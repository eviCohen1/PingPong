import { createContext, useContext, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const GameContext = createContext(null)


function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : init
    } catch {
      return init
    }
  })
  const save = useCallback(
    (v) => {
      setVal((prev) => {
        const next = typeof v === 'function' ? v(prev) : v
        try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
        return next
      })
    },
    [key],
  )
  return [val, save]
}

function genId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function isGameDone(p1, p2) {
  if (p1 >= 11 || p2 >= 11) {
    return Math.abs(p1 - p2) >= 2
  }
  return false
}

export function GameProvider({ children }) {
  const [currentPlayer, setCurrentPlayer] = useLocalStorage('pp_current', null)
  const [players, setPlayers] = useLocalStorage('pp_players', [])
  const [tournaments, setTournaments] = useLocalStorage('pp_tournaments', [])
  const [dbLoading, setDbLoading] = useState(false)

  /** Phone-number based login — syncs with Supabase */
  async function loginOrRegister(phone, name) {
    setDbLoading(true)
    try {
      // 1. Look up player by phone in Supabase
      const { data: existing } = await supabase
        .from('players')
        .select()
        .eq('phone', phone)
        .maybeSingle()

      let player
      if (existing) {
        player = existing
      } else {
        // New player — create with custom ID
        const newP = { id: genId('p'), name: name || 'Player', phone }
        const { data: created, error } = await supabase
          .from('players')
          .insert(newP)
          .select()
          .single()
        player = error ? newP : created
      }

      setCurrentPlayer(player)

      // Update local player list
      setPlayers((prev) => {
        const without = prev.filter((p) => p.id !== player.id)
        return [...without, player]
      })

      // 2. Fetch all tournaments this player is in from Supabase
      const { data: rows } = await supabase
        .from('tournaments')
        .select('data')
        .filter('data->players', 'cs', JSON.stringify([{ id: player.id }]))

      if (rows?.length) {
        setTournaments(rows.map((r) => r.data))
      }

      return player
    } finally {
      setDbLoading(false)
    }
  }

  function logout() {
    setCurrentPlayer(null)
  }

  /** Round-robin tournament: every player plays every other player once */
  function createTournament(name, tournamentPlayers) {
    const matches = []
    for (let i = 0; i < tournamentPlayers.length; i++) {
      for (let j = i + 1; j < tournamentPlayers.length; j++) {
        matches.push({
          id: genId('m'),
          player1Id: tournamentPlayers[i].id,
          player2Id: tournamentPlayers[j].id,
          games: [],   // [{ p1: number, p2: number }]
          winner: null,
          status: 'pending',
        })
      }
    }
    const t = {
      id: genId('t'),
      name,
      players: tournamentPlayers,
      matches,
      createdAt: Date.now(),
      status: 'active',
    }
    setTournaments((prev) => [...prev, t])

    // Sync to Supabase — all participants will see this tournament on login
    supabase.from('tournaments').upsert({ id: t.id, data: t }).then()

    return t
  }

  /**
   * Save games array + optionally finalize the match.
   * finalize=true → compute winner from games won, mark status=completed.
   */
  function updateMatch(tournamentId, matchId, games, finalize = false) {
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id !== tournamentId) return t
        const matches = t.matches.map((m) => {
          if (m.id !== matchId) return m
          let winner = null
          let status = finalize ? 'completed' : 'in_progress'
          if (finalize && games.length > 0) {
            const p1W = games.filter((g) => isGameDone(g.p1, g.p2) && g.p1 > g.p2).length
            const p2W = games.filter((g) => isGameDone(g.p1, g.p2) && g.p2 > g.p1).length
            if (p1W > p2W) winner = m.player1Id
            else if (p2W > p1W) winner = m.player2Id
            else winner = null  // draw — extremely rare in TT
          }
          return { ...m, games, winner, status }
        })
        // Close tournament if all matches completed
        const allDone = matches.every((m) => m.status === 'completed')
        const updated = { ...t, matches, status: allDone ? 'completed' : t.status }

        // Sync updated tournament to Supabase
        supabase
          .from('tournaments')
          .update({ data: updated, updated_at: new Date().toISOString() })
          .eq('id', tournamentId)
          .then()

        return updated
      }),
    )
  }

  /** Compute leaderboard for a tournament, sorted by match wins then point diff */
  function getLeaderboard(tournamentId) {
    const t = tournaments.find((x) => x.id === tournamentId)
    if (!t) return []

    const stats = {}
    t.players.forEach((p) => {
      stats[p.id] = {
        player: p,
        matchWins: 0,
        matchLosses: 0,
        gamesWon: 0,
        gamesLost: 0,
        pointsFor: 0,
        pointsAgainst: 0,
      }
    })

    t.matches.forEach((m) => {
      if (m.status !== 'completed') return
      m.games.forEach((g) => {
        if (stats[m.player1Id]) {
          stats[m.player1Id].pointsFor += g.p1
          stats[m.player1Id].pointsAgainst += g.p2
          if (isGameDone(g.p1, g.p2) && g.p1 > g.p2) stats[m.player1Id].gamesWon++
          else stats[m.player1Id].gamesLost++
        }
        if (stats[m.player2Id]) {
          stats[m.player2Id].pointsFor += g.p2
          stats[m.player2Id].pointsAgainst += g.p1
          if (isGameDone(g.p1, g.p2) && g.p2 > g.p1) stats[m.player2Id].gamesWon++
          else stats[m.player2Id].gamesLost++
        }
      })
      if (m.winner === m.player1Id) {
        if (stats[m.player1Id]) stats[m.player1Id].matchWins++
        if (stats[m.player2Id]) stats[m.player2Id].matchLosses++
      } else if (m.winner === m.player2Id) {
        if (stats[m.player2Id]) stats[m.player2Id].matchWins++
        if (stats[m.player1Id]) stats[m.player1Id].matchLosses++
      }
    })

    return Object.values(stats).sort((a, b) => {
      if (b.matchWins !== a.matchWins) return b.matchWins - a.matchWins
      const diffA = a.pointsFor - a.pointsAgainst
      const diffB = b.pointsFor - b.pointsAgainst
      return diffB - diffA
    })
  }

  function getTournament(id) {
    return tournaments.find((t) => t.id === id) || null
  }
  function getMatch(tournamentId, matchId) {
    const t = getTournament(tournamentId)
    return t ? t.matches.find((m) => m.id === matchId) || null : null
  }
  function getPlayerById(id) {
    // check tournament players first, then global players
    let allPlayers = []
    try { allPlayers = JSON.parse(localStorage.getItem('pp_players') || '[]') } catch {}
    return allPlayers.find((p) => p.id === id) || players.find((p) => p.id === id) || null
  }

  return (
    <GameContext.Provider
      value={{
        currentPlayer,
        loginOrRegister,
        logout,
        dbLoading,
        players,
        tournaments,
        createTournament,
        updateMatch,
        getLeaderboard,
        getTournament,
        getMatch,
        getPlayerById,
        isGameDone,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}

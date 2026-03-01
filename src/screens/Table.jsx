import { Trophy } from 'lucide-react'
import { useGame } from '../store/GameContext'
import { useLang } from '../store/LangContext'
import Layout from '../components/Layout'

function isGameDone(p1, p2) {
  if (p1 >= 11 || p2 >= 11) return Math.abs(p1 - p2) >= 2
  return false
}

export default function Table() {
  const { tournaments, players } = useGame()
  const { t } = useLang()

  // Aggregate stats for every player across all tournaments
  const statsMap = {}

  const ensurePlayer = (playerId) => {
    if (!statsMap[playerId]) {
      const p = players.find((x) => x.id === playerId)
      statsMap[playerId] = {
        player: p || { id: playerId, name: '?' },
        matchWins: 0,
        matchLosses: 0,
        gamesWon: 0,
        gamesLost: 0,
        pointsFor: 0,
        pointsAgainst: 0,
      }
    }
  }

  tournaments.forEach((tn) => {
    tn.matches.forEach((m) => {
      if (m.status !== 'completed') return
      ensurePlayer(m.player1Id)
      ensurePlayer(m.player2Id)

      m.games.forEach((g) => {
        statsMap[m.player1Id].pointsFor += g.p1
        statsMap[m.player1Id].pointsAgainst += g.p2
        statsMap[m.player2Id].pointsFor += g.p2
        statsMap[m.player2Id].pointsAgainst += g.p1
        if (isGameDone(g.p1, g.p2) && g.p1 > g.p2) {
          statsMap[m.player1Id].gamesWon++
          statsMap[m.player2Id].gamesLost++
        } else if (isGameDone(g.p1, g.p2) && g.p2 > g.p1) {
          statsMap[m.player2Id].gamesWon++
          statsMap[m.player1Id].gamesLost++
        }
      })

      if (m.winner === m.player1Id) {
        statsMap[m.player1Id].matchWins++
        statsMap[m.player2Id].matchLosses++
      } else if (m.winner === m.player2Id) {
        statsMap[m.player2Id].matchWins++
        statsMap[m.player1Id].matchLosses++
      }
    })
  })

  const rows = Object.values(statsMap).sort((a, b) => {
    if (b.matchWins !== a.matchWins) return b.matchWins - a.matchWins
    const diffA = a.pointsFor - a.pointsAgainst
    const diffB = b.pointsFor - b.pointsAgainst
    return diffB - diffA
  })

  const hasData = rows.length > 0

  return (
    <Layout>
      <div className="px-5 pt-2 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.2))' }}
          >
            <Trophy size={20} className="text-yellow-400" />
          </div>
          <h1
            className="text-2xl font-black text-white"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            {t('nav.table')}
          </h1>
        </div>

        {hasData ? (
          <div className="glass rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid text-[10px] font-bold text-white/40 uppercase tracking-wider px-3 py-2 border-b border-white/10"
              style={{ gridTemplateColumns: '28px 1fr 36px 36px 36px 36px 44px' }}>
              <span className="text-center">{t('leaderboard.headers.rank')}</span>
              <span className="ps-1">{t('leaderboard.headers.player')}</span>
              <span className="text-center">{t('leaderboard.headers.w')}</span>
              <span className="text-center">{t('leaderboard.headers.l')}</span>
              <span className="text-center">{t('leaderboard.headers.gw')}</span>
              <span className="text-center">{t('leaderboard.headers.gl')}</span>
              <span className="text-center">{t('leaderboard.headers.diff')}</span>
            </div>

            {/* Rows */}
            {rows.map((s, i) => {
              const diff = s.pointsFor - s.pointsAgainst
              const isTop = i === 0
              return (
                <div
                  key={s.player.id}
                  className={`grid items-center px-3 py-3 border-b border-white/5 last:border-0 ${
                    isTop ? 'bg-yellow-400/5' : ''
                  }`}
                  style={{ gridTemplateColumns: '28px 1fr 36px 36px 36px 36px 44px' }}
                >
                  <span className="text-center">
                    {i === 0 ? (
                      <span className="text-yellow-400 font-black text-sm">🥇</span>
                    ) : i === 1 ? (
                      <span className="text-white/50 font-bold text-xs">🥈</span>
                    ) : i === 2 ? (
                      <span className="text-orange-400/70 font-bold text-xs">🥉</span>
                    ) : (
                      <span className="text-white/30 text-xs font-semibold">{i + 1}</span>
                    )}
                  </span>
                  <span
                    className={`ps-1 font-bold text-sm truncate ${isTop ? 'text-yellow-300' : 'text-white'}`}
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    {s.player.name}
                  </span>
                  <span className="text-center text-[#37B5E9] font-bold text-sm">{s.matchWins}</span>
                  <span className="text-center text-white/40 text-sm">{s.matchLosses}</span>
                  <span className="text-center text-white/60 text-sm">{s.gamesWon}</span>
                  <span className="text-center text-white/40 text-sm">{s.gamesLost}</span>
                  <span className={`text-center font-bold text-sm ${diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-white/40'}`}>
                    {diff > 0 ? `+${diff}` : diff}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-14">
            <div
              className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(255,215,0,0.08)' }}
            >
              <Trophy size={28} className="text-yellow-400/30" />
            </div>
            <p className="text-white/40 font-semibold mb-1">{t('leaderboard.noMatches')}</p>
            <p className="text-white/25 text-sm">{t('leaderboard.noMatchesHint')}</p>
          </div>
        )}

        {/* Legend */}
        {hasData && (
          <div className="mt-4 glass rounded-xl p-3">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2">
              {t('leaderboard.legend.title')}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {[
                ['W', t('leaderboard.legend.w')],
                ['L', t('leaderboard.legend.l')],
                ['GW', t('leaderboard.legend.gw')],
                ['GL', t('leaderboard.legend.gl')],
                ['+/-', t('leaderboard.legend.diff')],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="text-[#37B5E9] text-[10px] font-bold w-6">{key}</span>
                  <span className="text-white/30 text-[10px]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

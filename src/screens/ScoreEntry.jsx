import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Plus, Check, AlertCircle, Trophy } from 'lucide-react'
import { useGame } from '../store/GameContext'
import { useLang } from '../store/LangContext'
import Layout from '../components/Layout'

function isGameDone(p1, p2) {
  if (p1 >= 11 || p2 >= 11) return Math.abs(p1 - p2) >= 2
  return false
}

export default function ScoreEntry() {
  const { id, matchId } = useParams()
  const { getTournament, updateMatch } = useGame()
  const { t } = useLang()
  const navigate = useNavigate()

  const tn    = getTournament(id)
  const match = tn?.matches.find((m) => m.id === matchId)

  const p1 = tn?.players.find((p) => p.id === match?.player1Id)
  const p2 = tn?.players.find((p) => p.id === match?.player2Id)

  const [games, setGames]   = useState(
    match?.status === 'completed' ? match.games : (match?.games || []),
  )
  const [cur1, setCur1] = useState(0)
  const [cur2, setCur2] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!match) return
    if (match.status === 'completed') return
    updateMatch(id, matchId, games, false)
  }, [games]) // eslint-disable-line

  if (!tn || !match || !p1 || !p2) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64 text-white/40">
          {t('scoreEntry.notFound')}
        </div>
      </Layout>
    )
  }

  const gameDone    = isGameDone(cur1, cur2)
  const curWinner   = gameDone ? (cur1 > cur2 ? p1 : p2) : null
  const p1GamesWon  = games.filter((g) => g.p1 > g.p2 && isGameDone(g.p1, g.p2)).length
  const p2GamesWon  = games.filter((g) => g.p2 > g.p1 && isGameDone(g.p1, g.p2)).length
  const isCompleted = match.status === 'completed'

  function adjScore(side, delta) {
    if (isCompleted) return
    if (side === 1) setCur1((v) => Math.max(0, v + delta))
    else            setCur2((v) => Math.max(0, v + delta))
  }

  function saveGame() {
    if (!gameDone) return
    setGames((prev) => [...prev, { p1: cur1, p2: cur2 }])
    setCur1(0)
    setCur2(0)
  }

  function finishMatch() {
    const finalGames = gameDone
      ? [...games, { p1: cur1, p2: cur2 }]
      : games
    if (finalGames.length === 0) return
    updateMatch(id, matchId, finalGames, true)
    navigate(`/tournament/${id}`, { replace: true })
  }

  const ScoreButton = ({ onClick, children, variant = 'plus' }) => (
    <button
      onClick={onClick}
      className="score-btn w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all active:scale-90"
      style={{
        background: variant === 'plus'
          ? 'linear-gradient(135deg, #37B5E9, #4B4BED)'
          : 'rgba(255,255,255,0.08)',
        color: 'white',
        boxShadow: variant === 'plus' ? '0 4px 20px rgba(55,181,233,0.3)' : 'none',
      }}
    >
      {children}
    </button>
  )

  return (
    <Layout hideNav>
      <div className="px-5 pt-3 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate(`/tournament/${id}`)}
            className="p-2.5 glass rounded-xl text-white/60"
          >
            <span className="rtl-flip"><ChevronLeft size={20} /></span>
          </button>
          <div className="flex-1">
            <p className="text-white/40 text-xs">
              {t('scoreEntry.gameLabel', { num: games.length + (isCompleted ? 0 : 1) })}
            </p>
            <h1
              className="text-lg font-black text-white leading-tight"
              style={{ fontFamily: "'Rajdhani',sans-serif" }}
            >
              {p1.name} <span className="text-white/30">vs</span> {p2.name}
            </h1>
          </div>
        </div>

        {/* Games won scoreboard */}
        <div className="glass rounded-2xl p-4 mb-4">
          <p className="text-white/40 text-xs font-semibold text-center mb-3 uppercase tracking-wider">
            {t('scoreEntry.gamesWon')}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-white font-bold text-sm truncate">{p1.name}</p>
              <p
                className="text-4xl font-black"
                style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  background: 'linear-gradient(135deg,#37B5E9,#4B4BED)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {p1GamesWon}
              </p>
            </div>
            <div className="text-white/20 text-2xl font-black px-4">—</div>
            <div className="text-center flex-1">
              <p className="text-white font-bold text-sm truncate">{p2.name}</p>
              <p
                className="text-4xl font-black"
                style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  background: 'linear-gradient(135deg,#37B5E9,#4B4BED)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {p2GamesWon}
              </p>
            </div>
          </div>
        </div>

        {/* Previous games */}
        {games.length > 0 && (
          <div className="glass rounded-2xl p-4 mb-4">
            <p className="text-white/40 text-xs font-semibold mb-2 uppercase tracking-wider">
              {t('scoreEntry.gameHistory')}
            </p>
            <div className="space-y-1.5">
              {games.map((g, i) => {
                const gWinner = isGameDone(g.p1, g.p2) ? (g.p1 > g.p2 ? p1 : p2) : null
                return (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-white/40">{t('scoreEntry.gameInHistory', { num: i + 1 })}</span>
                    <div className="flex items-center gap-2" dir="ltr">
                      <span className={`font-bold ${g.p1 > g.p2 ? 'text-white' : 'text-white/30'}`}>{g.p1}</span>
                      <span className="text-white/20">–</span>
                      <span className={`font-bold ${g.p2 > g.p1 ? 'text-white' : 'text-white/30'}`}>{g.p2}</span>
                    </div>
                    {gWinner && (
                      <span className="text-xs text-[#37B5E9] font-semibold">{gWinner.name}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Current game scoring */}
        {!isCompleted && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{
              background: gameDone
                ? 'linear-gradient(135deg,rgba(55,181,233,0.12),rgba(75,75,237,0.12))'
                : 'rgba(255,255,255,0.05)',
              border: gameDone ? '1px solid rgba(55,181,233,0.3)' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-white/40 text-xs font-semibold text-center mb-4 uppercase tracking-wider">
              {t('scoreEntry.firstTo11', { num: games.length + 1 })}
            </p>

            {/* Deuce indicator */}
            {cur1 >= 10 && cur2 >= 10 && !gameDone && (
              <div className="text-center mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400">
                  {t('scoreEntry.deuce')}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Player 1 */}
              <div className="flex-1">
                <p className="text-white/60 text-xs font-semibold text-center mb-3 truncate">{p1.name}</p>
                <div className="flex flex-col items-center gap-3">
                  <ScoreButton onClick={() => adjScore(1, 1)} variant="plus">+</ScoreButton>
                  <div
                    className="text-6xl font-black text-center leading-none"
                    style={{
                      fontFamily: "'Rajdhani',sans-serif",
                      color: curWinner?.id === p1.id ? '#37B5E9' : 'white',
                      textShadow: curWinner?.id === p1.id ? '0 0 30px rgba(55,181,233,0.6)' : 'none',
                    }}
                  >
                    {cur1}
                  </div>
                  <ScoreButton onClick={() => adjScore(1, -1)} variant="minus">−</ScoreButton>
                </div>
              </div>

              {/* Divider */}
              <div className="flex flex-col items-center gap-1 px-1">
                <div className="w-px h-16 bg-white/10" />
                <p className="text-white/20 text-xs font-bold">VS</p>
                <div className="w-px h-16 bg-white/10" />
              </div>

              {/* Player 2 */}
              <div className="flex-1">
                <p className="text-white/60 text-xs font-semibold text-center mb-3 truncate">{p2.name}</p>
                <div className="flex flex-col items-center gap-3">
                  <ScoreButton onClick={() => adjScore(2, 1)} variant="plus">+</ScoreButton>
                  <div
                    className="text-6xl font-black text-center leading-none"
                    style={{
                      fontFamily: "'Rajdhani',sans-serif",
                      color: curWinner?.id === p2.id ? '#37B5E9' : 'white',
                      textShadow: curWinner?.id === p2.id ? '0 0 30px rgba(55,181,233,0.6)' : 'none',
                    }}
                  >
                    {cur2}
                  </div>
                  <ScoreButton onClick={() => adjScore(2, -1)} variant="minus">−</ScoreButton>
                </div>
              </div>
            </div>

            {/* Game won indicator */}
            {gameDone && curWinner && (
              <div
                className="mt-4 text-center py-2 rounded-xl"
                style={{ background: 'linear-gradient(135deg,rgba(55,181,233,0.2),rgba(75,75,237,0.2))' }}
              >
                <p className="text-[#37B5E9] font-bold text-sm">
                  {t('scoreEntry.winsGame', { name: curWinner.name })}
                </p>
              </div>
            )}

            {/* Add game button */}
            {gameDone && (
              <button
                onClick={saveGame}
                className="btn-grad w-full py-3 mt-4 rounded-xl text-white font-bold flex items-center justify-center gap-2"
              >
                <Plus size={18} /> {t('scoreEntry.addNextGame')}
              </button>
            )}
          </div>
        )}

        {/* Finish match */}
        {!isCompleted && (
          <div className="space-y-3">
            {(games.length > 0 || gameDone) ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full py-4 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg,#FFD700,#FFA500)',
                  fontFamily: "'Rajdhani',sans-serif",
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 25px rgba(255,215,0,0.3)',
                }}
              >
                <Trophy size={20} /> {t('scoreEntry.finishMatch')}
              </button>
            ) : (
              <div
                className="rounded-xl p-3 flex items-center gap-2 text-white/40 text-sm"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}
              >
                <AlertCircle size={16} />
                {t('scoreEntry.scoreHint')}
              </div>
            )}
          </div>
        )}

        {/* Completed view */}
        {isCompleted && (
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: 'linear-gradient(135deg,rgba(255,215,0,0.1),rgba(255,165,0,0.05))', border: '1px solid rgba(255,215,0,0.2)' }}
          >
            <Trophy size={32} className="text-yellow-400 mx-auto mb-2" />
            <p className="text-yellow-400/60 text-xs mb-1 uppercase tracking-wider">
              {t('scoreEntry.matchWinner')}
            </p>
            <p
              className="text-2xl font-black"
              style={{
                fontFamily: "'Rajdhani',sans-serif",
                background: 'linear-gradient(135deg,#FFD700,#FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {(match.winner === p1.id ? p1 : p2).name}
            </p>
            <button
              onClick={() => navigate(`/tournament/${id}`)}
              className="btn-grad mt-4 px-6 py-2.5 rounded-xl text-white font-bold text-sm"
            >
              {t('scoreEntry.backToTournament')}
            </button>
          </div>
        )}

        {/* Confirm finish dialog */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-5"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
            <div className="glass rounded-3xl p-6 w-full max-w-sm">
              <h3 className="text-white font-black text-lg mb-2" style={{ fontFamily: "'Rajdhani',sans-serif" }}>
                {t('scoreEntry.dialog.title')}
              </h3>
              <p className="text-white/50 text-sm mb-5">
                {gameDone
                  ? t('scoreEntry.dialog.bodyWithGame', { cur1, cur2 })
                  : t(games.length !== 1 ? 'scoreEntry.dialog.bodyGamesPlural' : 'scoreEntry.dialog.bodyGames', { count: games.length })}
                {' '}{t('scoreEntry.dialog.cannotUndo')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold"
                >
                  {t('scoreEntry.dialog.cancel')}
                </button>
                <button
                  onClick={finishMatch}
                  className="flex-1 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)' }}
                >
                  <Check size={18} /> {t('scoreEntry.dialog.confirm')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Trophy, Zap, Clock, CheckCircle, ChevronRight, BarChart3 } from 'lucide-react'
import { useGame } from '../store/GameContext'
import { useLang } from '../store/LangContext'
import Layout from '../components/Layout'

function statusMeta(status, t) {
  switch (status) {
    case 'completed':   return { label: t('tournamentDetail.matchStatus.done'),    color: 'text-green-400',  bg: 'bg-green-400/10',  icon: CheckCircle }
    case 'in_progress': return { label: t('tournamentDetail.matchStatus.live'),    color: 'text-[#37B5E9]',  bg: 'bg-[#37B5E9]/10',  icon: Zap }
    default:            return { label: t('tournamentDetail.matchStatus.pending'), color: 'text-white/40',   bg: 'bg-white/5',        icon: Clock }
  }
}

function MatchCard({ match, p1, p2, onClick, index }) {
  const { t } = useLang()
  const meta = statusMeta(match.status, t)
  const Icon = meta.icon

  const p1Games = match.games.filter((g) => g.p1 > g.p2 && g.p1 >= 11).length
  const p2Games = match.games.filter((g) => g.p2 > g.p1 && g.p2 >= 11).length
  const p1Total = match.games.reduce((s, g) => s + g.p1, 0)
  const p2Total = match.games.reduce((s, g) => s + g.p2, 0)

  return (
    <button
      onClick={onClick}
      className="glass w-full rounded-2xl p-4 text-left transition-all active:scale-[0.97] hover:border-white/20"
      style={{ animation: 'slide-up 0.35s ease-out both', animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
          <Icon size={11} />
          {meta.label}
        </div>
        {match.status !== 'completed' && (
          <span className="rtl-flip">
            <ChevronRight size={16} className="text-white/30" />
          </span>
        )}
        {match.status === 'completed' && match.winner && (
          <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1">
            <Trophy size={12} />
            {match.winner === p1?.id ? p1?.name : p2?.name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Player 1 */}
        <div className={`flex-1 text-center ${match.winner === p1?.id ? '' : match.winner ? 'opacity-40' : ''}`}>
          <div
            className="w-10 h-10 rounded-2xl mx-auto mb-1.5 flex items-center justify-center font-bold text-white text-sm"
            style={{
              background: match.winner === p1?.id
                ? 'linear-gradient(135deg,#FFD700,#FFA500)'
                : 'linear-gradient(135deg,rgba(55,181,233,0.3),rgba(75,75,237,0.3))',
            }}
          >
            {p1?.name?.[0]?.toUpperCase()}
          </div>
          <p className="text-white text-xs font-bold truncate">{p1?.name}</p>
          {match.games.length > 0 && (
            <p className="text-white/40 text-[10px]">
              {t('scoreEntry.pts', { count: p1Total })}
            </p>
          )}
        </div>

        {/* Score */}
        <div className="text-center px-2">
          {match.status === 'pending' ? (
            <p className="text-white/20 text-sm font-bold">VS</p>
          ) : (
            <div>
              <p
                className="text-2xl font-black leading-none"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  background: 'linear-gradient(135deg, #37B5E9, #4B4BED)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {p1Games} – {p2Games}
              </p>
              <p className="text-white/30 text-[10px]">
                {t(match.games.length !== 1 ? 'tournamentDetail.gamesPlural' : 'tournamentDetail.games', { count: match.games.length })}
              </p>
            </div>
          )}
        </div>

        {/* Player 2 */}
        <div className={`flex-1 text-center ${match.winner === p2?.id ? '' : match.winner ? 'opacity-40' : ''}`}>
          <div
            className="w-10 h-10 rounded-2xl mx-auto mb-1.5 flex items-center justify-center font-bold text-white text-sm"
            style={{
              background: match.winner === p2?.id
                ? 'linear-gradient(135deg,#FFD700,#FFA500)'
                : 'linear-gradient(135deg,rgba(55,181,233,0.3),rgba(75,75,237,0.3))',
            }}
          >
            {p2?.name?.[0]?.toUpperCase()}
          </div>
          <p className="text-white text-xs font-bold truncate">{p2?.name}</p>
          {match.games.length > 0 && (
            <p className="text-white/40 text-[10px]">
              {t('scoreEntry.pts', { count: p2Total })}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}

export default function TournamentDetail() {
  const { id } = useParams()
  const { getTournament, getPlayerById } = useGame()
  const { t } = useLang()
  const navigate = useNavigate()

  const tn = getTournament(id)
  if (!tn) return (
    <Layout>
      <div className="flex items-center justify-center min-h-64 text-white/40">
        {t('tournamentDetail.notFound')}
      </div>
    </Layout>
  )

  const pending    = tn.matches.filter((m) => m.status === 'pending')
  const inProgress = tn.matches.filter((m) => m.status === 'in_progress')
  const completed  = tn.matches.filter((m) => m.status === 'completed')

  function getPlayers(match) {
    const p1 = tn.players.find((p) => p.id === match.player1Id) || getPlayerById(match.player1Id)
    const p2 = tn.players.find((p) => p.id === match.player2Id) || getPlayerById(match.player2Id)
    return { p1, p2 }
  }

  return (
    <Layout tournamentId={id}>
      <div className="px-5 pt-3 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 glass rounded-xl text-white/60 hover:text-white transition-colors"
          >
            <span className="rtl-flip"><ChevronLeft size={20} /></span>
          </button>
          <div className="flex-1 min-w-0">
            <h1
              className="text-xl font-black text-white truncate"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {tn.name}
            </h1>
            <p className="text-white/40 text-xs">
              {t('tournamentDetail.roundRobin', { count: tn.players.length })}
            </p>
          </div>
          <button
            onClick={() => navigate(`/tournament/${id}/leaderboard`)}
            className="p-2.5 rounded-xl flex items-center gap-1.5 text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,rgba(55,181,233,0.25),rgba(75,75,237,0.25))', border: '1px solid rgba(55,181,233,0.3)' }}
          >
            <BarChart3 size={16} className="text-[#37B5E9]" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="glass rounded-2xl p-4 mb-5">
          <div className="flex justify-between text-xs text-white/50 mb-2">
            <span>{t('tournamentDetail.progress', { done: completed.length, total: tn.matches.length })}</span>
            <span>{Math.round((completed.length / tn.matches.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(completed.length / tn.matches.length) * 100}%`,
                background: tn.status === 'completed'
                  ? 'linear-gradient(90deg,#FFD700,#FFA500)'
                  : 'linear-gradient(90deg,#37B5E9,#4B4BED)',
              }}
            />
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            <span className="text-[#37B5E9]">● {t('tournamentDetail.live', { count: inProgress.length })}</span>
            <span className="text-white/30">○ {t('tournamentDetail.pending', { count: pending.length })}</span>
            <span className="text-green-400">✓ {t('tournamentDetail.done', { count: completed.length })}</span>
          </div>
        </div>

        {/* Tournament champion */}
        {tn.status === 'completed' && (() => {
          const lb = (() => {
            const stats = {}
            tn.players.forEach((p) => { stats[p.id] = { player: p, wins: 0 } })
            tn.matches.forEach((m) => {
              if (m.winner && stats[m.winner]) stats[m.winner].wins++
            })
            return Object.values(stats).sort((a, b) => b.wins - a.wins)
          })()
          const champ = lb[0]?.player
          return champ ? (
            <div
              className="rounded-2xl p-4 mb-5 text-center"
              style={{ background: 'linear-gradient(135deg,rgba(255,215,0,0.12),rgba(255,165,0,0.08))', border: '1px solid rgba(255,215,0,0.25)' }}
            >
              <p className="text-yellow-400/60 text-xs font-semibold mb-1 uppercase tracking-wider">
                🏆 {t('tournamentDetail.champion')}
              </p>
              <p className="text-2xl font-black" style={{ fontFamily: "'Rajdhani',sans-serif", background: 'linear-gradient(135deg,#FFD700,#FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {champ.name}
              </p>
            </div>
          ) : null
        })()}

        {/* In-progress matches */}
        {inProgress.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-[#37B5E9]" />
              <h2 className="text-white/60 text-xs font-bold uppercase tracking-wider">
                {t('tournamentDetail.sections.liveNow')}
              </h2>
            </div>
            <div className="space-y-3">
              {inProgress.map((m, i) => {
                const { p1, p2 } = getPlayers(m)
                return (
                  <MatchCard
                    key={m.id}
                    match={m}
                    p1={p1}
                    p2={p2}
                    index={i}
                    onClick={() => navigate(`/tournament/${id}/match/${m.id}`)}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Pending matches */}
        {pending.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-white/40" />
              <h2 className="text-white/60 text-xs font-bold uppercase tracking-wider">
                {t('tournamentDetail.sections.upcoming')}
              </h2>
            </div>
            <div className="space-y-3">
              {pending.map((m, i) => {
                const { p1, p2 } = getPlayers(m)
                return (
                  <MatchCard
                    key={m.id}
                    match={m}
                    p1={p1}
                    p2={p2}
                    index={i}
                    onClick={() => navigate(`/tournament/${id}/match/${m.id}`)}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Completed matches */}
        {completed.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={14} className="text-green-400" />
              <h2 className="text-white/60 text-xs font-bold uppercase tracking-wider">
                {t('tournamentDetail.sections.completed')}
              </h2>
            </div>
            <div className="space-y-3">
              {completed.map((m, i) => {
                const { p1, p2 } = getPlayers(m)
                return (
                  <MatchCard
                    key={m.id}
                    match={m}
                    p1={p1}
                    p2={p2}
                    index={i}
                    onClick={() => navigate(`/tournament/${id}/match/${m.id}`)}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  )
}

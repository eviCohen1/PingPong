import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Trophy } from 'lucide-react'
import { useGame } from '../store/GameContext'
import { useLang } from '../store/LangContext'
import Layout from '../components/Layout'

const MEDALS = ['🥇', '🥈', '🥉']

function StatChip({ label, value, color }) {
  return (
    <div className="flex flex-col items-center glass rounded-xl px-3 py-2 min-w-0">
      <span className={`text-lg font-black leading-none ${color || 'text-white'}`}
        style={{ fontFamily: "'Rajdhani',sans-serif" }}>
        {value}
      </span>
      <span className="text-white/30 text-[9px] font-semibold uppercase tracking-wider mt-0.5 whitespace-nowrap">{label}</span>
    </div>
  )
}

export default function Leaderboard() {
  const { id } = useParams()
  const { getTournament, getLeaderboard } = useGame()
  const { t } = useLang()
  const navigate = useNavigate()

  const tn = getTournament(id)
  const lb = getLeaderboard(id)

  if (!tn) return (
    <Layout>
      <div className="flex items-center justify-center min-h-64 text-white/40">
        {t('leaderboard.notFound')}
      </div>
    </Layout>
  )

  const champion     = lb[0]
  const totalMatches = tn.matches.filter((m) => m.status === 'completed').length

  return (
    <Layout>
      <div className="px-5 pt-3 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate(`/tournament/${id}`)}
            className="p-2.5 glass rounded-xl text-white/60"
          >
            <span className="rtl-flip"><ChevronLeft size={20} /></span>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-white" style={{ fontFamily: "'Rajdhani',sans-serif" }}>
              {t('leaderboard.title')}
            </h1>
            <p className="text-white/40 text-xs">{tn.name}</p>
          </div>
          <Trophy size={22} className="text-yellow-400" />
        </div>

        {/* Champion spotlight */}
        {champion && totalMatches > 0 && (
          <div
            className="rounded-3xl p-5 mb-5 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg,rgba(255,215,0,0.12) 0%,rgba(255,165,0,0.06) 100%)',
              border: '1px solid rgba(255,215,0,0.25)',
              animation: 'slide-up 0.4s ease-out both',
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,215,0,0.08) 0%, transparent 70%)' }} />
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl font-black text-white relative z-10"
              style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)', boxShadow: '0 8px 32px rgba(255,215,0,0.4)' }}
            >
              {champion.player.name[0].toUpperCase()}
            </div>
            <p className="text-yellow-400/60 text-xs font-bold uppercase tracking-widest mb-0.5 relative z-10">
              {tn.status === 'completed' ? t('leaderboard.champion') : t('leaderboard.leading')}
            </p>
            <p
              className="text-3xl font-black relative z-10"
              style={{
                fontFamily: "'Rajdhani',sans-serif",
                background: 'linear-gradient(135deg,#FFD700,#FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {champion.player.name}
            </p>
            <div className="flex justify-center gap-3 mt-3 relative z-10">
              <StatChip label={t('leaderboard.stats.wins')}   value={champion.matchWins}   color="text-yellow-400" />
              <StatChip label={t('leaderboard.stats.points')} value={champion.pointsFor}   color="text-[#37B5E9]" />
              <StatChip label={t('leaderboard.stats.diff')}   value={`+${champion.pointsFor - champion.pointsAgainst}`} color="text-green-400" />
            </div>
          </div>
        )}

        {/* Stats table */}
        <div className="glass rounded-2xl overflow-hidden mb-4">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-white/5 border-b border-white/10">
            <div className="col-span-1 text-white/30 text-[10px] font-bold">{t('leaderboard.headers.rank')}</div>
            <div className="col-span-4 text-white/30 text-[10px] font-bold">{t('leaderboard.headers.player')}</div>
            <div className="col-span-1 text-white/30 text-[10px] font-bold text-center">{t('leaderboard.headers.w')}</div>
            <div className="col-span-1 text-white/30 text-[10px] font-bold text-center">{t('leaderboard.headers.l')}</div>
            <div className="col-span-1 text-white/30 text-[10px] font-bold text-center">{t('leaderboard.headers.gw')}</div>
            <div className="col-span-1 text-white/30 text-[10px] font-bold text-center">{t('leaderboard.headers.gl')}</div>
            <div className="col-span-2 text-white/30 text-[10px] font-bold text-center">{t('leaderboard.headers.pts')}</div>
            <div className="col-span-1 text-white/30 text-[10px] font-bold text-center">{t('leaderboard.headers.diff')}</div>
          </div>

          {/* Rows */}
          {lb.map((row, i) => {
            const diff     = row.pointsFor - row.pointsAgainst
            const isLeader = i === 0 && totalMatches > 0
            const isLast   = i === lb.length - 1

            return (
              <div
                key={row.player.id}
                className="grid grid-cols-12 gap-1 px-3 py-3 items-center transition-all"
                style={{
                  background: isLeader
                    ? 'linear-gradient(90deg,rgba(255,215,0,0.08),transparent)'
                    : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  animation: 'slide-up 0.35s ease-out both',
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                {/* Rank */}
                <div className="col-span-1">
                  {MEDALS[i] ? (
                    <span className="text-base">{MEDALS[i]}</span>
                  ) : (
                    <span className="text-white/30 text-xs font-bold">{i + 1}</span>
                  )}
                </div>

                {/* Player */}
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                    style={{
                      background: isLeader
                        ? 'linear-gradient(135deg,#FFD700,#FFA500)'
                        : 'linear-gradient(135deg,rgba(55,181,233,0.4),rgba(75,75,237,0.4))',
                    }}
                  >
                    {row.player.name[0].toUpperCase()}
                  </div>
                  <span className={`text-xs font-bold truncate ${isLeader ? 'text-yellow-400' : 'text-white'}`}>
                    {row.player.name}
                  </span>
                </div>

                {/* W */}
                <div className="col-span-1 text-center">
                  <span className="text-xs font-black text-green-400">{row.matchWins}</span>
                </div>
                {/* L */}
                <div className="col-span-1 text-center">
                  <span className="text-xs font-black text-red-400/70">{row.matchLosses}</span>
                </div>
                {/* GW */}
                <div className="col-span-1 text-center">
                  <span className="text-xs text-white/60">{row.gamesWon}</span>
                </div>
                {/* GL */}
                <div className="col-span-1 text-center">
                  <span className="text-xs text-white/40">{row.gamesLost}</span>
                </div>
                {/* Points */}
                <div className="col-span-2 text-center">
                  <span className="text-xs font-bold text-[#37B5E9]">{row.pointsFor}</span>
                  <span className="text-white/20 text-[10px]">/{row.pointsAgainst}</span>
                </div>
                {/* Diff */}
                <div className="col-span-1 text-center flex items-center justify-center">
                  {diff > 0 ? (
                    <span className="text-[10px] font-black text-green-400">+{diff}</span>
                  ) : diff < 0 ? (
                    <span className="text-[10px] font-black text-red-400">{diff}</span>
                  ) : (
                    <span className="text-[10px] text-white/20">0</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="glass rounded-2xl px-4 py-3">
          <p className="text-white/30 text-xs font-semibold mb-2 uppercase tracking-wider">
            {t('leaderboard.legend.title')}
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-white/40">
            <span><b className="text-white/50">{t('leaderboard.headers.w')}</b> {t('leaderboard.legend.w')}</span>
            <span><b className="text-white/50">{t('leaderboard.headers.l')}</b> {t('leaderboard.legend.l')}</span>
            <span><b className="text-white/50">{t('leaderboard.headers.gw')}</b> {t('leaderboard.legend.gw')}</span>
            <span><b className="text-white/50">{t('leaderboard.headers.gl')}</b> {t('leaderboard.legend.gl')}</span>
            <span><b className="text-white/50">{t('leaderboard.headers.pts')}</b> {t('leaderboard.legend.pts')}</span>
            <span><b className="text-white/50">{t('leaderboard.headers.diff')}</b> {t('leaderboard.legend.diff')}</span>
          </div>
        </div>

        {/* No data hint */}
        {totalMatches === 0 && (
          <div className="text-center py-8">
            <p className="text-white/30 text-sm">{t('leaderboard.noMatches')}</p>
            <p className="text-white/20 text-xs mt-1">{t('leaderboard.noMatchesHint')}</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  )
}

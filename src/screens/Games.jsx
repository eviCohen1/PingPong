import { useNavigate } from 'react-router-dom'
import { Swords, ChevronRight, Zap, CheckCircle, Clock } from 'lucide-react'
import { useGame } from '../store/GameContext'
import { useLang } from '../store/LangContext'
import Layout from '../components/Layout'

function ScoreSummary({ match }) {
  if (match.games.length === 0) return null
  const p1G = match.games.filter((g) => g.p1 > g.p2).length
  const p2G = match.games.filter((g) => g.p2 > g.p1).length
  return (
    <span className="text-white/40 text-xs font-mono">
      {p1G} – {p2G}
    </span>
  )
}

export default function Games() {
  const { tournaments, getPlayerById } = useGame()
  const { t } = useLang()
  const navigate = useNavigate()

  const hasAny = tournaments.some((tn) => tn.matches.length > 0)

  const handleMatchTap = (tn, match) => {
    if (match.status === 'completed') {
      navigate(`/tournament/${tn.id}`)
    } else {
      navigate(`/tournament/${tn.id}/match/${match.id}`)
    }
  }

  return (
    <Layout>
      <div className="px-5 pt-2 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(55,181,233,0.15)' }}
          >
            <Swords size={20} className="text-[#37B5E9]" />
          </div>
          <h1
            className="text-2xl font-black text-white"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            {t('nav.games')}
          </h1>
        </div>

        {hasAny ? (
          <div className="space-y-6">
            {tournaments.map((tn) => {
              if (tn.matches.length === 0) return null
              const live = tn.matches.filter((m) => m.status === 'in_progress')
              const pending = tn.matches.filter((m) => m.status === 'pending')
              const done = tn.matches.filter((m) => m.status === 'completed')

              return (
                <div key={tn.id}>
                  {/* Tournament name */}
                  <div className="flex items-center gap-2 mb-2">
                    <h2
                      className="text-white/70 text-sm font-bold truncate"
                      style={{ fontFamily: "'Rajdhani', sans-serif" }}
                    >
                      {tn.name}
                    </h2>
                    {tn.status === 'completed' && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-black flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)' }}
                      >
                        {t('dashboard.card.complete')}
                      </span>
                    )}
                  </div>

                  <div className="glass rounded-2xl overflow-hidden">
                    {[...live, ...pending, ...done].map((match, idx, arr) => {
                      const p1 = tn.players.find((p) => p.id === match.player1Id) || getPlayerById(match.player1Id)
                      const p2 = tn.players.find((p) => p.id === match.player2Id) || getPlayerById(match.player2Id)
                      const isLive = match.status === 'in_progress'
                      const isDone = match.status === 'completed'

                      return (
                        <button
                          key={match.id}
                          onClick={() => handleMatchTap(tn, match)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/5 active:bg-white/10 ${
                            idx < arr.length - 1 ? 'border-b border-white/5' : ''
                          }`}
                        >
                          {/* Status icon */}
                          <div className="flex-shrink-0">
                            {isLive ? (
                              <Zap size={14} className="text-[#37B5E9]" />
                            ) : isDone ? (
                              <CheckCircle size={14} className="text-white/25" />
                            ) : (
                              <Clock size={14} className="text-white/20" />
                            )}
                          </div>

                          {/* Players */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-sm font-bold truncate ${
                                  isDone && match.winner === match.player1Id
                                    ? 'text-white'
                                    : isDone
                                    ? 'text-white/40'
                                    : 'text-white/80'
                                }`}
                                style={{ fontFamily: "'Rajdhani', sans-serif" }}
                              >
                                {p1?.name || '?'}
                              </span>
                              <span className="text-white/25 text-xs">vs</span>
                              <span
                                className={`text-sm font-bold truncate ${
                                  isDone && match.winner === match.player2Id
                                    ? 'text-white'
                                    : isDone
                                    ? 'text-white/40'
                                    : 'text-white/80'
                                }`}
                                style={{ fontFamily: "'Rajdhani', sans-serif" }}
                              >
                                {p2?.name || '?'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {isLive && (
                                <span className="text-[10px] font-bold text-[#37B5E9]">
                                  {t('dashboard.card.live')}
                                </span>
                              )}
                              {isDone && <ScoreSummary match={match} />}
                              {!isLive && !isDone && (
                                <span className="text-[10px] text-white/25">
                                  {t('dashboard.card.upcoming')}
                                </span>
                              )}
                            </div>
                          </div>

                          <ChevronRight size={14} className="text-white/20 flex-shrink-0 rtl-flip" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-14">
            <div
              className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(55,181,233,0.08)' }}
            >
              <Swords size={28} className="text-white/20" />
            </div>
            <p className="text-white/40 font-semibold mb-1">{t('dashboard.empty.title')}</p>
            <p className="text-white/25 text-sm">{t('dashboard.empty.subtitle')}</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

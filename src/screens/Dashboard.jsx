import { useNavigate } from 'react-router-dom'
import { Plus, Trophy, Zap, CheckCircle, Users, LogOut, ChevronRight } from 'lucide-react'
import { useGame } from '../store/GameContext'
import { useLang } from '../store/LangContext'
import Layout from '../components/Layout'

function TournamentCard({ tourney, onClick }) {
  const { t } = useLang()
  const total    = tourney.matches.length
  const done     = tourney.matches.filter((m) => m.status === 'completed').length
  const active   = tourney.matches.filter((m) => m.status === 'in_progress').length
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0
  const isComplete = tourney.status === 'completed'

  return (
    <button
      onClick={onClick}
      className="glass w-full rounded-2xl p-4 text-left transition-all hover:border-white/20 active:scale-[0.98]"
      style={{ animation: 'slide-up 0.35s ease-out both' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {isComplete ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-black"
                style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)' }}>
                {t('dashboard.card.complete')}
              </span>
            ) : active > 0 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#37B5E9]/20 text-[#37B5E9]">
                {t('dashboard.card.live')}
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                {t('dashboard.card.upcoming')}
              </span>
            )}
          </div>
          <h3 className="text-white font-bold text-lg leading-tight truncate"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            {tourney.name}
          </h3>
        </div>
        <span className="rtl-flip mt-1 flex-shrink-0">
          <ChevronRight size={18} className="text-white/30" />
        </span>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-white/50 text-xs">
          <Users size={13} />
          <span>{t('dashboard.card.players', { count: tourney.players.length })}</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/50 text-xs">
          <CheckCircle size={13} />
          <span>{t('dashboard.card.matches', { done, total })}</span>
        </div>
        {active > 0 && (
          <div className="flex items-center gap-1.5 text-[#37B5E9] text-xs">
            <Zap size={13} />
            <span>{t('dashboard.card.liveCount', { count: active })}</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: isComplete
              ? 'linear-gradient(90deg, #FFD700, #FFA500)'
              : 'linear-gradient(90deg, #37B5E9, #4B4BED)',
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-white/30 text-[10px]">
          {t('dashboard.card.percentComplete', { pct })}
        </span>
        <span className="text-white/30 text-[10px]">
          {new Date(tourney.createdAt).toLocaleDateString()}
        </span>
      </div>
    </button>
  )
}

export default function Dashboard() {
  const { tournaments, currentPlayer, logout } = useGame()
  const { t } = useLang()
  const navigate = useNavigate()

  const active    = tournaments.filter((tn) => tn.status === 'active')
  const completed = tournaments.filter((tn) => tn.status === 'completed')

  return (
    <Layout>
      <div className="px-5 pt-2 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/40 text-sm">{t('dashboard.welcomeBack')}</p>
            <h1
              className="text-2xl font-black text-white leading-tight"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {currentPlayer?.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #37B5E9, #4B4BED)' }}
            >
              {currentPlayer?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <button
              onClick={() => { logout(); navigate('/login', { replace: true }) }}
              className="p-2.5 glass rounded-xl text-white/40 hover:text-white/70 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 glass rounded-2xl p-3 text-center">
            <p className="text-2xl font-black grad-text" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {tournaments.length}
            </p>
            <p className="text-white/40 text-xs">{t('dashboard.stats.tournaments')}</p>
          </div>
          <div className="flex-1 glass rounded-2xl p-3 text-center">
            <p className="text-2xl font-black grad-text" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {active.length}
            </p>
            <p className="text-white/40 text-xs">{t('dashboard.stats.active')}</p>
          </div>
          <div className="flex-1 glass rounded-2xl p-3 text-center">
            <p className="text-2xl font-black gold-text" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {completed.length}
            </p>
            <p className="text-white/40 text-xs">{t('dashboard.stats.completed')}</p>
          </div>
        </div>

        {/* Active tournaments */}
        {active.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={15} className="text-[#37B5E9]" />
              <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider">
                {t('dashboard.sections.active')}
              </h2>
            </div>
            <div className="space-y-3">
              {active.map((tn, i) => (
                <div key={tn.id} style={{ animationDelay: `${i * 0.07}s` }}>
                  <TournamentCard tourney={tn} onClick={() => navigate(`/tournament/${tn.id}`)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={15} className="text-yellow-400" />
              <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider">
                {t('dashboard.sections.completed')}
              </h2>
            </div>
            <div className="space-y-3">
              {completed.map((tn, i) => (
                <div key={tn.id} style={{ animationDelay: `${i * 0.07}s` }}>
                  <TournamentCard tourney={tn} onClick={() => navigate(`/tournament/${tn.id}`)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {tournaments.length === 0 && (
          <div className="text-center py-14">
            <div
              className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(55,181,233,0.2), rgba(75,75,237,0.2))' }}
            >
              <span style={{ fontSize: 36 }}>🏓</span>
            </div>
            <h3 className="text-white/60 font-semibold mb-1">{t('dashboard.empty.title')}</h3>
            <p className="text-white/30 text-sm mb-6">{t('dashboard.empty.subtitle')}</p>
            <button
              onClick={() => navigate('/create')}
              className="btn-grad px-8 py-3 rounded-2xl text-white font-bold flex items-center gap-2 mx-auto"
            >
              <Plus size={18} /> {t('dashboard.empty.button')}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  )
}

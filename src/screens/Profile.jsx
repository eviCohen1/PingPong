import { useNavigate } from 'react-router-dom'
import { LogOut, Trophy, Swords, TrendingUp, Phone } from 'lucide-react'
import { useGame } from '../store/GameContext'
import { useLang } from '../store/LangContext'
import Layout from '../components/Layout'

export default function Profile() {
  const { currentPlayer, tournaments, logout } = useGame()
  const { t } = useLang()
  const navigate = useNavigate()

  // Compute stats across all tournaments this player participated in
  const myTournaments = tournaments.filter((tn) =>
    tn.players.some((p) => p.id === currentPlayer?.id)
  )

  let matchWins = 0
  let matchTotal = 0

  myTournaments.forEach((tn) => {
    tn.matches.forEach((m) => {
      if (m.status !== 'completed') return
      if (m.player1Id !== currentPlayer.id && m.player2Id !== currentPlayer.id) return
      matchTotal++
      if (m.winner === currentPlayer.id) matchWins++
    })
  })

  const winRate = matchTotal > 0 ? Math.round((matchWins / matchTotal) * 100) : 0

  return (
    <Layout>
      <div className="px-5 pt-2 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-2xl font-black text-white"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            {t('nav.profile')}
          </h1>
          <button
            onClick={() => { logout(); navigate('/login', { replace: true }) }}
            className="flex items-center gap-2 px-3 py-2 glass rounded-xl text-white/50 hover:text-white/80 transition-colors text-sm"
          >
            <LogOut size={15} />
            <span>{t('login.back') === 'Back' ? 'Logout' : 'יציאה'}</span>
          </button>
        </div>

        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-white font-black text-4xl mb-4"
            style={{
              background: 'linear-gradient(135deg, #37B5E9, #4B4BED)',
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            {currentPlayer?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <h2
            className="text-2xl font-black text-white mb-1"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            {currentPlayer?.name}
          </h2>
          {currentPlayer?.phone && (
            <div className="flex items-center gap-1.5 text-white/40 text-sm">
              <Phone size={13} />
              <span>{currentPlayer.phone}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass rounded-2xl p-4 text-center">
            <Trophy size={18} className="text-yellow-400 mx-auto mb-2" />
            <p
              className="text-2xl font-black grad-text"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {myTournaments.length}
            </p>
            <p className="text-white/40 text-[11px] mt-0.5">
              {t('dashboard.stats.tournaments')}
            </p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <Swords size={18} className="text-[#37B5E9] mx-auto mb-2" />
            <p
              className="text-2xl font-black grad-text"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {matchWins}
            </p>
            <p className="text-white/40 text-[11px] mt-0.5">
              {t('leaderboard.stats.wins')}
            </p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <TrendingUp size={18} className="text-green-400 mx-auto mb-2" />
            <p
              className="text-2xl font-black"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                background: 'linear-gradient(135deg,#4ade80,#22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {winRate}%
            </p>
            <p className="text-white/40 text-[11px] mt-0.5">Win Rate</p>
          </div>
        </div>

        {/* Tournaments list */}
        {myTournaments.length > 0 && (
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
              {t('dashboard.stats.tournaments')}
            </p>
            <div className="space-y-2">
              {myTournaments.map((tn) => {
                const myMatches = tn.matches.filter(
                  (m) =>
                    m.status === 'completed' &&
                    (m.player1Id === currentPlayer.id || m.player2Id === currentPlayer.id)
                )
                const myWins = myMatches.filter((m) => m.winner === currentPlayer.id).length
                const isComplete = tn.status === 'completed'
                return (
                  <button
                    key={tn.id}
                    onClick={() => navigate(`/tournament/${tn.id}`)}
                    className="glass w-full rounded-xl px-4 py-3 flex items-center justify-between text-left"
                  >
                    <div>
                      <p className="text-white font-semibold text-sm">{tn.name}</p>
                      <p className="text-white/40 text-xs mt-0.5">
                        {myWins}W · {myMatches.length - myWins}L
                      </p>
                    </div>
                    {isComplete ? (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full text-black"
                        style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)' }}
                      >
                        {t('dashboard.card.complete')}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#37B5E9]/20 text-[#37B5E9]">
                        {t('dashboard.card.live')}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {myTournaments.length === 0 && (
          <div className="text-center py-12">
            <div
              className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(55,181,233,0.1)' }}
            >
              <Trophy size={28} className="text-white/20" />
            </div>
            <p className="text-white/40 text-sm">{t('dashboard.empty.subtitle')}</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

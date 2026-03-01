import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, X, Phone, User, Trophy } from 'lucide-react'
import { useGame } from '../store/GameContext'
import { useLang } from '../store/LangContext'
import Layout from '../components/Layout'

export default function CreateTournament() {
  const { createTournament, currentPlayer } = useGame()
  const { t } = useLang()
  const navigate = useNavigate()

  const [name, setName]       = useState('')
  const [players, setPlayers] = useState(
    currentPlayer ? [{ id: currentPlayer.id, name: currentPlayer.name, phone: currentPlayer.phone }] : [],
  )
  const [pName, setPName] = useState('')
  const [pPhone, setPPhone] = useState('')
  const [error, setError] = useState('')
  const [pError, setPError] = useState('')

  function addPlayer(e) {
    e.preventDefault()
    const cleaned = pPhone.replace(/\D/g, '')
    if (!pName.trim()) { setPError(t('create.errorName')); return }
    if (cleaned.length < 7) { setPError(t('create.errorPhone')); return }
    if (players.find((p) => p.phone === cleaned)) { setPError(t('create.errorDuplicate')); return }
    setPError('')
    setPlayers((prev) => [
      ...prev,
      { id: `tmp-${Date.now()}`, name: pName.trim(), phone: cleaned },
    ])
    setPName('')
    setPPhone('')
  }

  function removePlayer(idx) {
    setPlayers((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) { setError(t('create.errorTournamentName')); return }
    if (players.length < 2) { setError(t('create.errorMinPlayers')); return }
    setError('')
    const tn = createTournament(name.trim(), players)
    navigate(`/tournament/${tn.id}`, { replace: true })
  }

  return (
    <Layout hideNav>
      <div className="px-5 pt-3 pb-8">
        {/* Back header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 glass rounded-xl text-white/60 hover:text-white transition-colors"
          >
            <span className="rtl-flip"><ChevronLeft size={20} /></span>
          </button>
          <h1 className="text-xl font-black text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            {t('create.title')}
          </h1>
        </div>

        {/* Tournament name */}
        <div className="glass rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} className="text-[#37B5E9]" />
            <label className="text-white/70 text-sm font-semibold">{t('create.nameLabel')}</label>
          </div>
          <input
            type="text"
            className="pp-input"
            placeholder={t('create.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        {/* Players */}
        <div className="glass rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#37B5E9]" />
              <span className="text-white/70 text-sm font-semibold">{t('create.playersLabel')}</span>
            </div>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background: players.length >= 2
                  ? 'linear-gradient(135deg,rgba(55,181,233,0.2),rgba(75,75,237,0.2))'
                  : 'rgba(255,255,255,0.07)',
                color: players.length >= 2 ? '#37B5E9' : 'rgba(255,255,255,0.3)',
              }}
            >
              {players.length} {t('create.minPlayers')}
            </span>
          </div>

          {/* Player list */}
          {players.length > 0 && (
            <div className="space-y-2 mb-4">
              {players.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5"
                  style={{ animation: 'slide-up 0.3s ease-out both', animationDelay: `${i * 0.05}s` }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #37B5E9, #4B4BED)' }}
                  >
                    {p.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-white/30 text-xs" dir="ltr">{p.phone}</p>
                  </div>
                  {p.id !== currentPlayer?.id && (
                    <button
                      onClick={() => removePlayer(i)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                  {p.id === currentPlayer?.id && (
                    <span className="text-[10px] text-[#37B5E9]/70 font-semibold">{t('create.youBadge')}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add player form */}
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(55,181,233,0.05)', border: '1px dashed rgba(55,181,233,0.2)' }}
          >
            <p className="text-white/40 text-xs font-semibold mb-3 uppercase tracking-wider">
              {t('create.addPlayerSection')}
            </p>
            <form onSubmit={addPlayer} className="space-y-2.5">
              <div className="relative">
                <User size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  className="pp-input ps-9 text-sm"
                  placeholder={t('create.playerNamePlaceholder')}
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                />
              </div>
              <div className="relative">
                <Phone size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  dir="ltr"
                  type="tel"
                  className="pp-input ps-9 text-sm"
                  placeholder={t('create.phonePlaceholder')}
                  value={pPhone}
                  onChange={(e) => setPPhone(e.target.value)}
                />
              </div>
              {pError && <p className="text-red-400 text-xs">{pError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl border border-dashed border-white/20 text-white/60 text-sm font-semibold flex items-center justify-center gap-1.5 hover:border-white/40 hover:text-white/80 transition-colors"
              >
                <Plus size={16} /> {t('create.addPlayerBtn')}
              </button>
            </form>
          </div>
        </div>

        {/* Round robin info */}
        {players.length >= 2 && (
          <div
            className="rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
            style={{ background: 'rgba(55,181,233,0.08)', border: '1px solid rgba(55,181,233,0.15)' }}
          >
            <span style={{ fontSize: 20 }}>🔄</span>
            <p className="text-white/50 text-xs">
              <span className="text-[#37B5E9] font-semibold">{t('create.roundRobinFormat')}</span>
              {' — '}
              {t('create.roundRobinDesc', {
                matches: (players.length * (players.length - 1)) / 2,
              })}
            </p>
          </div>
        )}

        {/* Create button */}
        <button
          onClick={handleCreate}
          disabled={players.length < 2 || !name.trim()}
          className="btn-grad w-full py-4 rounded-2xl text-white font-black text-base tracking-wide"
          style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}
        >
          {t('create.createBtn')}
        </button>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  )
}

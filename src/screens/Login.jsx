import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, User, ArrowRight, ChevronLeft, Loader2 } from 'lucide-react'
import { useGame } from '../store/GameContext'
import { useLang } from '../store/LangContext'
import { supabase } from '../lib/supabase'
import StatusBar from '../components/StatusBar'

export default function Login() {
  const { loginOrRegister, dbLoading } = useGame()
  const { t } = useLang()
  const navigate = useNavigate()

  const [step, setStep]       = useState('phone') // 'phone' | 'name'
  const [phone, setPhone]     = useState('')
  const [name, setName]       = useState('')
  const [error, setError]     = useState('')
  const [checking, setChecking] = useState(false)

  async function handlePhoneSubmit(e) {
    e.preventDefault()
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length < 7) { setError(t('login.errorPhone')); return }
    setError('')
    setChecking(true)
    try {
      // Check Supabase for existing player by phone
      const { data: existing } = await supabase
        .from('players')
        .select()
        .eq('phone', cleaned)
        .maybeSingle()

      if (existing) {
        await loginOrRegister(cleaned, existing.name)
        navigate('/', { replace: true })
      } else {
        setStep('name')
      }
    } catch {
      setError(t('login.errorPhone'))
    } finally {
      setChecking(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (!name.trim()) { setError(t('login.errorName')); return }
    setError('')
    const cleaned = phone.replace(/\D/g, '')
    await loginOrRegister(cleaned, name.trim())
    navigate('/', { replace: true })
  }

  const busy = checking || dbLoading

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
            width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(55,181,233,0.15) 0%, transparent 65%)',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '-10%', right: '-20%',
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(75,75,237,0.15) 0%, transparent 65%)',
          }}
        />
        {/* Mesh grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-sm mx-auto w-full flex flex-col flex-1 relative z-10">
        <StatusBar />

        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          {/* Hero */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #37B5E9, #4B4BED)',
                boxShadow: '0 0 60px rgba(55,181,233,0.4)',
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <span style={{ fontSize: 44 }}>🏓</span>
            </div>

            <h1
              className="text-5xl font-black tracking-tight mb-1"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                background: 'linear-gradient(135deg, #37B5E9, #4B4BED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('app.name')}
            </h1>
            <p className="text-white/40 text-base font-medium tracking-[0.3em] uppercase">
              {t('app.subtitle')}
            </p>
          </div>

          {/* Card */}
          <div className="glass rounded-3xl p-7">
            {step === 'phone' ? (
              <>
                <p className="text-white/60 text-sm mb-6 text-center">
                  {t('login.phoneStep')}
                </p>
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute start-4 top-1/2 -translate-y-1/2 text-white/30"
                    />
                    <input
                      dir="ltr"
                      type="tel"
                      className="pp-input ps-11"
                      placeholder={t('login.phonePlaceholder')}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={busy}
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn-grad w-full py-3.5 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {busy ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        {t('login.continue')}
                        <span className="rtl-flip"><ArrowRight size={18} /></span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setStep('phone'); setError('') }}
                  className="flex items-center gap-1 text-white/40 text-sm mb-5 hover:text-white/70 transition-colors"
                >
                  <span className="rtl-flip"><ChevronLeft size={16} /></span>
                  {t('login.back')}
                </button>
                <p className="text-white/60 text-sm mb-1 text-center">
                  {t('login.welcomeNew')}
                </p>
                <p className="text-white/40 text-xs mb-6 text-center" dir="ltr">
                  {phone}
                </p>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute start-4 top-1/2 -translate-y-1/2 text-white/30"
                    />
                    <input
                      type="text"
                      className="pp-input ps-11"
                      placeholder={t('login.namePlaceholder')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={busy}
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn-grad w-full py-3.5 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {busy ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        {t('login.joinTournament')}
                        <span className="rtl-flip"><ArrowRight size={18} /></span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-white/20 text-xs text-center mt-6">
            {t('login.phoneHint')}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-12px) rotate(10deg); }
        }
      `}</style>
    </div>
  )
}

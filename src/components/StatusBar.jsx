import { useLang } from '../store/LangContext'

/** iOS-style mock status bar with language switcher */
export default function StatusBar() {
  const { lang, setLang } = useLang()

  return (
    <div
      dir="ltr"
      className="flex justify-between items-center px-6 pt-3 pb-1 text-white/80 text-xs font-semibold select-none"
    >
      <span style={{ fontFamily: "'Exo 2', sans-serif", letterSpacing: '0.05em' }}>9:41</span>

      {/* Language toggle */}
      <button
        onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
        className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        style={{ fontSize: 10, letterSpacing: '0.06em', fontFamily: "'Exo 2', sans-serif" }}
      >
        <span className={lang === 'en' ? 'text-white font-bold' : 'text-white/35'}>EN</span>
        <span className="text-white/25">|</span>
        <span className={lang === 'he' ? 'text-white font-bold' : 'text-white/35'}>עב</span>
      </button>

      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0"  y="8" width="3" height="4" rx="0.5" fill="white"/>
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" fill="white"/>
          <rect x="9" y="3" width="3" height="9" rx="0.5" fill="white"/>
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="white"/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="white"/>
          <path d="M3.5 6.8A6.4 6.4 0 0 1 8 5a6.4 6.4 0 0 1 4.5 1.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M1 4.2A9.9 9.9 0 0 1 8 1.5a9.9 9.9 0 0 1 7 2.7" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="white" strokeOpacity="0.5"/>
          <rect x="2" y="2" width="17" height="8" rx="2" fill="white"/>
          <path d="M23 4v4a2 2 0 0 0 0-4z" fill="white" fillOpacity="0.5"/>
        </svg>
      </div>
    </div>
  )
}

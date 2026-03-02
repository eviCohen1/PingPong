import { useLang } from '../store/LangContext'

/** iOS-style mock status bar with language switcher */
export default function StatusBar() {
  const { lang, setLang } = useLang()

  return (
    <div
      dir="ltr"
      className="flex justify-end items-center px-6 pt-3 pb-1 select-none"
    >
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
    </div>
  )
}

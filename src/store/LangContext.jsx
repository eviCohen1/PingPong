import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { translations } from '../i18n/translations'

const LangContext = createContext(null)

function interpolate(str, vars = {}) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ''))
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('pp_lang') || 'en',
  )

  useEffect(() => {
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  function setLang(l) {
    localStorage.setItem('pp_lang', l)
    setLangState(l)
  }

  const t = useCallback(
    (key, vars = {}) => {
      const keys = key.split('.')
      let val = translations[lang]
      for (const k of keys) {
        val = val?.[k]
        if (val === undefined) break
      }
      if (typeof val !== 'string') return key
      return interpolate(val, vars)
    },
    [lang],
  )

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRTL: lang === 'he' }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}

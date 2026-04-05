import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lang } from '../lib/i18n'

interface LanguageCtx {
  lang: Lang
  toggle: () => void
}

const LanguageContext = createContext<LanguageCtx>({ lang: 'zh', toggle: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem('bsk_lang')
    return stored === 'en' ? 'en' : 'zh'
  })

  function toggle() {
    setLang(prev => {
      const next: Lang = prev === 'zh' ? 'en' : 'zh'
      localStorage.setItem('bsk_lang', next)
      return next
    })
  }

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

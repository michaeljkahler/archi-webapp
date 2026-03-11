import React, { createContext, useContext, useState, useEffect } from 'react'
import deJson from '../i18n/de.json'
import frJson from '../i18n/fr.json'

const LanguageContext = createContext()

// Use JSON files as the single source of truth
const translations = { de: deJson, fr: frJson }

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const stored = localStorage.getItem('archi-language')
      if (stored === 'de' || stored === 'fr') return stored
    } catch (e) { /* localStorage not available */ }

    const browserLang = (navigator.language || '').toLowerCase()
    if (browserLang.startsWith('fr')) return 'fr'
    return 'de'
  })

  useEffect(() => {
    try { localStorage.setItem('archi-language', language) } catch (e) {}
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'de' ? 'fr' : 'de')
  }

  const t = (key) => {
    const keys = key.split('.')
    let current = translations[language]

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        return key // Fallback: return key path as-is
      }
    }

    return typeof current === 'string' ? current : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

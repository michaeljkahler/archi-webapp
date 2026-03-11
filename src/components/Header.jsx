import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

export default function Header() {
  const { language, toggleLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.sites'), href: '/sites' },
    { label: t('nav.diagnose'), href: '/diagnose' },
    { label: t('nav.glossary'), href: '/glossary' },
    { label: t('nav.about'), href: '/about' },
  ]

  return (
    <header className="bg-archi-forest text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-archi-forest">
              A
            </div>
            <span className="font-bold text-lg hidden sm:inline">ARCHI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="hover:text-archi-forestLight transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Language Toggle and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium min-h-touch min-w-touch flex items-center justify-center"
              aria-label={`Switch to ${language === 'de' ? 'French' : 'German'}`}
              title={language === 'de' ? 'Français' : 'Deutsch'}
            >
              {language === 'de' ? 'FR' : 'DE'}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors min-h-touch min-w-touch"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block py-2 hover:text-archi-forestLight transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

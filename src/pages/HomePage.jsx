import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-archi-forest to-archi-forestLight text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.title')}</h1>
          <p className="text-lg md:text-xl mb-8 opacity-95">{t('home.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/diagnose"
              className="bg-white text-archi-forest font-bold py-4 px-8 rounded-xl text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              {t('home.start_diagnosis')}
            </Link>
            <Link
              to="/sites"
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
            >
              {t('home.manage_sites')}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/diagnose" className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🌳</div>
            <h3 className="font-bold text-lg mb-2 text-archi-forest">{t('home.quick_diagnosis')}</h3>
            <p className="text-sm text-gray-600">{t('species.select')}</p>
          </Link>
          <Link to="/sites" className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-bold text-lg mb-2 text-archi-forest">{t('nav.sites')}</h3>
            <p className="text-sm text-gray-600">{t('site.summary')}</p>
          </Link>
          <Link to="/glossary" className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-bold text-lg mb-2 text-archi-forest">{t('glossary.title')}</h3>
            <p className="text-sm text-gray-600">{t('glossary.search')}</p>
          </Link>
        </div>
      </section>

      {/* Footer citation */}
      <section className="bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>{t('app.footer_citation')}</p>
        </div>
      </section>
    </div>
  )
}

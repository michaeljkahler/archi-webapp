import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import CycleDiagram from '../components/CycleDiagram'

export default function AboutPage() {
  const { t } = useLanguage()

  const steps = [
    { key: 'step1', num: 1 },
    { key: 'step2', num: 2 },
    { key: 'step3', num: 3 },
    { key: 'step4', num: 4 },
  ]

  const states = [
    { key: 'sain', bg: 'bg-green-50', border: 'border-archi-sain', text: 'text-green-800' },
    { key: 'stresse', bg: 'bg-yellow-50', border: 'border-archi-stresse', text: 'text-yellow-800' },
    { key: 'resilient', bg: 'bg-blue-50', border: 'border-archi-resilient', text: 'text-blue-800' },
    { key: 'descente', bg: 'bg-orange-50', border: 'border-archi-descente', text: 'text-orange-800' },
    { key: 'repli', bg: 'bg-purple-50', border: 'border-archi-repli', text: 'text-purple-800' },
    { key: 'irreversible', bg: 'bg-red-50', border: 'border-archi-irreversible', text: 'text-red-800' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('about.title')}</h1>

      {/* Introduction */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-4 text-archi-forest">{t('about.methodology')}</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          {t('about.description')}
        </p>
        <p className="text-gray-700 leading-relaxed">
          {t('about.methodologyText')}
        </p>
      </div>

      {/* DMA Categories */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-4 text-archi-forest">{t('about.dma_categories')}</h2>
        <p className="text-gray-700 mb-6">
          {t('about.dma_categories_intro')}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {states.map(s => (
            <div key={s.key} className={`p-4 ${s.bg} rounded-lg border-l-4 ${s.border}`}>
              <h3 className={`font-bold ${s.text} mb-2`}>{t(`about.state_${s.key}`)}</h3>
              <p className="text-sm text-gray-700">{t(`about.state_${s.key}_desc`)}</p>
            </div>
          ))}
          <div className="p-4 bg-gray-700 text-white rounded-lg border-l-4 border-archi-mort">
            <h3 className="font-bold mb-2">{t('about.state_mort')}</h3>
            <p className="text-sm">{t('about.state_mort_desc')}</p>
          </div>
        </div>
      </div>

      {/* Cycle Diagram */}
      <div className="mb-8">
        <CycleDiagram />
      </div>

      {/* Citation */}
      <div className="card bg-gradient-to-r from-archi-forest to-archi-forestLight text-white mb-8">
        <h2 className="text-2xl font-bold mb-4">{t('about.citation')}</h2>
        <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
          <p className="font-semibold mb-2">
            {t('about.citationText')}
          </p>
          <p className="text-sm opacity-90">
            Drénou C., 2023
          </p>
        </div>
      </div>

      {/* How to Use */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-4 text-archi-forest">{t('about.how_to_use')}</h2>
        <ol className="space-y-4">
          {steps.map(step => (
            <li key={step.key} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-archi-forest text-white rounded-full flex items-center justify-center font-bold">
                {step.num}
              </span>
              <div>
                <h3 className="font-semibold mb-1">{t(`about.${step.key}_title`)}</h3>
                <p className="text-gray-700 text-sm">{t(`about.${step.key}_desc`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Offline Capability */}
      <div className="card bg-blue-50 border-l-4 border-archi-resilient mb-8">
        <h2 className="text-2xl font-bold mb-4 text-archi-resilient">{t('about.offline_title')}</h2>
        <p className="text-gray-700">{t('about.offline_desc')}</p>
      </div>

      {/* Technical Info */}
      <div className="card bg-gray-50">
        <h2 className="text-2xl font-bold mb-4 text-archi-forest">{t('about.technical_title')}</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">{t('about.storage_title')}</h3>
            <p>{t('about.storage_desc')}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t('about.privacy_title')}</h3>
            <p>{t('about.privacy_desc')}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t('about.platforms_title')}</h3>
            <p>{t('about.platforms_desc')}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t('about.support_title')}</h3>
            <p>{t('about.support_desc')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

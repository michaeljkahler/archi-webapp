import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

const SPECIES = [
  { id: 'chenes_hetre', icon: '\u{1F333}', latin: 'Quercus spp. / Fagus sylvatica' },
  { id: 'chataignier', icon: '\u{1F330}', latin: 'Castanea sativa' },
  { id: 'platane', icon: '\u{1F341}', latin: 'Platanus \u00d7 acerifolia' },
  { id: 'douglas', icon: '\u{1F332}', latin: 'Pseudotsuga menziesii' },
  { id: 'epicea', icon: '\u{1F384}', latin: 'Picea abies' },
  { id: 'pins', icon: '\u{1F332}', latin: 'Pinus spp.' },
  { id: 'sapin_pectine', icon: '\u{1F332}', latin: 'Abies alba' },
  { id: 'cedre_atlas', icon: '\u{1F33F}', latin: 'Cedrus atlantica' }
]

export default function SpeciesSelector() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-archi-forest mb-2">
          {t('species.select')}
        </h1>
        <p className="text-gray-600">{t('species.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SPECIES.map((sp) => (
          <button
            key={sp.id}
            onClick={() => navigate(`/diagnose/${sp.id}`)}
            className="species-tile group hover:border-archi-forest"
          >
            <span className="text-4xl mb-2">{sp.icon}</span>
            <h3 className="font-bold text-base text-archi-forest group-hover:text-archi-forestDark text-center">
              {t(`species.${sp.id}`)}
            </h3>
            <p className="text-xs text-gray-500 italic text-center mt-1">{sp.latin}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button onClick={() => navigate('/')} className="btn-secondary">
          {t('common.back')}
        </button>
      </div>
    </div>
  )
}

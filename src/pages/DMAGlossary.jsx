import React, { useState, useMemo } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import dmaData from '../data/dma.json'

const CATEGORY_ORDER = ['houppier', 'branches', 'tronc', 'fleche', 'arbre_entier']

export default function DMAGlossary() {
  const { t, language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState({})
  const [selectedCategory, setSelectedCategory] = useState('all')

  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const grouped = useMemo(() => {
    const groups = {}
    for (const marker of dmaData.dendromarkers) {
      const cat = marker.category
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(marker)
    }
    return groups
  }, [])

  const filteredGrouped = useMemo(() => {
    const query = searchTerm.toLowerCase()
    const result = {}

    for (const cat of CATEGORY_ORDER) {
      if (!grouped[cat]) continue
      if (selectedCategory !== 'all' && cat !== selectedCategory) continue

      const filtered = grouped[cat].filter(marker => {
        if (!query) return true
        const name = marker.name?.[language] || ''
        const desc = marker.description?.[language] || ''
        const diag = marker.diagnostic_value?.[language] || ''
        return (
          name.toLowerCase().includes(query) ||
          desc.toLowerCase().includes(query) ||
          diag.toLowerCase().includes(query)
        )
      })

      if (filtered.length > 0) {
        result[cat] = filtered
      }
    }
    return result
  }, [searchTerm, selectedCategory, language, grouped])

  const categories = CATEGORY_ORDER.filter(c => grouped[c])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('glossary.title')}</h1>
      <p className="text-gray-600 mb-8">{t('glossary.subtitle')}</p>

      {/* Search + Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder={t('glossary.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field flex-1"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field sm:w-48"
        >
          <option value="all">{t('glossary.all_categories')}</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {t(`glossary.categories.${cat}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {Object.keys(filteredGrouped).length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t('glossary.noResults')}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(filteredGrouped).map(([cat, markers]) => (
            <div key={cat}>
              <h2 className="text-lg font-bold text-archi-forest mb-4 flex items-center gap-2">
                {t(`glossary.categories.${cat}`)}
                <span className="text-sm font-normal text-gray-400">({markers.length})</span>
              </h2>
              <div className="space-y-3">
                {markers.map(marker => (
                  <div key={marker.id} className="card">
                    <button
                      onClick={() => toggleItem(marker.id)}
                      className="w-full flex justify-between items-center text-left"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {marker.name?.[language] || marker.id.replace(/_/g, ' ')}
                        </h3>
                        {marker.guide_page && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {t('glossary.guide_page')} {marker.guide_page}
                          </p>
                        )}
                      </div>
                      <span className="text-2xl text-gray-400 ml-2">
                        {expandedItems[marker.id] ? '−' : '+'}
                      </span>
                    </button>

                    {expandedItems[marker.id] && (
                      <div className="mt-4 border-t border-gray-200 pt-4 space-y-4">
                        {/* Illustration */}
                        {marker.illustration_extracted && (
                          <img
                            src={`${import.meta.env.BASE_URL}images/${marker.illustration_extracted}`}
                            alt={marker.name?.[language] || marker.id}
                            className="rounded-lg max-w-full h-auto max-h-64 mx-auto"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}

                        {/* Description */}
                        {marker.description?.[language] && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-600 mb-1">
                              {t('glossary.description')}
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {marker.description[language]}
                            </p>
                          </div>
                        )}

                        {/* Diagnostic value */}
                        {marker.diagnostic_value?.[language] && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <h4 className="text-sm font-semibold text-green-800 mb-1">
                              {t('glossary.diagnostic_value')}
                            </h4>
                            <p className="text-sm text-green-700 leading-relaxed">
                              {marker.diagnostic_value[language]}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

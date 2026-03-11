import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { saveTree, getSite } from '../utils/storage'

const ARCHI_SPECIES = [
  { id: 'chenes_hetre', icon: '\u{1F333}', latin: 'Quercus spp. & Fagus sylvatica' },
  { id: 'chataignier', icon: '\u{1F330}', latin: 'Castanea sativa' },
  { id: 'platane', icon: '\u{1F341}', latin: 'Platanus \u00d7 acerifolia' },
  { id: 'douglas', icon: '\u{1F332}', latin: 'Pseudotsuga menziesii' },
  { id: 'epicea', icon: '\u{1F384}', latin: 'Picea abies' },
  { id: 'pins', icon: '\u{1F332}', latin: 'Pinus spp.' },
  { id: 'sapin_pectine', icon: '\u{1F332}', latin: 'Abies alba' },
  { id: 'cedre_atlas', icon: '\u{1F33F}', latin: 'Cedrus atlantica' },
]

export default function TreeForm() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id: siteId } = useParams()

  const [site, setSite] = useState(null)
  const [formData, setFormData] = useState({
    species: '',
    dbh: '',
    height: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSite()
  }, [siteId])

  const loadSite = async () => {
    try {
      const siteData = await getSite(siteId)
      if (!siteData) {
        setError('Site not found')
      } else {
        setSite(siteData)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.species) {
      setError(t('common.required'))
      return
    }

    try {
      setSubmitting(true)
      const treeData = {
        siteId,
        species: formData.species,
        dbh: formData.dbh ? parseFloat(formData.dbh) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        notes: formData.notes,
        date: new Date().toISOString(),
      }
      const saved = await saveTree(treeData)
      navigate(`/sites/${siteId}/trees/${saved.id}/diagnose/${formData.species}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-red-600">{error || 'Loading...'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('trees.title')} {t('common.add')}</h1>
      <p className="text-gray-600 mb-6">{t('sites.title')}: {site.name}</p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Species Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t('trees.species')} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {ARCHI_SPECIES.map(sp => (
              <button
                key={sp.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, species: sp.id }))}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  formData.species === sp.id
                    ? 'border-archi-forest bg-green-50 ring-2 ring-archi-forest/30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{sp.icon}</span>
                <p className="font-semibold text-sm mt-1">{t(`species.${sp.id}`)}</p>
                <p className="text-xs text-gray-500 italic">{sp.latin}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Optional fields */}
        <div className="card space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('trees.dbh')}
            </label>
            <input
              type="number"
              value={formData.dbh}
              onChange={e => setFormData(prev => ({ ...prev, dbh: e.target.value }))}
              placeholder="0"
              min="0"
              step="0.1"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('trees.height')}
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={e => setFormData(prev => ({ ...prev, height: e.target.value }))}
              placeholder="0"
              min="0"
              step="0.1"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('trees.notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder={t('trees.notes')}
              className="input-field resize-none"
              rows="3"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting || !formData.species}
              className="btn-primary flex-1 disabled:opacity-40"
            >
              {submitting ? t('common.loading') : t('trees.save_and_diagnose')}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/sites/${siteId}`)}
              className="btn-secondary flex-1"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { saveTree, getSite } from '../utils/storage'

const SPECIES_OPTIONS = [
  'Eiche (Quercus spp.)',
  'Buche (Fagus sylvatica)',
  'Edelkastanie (Castanea sativa)',
  'Platane (Platanus × acerifolia)',
  'Douglasie (Pseudotsuga menziesii)',
  'Fichte (Picea abies)',
  'Waldkiefer (Pinus sylvestris)',
  'Schwarzkiefer (Pinus nigra)',
  'Seekiefer (Pinus pinaster)',
  'Weisstanne (Abies alba)',
  'Atlaszeder (Cedrus atlantica)',
  'Korkeiche (Quercus suber)',
  'Bergahorn (Acer pseudoplatanus)',
  'Spitzahorn (Acer platanoides)',
  'Esche (Fraxinus excelsior)',
  'Linde (Tilia spp.)',
  'Birke (Betula spp.)',
  'Hainbuche (Carpinus betulus)',
  'Lärche (Larix decidua)',
]

export default function TreeForm() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id: siteId } = useParams()

  const [site, setSite] = useState(null)
  const [formData, setFormData] = useState({
    siteId,
    species: '',
    dbh: '',
    height: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredSpecies, setFilteredSpecies] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    loadSite()
  }, [siteId])

  useEffect(() => {
    if (formData.species.length > 0) {
      const filtered = SPECIES_OPTIONS.filter(s =>
        s.toLowerCase().includes(formData.species.toLowerCase())
      ).slice(0, 8)
      setFilteredSpecies(filtered)
      setShowDropdown(filtered.length > 0)
    } else {
      setFilteredSpecies([])
      setShowDropdown(false)
    }
  }, [formData.species])

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const selectSpecies = (species) => {
    setFormData(prev => ({ ...prev, species }))
    setShowDropdown(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.species.trim()) {
      setError(t('trees.species') + ' ist erforderlich')
      return
    }

    try {
      setSubmitting(true)
      const treeData = {
        ...formData,
        dbh: formData.dbh ? parseFloat(formData.dbh) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        date: new Date().toISOString(),
      }
      await saveTree(treeData)
      navigate(`/sites/${siteId}`)
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
      <h1 className="text-3xl font-bold mb-4">{t('trees.title')} {t('common.add')}</h1>
      <p className="text-gray-600 mb-8">{t('sites.title')}: {site.name}</p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Species Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('trees.species')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="species"
                value={formData.species}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(filteredSpecies.length > 0)}
                placeholder={t('trees.species')}
                className="input-field"
                autoComplete="off"
                required
              />
              {showDropdown && filteredSpecies.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {filteredSpecies.map((species, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectSpecies(species)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm"
                    >
                      {species}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DBH Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('trees.dbh')}
            </label>
            <input
              type="number"
              name="dbh"
              value={formData.dbh}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              step="0.1"
              className="input-field"
            />
          </div>

          {/* Height Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('trees.height')}
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              step="0.1"
              className="input-field"
            />
          </div>

          {/* Notes Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('trees.notes')}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder={t('trees.notes')}
              className="input-field resize-none"
              rows="4"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? t('common.loading') : t('common.save')}
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

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { saveSite } from '../utils/storage'
import { useGeolocation } from '../hooks/useGeolocation'

export default function SiteForm() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { position, capture, loading: geoLoading } = useGeolocation()

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    observer: '',
    latitude: null,
    longitude: null,
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCapture = () => {
    capture()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError(t('sites.name') + ' — ' + t('common.required'))
      return
    }

    try {
      setSubmitting(true)
      const siteData = {
        ...formData,
        latitude: position?.latitude || formData.latitude,
        longitude: position?.longitude || formData.longitude,
      }
      const savedSite = await saveSite(siteData)
      navigate(`/sites/${savedSite.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('sites.newSite')}</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('sites.name')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('sites.name')}
              className="input-field"
              required
            />
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('sites.location')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder={t('sites.location')}
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={handleCapture}
                disabled={geoLoading}
                className="btn-secondary"
              >
                {geoLoading ? '...' : '📍'}
              </button>
            </div>
            {position && (
              <p className="text-xs text-gray-600 mt-2">
                Lat: {position.latitude.toFixed(4)}, Lon: {position.longitude.toFixed(4)}
                {position.accuracy && ` (±${position.accuracy.toFixed(0)}m)`}
              </p>
            )}
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('sites.date')}
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          {/* Observer Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('sites.observer')}
            </label>
            <input
              type="text"
              name="observer"
              value={formData.observer}
              onChange={handleInputChange}
              placeholder={t('sites.observer')}
              className="input-field"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? t('common.loading') : t('common.save')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/sites')}
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

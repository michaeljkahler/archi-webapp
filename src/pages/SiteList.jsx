import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getAllSites, deleteSite } from '../utils/storage'

export default function SiteList() {
  const { t } = useLanguage()
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    try {
      setLoading(true)
      setError(null)
      const allSites = await getAllSites()
      setSites(allSites.sort((a, b) => new Date(b.date) - new Date(a.date)))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (siteId) => {
    if (window.confirm(t('sites.confirmDelete'))) {
      try {
        await deleteSite(siteId)
        setSites(sites.filter(s => s.id !== siteId))
      } catch (err) {
        setError(err.message)
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('sites.title')}</h1>
        <Link to="/sites/new" className="btn-primary">
          {t('sites.newSite')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('common.loading')}</p>
        </div>
      ) : sites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">{t('sites.noSites')}</p>
          <Link to="/sites/new" className="btn-primary inline-block">
            {t('sites.addFirst')}
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Link
              key={site.id}
              to={`/sites/${site.id}`}
              className="card hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-archi-forest group-hover:text-archi-forestDark transition-colors flex-1">
                  {site.name}
                </h2>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleDelete(site.id)
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                  title={t('common.delete')}
                >
                  ✕
                </button>
              </div>
              {site.location && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">{t('sites.location')}:</span> {site.location}
                </p>
              )}
              {site.date && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">{t('sites.date')}:</span>{' '}
                  {new Date(site.date).toLocaleDateString()}
                </p>
              )}
              {site.observer && (
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{t('sites.observer')}:</span> {site.observer}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

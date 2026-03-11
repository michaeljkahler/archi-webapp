import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getSite, getTreesBySite, deleteSite, deleteTree, getSiteStats } from '../utils/storage'
import { exportCSV, exportPDF } from '../utils/export'

export default function SiteSummary() {
  const { t, language } = useLanguage()
  const { id } = useParams()
  const navigate = useNavigate()

  const [site, setSite] = useState(null)
  const [trees, setTrees] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const siteData = await getSite(id)
      if (!siteData) {
        setError('Site not found')
        return
      }
      setSite(siteData)

      const treesData = await getTreesBySite(id)
      setTrees(treesData.sort((a, b) => new Date(b.date) - new Date(a.date)))

      const statsData = await getSiteStats(id)
      setStats(statsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSite = async () => {
    if (window.confirm(t('sites.confirmDelete'))) {
      try {
        await deleteSite(id)
        navigate('/sites')
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleDeleteTree = async (treeId) => {
    if (window.confirm(t('trees.title') + ' ' + t('common.delete') + '?')) {
      try {
        await deleteTree(treeId)
        setTrees(trees.filter(t => t.id !== treeId))
        loadData()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleExportCSV = async () => {
    try {
      setExporting(true)
      exportCSV(site, trees, language)
    } catch (err) {
      setError(err.message)
    } finally {
      setExporting(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setExporting(true)
      exportPDF(site, trees, language)
    } catch (err) {
      setError(err.message)
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-red-600">{error || 'Site not found'}</p>
        <Link to="/sites" className="btn-primary mt-4 inline-block">
          {t('common.back')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">{site.name}</h1>
          <p className="text-gray-600 mt-2">{site.location || t('site.no_location')}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/sites" className="btn-secondary">
            {t('common.back')}
          </Link>
          <button onClick={handleDeleteSite} className="btn-secondary text-red-600 border-red-300">
            {t('common.delete')}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      {/* Site Info Card */}
      <div className="card mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">{t('sites.date')}</p>
            <p className="font-semibold">{new Date(site.date).toLocaleDateString()}</p>
          </div>
          {site.observer && (
            <div>
              <p className="text-sm text-gray-600">{t('sites.observer')}</p>
              <p className="font-semibold">{site.observer}</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Card */}
      {stats && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">{t('common.statistics')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-archi-forest">{stats.totalTrees}</p>
              <p className="text-sm text-gray-600">{t('trees.title')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-archi-forest">{stats.completionRate}%</p>
              <p className="text-sm text-gray-600">{t('diagnose.progress')}</p>
            </div>
            {stats.avgDBH && (
              <div className="text-center">
                <p className="text-3xl font-bold text-archi-forest">{stats.avgDBH}</p>
                <p className="text-sm text-gray-600">{t('common.avg_dbh')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Buttons */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="btn-secondary"
        >
          {exporting ? '...' : t('export.csv')}
        </button>
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="btn-secondary"
        >
          {exporting ? '...' : t('export.pdf')}
        </button>
        <Link to={`/sites/${id}/tree/new`} className="btn-primary">
          {t('sites.addTree')}
        </Link>
      </div>

      {/* Trees List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">{t('trees.title')}</h2>
        {trees.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">{t('trees.noTrees')}</p>
            <Link to={`/sites/${id}/tree/new`} className="btn-primary inline-block">
              {t('trees.title')} {t('common.add')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {trees.map((tree) => (
              <div key={tree.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-archi-forest">
                      {t(`species.${tree.species}`) !== `species.${tree.species}` ? t(`species.${tree.species}`) : tree.species}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                      {tree.dbh && (
                        <div>
                          <p className="text-gray-600">{t('trees.dbh')}</p>
                          <p className="font-semibold">{tree.dbh} cm</p>
                        </div>
                      )}
                      {tree.height && (
                        <div>
                          <p className="text-gray-600">{t('trees.height')}</p>
                          <p className="font-semibold">{tree.height} m</p>
                        </div>
                      )}
                      {tree.diagnosis && (
                        <div>
                          <p className="text-gray-600">{t('diagnosis.result')}</p>
                          <p className="font-semibold text-archi-forest">
                            {t(`states.${tree.diagnosis.category}`) !== `states.${tree.diagnosis.category}` ? t(`states.${tree.diagnosis.category}`) : tree.diagnosis.category}
                          </p>
                        </div>
                      )}
                    </div>
                    {tree.notes && (
                      <p className="text-sm text-gray-600 mt-3">{tree.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteTree(tree.id)}
                    className="text-red-500 hover:text-red-700 p-1 ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


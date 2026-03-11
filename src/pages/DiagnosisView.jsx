import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { TreeEngine } from '../utils/treeEngine'
import dmaData from '../data/dma.json'

// Dynamic imports for all 8 species
const treeFiles = {
  chenes_hetre: () => import('../data/trees/chenes_hetre.json'),
  chataignier: () => import('../data/trees/chataignier.json'),
  platane: () => import('../data/trees/platane.json'),
  douglas: () => import('../data/trees/douglas.json'),
  epicea: () => import('../data/trees/epicea.json'),
  pins: () => import('../data/trees/pins.json'),
  sapin_pectine: () => import('../data/trees/sapin_pectine.json'),
  cedre_atlas: () => import('../data/trees/cedre.json'),
}

export default function DiagnosisView() {
  const { t, language } = useLanguage()
  const { species } = useParams()
  const navigate = useNavigate()

  const [engine, setEngine] = useState(null)
  const [treeData, setTreeData] = useState(null)
  const [, setTick] = useState(0) // force re-render
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFlowchart, setShowFlowchart] = useState(false)
  const [showDmaHelp, setShowDmaHelp] = useState(null)

  useEffect(() => {
    loadSpecies()
  }, [species])

  const loadSpecies = async () => {
    try {
      setLoading(true)
      setError(null)
      const loader = treeFiles[species]
      if (!loader) {
        setError(`Unknown species: ${species}`)
        return
      }
      const mod = await loader()
      const data = mod.default || mod
      setTreeData(data)
      const eng = new TreeEngine(data)
      setEngine(eng)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const forceUpdate = () => setTick(t => t + 1)

  const handleAnswer = (response) => {
    try {
      engine.answer(response)
      forceUpdate()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoBack = () => {
    engine.goBack()
    forceUpdate()
  }

  const handleReset = () => {
    engine.reset()
    forceUpdate()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-archi-forest border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 mb-4">{error}</div>
        <button onClick={() => navigate('/diagnose')} className="btn-primary">{t('common.back')}</button>
      </div>
    )
  }

  const isComplete = engine.isComplete()
  const result = engine.getResult()
  const currentNode = engine.getCurrentNode()
  const progress = engine.getProgress()

  // Render result
  if (isComplete && result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-6">{t('diagnosis.result')}</h2>

          <div
            className="result-badge mx-auto mb-4"
            style={{ backgroundColor: result.color || '#2E7D32' }}
          >
            {result.code}
          </div>

          <h3 className="text-xl font-bold mb-2">
            {result.label?.[language] || result.label?.fr || result.code}
          </h3>

          <div className="flex gap-2 justify-center mb-6">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
              {t(`stages.${result.stage}`) || result.stage}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: result.color || '#666' }}>
              {t(`states.${result.state}`) || result.state}
            </span>
          </div>

          {/* Decision path */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h4 className="font-bold text-sm mb-2">{t('diagnosis.decision_path')}</h4>
            <div className="space-y-1">
              {engine.getPath().map((step, i) => (
                <div key={i} className="text-sm flex gap-2">
                  <span className={`font-bold ${step.answer === 'yes' ? 'text-green-600' : step.answer === 'no' ? 'text-red-600' : 'text-gray-400'}`}>
                    {step.answer === 'yes' ? 'OUI' : step.answer === 'no' ? 'NON' : '→'}
                  </span>
                  <span className="text-gray-600 truncate">
                    {step.question?.[language] || step.question?.fr || step.nodeId}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={handleReset} className="btn-primary w-full">
              {t('diagnosis.restart')}
            </button>
            <button onClick={() => navigate('/diagnose')} className="btn-secondary w-full">
              {t('species.select')}
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary w-full">
              {t('common.back')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render question
  if (!currentNode) return null

  const question = currentNode.question?.[language] || currentNode.question?.fr || ''
  const zone = currentNode.zone?.[language] || currentNode.zone?.fr || ''
  const note = currentNode.note?.[language] || currentNode.note?.fr || ''
  const hasSkip = !!currentNode.skip
  const dmaRefs = currentNode.dma_refs || []

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Species name */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-archi-forest">
          {treeData?.names?.[language] || treeData?.names?.fr || species}
        </h1>
        <p className="text-xs text-gray-500 italic">
          {treeData?.latin?.join(', ')}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>{t('diagnosis.question')} {engine.history.length + 1}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-archi-forest h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card mb-6">
        {zone && (
          <div className="text-xs font-medium text-archi-forest bg-green-50 rounded-lg px-3 py-1 inline-block mb-3">
            {zone}
          </div>
        )}

        <p className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed">
          {question}
        </p>

        {note && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
            {note}
          </div>
        )}

        {/* DMA help links */}
        {dmaRefs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {dmaRefs.map(ref => (
              <button
                key={ref}
                onClick={() => setShowDmaHelp(showDmaHelp === ref ? null : ref)}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
              >
                {t('diagnosis.help')}: {ref.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        )}

        {/* DMA help overlay */}
        {showDmaHelp && (() => {
          const dmaItem = dmaData.dendromarkers.find(d => d.id === showDmaHelp)
          return (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-sm text-blue-800">
                  {dmaItem?.name?.[language] || showDmaHelp.replace(/_/g, ' ')}
                </h4>
                <button onClick={() => setShowDmaHelp(null)} className="text-blue-400 hover:text-blue-600">✕</button>
              </div>
              {dmaItem?.description?.[language] && (
                <p className="text-sm text-gray-700 mb-3">{dmaItem.description[language]}</p>
              )}
              <img
                src={`${import.meta.env.BASE_URL}images/${dmaItem?.illustration_extracted || 'dma/guide_p24_0.png'}`}
                alt={dmaItem?.name?.[language] || showDmaHelp}
                className="rounded-lg max-w-full h-auto"
                onError={(e) => e.target.style.display = 'none'}
              />
              {dmaItem?.diagnostic_value?.[language] && (
                <p className="text-xs text-blue-700 mt-2 italic">{dmaItem.diagnostic_value[language]}</p>
              )}
            </div>
          )
        })()}

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleAnswer('yes')} className="btn-yes">
            {t('diagnosis.yes')}
          </button>
          <button onClick={() => handleAnswer('no')} className="btn-no">
            {t('diagnosis.no')}
          </button>
        </div>

        {hasSkip && (
          <button
            onClick={() => handleAnswer('skip')}
            className="btn-skip w-full mt-3"
          >
            {t('diagnosis.skip') || 'Kann nicht beurteilt werden / Impossible de répondre'}
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handleGoBack}
          disabled={engine.history.length === 0}
          className="btn-secondary flex-1 disabled:opacity-40"
        >
          {t('diagnosis.back')}
        </button>
        <button onClick={handleReset} className="btn-secondary flex-1">
          {t('diagnosis.restart')}
        </button>
        <button
          onClick={() => setShowFlowchart(!showFlowchart)}
          className="btn-secondary flex-1 text-sm"
        >
          {t('diagnosis.show_flowchart')}
        </button>
      </div>

      {/* Flowchart overlay */}
      {showFlowchart && treeData?.flowchart_images?.length > 0 && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowFlowchart(false)}>
          <div className="bg-white rounded-2xl p-4 max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">{t('diagnosis.show_flowchart')}</h3>
              <button onClick={() => setShowFlowchart(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            {treeData.flowchart_images.map((img, idx) => (
              <img
                key={idx}
                src={`${import.meta.env.BASE_URL}images/${img}`}
                alt={`Flowchart ${idx + 1}`}
                className="max-w-full h-auto mb-2"
              />
            ))}
            <p className="text-xs text-gray-400 mt-2 text-center">
              © CNPF — Drénou C., 2023
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

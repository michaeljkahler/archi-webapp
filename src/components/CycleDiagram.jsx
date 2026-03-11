import React, { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'

const CYCLE_IMAGES = [
  'cycle/cycle_p10_0.png',
  'cycle/cycle_p10_1.png',
  'cycle/cycle_p10_2.png',
  'cycle/cycle_p10_3.png',
  'cycle/cycle_p10_4.png',
  'cycle/cycle_p10_5.png',
  'cycle/cycle_p11_0.png',
]

export default function CycleDiagram({ highlightState }) {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center"
      >
        <h3 className="font-bold text-lg text-archi-forest">
          {t('about.dma_categories')}
        </h3>
        <span className="text-2xl text-gray-400">
          {expanded ? '−' : '+'}
        </span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          {CYCLE_IMAGES.map((img, idx) => (
            <img
              key={idx}
              src={`${import.meta.env.BASE_URL}images/${img}`}
              alt={`ARCHI cycle ${idx + 1}`}
              className="max-w-full h-auto rounded-lg"
              onError={(e) => e.target.style.display = 'none'}
            />
          ))}
          <p className="text-xs text-gray-400 text-center mt-2">
            © CNPF — Drénou C., 2023
          </p>
        </div>
      )}
    </div>
  )
}

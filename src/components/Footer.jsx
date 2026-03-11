import React from 'react'
import { useLanguage } from '../hooks/useLanguage'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          {/* Citation Box */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-archi-forest w-full max-w-2xl">
            <p className="text-sm text-gray-600 mb-3 font-semibold">{t('footer.citation_label')}</p>
            <p className="text-sm text-gray-700 font-medium">
              Méthode ARCHI © CNPF — Drénou C., 2023
            </p>
            <p className="text-sm text-gray-700 font-medium">
              Évaluer la vitalité des arbres. Guide d'utilisation de la méthode ARCHI.
            </p>
            <p className="text-sm text-gray-700">
              Éditions CNPF-IDF, Paris.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500 pt-4 border-t border-gray-200 w-full">
            <p>
              &copy; {new Date().getFullYear()} {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

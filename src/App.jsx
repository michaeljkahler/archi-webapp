import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './hooks/useLanguage'
import HomePage from './pages/HomePage'
import SiteList from './pages/SiteList'
import SiteForm from './pages/SiteForm'
import SiteSummary from './pages/SiteSummary'
import TreeForm from './pages/TreeForm'
import SpeciesSelector from './pages/SpeciesSelector'
import DiagnosisView from './pages/DiagnosisView'
import DMAGlossary from './pages/DMAGlossary'
import AboutPage from './pages/AboutPage'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sites" element={<SiteList />} />
            <Route path="/sites/new" element={<SiteForm />} />
            <Route path="/sites/:id" element={<SiteSummary />} />
            <Route path="/sites/:id/tree/new" element={<TreeForm />} />
            <Route path="/sites/:siteId/trees/:treeId/diagnose/:species" element={<DiagnosisView />} />
            <Route path="/diagnose" element={<SpeciesSelector />} />
            <Route path="/diagnose/:species" element={<DiagnosisView />} />
            <Route path="/glossary" element={<DMAGlossary />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}

export default App

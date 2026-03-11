import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const labels = {
  de: {
    header: 'ARCHI — Baumdiagnose Exportdaten',
    site: 'Standort',
    date: 'Datum',
    observer: 'Beobachter',
    columns: ['#', 'Art', 'BHD (cm)', 'Höhe (m)', 'Kategorie', 'Notizen'],
    citation: 'Quellenangabe',
    notDiagnosed: 'Nicht diagnostiziert',
    states: {
      sain: 'Gesund', stresse: 'Gestresst', resilient: 'Resilient',
      descente: 'Kronenrückzug', repli: 'Repli',
      irreversible: 'Irreversibler Verfall', mort: 'Tot',
    },
  },
  fr: {
    header: 'ARCHI — Données d\'export du diagnostic',
    site: 'Peuplement',
    date: 'Date',
    observer: 'Observateur',
    columns: ['#', 'Essence', 'DHP (cm)', 'Hauteur (m)', 'Catégorie', 'Notes'],
    citation: 'Référence',
    notDiagnosed: 'Non diagnostiqué',
    states: {
      sain: 'Sain', stresse: 'Stressé', resilient: 'Résilient',
      descente: 'Descente de cime', repli: 'Repli',
      irreversible: 'Dépérissement irréversible', mort: 'Mort',
    },
  },
}

function getLabels(lang) {
  return labels[lang] || labels.de
}

function getDiagnosisLabel(category, lang) {
  const l = getLabels(lang)
  return l.states[category] || category
}

/**
 * Export site and trees data as CSV
 */
export function exportCSV(site, trees, lang = 'de') {
  if (!site) {
    throw new Error('Site data is required')
  }

  const l = getLabels(lang)
  const lines = []

  lines.push(l.header)
  lines.push(`${l.site}: ${site.name || ''}`)
  lines.push(`${l.site}: ${site.location || ''}`)
  lines.push(`${l.date}: ${formatDate(site.date, lang)}`)
  lines.push(`${l.observer}: ${site.observer || ''}`)
  lines.push('')

  lines.push(l.columns.join(','))

  if (trees && trees.length > 0) {
    trees.forEach((tree, index) => {
      const diagnosis = tree.diagnosis ? getDiagnosisLabel(tree.diagnosis.category, lang) : l.notDiagnosed
      const notes = (tree.notes || '').replace(/,/g, ';')
      lines.push(
        `${index + 1},"${tree.species || ''}",${tree.dbh || ''},${tree.height || ''},"${diagnosis}","${notes}"`
      )
    })
  }

  lines.push('')
  lines.push(`${l.citation}: Méthode ARCHI © CNPF — Drénou C., 2023`)
  lines.push('Éditions CNPF-IDF, Paris')

  const csvContent = lines.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', generateFilename('csv'))
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return csvContent
}

/**
 * Export site and trees data as PDF
 */
export function exportPDF(site, trees, lang = 'de') {
  if (!site) {
    throw new Error('Site data is required')
  }

  const l = getLabels(lang)
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 10

  const primaryColor = [46, 125, 50]
  const lightGray = [245, 245, 245]

  // Title
  doc.setFontSize(18)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(l.header, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 12

  // Site information
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  const siteInfo = [
    [`${l.site}:`, site.name || ''],
    [`${l.site}:`, site.location || ''],
    [`${l.date}:`, formatDate(site.date, lang)],
    [`${l.observer}:`, site.observer || ''],
  ]

  doc.setFontSize(10)
  siteInfo.forEach(([label, value]) => {
    doc.text(`${label} ${value}`, 10, yPosition)
    yPosition += 6
  })
  yPosition += 4

  // Trees table
  if (trees && trees.length > 0) {
    const tableData = trees.map((tree, index) => [
      index + 1,
      tree.species || '',
      tree.dbh ? tree.dbh.toString() : '',
      tree.height ? tree.height.toString() : '',
      tree.diagnosis ? getDiagnosisLabel(tree.diagnosis.category, lang) : l.notDiagnosed,
      tree.notes || '',
    ])

    autoTable(doc, {
      head: [l.columns],
      body: tableData,
      startY: yPosition,
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: lightGray,
      },
      margin: 10,
      didDrawPage: function (data) {
        const pageSize = doc.internal.pageSize
        const footerY = pageSize.getHeight() - 10

        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text(
          'Méthode ARCHI © CNPF — Drénou C., 2023. Éditions CNPF-IDF, Paris.',
          pageSize.getWidth() / 2,
          footerY,
          { align: 'center' }
        )
      },
    })
  }

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('Méthode ARCHI © CNPF — Drénou C., 2023', 10, pageHeight - 10)
  doc.text('Éditions CNPF-IDF, Paris', 10, pageHeight - 5)

  doc.save(generateFilename('pdf'))

  return doc
}

/**
 * Export diagnosis data as JSON
 */
export function exportDiagnosisJSON(diagnosis) {
  if (!diagnosis) {
    throw new Error('Diagnosis data is required')
  }

  const jsonString = JSON.stringify(diagnosis, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', generateFilename('json'))
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return jsonString
}

function formatDate(dateString, lang = 'de') {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function generateFilename(format) {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0]
  const extension = format === 'csv' ? 'csv' : format === 'pdf' ? 'pdf' : 'json'
  return `ARCHI_${timestamp}.${extension}`
}

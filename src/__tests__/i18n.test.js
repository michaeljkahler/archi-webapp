import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const I18N_DIR = path.resolve(__dirname, '../i18n')

function loadJson(filename) {
  const raw = fs.readFileSync(path.join(I18N_DIR, filename), 'utf-8')
  return JSON.parse(raw)
}

function flattenKeys(obj, prefix = '') {
  const keys = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

describe('i18n — Translation completeness', () => {
  const de = loadJson('de.json')
  const fr = loadJson('fr.json')
  const deKeys = flattenKeys(de)
  const frKeys = flattenKeys(fr)

  it('de.json and fr.json have the same keys', () => {
    const onlyInDe = deKeys.filter(k => !frKeys.includes(k))
    const onlyInFr = frKeys.filter(k => !deKeys.includes(k))

    if (onlyInDe.length > 0) {
      console.warn('Keys only in de.json:', onlyInDe)
    }
    if (onlyInFr.length > 0) {
      console.warn('Keys only in fr.json:', onlyInFr)
    }

    expect(onlyInDe).toEqual([])
    expect(onlyInFr).toEqual([])
  })

  it('no empty translation values in de.json', () => {
    const empty = deKeys.filter(k => {
      const val = k.split('.').reduce((obj, key) => obj?.[key], de)
      return val === '' || val === null || val === undefined
    })
    expect(empty).toEqual([])
  })

  it('no empty translation values in fr.json', () => {
    const empty = frKeys.filter(k => {
      const val = k.split('.').reduce((obj, key) => obj?.[key], fr)
      return val === '' || val === null || val === undefined
    })
    expect(empty).toEqual([])
  })

  it('both files have all 8 species names', () => {
    const speciesIds = [
      'chenes_hetre', 'chataignier', 'platane', 'douglas',
      'epicea', 'pins', 'sapin_pectine', 'cedre_atlas'
    ]
    for (const id of speciesIds) {
      expect(de.species[id]).toBeTruthy()
      expect(fr.species[id]).toBeTruthy()
    }
  })

  it('both files have all vitality states', () => {
    const states = ['sain', 'stresse', 'resilient', 'descente', 'repli', 'irreversible', 'mort']
    for (const state of states) {
      expect(de.states[state]).toBeTruthy()
      expect(fr.states[state]).toBeTruthy()
    }
  })

  it('both files have all stages', () => {
    const stages = ['jeune', 'adulte', 'mature', 'senescent']
    for (const stage of stages) {
      expect(de.stages[stage]).toBeTruthy()
      expect(fr.stages[stage]).toBeTruthy()
    }
  })
})

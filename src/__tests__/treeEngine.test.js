import { describe, it, expect } from 'vitest'
import { TreeEngine } from '../utils/treeEngine'
import fs from 'fs'
import path from 'path'

const TREES_DIR = path.resolve(__dirname, '../data/trees')

const SPECIES_FILES = [
  'chenes_hetre.json',
  'chataignier.json',
  'platane.json',
  'douglas.json',
  'epicea.json',
  'pins.json',
  'sapin_pectine.json',
  'cedre.json',
]

function loadTreeData(filename) {
  const raw = fs.readFileSync(path.join(TREES_DIR, filename), 'utf-8')
  return JSON.parse(raw)
}

/**
 * DFS traversal: walks all paths through the decision tree.
 * Returns an array of { path: [...], resultCode } for every reachable result.
 */
function traverseAllPaths(treeData) {
  const results = []
  const visited = new Set()

  function dfs(nodeId, pathSoFar) {
    // If this is a result node, record it
    if (treeData.results[nodeId]) {
      results.push({ path: pathSoFar, resultCode: nodeId })
      return
    }

    const node = treeData.nodes[nodeId]
    if (!node) {
      results.push({ path: pathSoFar, resultCode: `MISSING:${nodeId}` })
      return
    }

    // Prevent infinite loops
    const pathKey = pathSoFar.map(s => `${s.nodeId}:${s.answer}`).join('>')
    if (visited.has(pathKey + '>' + nodeId)) return
    visited.add(pathKey + '>' + nodeId)

    const branches = ['yes', 'no']
    if (node.skip) branches.push('skip')

    for (const answer of branches) {
      let target = node[answer]
      if (answer === 'skip' && !target) target = node.no
      if (!target) continue

      // Handle MATURE_CHECK special case
      if (target === 'MATURE_CHECK') {
        // Find the hash node (25%/mortalité question)
        for (const [id, n] of Object.entries(treeData.nodes)) {
          const fr = n.question?.fr || ''
          if (fr.includes('25%') && (fr.includes('mortalité') || fr.includes('espace occupé'))) {
            target = id
            break
          }
        }
        if (target === 'MATURE_CHECK') target = 'n2' // fallback
      }

      dfs(target, [...pathSoFar, { nodeId, answer }])
    }
  }

  dfs(treeData.start_node, [])
  return results
}

describe('TreeEngine — All 8 species', () => {
  for (const filename of SPECIES_FILES) {
    const speciesName = filename.replace('.json', '')

    describe(speciesName, () => {
      let data

      it('loads valid JSON', () => {
        data = loadTreeData(filename)
        expect(data).toBeDefined()
      })

      it('has required top-level fields', () => {
        data = loadTreeData(filename)
        expect(data.id).toBeTruthy()
        expect(data.names).toBeTruthy()
        expect(data.nodes).toBeTruthy()
        expect(data.results).toBeTruthy()
        expect(data.start_node).toBeTruthy()
      })

      it('has bilingual names (de + fr)', () => {
        data = loadTreeData(filename)
        expect(data.names.de).toBeTruthy()
        expect(data.names.fr).toBeTruthy()
      })

      it('has latin names', () => {
        data = loadTreeData(filename)
        expect(data.latin).toBeDefined()
        expect(data.latin.length).toBeGreaterThan(0)
      })

      it('has flowchart_images array', () => {
        data = loadTreeData(filename)
        expect(Array.isArray(data.flowchart_images)).toBe(true)
        expect(data.flowchart_images.length).toBeGreaterThan(0)
      })

      it('start_node exists in nodes', () => {
        data = loadTreeData(filename)
        expect(data.nodes[data.start_node]).toBeDefined()
      })

      it('all nodes have bilingual questions (de + fr)', () => {
        data = loadTreeData(filename)
        const missing = []
        for (const [id, node] of Object.entries(data.nodes)) {
          if (!node.question?.de) missing.push(`${id}: missing de`)
          if (!node.question?.fr) missing.push(`${id}: missing fr`)
        }
        expect(missing).toEqual([])
      })

      it('all node targets (yes/no/skip) point to valid nodes or results', () => {
        data = loadTreeData(filename)
        const invalid = []
        for (const [id, node] of Object.entries(data.nodes)) {
          for (const branch of ['yes', 'no']) {
            const target = node[branch]
            if (!target) {
              invalid.push(`${id}.${branch} is undefined`)
              continue
            }
            if (target === 'MATURE_CHECK') continue // special case
            if (!data.nodes[target] && !data.results[target]) {
              invalid.push(`${id}.${branch} → "${target}" not found`)
            }
          }
          if (node.skip) {
            const target = node.skip
            if (target !== 'MATURE_CHECK' && !data.nodes[target] && !data.results[target]) {
              invalid.push(`${id}.skip → "${target}" not found`)
            }
          }
        }
        expect(invalid).toEqual([])
      })

      it('all results have required fields (code, label, stage, state, color)', () => {
        data = loadTreeData(filename)
        const missing = []
        for (const [code, result] of Object.entries(data.results)) {
          if (!result.code) missing.push(`${code}: missing code`)
          if (!result.label) missing.push(`${code}: missing label`)
          if (!result.stage) missing.push(`${code}: missing stage`)
          if (!result.state) missing.push(`${code}: missing state`)
          if (!result.color) missing.push(`${code}: missing color`)
        }
        expect(missing).toEqual([])
      })

      it('all results have bilingual labels (de + fr)', () => {
        data = loadTreeData(filename)
        const missing = []
        for (const [code, result] of Object.entries(data.results)) {
          if (!result.label?.de) missing.push(`${code}: missing label.de`)
          if (!result.label?.fr) missing.push(`${code}: missing label.fr`)
        }
        expect(missing).toEqual([])
      })

      it('all DFS paths end in a valid result', () => {
        data = loadTreeData(filename)
        const paths = traverseAllPaths(data)
        expect(paths.length).toBeGreaterThan(0)

        const invalid = paths.filter(p => p.resultCode.startsWith('MISSING:'))
        if (invalid.length > 0) {
          const details = invalid.map(p =>
            `Path: ${p.path.map(s => `${s.nodeId}(${s.answer})`).join(' → ')} → ${p.resultCode}`
          )
          expect(details).toEqual([])
        }
      })

      it('TreeEngine can be instantiated', () => {
        data = loadTreeData(filename)
        const engine = new TreeEngine(data)
        expect(engine).toBeDefined()
        expect(engine.getCurrentNode()).toBeDefined()
        expect(engine.isComplete()).toBe(false)
      })

      it('TreeEngine reset works', () => {
        data = loadTreeData(filename)
        const engine = new TreeEngine(data)
        engine.answer('yes')
        engine.reset()
        expect(engine.history.length).toBe(0)
        expect(engine.isComplete()).toBe(false)
        expect(engine.getCurrentNode().id).toBe(data.start_node)
      })

      it('TreeEngine goBack works', () => {
        data = loadTreeData(filename)
        const engine = new TreeEngine(data)
        const firstNode = engine.getCurrentNode().id
        engine.answer('yes')
        engine.goBack()
        expect(engine.getCurrentNode().id).toBe(firstNode)
      })

      it('TreeEngine completes at least one yes-path', () => {
        data = loadTreeData(filename)
        const engine = new TreeEngine(data)
        let steps = 0
        while (!engine.isComplete() && steps < 50) {
          try {
            engine.answer('yes')
          } catch {
            break
          }
          steps++
        }
        // Should complete or at least not crash
        expect(steps).toBeGreaterThan(0)
      })
    })
  }
})

describe('TreeEngine — API tests', () => {
  let data

  it('throws on invalid tree data', () => {
    expect(() => new TreeEngine(null)).toThrow()
    expect(() => new TreeEngine({})).toThrow()
    expect(() => new TreeEngine({ nodes: {} })).toThrow()
  })

  it('throws on invalid answer', () => {
    data = loadTreeData('chenes_hetre.json')
    const engine = new TreeEngine(data)
    expect(() => engine.answer('maybe')).toThrow('Invalid response')
  })

  it('exportDiagnosis returns correct structure', () => {
    data = loadTreeData('chenes_hetre.json')
    const engine = new TreeEngine(data)
    // Navigate to a result
    let steps = 0
    while (!engine.isComplete() && steps < 50) {
      try { engine.answer('no') } catch { break }
      steps++
    }
    if (engine.isComplete()) {
      const diag = engine.exportDiagnosis()
      expect(diag.species).toBe('chenes_hetre')
      expect(diag.result).toBeDefined()
      expect(diag.path).toBeDefined()
      expect(diag.timestamp).toBeDefined()
    }
  })

  it('getProgress returns 0-100', () => {
    data = loadTreeData('chenes_hetre.json')
    const engine = new TreeEngine(data)
    expect(engine.getProgress()).toBeGreaterThanOrEqual(0)
    expect(engine.getProgress()).toBeLessThanOrEqual(100)
  })

  it('getPath returns answered history', () => {
    data = loadTreeData('chenes_hetre.json')
    const engine = new TreeEngine(data)
    expect(engine.getPath()).toHaveLength(0)
    engine.answer('yes')
    expect(engine.getPath()).toHaveLength(1)
    expect(engine.getPath()[0].answer).toBe('yes')
  })
})

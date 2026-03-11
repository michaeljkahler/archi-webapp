/**
 * TreeEngine for ARCHI decision tree navigation
 * Works with the JSON format: nodes { id: { question, yes, no, skip } }, results { code: {...} }
 */
export class TreeEngine {
  constructor(treeData) {
    if (!treeData || !treeData.nodes || !treeData.results || !treeData.start_node) {
      throw new Error('Invalid tree data: requires nodes, results, and start_node')
    }
    this.treeData = treeData
    this.startNode = treeData.start_node
    this.currentNodeId = this.startNode
    this.history = [] // array of { nodeId, answer }
    this._result = null
  }

  /** Get the current node object, or null if at a result */
  getCurrentNode() {
    if (this._result) return null
    const node = this.treeData.nodes[this.currentNodeId]
    if (!node) return null
    return { ...node, id: this.currentNodeId }
  }

  /** Get the current result, or null if still navigating */
  getResult() {
    return this._result
  }

  /** Check if we've reached a final result */
  isComplete() {
    return this._result !== null
  }

  /** Answer the current question: 'yes', 'no', or 'skip' */
  answer(response) {
    if (this._result) throw new Error('Diagnosis already complete')
    const node = this.treeData.nodes[this.currentNodeId]
    if (!node) throw new Error(`Node not found: ${this.currentNodeId}`)

    let nextId
    if (response === 'yes') nextId = node.yes
    else if (response === 'no') nextId = node.no
    else if (response === 'skip') nextId = node.skip || node.no
    else throw new Error('Invalid response')

    if (!nextId) throw new Error(`No ${response} path from node ${this.currentNodeId}`)

    // Save to history
    this.history.push({ nodeId: this.currentNodeId, answer: response })

    // Check if nextId is a result code
    if (this.treeData.results[nextId]) {
      this._result = { ...this.treeData.results[nextId] }
      this.currentNodeId = nextId
    } else if (nextId === 'MATURE_CHECK') {
      // Special: redirect to the '#' question (usually n2 or similar hash question)
      // Find the node marked for mature check - typically it's the mortalité question
      const hashNode = this._findHashNode()
      this.currentNodeId = hashNode || this.startNode
    } else if (this.treeData.nodes[nextId]) {
      this.currentNodeId = nextId
    } else {
      throw new Error(`Target not found: ${nextId}`)
    }

    return this.isComplete() ? this.getResult() : this.getCurrentNode()
  }

  /** Go back one step */
  goBack() {
    if (this.history.length === 0) return this.getCurrentNode()
    this._result = null
    const prev = this.history.pop()
    this.currentNodeId = prev.nodeId
    return this.getCurrentNode()
  }

  /** Reset to start */
  reset() {
    this.currentNodeId = this.startNode
    this.history = []
    this._result = null
    return this.getCurrentNode()
  }

  /** Get progress estimate (answered / estimated total) */
  getProgress() {
    // Estimate based on typical path length vs max depth
    const maxDepth = this._estimateMaxDepth()
    const current = this.history.length
    if (this._result) return 100
    return Math.min(95, Math.round((current / maxDepth) * 100))
  }

  /** Get the history of answers */
  getPath() {
    return this.history.map(h => ({
      nodeId: h.nodeId,
      answer: h.answer,
      question: this.treeData.nodes[h.nodeId]?.question || {}
    }))
  }

  /** Check if current node has a skip option */
  hasSkip() {
    const node = this.getCurrentNode()
    return node && !!node.skip
  }

  /** Check if current node has a note */
  getNote() {
    const node = this.getCurrentNode()
    return node?.note || null
  }

  /** Get DMA references for the current question */
  getDmaRefs() {
    const node = this.getCurrentNode()
    return node?.dma_refs || []
  }

  /** Export diagnosis for saving */
  exportDiagnosis() {
    return {
      species: this.treeData.id,
      speciesNames: this.treeData.names,
      result: this._result,
      path: this.history.map(h => ({ node: h.nodeId, answer: h.answer === 'yes' })),
      timestamp: new Date().toISOString()
    }
  }

  // Private helpers
  _findHashNode() {
    // The '#' node is typically the mortalité/degradation question
    // Look for nodes that contain '25%' in their question text (the hash threshold question)
    for (const [id, node] of Object.entries(this.treeData.nodes)) {
      const fr = node.question?.fr || ''
      if (fr.includes('25%') && (fr.includes('mortalité') || fr.includes('espace occupé'))) {
        return id
      }
    }
    // Fallback: return n2 or first node after start
    return 'n2'
  }

  _estimateMaxDepth() {
    // Estimate max path length by counting unique nodes
    const nodeCount = Object.keys(this.treeData.nodes).length
    return Math.max(nodeCount / 2, 5)
  }
}

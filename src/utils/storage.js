import Dexie from 'dexie'

/**
 * Initialize Dexie database with ARCHI schema
 */
const db = new Dexie('ArchiDB')

db.version(1).stores({
  sites: 'id, date',
  trees: 'id, siteId, [siteId+species]',
})

/**
 * Site Management Functions
 */

export async function saveSite(site) {
  if (!site.id) {
    site.id = crypto.randomUUID()
  }
  site.date = site.date || new Date().toISOString()
  const id = await db.sites.put(site)
  return { ...site, id }
}

export async function getSite(id) {
  return await db.sites.get(id)
}

export async function getAllSites() {
  return await db.sites.toArray()
}

export async function getSitesByDate(startDate, endDate) {
  return await db.sites
    .where('date')
    .between(startDate, endDate)
    .toArray()
}

export async function updateSite(id, updates) {
  await db.sites.update(id, updates)
  return await getSite(id)
}

export async function deleteSite(id) {
  // Delete all associated trees first
  const trees = await db.trees.where('siteId').equals(id).toArray()
  for (const tree of trees) {
    await db.trees.delete(tree.id)
  }
  // Delete the site
  await db.sites.delete(id)
}

/**
 * Tree Management Functions
 */

export async function saveTree(tree) {
  if (!tree.id) {
    tree.id = crypto.randomUUID()
  }
  tree.date = tree.date || new Date().toISOString()
  const id = await db.trees.put(tree)
  return { ...tree, id }
}

export async function getTree(id) {
  return await db.trees.get(id)
}

export async function getTreesBySite(siteId) {
  return await db.trees.where('siteId').equals(siteId).toArray()
}

export async function getTreeBySpecies(siteId, species) {
  return await db.trees.where('[siteId+species]').equals([siteId, species]).toArray()
}

export async function updateTree(id, updates) {
  await db.trees.update(id, updates)
  return await getTree(id)
}

export async function deleteTree(id) {
  await db.trees.delete(id)
}

export async function getAllTrees() {
  return await db.trees.toArray()
}

/**
 * Search and Filter Functions
 */

export async function searchSites(query) {
  const sites = await getAllSites()
  const lowerQuery = query.toLowerCase()
  return sites.filter(
    site =>
      site.name?.toLowerCase().includes(lowerQuery) ||
      site.location?.toLowerCase().includes(lowerQuery) ||
      site.observer?.toLowerCase().includes(lowerQuery)
  )
}

export async function searchTrees(siteId, query) {
  const trees = await getTreesBySite(siteId)
  const lowerQuery = query.toLowerCase()
  return trees.filter(
    tree =>
      tree.species?.toLowerCase().includes(lowerQuery) ||
      tree.notes?.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Statistics and Analytics Functions
 */

export async function getSiteStats(siteId) {
  const trees = await getTreesBySite(siteId)
  const withDiagnosis = trees.filter(t => t.diagnosis).length

  return {
    totalTrees: trees.length,
    treesWithDiagnosis: withDiagnosis,
    completionRate: trees.length > 0 ? Math.round((withDiagnosis / trees.length) * 100) : 0,
    species: [...new Set(trees.map(t => t.species))],
    avgDBH: trees.length > 0 ? (trees.reduce((sum, t) => sum + (t.dbh || 0), 0) / trees.length).toFixed(1) : 0,
  }
}

export async function getGlobalStats() {
  const sites = await getAllSites()
  const trees = await getAllTrees()
  const diagnosedTrees = trees.filter(t => t.diagnosis).length

  return {
    totalSites: sites.length,
    totalTrees: trees.length,
    diagnosedTrees,
    completionRate: trees.length > 0 ? Math.round((diagnosedTrees / trees.length) * 100) : 0,
    species: [...new Set(trees.map(t => t.species))],
    observers: [...new Set(sites.map(s => s.observer))],
  }
}

/**
 * Export and Import Functions
 */

export async function exportDatabase() {
  const sites = await getAllSites()
  const trees = await getAllTrees()

  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    sites,
    trees,
  }
}

export async function importDatabase(data) {
  if (!data.sites || !data.trees) {
    throw new Error('Invalid database format')
  }

  for (const site of data.sites) {
    await saveSite(site)
  }

  for (const tree of data.trees) {
    await saveTree(tree)
  }
}

/**
 * Clear all data (for testing/reset)
 */

export async function clearDatabase() {
  await db.sites.clear()
  await db.trees.clear()
}

/**
 * Bulk operations
 */

export async function deleteMultipleSites(siteIds) {
  for (const siteId of siteIds) {
    await deleteSite(siteId)
  }
}

export async function deleteMultipleTrees(treeIds) {
  for (const treeId of treeIds) {
    await deleteTree(treeId)
  }
}

export { db }

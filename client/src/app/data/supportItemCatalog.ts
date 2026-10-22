// NDIS support items offered in the Service Agreement's Schedule of Supports.
// Typing or picking an item code or name in the form fills in the rest of the
// item from this list. Items brought in with "Import quote" or "Import item codes"
// are added on top of it in the browser (see loadCatalog / rememberCatalogItems),
// so a newly quoted item or a newer catalogue is offered next time without
// editing this file.

import { NDIS_CATALOGUE_2026_27 } from './ndisCatalogue2026-27'

export type CatalogItem = {
  itemCode: string
  itemName: string
  unitPrice: number
}

// NDIS Support Catalogue 2026-27 v1.0, national prices
export const SUPPORT_ITEM_CATALOG: CatalogItem[] = NDIS_CATALOGUE_2026_27

const STORAGE_KEY = 'hu.supportItemCatalog'

const readStored = (): CatalogItem[] => {
  try {
    const a = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(a) ? a.filter((i) => i && i.itemCode) : []
  } catch {
    return []
  }
}

// Built-in items plus any imported ones; an imported item replaces a built-in
// item with the same code (it carries the newer price).
export const loadCatalog = (): CatalogItem[] => {
  const byCode = new Map<string, CatalogItem>()
  for (const i of [...SUPPORT_ITEM_CATALOG, ...readStored()]) byCode.set(i.itemCode, i)
  return [...byCode.values()].sort((a, b) => a.itemCode.localeCompare(b.itemCode))
}

// Saves imported items so they are offered next time; returns the updated catalog.
export const rememberCatalogItems = (items: CatalogItem[]): CatalogItem[] => {
  const byCode = new Map(readStored().map((i) => [i.itemCode, i] as const))
  for (const i of items) if (i.itemCode && i.itemName) byCode.set(i.itemCode, i)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...byCode.values()]))
  } catch {
    // storage unavailable (private window): the items still fill this form
  }
  return loadCatalog()
}

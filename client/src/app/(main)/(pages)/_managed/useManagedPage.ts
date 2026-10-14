"use client"
import { createContext, useContext, useEffect, useState } from 'react'
import Axios from 'utils/Axios'

export const ManagedPagePreviewContext = createContext<{ slug: string; data: unknown } | null>(null)
const pageCache = new Map<string, { data: unknown; fetchedAt: number }>()
const CACHE_MS = 30_000

export function setManagedPageCache(slug: string, data: unknown) {
  pageCache.set(slug, { data, fetchedAt: Date.now() })
}

export function useManagedPage<T>(slug: string) {
  const preview = useContext(ManagedPagePreviewContext)
  const [data, setData] = useState<T | null>(() => (pageCache.get(slug)?.data as T) ?? null)
  const [error, setError] = useState(false)
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    if (preview?.slug === slug) return
    const cached = pageCache.get(slug)
    if (cached) setData(cached.data as T)
    if (cached && Date.now() - cached.fetchedAt < CACHE_MS && retry === 0) return
    let active = true
    setError(false)
    Axios.get(`/api/pages/${slug}`)
      .then(response => { setManagedPageCache(slug, response.data.data); if (active) setData(response.data.data as T) })
      .catch(() => { if (active && !pageCache.has(slug)) setError(true) })
    return () => { active = false }
  }, [slug, retry, preview?.slug])
  if (preview?.slug === slug) return { data: preview.data as T, error: false, reload: () => {} }
  return { data, error, reload: () => setRetry(value => value + 1) }
}

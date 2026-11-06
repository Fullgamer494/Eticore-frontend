import { useEffect, useState } from 'react'
import { getCatalog, type CatalogFilters } from './api'
import { mapCatalogItem } from './model'
import type { Course } from '../../shared/types/course'

type Filters = Pick<CatalogFilters, 'tipo' | 'dificultad' | 'tema_id' | 'ruta_id' | 'avance'>

export function useCatalog(enabled: boolean) {
  const [query, setQuery] = useState('')
  const [filters, setFiltersState] = useState<Filters>({})
  const [items, setItems] = useState<Course[]>([])
  const [status, setStatus] = useState<'idle' | 'loaded' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    if (!enabled) return
    const controller = new AbortController()
    getCatalog({ q: query.trim() || undefined, ...filters, limit: 20 }, controller.signal)
      .then((result) => { setItems(result.items.map(mapCatalogItem)); setCursor(result.siguiente_cursor); setError(null); setStatus('loaded') })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return
        setError(cause instanceof Error ? cause.message : 'No se pudo cargar el catálogo.')
        setStatus('error')
      })
    return () => controller.abort()
  }, [enabled, reload, query, filters])

  function updateQuery(value: string) { setCursor(null); setStatus('idle'); setQuery(value) }
  function updateFilters(value: Partial<Filters>) { setCursor(null); setStatus('idle'); setFiltersState((current) => ({ ...current, ...value })) }
  function retry() { setError(null); setStatus('idle'); setReload((value) => value + 1) }

  async function loadMore() {
    if (!cursor || loadingMore) return
    setLoadingMore(true)
    try {
      const result = await getCatalog({ q: query.trim() || undefined, ...filters, limit: 20, cursor })
      setItems((current) => [...current, ...result.items.map(mapCatalogItem)])
      setCursor(result.siguiente_cursor)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo cargar la página siguiente.') }
    finally { setLoadingMore(false) }
  }

  return { query, filters, items, status, error, cursor, loadingMore, updateQuery, updateFilters, retry, loadMore }
}

import { useEffect, useState } from 'react'
import { getBadges, getPoints, getRank, type Badge, type PointsSummary, type RankSummary } from '../gamification/api'
import { chooseRoute as chooseRouteRequest, getProgress, listRoutes, type LearningRoute, type RouteProgress } from '../routes/api'
import { getAttemptHistory } from '../learning/api'
import { getAttemptResult, switchRoute } from '../management/api'
import type { AuthenticatedUser } from '../auth/api'

export function useLearningProgress(user: AuthenticatedUser | null, refreshUser: () => Promise<void>) {
  const [points, setPoints] = useState<PointsSummary | null>(null)
  const [rank, setRank] = useState<RankSummary | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [progress, setProgress] = useState<RouteProgress | null>(null)
  const [history, setHistory] = useState<Record<string, unknown>[]>([])
  const [historyCursor, setHistoryCursor] = useState<string | null>(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [routes, setRoutes] = useState<LearningRoute[]>([])
  const [routeError, setRouteError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const controller = new AbortController()
    listRoutes(controller.signal).then(setRoutes).catch(() => setRoutes([]))
    return () => controller.abort()
  }, [user])

  async function refresh() {
    const refreshed = await Promise.allSettled([getProgress(), getPoints(), getRank(), getBadges(), getAttemptHistory()])
    if (refreshed[0].status === 'fulfilled') setProgress(refreshed[0].value)
    if (refreshed[1].status === 'fulfilled') setPoints(refreshed[1].value)
    if (refreshed[2].status === 'fulfilled') setRank(refreshed[2].value)
    if (refreshed[3].status === 'fulfilled') setBadges(refreshed[3].value)
    if (refreshed[4].status === 'fulfilled') { setHistory(refreshed[4].value.items); setHistoryCursor(refreshed[4].value.siguiente_cursor) }
  }

  function clear() {
    setPoints(null); setRank(null); setBadges([]); setProgress(null)
    setHistory([]); setHistoryCursor(null); setResult(null); setRouteError(null)
  }

  useEffect(() => {
    if (!user) return
    const controller = new AbortController()
    void Promise.allSettled([
      getPoints(controller.signal).then(setPoints),
      getRank(controller.signal).then(setRank),
      getProgress(controller.signal).then(setProgress),
      getBadges(controller.signal).then(setBadges),
      getAttemptHistory(controller.signal).then((items) => { setHistory(items.items); setHistoryCursor(items.siguiente_cursor) }),
    ])
    return () => controller.abort()
  }, [user])

  async function chooseRoute(routeId: number) {
    setRouteError(null)
    try { await chooseRouteRequest(routeId); setProgress(await getProgress()) }
    catch (cause) { setRouteError(cause instanceof Error ? cause.message : 'No se pudo elegir la ruta.') }
  }

  async function changeRoute(routeId: number) {
    setRouteError(null)
    try { await switchRoute(routeId); setProgress(await getProgress()); await refreshUser() }
    catch (cause) { setRouteError(cause instanceof Error ? cause.message : 'No se pudo cambiar la ruta.') }
  }

  async function loadMoreHistory() {
    if (!historyCursor || historyLoading) return
    setHistoryLoading(true)
    try {
      const next = await getAttemptHistory(undefined, { cursor: historyCursor, limit: 20 })
      setHistory((current) => [...current, ...next.items]); setHistoryCursor(next.siguiente_cursor)
    } catch (cause) { setResult({ error: cause instanceof Error ? cause.message : 'No se pudo cargar más historial.' }) }
    finally { setHistoryLoading(false) }
  }

  async function viewResult(id: string) {
    try { setResult(await getAttemptResult(id)) }
    catch (cause) { setResult({ error: cause instanceof Error ? cause.message : 'No se pudo consultar el resultado.' }) }
  }

  return { points, rank, badges, progress, history, historyCursor, historyLoading, result, routes, routeError, refresh, clear, chooseRoute, changeRoute, loadMoreHistory, viewResult }
}


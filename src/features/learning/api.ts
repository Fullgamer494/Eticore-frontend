import { apiRequest } from '../../shared/api/client'
import type { UnitDetail } from '../catalog/api'

export type Attempt = {
  id: string
  unidad_id: number
  version_id: number
  version_numero: number
  tipo: string
  titulo: string
  numero: number
  estado: 'en_curso' | 'finalizado'
  revision: number
  contenido: Record<string, unknown>
  recorrido: Record<string, unknown>
}

export function startAttempt(unitId: number): Promise<Attempt> {
  return apiRequest('intentos', { method: 'POST', body: { id: crypto.randomUUID(), unidad_id: unitId } })
}

export function getAttempt(attemptId: string, signal?: AbortSignal): Promise<Attempt> {
  return apiRequest(`intentos/${encodeURIComponent(attemptId)}`, { signal })
}

export function saveAttemptStep(attemptId: string, payload: Record<string, unknown>): Promise<{ revision: number; recorrido: Record<string, unknown> }> {
  return apiRequest(`intentos/${encodeURIComponent(attemptId)}/paso`, { method: 'PATCH', body: payload })
}

export function finishAttempt(attempt: Attempt, payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  return apiRequest(`intentos/${encodeURIComponent(attempt.id)}/finalizar`, { method: 'POST', body: { revision: attempt.revision, ...payload } })
}

export function getAttemptHistory(signal?: AbortSignal, filters: { unidad_id?: number; cursor?: string; limit?: number } = {}): Promise<{ items: Array<Record<string, unknown>>; siguiente_cursor: string | null }> {
  const query = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => { if (value !== undefined) query.set(key, String(value)) })
  const suffix = query.size ? `?${query.toString()}` : ''
  return apiRequest(`intentos/me/historial${suffix}`, { signal })
}

export function beginUnit(unit: UnitDetail): Promise<Attempt> {
  return startAttempt(unit.id)
}

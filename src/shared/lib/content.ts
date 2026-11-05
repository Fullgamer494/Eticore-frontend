import type { Attempt } from '../../features/learning/api'

export function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {}
}


export function asRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(asRecord) : []
}


export function asText(value: unknown): string {
  return typeof value === 'string' ? value : ''
}


export function resumeSectionIndex(attempt: Attempt | null): number {
  if (!attempt || attempt.tipo !== 'aprende') return 0
  const sections = asRecords(attempt.contenido.secciones).sort((a, b) => Number(a.orden) - Number(b.orden))
  const visited = Array.isArray(attempt.recorrido.secciones_visitadas) ? attempt.recorrido.secciones_visitadas : []
  const lastId = visited.at(-1)
  const lastVisited = sections.findIndex((section) => section.id === lastId)
  return lastVisited < 0 ? 0 : Math.min(lastVisited + 1, Math.max(sections.length - 1, 0))
}

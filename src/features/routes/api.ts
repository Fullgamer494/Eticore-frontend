import { apiRequest } from '../../shared/api/client'

export type LearningRoute = {
  id: number
  nombre: string
  version_actual_id: number
  version_numero: number
  publicada_en: string | null
  total_unidades: number
  unidades_obligatorias: number
}

export type RouteProgress = {
  inscripcion_id: number | null
  ruta_id: number | null
  ruta_nombre: string | null
  ruta_version_id: number | null
  version_numero: number | null
  total_obligatorias: number
  completadas_obligatorias: number
  porcentaje: number | null
  estado: 'Sin inscripcion' | 'Sin actividades' | 'En progreso' | 'Completada'
  unidades: Array<{ unidad_id: number; tipo: string; orden: number; obligatoria: boolean; completada: boolean; puntos_acreditados: number | null }>
  creditos_totales_usuario: number
  inscripciones: unknown[]
}

export function listRoutes(signal?: AbortSignal): Promise<LearningRoute[]> {
  return apiRequest('rutas', { signal })
}

export function getProgress(signal?: AbortSignal): Promise<RouteProgress> {
  return apiRequest('rutas/me/progreso', { signal })
}

export function chooseRoute(routeId: number): Promise<unknown> {
  return apiRequest(`rutas/${routeId}/elegir`, { method: 'POST', body: {} })
}

export function updateProfile(input: { nombre_visualizacion?: string; ruta_preferida_id?: number | null }): Promise<unknown> {
  return apiRequest('usuarios/me', { method: 'PATCH', body: input })
}

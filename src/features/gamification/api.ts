import { apiRequest } from '../../shared/api/client'

export type PointsSummary = { puntos_totales: number; unidades_acreditadas: number; creditos: Array<{ unidad_id: number; puntos: number; completada_en: string }> }
export type RankSummary = { rango: 'Inicial' | 'Intermedio' | 'Avanzado'; nivel: 1 | 2 | 3; puntos_totales: number; siguiente_umbral: number | null; puntos_faltantes: number }
export type Badge = { insignia_id: number; codigo: string; nombre: string; criterio: string; obtenida_en: string; intento_origen_id: string | null; inscripcion_origen_id: number | null }

export const getPoints = (signal?: AbortSignal): Promise<PointsSummary> => apiRequest('gamificacion/me/puntos', { signal })
export const getRank = (signal?: AbortSignal): Promise<RankSummary> => apiRequest('gamificacion/me/rango', { signal })
export const getBadges = (signal?: AbortSignal): Promise<Badge[]> => apiRequest('gamificacion/me/insignias', { signal })

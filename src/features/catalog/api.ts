import { apiRequest } from '../../shared/api/client'

export type ActivityType = 'aprende' | 'normamatch' | 'casotech'
export type Difficulty = 'basico' | 'intermedio' | 'especializado'

export type CatalogItem = {
  id: number
  tipo: ActivityType
  muestra_publica: boolean
  version_id: number
  version_numero: number
  titulo: string
  descripcion: string
  dificultad: Difficulty
  publicada_en: string
  tema: { id: number; nombre: string }
  completada?: boolean
}

export type CatalogResponse = { items: CatalogItem[]; siguiente_cursor: string | null }

export type UnitDetail = CatalogItem & {
  esquema_version: number
  contenido: Record<string, unknown>
  fuentes: Array<{
    clave_local: string
    revisada_en: string
    fuente_nombre: string
    titulo: string
    autor_organismo: string
    url: string
    fecha_o_version: string
    licencia_o_condicion_uso: string | null
  }>
}

export type CatalogFilters = {
  q?: string
  tipo?: ActivityType
  dificultad?: Difficulty
  tema_id?: number
  ruta_id?: number
  avance?: 'pendiente' | 'completada'
  cursor?: string
  limit?: number
}

export function getCatalog(filters: CatalogFilters = {}, signal?: AbortSignal): Promise<CatalogResponse> {
  const query = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value))
  })
  const suffix = query.size ? `?${query.toString()}` : ''
  return apiRequest<CatalogResponse>(`catalogo${suffix}`, { signal })
}

export function getPublicSample(unitId: number, signal?: AbortSignal): Promise<UnitDetail> {
  return apiRequest<UnitDetail>(`catalogo/unidades/${unitId}/muestra`, { signal })
}

export function getUnit(unitId: number, signal?: AbortSignal): Promise<UnitDetail> {
  return apiRequest<UnitDetail>(`catalogo/unidades/${unitId}`, { signal })
}

import { apiConfig, apiRequest } from '../../shared/api/client'

export type RoleCode = 'APRENDIZ' | 'ADMIN_CONTENIDO' | 'ADMIN_TECNICO'
export type PageResult<T> = { items: T[]; siguiente_cursor: string | null }

export type AdminAccount = {
  id: number; nombre_visualizacion: string; correo_normalizado: string; activo: boolean
  ruta_preferida_id: number | null; roles: RoleCode[]; creado_en: string
}

export type Group = { id: number; nombre: string; periodo: string; activo: boolean; creado_en: string; integrantes_activos?: number }
export type GroupMember = {
  membresia_id: number; grupo_id: number; usuario_id: number; nombre_visualizacion: string
  correo_normalizado: string; usuario_activo: boolean; ingreso: string; salida: string | null; activa: boolean
}
export type LegalDocument = { version_documento_id: number; documento_id: number; tipo: LegalDocumentType; numero: number; texto: string; huella: string; publicada_en: string }
export type LegalDocumentType = 'aviso_privacidad' | 'terminos' | 'consentimiento'
export type PrivacyEventType = 'aviso_presentado' | 'terminos_aceptados' | 'consentimiento_otorgado' | 'consentimiento_retirado' | 'consentimiento_rechazado'

export const checkApiHealth = async (signal?: AbortSignal): Promise<unknown> => {
  const healthUrl = apiConfig.baseUrl.replace(/\/api\/v1\/?$/, '/health')
  const response = await fetch(healthUrl, { headers: { Accept: 'application/json' }, signal, credentials: 'include' })
  if (!response.ok) throw new Error(`Salud API: HTTP ${response.status}`)
  return response.json()
}

export const beginTwoFactorSetup = (): Promise<{ otpauth_uri: string; qr_uri: string; clave_base32: string; algoritmo: string; digitos: number; periodo: number }> =>
  apiRequest('auth/2fa/iniciar', { method: 'POST', body: {} })
export const confirmTwoFactorSetup = (codigo: string): Promise<{ verificado_2fa: true; confirmado_en: string }> =>
  apiRequest('auth/2fa/confirmar', { method: 'POST', body: { codigo } })
export const disableTwoFactor = (contrasena?: string): Promise<void> =>
  apiRequest('auth/2fa', { method: 'DELETE', body: contrasena ? { contrasena } : {} })

export const getAttemptResult = (id: string): Promise<Record<string, unknown>> =>
  apiRequest(`intentos/${encodeURIComponent(id)}/resultado`)

export const switchRoute = (ruta_id: number): Promise<unknown> =>
  apiRequest('rutas/me/cambiar', { method: 'POST', body: { ruta_id } })

export const listAdminAccounts = (params: { activo?: boolean; rol?: RoleCode; cursor?: string; limit?: number } = {}): Promise<PageResult<AdminAccount>> =>
  apiRequest(`admin/cuentas${queryString(params)}`)
export const setAdminAccountActive = (id: number, active: boolean): Promise<AdminAccount & { sesiones_revocadas?: number }> =>
  apiRequest(`admin/cuentas/${id}/${active ? 'activar' : 'desactivar'}`, { method: 'PATCH', body: {} })
export const changeUserRole = (usuario_id: number, rol_codigo: RoleCode, assign: boolean): Promise<unknown> =>
  apiRequest(`admin/roles/${assign ? 'asignar' : 'retirar'}`, { method: 'POST', body: { usuario_id, rol_codigo } })
export const listAudit = (params: Record<string, string | number | undefined>): Promise<Record<string, unknown>> =>
  apiRequest(`admin/auditoria${queryString(params)}`)

export const listGroups = (params: Record<string, string | number | boolean | undefined> = {}): Promise<PageResult<Group>> =>
  apiRequest(`grupos${queryString(params)}`)
export const createGroup = (input: { nombre: string; periodo: string }): Promise<Group> =>
  apiRequest('grupos', { method: 'POST', body: input })
export const deactivateGroup = (id: number): Promise<Group> =>
  apiRequest(`grupos/${id}/desactivar`, { method: 'PATCH', body: {} })
export const listGroupMembers = (id: number, params: { solo_activos?: boolean; cursor?: string; limit?: number } = {}): Promise<PageResult<GroupMember>> =>
  apiRequest(`grupos/${id}/integrantes${queryString(params)}`)
export const addGroupMember = (id: number, input: { usuario_id: number; ingreso?: string; salida?: string }): Promise<unknown> =>
  apiRequest(`grupos/${id}/integrantes`, { method: 'POST', body: input })
export const removeGroupMember = (id: number, usuarioId: number, salida?: string): Promise<unknown> =>
  apiRequest(`grupos/${id}/integrantes/${usuarioId}/retirar`, { method: 'PATCH', body: salida ? { salida } : {} })

export const getGroupReport = (id: number, params: { desde: string; hasta: string; unidad_id?: number; ruta_id?: number }): Promise<Record<string, unknown>> =>
  apiRequest(`reportes/grupos/${id}${queryString(params)}`)

export const getLegalDocument = (tipo?: LegalDocumentType): Promise<LegalDocument> =>
  apiRequest(`legal/aviso${queryString({ tipo })}`, { credentials: 'omit' })
export const publishLegalDocument = (tipo: LegalDocumentType, texto: string): Promise<LegalDocument> =>
  apiRequest('legal/documentos/versiones', { method: 'POST', body: { tipo, texto } })
export const registerLegalEvent = (input: { version_documento_id: number; tipo_evento: PrivacyEventType; clave_operacion: string; canal?: string; finalidad_codigo?: string }): Promise<Record<string, unknown>> =>
  apiRequest('legal/eventos', { method: 'POST', body: input })
export const getMyLegalEvents = (): Promise<Record<string, unknown>> => apiRequest('legal/mis-eventos')
export const createPrivacyRequest = (input: { tipo: string; verificacion_minima?: string }): Promise<Record<string, unknown>> =>
  apiRequest('legal/solicitudes', { method: 'POST', body: input })

export const createEditorialUnit = (tipo: 'aprende' | 'normamatch' | 'casotech', muestra_publica?: boolean): Promise<Record<string, unknown>> =>
  apiRequest('editorial/unidades', { method: 'POST', body: { tipo, muestra_publica } })
export const createEditorialDraft = (input: Record<string, unknown>): Promise<Record<string, unknown>> =>
  apiRequest('editorial/versiones', { method: 'POST', body: input })
export const updateEditorialDraft = (id: number, input: Record<string, unknown>): Promise<Record<string, unknown>> =>
  apiRequest(`editorial/versiones/${id}`, { method: 'PATCH', body: input })
export const reviewEditorialDraft = (id: number, resultado: 'aprobada' | 'rechazada' | 'observaciones'): Promise<Record<string, unknown>> =>
  apiRequest(`editorial/versiones/${id}/revisiones`, { method: 'POST', body: { resultado } })
export const publishEditorialDraft = (id: number): Promise<Record<string, unknown>> =>
  apiRequest(`editorial/versiones/${id}/publicar`, { method: 'POST', body: {} })
export const deactivateEditorialUnit = (id: number): Promise<Record<string, unknown>> =>
  apiRequest(`editorial/unidades/${id}/desactivar`, { method: 'PATCH', body: {} })

function queryString(params: Record<string, string | number | boolean | undefined>): string {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value))
  })
  return query.size ? `?${query.toString()}` : ''
}

import { apiRequest } from '../../shared/api/client'

export type Role = 'APRENDIZ' | 'ADMIN_CONTENIDO' | 'ADMIN_TECNICO'
export type AuthenticatedUser = {
  id: number
  nombre_visualizacion: string
  correo_normalizado: string
  activo: boolean
  ruta_preferida_id: number | null
  roles: Role[]
  creado_en: string
}

export type LoginResult =
  | { usuario: AuthenticatedUser }
  | { requiere_2fa: true; desafio_id: string; expira_en: string }

export function getCurrentUser(signal?: AbortSignal): Promise<AuthenticatedUser> {
  return apiRequest('usuarios/me', { signal })
}

export function signIn(correo: string, contrasena: string): Promise<LoginResult> {
  return apiRequest('auth/login', { method: 'POST', body: { correo, contrasena } })
}

export function verifyTwoFactor(desafio_id: string, codigo_totp: string): Promise<{ usuario: AuthenticatedUser }> {
  return apiRequest('auth/2fa/verificar', { method: 'POST', body: { desafio_id, codigo_totp } })
}

export function signUp(input: { nombre_visualizacion: string; correo: string; contrasena: string }): Promise<{ usuario: AuthenticatedUser }> {
  return apiRequest('auth/registro', { method: 'POST', body: input })
}

export function signOut(): Promise<void> {
  return apiRequest('auth/logout', { method: 'POST', body: {} })
}

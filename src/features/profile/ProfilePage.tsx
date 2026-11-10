import { useState } from 'react'
import type { AuthenticatedUser } from '../auth/api'
import type { LearningRoute } from '../routes/api'
import { beginTwoFactorSetup, confirmTwoFactorSetup, disableTwoFactor } from '../management/api'

export function Profile({ user, routes, message, onUpdate }: { user: AuthenticatedUser; routes: LearningRoute[]; message: string | null; onUpdate: (input: { nombre_visualizacion?: string; ruta_preferida_id?: number | null }) => Promise<void> }) {
  return <div className="page-content"><section className="page-intro"><p className="eyebrow">TU CUENTA</p><h1>Mi perfil</h1><p>Datos de tu sesión y preferencias.</p></section>
    <div className="profile-card"><div className="profile-heading"><span className="avatar avatar-large">{user.nombre_visualizacion.slice(0, 2).toUpperCase()}</span><div><h2>{user.nombre_visualizacion}</h2><p>{user.roles.join(' · ')}</p></div></div>
      <div className="profile-fields"><div><span>Correo electrónico</span><strong>{user.correo_normalizado}</strong><small>El correo no es editable desde autoservicio.</small></div><div><span>Ruta preferida</span><strong>{user.ruta_preferida_id ?? 'Sin elegir'}</strong><small>La ruta organiza el aprendizaje, no cambia permisos.</small></div></div>
      <form className="profile-edit-form" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); void onUpdate({ nombre_visualizacion: String(data.get('display_name')), ruta_preferida_id: data.get('route') ? Number(data.get('route')) : null }) }}><h3>Editar perfil</h3><label>Nombre para mostrar<input name="display_name" defaultValue={user.nombre_visualizacion} minLength={2} maxLength={80} required /></label><label>Ruta preferida<select name="route" defaultValue={user.ruta_preferida_id ?? ''}><option value="">Sin preferencia</option>{routes.map((route) => <option key={route.id} value={route.id}>{route.nombre}</option>)}</select></label><button className="button button-teal">Guardar perfil</button>{message && <p role="status" className="field-hint">{message}</p>}</form>
      <TwoFactorSettings user={user} />
      <div className="demo-notice"><strong>Sesión del servidor</strong><p>La sesión se mantiene en una cookie HttpOnly; el frontend no guarda tokens.</p></div>
    </div>
  </div>
}

export function TwoFactorSettings({ user }: { user: AuthenticatedUser }) {
  const [setup, setSetup] = useState<{ otpauth_uri: string; qr_uri: string; clave_base32: string; algoritmo: string; digitos: number; periodo: number } | null>(null)
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const isAdmin = user.roles.some((role) => role === 'ADMIN_TECNICO' || role === 'ADMIN_CONTENIDO')

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true); setError(null); setMessage(null)
    try { await action(); setMessage(success) } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo completar la operación.') }
    finally { setBusy(false) }
  }

  return <section className="security-panel"><h3>Autenticación de dos factores</h3><p>El alta entrega el secreto y URI de configuración una sola vez. Usa una aplicación TOTP compatible.</p>
    {message && <p role="status" className="notice-banner">{message}</p>}{error && <p role="alert" className="error-banner">{error}</p>}
    {!setup && <button className="button button-outline" disabled={busy} onClick={() => { void run(async () => setSetup(await beginTwoFactorSetup()), 'Escanea o importa el URI y confirma el primer código.') }}>Iniciar configuración 2FA</button>}
    {setup && <><div className="secret-block"><strong>Secreto Base32</strong><code>{setup.clave_base32}</code><strong>URI de autenticación</strong><code>{setup.otpauth_uri}</code></div><form onSubmit={(event) => { event.preventDefault(); void run(async () => { await confirmTwoFactorSetup(code); setSetup(null); setCode('') }, 'Segundo factor activado.') }}><label>Código de 6 dígitos<input value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" pattern="[0-9]{6,8}" minLength={6} maxLength={8} required /></label><button className="button button-teal" disabled={busy}>Confirmar 2FA</button></form></>}
    {!isAdmin && <form onSubmit={(event) => { event.preventDefault(); void run(async () => { await disableTwoFactor(password); setPassword('') }, 'Segundo factor desactivado.') }}><label>Contraseña actual para desactivar<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label><button className="button button-outline" disabled={busy}>Desactivar 2FA</button></form>}
    {isAdmin && <small>La API exige 2FA para roles administrativos y no permite desactivarlo desde esta cuenta.</small>}
  </section>
}

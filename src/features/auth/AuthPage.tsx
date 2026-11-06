import { useState } from 'react'

export function AuthPage({ mode, setMode, error, notice, busy, onLogin, onRegister, onVerify }: {
  mode: 'login' | 'register' | '2fa'; setMode: (mode: 'login' | 'register' | '2fa') => void
  error: string | null; notice: string | null; busy: boolean
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (input: { nombre_visualizacion: string; correo: string; contrasena: string }) => Promise<void>
  onVerify: (code: string) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  return <div className="page-content auth-content"><section className="auth-card">
    <p className="eyebrow">ETICORE · TU ESPACIO</p><h1>{mode === 'register' ? 'Crea tu cuenta' : mode === '2fa' ? 'Verifica tu identidad' : 'Qué bueno verte'}</h1>
    <p className="auth-lead">{mode === '2fa' ? 'Ingresa el código temporal de tu aplicación de autenticación.' : 'Continúa aprendiendo ética y legislación en tecnología.'}</p>
    {notice && <div className="notice-banner" role="status">{notice}</div>}{error && <div className="error-banner" role="alert">{error}</div>}
    {mode === '2fa' ? <form onSubmit={(event) => { event.preventDefault(); void onVerify(code) }}>
      <label>Código TOTP<input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}" minLength={6} maxLength={8} required value={code} onChange={(event) => setCode(event.target.value)} /></label>
      <button className="button button-teal auth-submit" disabled={busy}>{busy ? 'Verificando…' : 'Verificar código'}</button><button className="text-button" type="button" onClick={() => setMode('login')}>Volver</button>
    </form> : <form onSubmit={(event) => { event.preventDefault(); if (mode === 'register') void onRegister({ nombre_visualizacion: name, correo: email, contrasena: password }); else void onLogin(email, password) }}>
      {mode === 'register' && <label>Nombre para mostrar<input autoComplete="name" minLength={2} maxLength={80} required value={name} onChange={(event) => setName(event.target.value)} /></label>}
      <label>Correo electrónico<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label>Contraseña<input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 15 : undefined} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      {mode === 'register' && <small className="form-help">Usa entre 15 y 128 caracteres.</small>}
      <button className="button button-teal auth-submit" disabled={busy}>{busy ? 'Procesando…' : mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}</button>
      <p className="auth-switch">{mode === 'register' ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'} <button type="button" className="text-button" onClick={() => setMode(mode === 'register' ? 'login' : 'register')}>{mode === 'register' ? 'Inicia sesión' : 'Regístrate'}</button></p>
    </form>}
  </section></div>
}

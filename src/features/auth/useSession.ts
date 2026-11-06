import { useEffect, useState } from 'react'
import { getCurrentUser, signIn, signOut, signUp, verifyTwoFactor, type AuthenticatedUser } from './api'
import type { Page } from '../../app/types'

type RegistrationInput = { nombre_visualizacion: string; correo: string; contrasena: string }

export function useSession(setPage: (page: Page) => void) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register' | '2fa'>('login')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authNotice, setAuthNotice] = useState<string | null>(null)
  const [authBusy, setAuthBusy] = useState(false)
  const [challengeId, setChallengeId] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    getCurrentUser(controller.signal)
      .then((currentUser) => { setUser(currentUser); setPage('home') })
      .catch(() => { setUser(null); setPage('landing') })
      .finally(() => setSessionChecked(true))
    return () => controller.abort()
  }, [setPage])

  async function refreshUser() { setUser(await getCurrentUser()) }

  function openLogin() { setAuthMode('login'); setAuthError(null); setAuthNotice(null); setPage('auth') }
  function openRegistration() { setAuthMode('register'); setAuthError(null); setAuthNotice(null); setPage('auth') }

  async function login(correo: string, contrasena: string) {
    setAuthBusy(true); setAuthError(null)
    try {
      const result = await signIn(correo, contrasena)
      if (!('usuario' in result)) { setChallengeId(result.desafio_id); setAuthMode('2fa'); return }
      setUser(result.usuario); setPage('home')
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.') }
    finally { setAuthBusy(false) }
  }

  async function register(input: RegistrationInput) {
    setAuthBusy(true); setAuthError(null)
    try { await signUp(input); setAuthNotice('Tu cuenta quedó registrada. Inicia sesión para continuar.'); setAuthMode('login') }
    catch (error) { setAuthError(error instanceof Error ? error.message : 'No se pudo crear la cuenta.') }
    finally { setAuthBusy(false) }
  }

  async function verify(code: string) {
    setAuthBusy(true); setAuthError(null)
    try { const result = await verifyTwoFactor(challengeId, code); setUser(result.usuario); setPage('home'); setAuthMode('login') }
    catch (error) { setAuthError(error instanceof Error ? error.message : 'No se pudo verificar el código.') }
    finally { setAuthBusy(false) }
  }

  async function logout() {
    try { await signOut() } catch { /* The local view still clears if the server session expired. */ }
    setUser(null); setPage('landing')
  }

  return { user, setUser, refreshUser, sessionChecked, authMode, setAuthMode, authError, setAuthError, authNotice, setAuthNotice, authBusy, login, register, verify, logout, openLogin, openRegistration }
}

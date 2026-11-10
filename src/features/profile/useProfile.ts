import { useState } from 'react'
import { updateProfile } from '../routes/api'

export function useProfile(refreshUser: () => Promise<void>) {
  const [message, setMessage] = useState<string | null>(null)

  async function update(input: { nombre_visualizacion?: string; ruta_preferida_id?: number | null }) {
    setMessage(null)
    try { await updateProfile(input); await refreshUser(); setMessage('Perfil actualizado.') }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : 'No se pudo actualizar el perfil.') }
  }

  return { message, update }
}

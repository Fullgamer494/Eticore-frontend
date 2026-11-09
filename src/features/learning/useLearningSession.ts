import { useState } from 'react'
import { getPublicSample, getUnit, type UnitDetail } from '../catalog/api'
import type { AuthenticatedUser } from '../auth/api'
import { finishAttempt, getAttempt, getAttemptHistory, saveAttemptStep, startAttempt, type Attempt } from './api'
import type { Course } from '../../shared/types/course'
import type { Page } from '../../app/types'

export function useLearningSession(user: AuthenticatedUser | null, setPage: (page: Page) => void, refreshProgress: () => Promise<void>, openLogin: () => void) {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [samplePreview, setSamplePreview] = useState<UnitDetail | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function openCourse(course: Course) {
    if (!user && !course.samplePublic) { openLogin(); return }
    setActiveCourse(course); setAttempt(null); setSamplePreview(null); setError(null); setNotice(null); setPage('learning'); setBusy(true)
    try {
      if (!user) { setSamplePreview(await getPublicSample(course.unitId!)); return }
      const unit = await getUnit(course.unitId!)
      const history = await getAttemptHistory(undefined, { unidad_id: unit.id, limit: 20 })
      const active = history.items.find((item) => item.estado === 'en_curso')
      const started = active && typeof active.id === 'string' ? await getAttempt(active.id) : await startAttempt(unit.id)
      setAttempt(started); setActiveCourse({ ...course, title: started.titulo })
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo abrir la actividad.') }
    finally { setBusy(false) }
  }

  async function saveStep(payload: Record<string, unknown>) {
    if (!attempt) return
    setBusy(true); setError(null)
    try {
      const saved = await saveAttemptStep(attempt.id, { revision: attempt.revision, ...payload })
      setAttempt((current) => current ? { ...current, revision: saved.revision, recorrido: saved.recorrido } : current)
      return saved
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo guardar el avance.'); return undefined }
    finally { setBusy(false) }
  }

  async function refreshAttempt() {
    if (!attempt) return
    try { setAttempt(await getAttempt(attempt.id)) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo actualizar el intento.') }
  }

  async function finish(payload: Record<string, unknown>) {
    if (!attempt) return
    setBusy(true); setError(null)
    try {
      await finishAttempt(attempt, payload)
      setNotice('Actividad finalizada. El servidor registró tu resultado y progreso.')
      setAttempt((current) => current ? { ...current, estado: 'finalizado' } : current)
      await refreshProgress()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo finalizar la actividad.') }
    finally { setBusy(false) }
  }

  async function resumeAttempt(id: string) {
    setBusy(true); setError(null)
    try {
      const current = await getAttempt(id)
      const kind = current.tipo === 'casotech' ? 'CasoTech' : current.tipo === 'normamatch' ? 'NormaMatch' : 'Aprende'
      setActiveCourse({ id: String(current.unidad_id), unitId: current.unidad_id, title: current.titulo, topic: 'Actividad', topicId: 0, description: '', difficulty: '', samplePublic: false, progress: 0, kind, color: kind === 'CasoTech' ? 'amber' : kind === 'NormaMatch' ? 'blue' : 'teal' })
      setAttempt(current); setSamplePreview(null); setNotice(null); setPage('learning')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo reanudar el intento.') }
    finally { setBusy(false) }
  }

  return { activeCourse, attempt, samplePreview, busy, error, notice, openCourse, saveStep, refreshAttempt, finish, resumeAttempt }
}

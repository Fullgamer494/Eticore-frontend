import { useState } from 'react'
import type { UnitDetail } from '../catalog/api'
import type { Attempt } from './api'
import type { Course } from '../../shared/types/course'
import { asRecord, asRecords, asText, resumeSectionIndex } from '../../shared/lib/content'

export function SamplePreview({ course, sample, onBack, onLogin }: { course: Course; sample: UnitDetail; onBack: () => void; onLogin: () => void }) {
  const content = sample.contenido
  return <div className="page-content learning-content">
    <button className="back-link" onClick={onBack}>← <span>Volver al catálogo</span></button>
    <article className="lesson-main sample-preview">
      <div className="lesson-overline"><span className="tag tag-teal">Muestra pública · {course.kind}</span><span>{course.difficulty} · {course.topic}</span></div>
      <h1>{sample.titulo}</h1><p className="lesson-lead">{sample.descripcion}</p>
      {course.kind === 'Aprende' && <><div className="note-box"><span>OBJETIVO</span><p>{asText(content.objetivo)}</p></div>{asRecords(content.secciones).map((section) => <section className="lesson-block" key={asText(section.id)}><h2>{asText(section.titulo)}</h2><p>{asText(section.cuerpo) || asText(section.contenido)}</p></section>)}</>}
      {course.kind === 'NormaMatch' && asRecords(content.situaciones).map((situation) => <section className="lesson-block" key={asText(situation.id)}><h2>{asText(situation.enunciado) || asText(situation.texto)}</h2><ul>{asRecords(situation.opciones).map((option) => <li key={asText(option.id)}>{asText(option.texto)}</li>)}</ul></section>)}
      {course.kind === 'CasoTech' && asRecords(content.etapas).map((stage) => <section className="lesson-block" key={asText(stage.id)}><h2>{asText(stage.titulo)}</h2><p>{asText(stage.enunciado) || asText(stage.contexto)}</p><ul>{asRecords(stage.alternativas).map((alternative) => <li key={asText(alternative.id)}>{asText(alternative.texto)}</li>)}</ul></section>)}
      <div className="demo-notice"><strong>Vista de muestra</strong><p>Inicia sesión para crear un intento y guardar tu progreso.</p><button className="button button-teal" onClick={onLogin}>Iniciar sesión</button></div>
    </article>
  </div>
}

export function Learning({ course, attempt, busy, error, notice, onSave, onRefresh, onFinish, onBack }: {
  course: Course; attempt: Attempt | null; busy: boolean; error: string | null; notice: string | null
  onSave: (payload: Record<string, unknown>) => Promise<unknown>; onRefresh: () => Promise<void>
  onFinish: (payload: Record<string, unknown>) => Promise<void>; onBack: () => void
}) {
  const [sectionIndex, setSectionIndex] = useState(() => resumeSectionIndex(attempt))
  const [associations, setAssociations] = useState<Record<string, string>>({})
  if (!attempt) return <div className="page-content"><button className="back-link" onClick={onBack}>← Volver al catálogo</button><div className={error ? 'empty-state api-error' : 'empty-state'} role={error ? 'alert' : 'status'}><h2>{error ? 'No se pudo abrir la actividad' : 'Abriendo actividad…'}</h2><p>{error ?? 'Consultando el contenido y creando tu intento.'}</p>{error && <button className="button button-outline" onClick={onBack}>Volver al catálogo</button>}</div></div>

  const currentAttempt = attempt
  const content = currentAttempt.contenido
  const sections = asRecords(content.secciones).sort((a, b) => Number(a.orden) - Number(b.orden))
  const situations = asRecords(content.situaciones)
  const stages = asRecords(content.etapas)
  const currentStageId = asText(currentAttempt.recorrido.etapa_actual_id) || asText(content.etapa_inicial_id)
  const currentStage = stages.find((stage) => stage.id === currentStageId)
  const alternatives = asRecords(currentStage?.alternativas)
  const decisions = asRecords(currentAttempt.recorrido.decisiones).map((decision) => ({ etapa_id: asText(decision.etapa_id), alternativa_id: asText(decision.alternativa_id) }))
  const isComplete = currentAttempt.estado === 'finalizado'
  const currentSection = sections[sectionIndex]

  async function nextSection() {
    if (!currentSection) return
    const visited = sections.slice(0, sectionIndex + 1).map((section) => asText(section.id))
    const payload = { seccion_id: asText(currentSection.id), secciones_visitadas: visited, confirmado: true }
    if (sectionIndex === sections.length - 1) await onFinish({ revision: currentAttempt.revision, ...payload })
    else if (await onSave(payload)) setSectionIndex((index) => index + 1)
  }

  async function chooseAlternative(alternative: Record<string, unknown>) {
    const decision = { etapa_id: currentStageId, alternativa_id: asText(alternative.id) }
    const result = await onSave(decision) as { recorrido?: Record<string, unknown> } | undefined
    if (result) {
      await onRefresh()
    }
  }

  return <div className="page-content learning-content">
    <button className="back-link" onClick={onBack}>← <span>Volver al catálogo</span></button>
    <div className="lesson-layout"><article className="lesson-main">
      <div className="lesson-overline"><span className="tag tag-teal">{course.kind}</span><span>{course.difficulty} · {course.topic}</span></div>
      <h1>{currentAttempt.titulo}</h1>
      {notice && <div className="notice-banner" role="status">{notice}</div>}{error && <div className="error-banner" role="alert">{error}</div>}
      {busy && <p role="status" className="field-hint">Guardando en Eticore…</p>}
      {!isComplete && currentAttempt.tipo === 'aprende' && <section className="lesson-block">
        <p className="eyebrow">SECCIÓN {sectionIndex + 1} DE {sections.length}</p><h2>{asText(currentSection?.titulo)}</h2>
        <p>{asText(currentSection?.cuerpo) || asText(currentSection?.contenido)}</p>
        {sectionIndex === 0 && <><div className="note-box"><span>OBJETIVO</span><p>{asText(content.objetivo)}</p></div><div className="note-box"><span>EJEMPLO</span><p>{typeof content.ejemplo === 'string' ? content.ejemplo : asText(asRecord(content.ejemplo).descripcion)}</p></div></>}
        {sectionIndex < sections.length - 1 ? <button className="button button-teal" disabled={busy} onClick={() => void nextSection()}>Guardar y continuar →</button> : <button className="button button-teal" disabled={busy} onClick={() => void nextSection()}>Finalizar actividad →</button>}
      </section>}
      {!isComplete && currentAttempt.tipo === 'normamatch' && <section className="lesson-block"><p className="eyebrow">RELACIONA CADA SITUACIÓN</p>
        {situations.map((situation) => <fieldset className="match-question" key={asText(situation.id)}><legend>{asText(situation.enunciado) || asText(situation.texto)}</legend>{asRecords(situation.opciones).map((option) => <label className="match-option" key={asText(option.id)}><input type="radio" name={asText(situation.id)} checked={associations[asText(situation.id)] === asText(option.id)} onChange={() => setAssociations((current) => ({ ...current, [asText(situation.id)]: asText(option.id) }))} />{asText(option.texto)}</label>)}</fieldset>)}
        <button className="button button-teal" disabled={busy || situations.length === 0 || situations.some((s) => !associations[asText(s.id)])} onClick={() => void onFinish({ revision: currentAttempt.revision, asociaciones: associations })}>Enviar respuestas →</button>
      </section>}
      {!isComplete && currentAttempt.tipo === 'casotech' && currentStage && <section className="lesson-block"><p className="eyebrow">CASO · {asText(currentStage.titulo)}</p><h2>{asText(currentStage.enunciado) || asText(currentStage.contexto) || asText(currentStage.titulo)}</h2>
        {currentStage.terminal === true ? <><p>Has llegado al cierre de este recorrido. Envía tus decisiones para que Eticore las evalúe.</p><button className="button button-teal" disabled={busy || decisions.length === 0} onClick={() => void onFinish({ revision: currentAttempt.revision, decisiones: decisions })}>Finalizar caso →</button></> : alternatives.map((alternative) => <button className="button button-outline alternative-button" key={asText(alternative.id)} disabled={busy} onClick={() => void chooseAlternative(alternative)}>{asText(alternative.texto)}</button>)}
      </section>}
      {isComplete && <div className="finish-note" role="status"><span>✓</span><div><strong>Actividad completada</strong><p>El resultado y los créditos son calculados por el servidor.</p></div></div>}
      <div className="lesson-actions"><span>Intento {currentAttempt.numero} · revisión {currentAttempt.revision}</span></div>
    </article><aside className="lesson-aside"><div className="aside-card"><span className="aside-spark">✳</span><p className="eyebrow">ETICORE</p><h3>Aprende y decide con intención</h3><p>El contenido y la evaluación provienen de la versión publicada en la API.</p></div><div className="aside-progress"><div><span>Estado</span><strong>{isComplete ? 'Finalizada' : 'En curso'}</strong></div><small>El progreso se conserva en tu sesión.</small></div></aside></div>
  </div>
}

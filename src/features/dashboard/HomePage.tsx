import type { PointsSummary } from '../gamification/api'
import type { RouteProgress } from '../routes/api'
import type { Course } from '../../shared/types/course'
import { CourseCard } from '../../shared/ui/CourseCard'

export function Home({ onExplore, onContinue, onOpenCourse, points, progress, courses: availableCourses }: { onExplore: () => void; onContinue: () => void; onOpenCourse: (course: Course) => void; points: PointsSummary | null; progress: RouteProgress | null; courses: Course[] }) {
  return <div className="page-content">
    <section className="welcome-row">
      <div><p className="eyebrow">TU ESPACIO DE APRENDIZAJE</p><h1>Hola <span className="wave">✳</span></h1><p className="welcome-copy">Cada decisión digital tiene un impacto. Hoy puedes explorar uno nuevo.</p></div>
      <div className="streak-card"><span className="streak-icon">✦</span><div><strong>{progress?.ruta_nombre ?? 'Elige una ruta'}</strong><span>ruta formativa</span></div></div>
    </section>

    <section className="hero-panel">
      <div className="hero-copy"><span className="hero-kicker">APRENDIZAJE CON INTENCIÓN</span><h2>Ética para<br />decidir mejor</h2><p>Explora contenidos y casos para pensar la tecnología desde las personas.</p>
        <button className="button button-teal" onClick={onContinue}>Explorar actividades <span aria-hidden="true">→</span></button>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-sun" /><div className="hero-shape"><span>?</span></div><div className="hero-caption">Una pausa para<br />mirar distinto.</div></div>
      <span className="hero-index">01 <i /> 03</span>
    </section>

    <section className="stats-grid" aria-label="Resumen de aprendizaje">
      <StatCard label="PUNTOS" value={points ? String(points.puntos_totales) : '—'} detail="Saldo confirmado" icon="✦" tone="mint" />
      <StatCard label="ACTIVIDADES" value={progress ? `${progress.completadas_obligatorias} de ${progress.total_obligatorias}` : '—'} detail={progress?.ruta_nombre ?? 'Elige una ruta'} icon="▤" tone="sand" />
      <StatCard label="AVANCE" value={progress?.porcentaje === null || progress?.porcentaje === undefined ? '—' : `${progress.porcentaje}%`} detail={progress?.estado ?? 'Cargando progreso'} icon="◇" tone="lavender" />
    </section>

    <section className="section-heading"><div><p className="eyebrow">PARA TI</p><h2>Una buena pregunta para empezar</h2></div><button className="text-button" onClick={onExplore}>Ver catálogo <span>→</span></button></section>
    <div className="question-card"><div className="question-mark">“</div><div><span className="tag tag-amber">PENSAR EN TECNOLOGÍA</span><h3>¿Qué principios deberían orientar una decisión tecnológica?</h3><p>Explora las actividades disponibles y construye tu propio criterio.</p></div><button className="circle-arrow" onClick={onContinue} aria-label="Explorar actividades">→</button></div>
    <section className="section-heading courses-heading"><div><p className="eyebrow">TU RUTA GENERAL</p><h2>Continúa a tu ritmo</h2></div><button className="text-button" onClick={onExplore}>Explorar todas <span>→</span></button></section>
    <div className="course-grid">{availableCourses.slice(0, 2).map((course) => <CourseCard key={course.id} course={course} onOpen={() => onOpenCourse(course)} />)}</div>
  </div>
}

export function StatCard({ label, value, detail, icon, tone }: { label: string; value: string; detail: string; icon: string; tone: string }) {
  return <article className="stat-card"><span className={`stat-icon ${tone}`} aria-hidden="true">{icon}</span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></article>
}

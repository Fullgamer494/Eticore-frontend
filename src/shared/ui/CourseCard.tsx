import type { Course } from '../types/course'

export function CourseCard({ course, onOpen }: { course: Course; onOpen: () => void }) {
  return <article className="course-card">
    <div className={`course-art ${course.color}`}><span className="course-art-label">{course.kind}</span><span className="course-art-symbol" aria-hidden="true">{course.kind === 'Aprende' ? '◌' : course.kind === 'CasoTech' ? '↗' : '↔'}</span></div>
    <div className="course-card-body"><span className="course-topic">{course.topic}</span><h3>{course.title}</h3><p>{course.description}</p><div className="course-card-meta"><span>{course.difficulty}</span><span>·</span><span>{course.progress ? `${course.progress}% completado` : 'Por comenzar'}</span></div>
      <button className="button button-outline" aria-label={`${course.progress ? 'Continuar' : 'Ver actividad'}: ${course.title}`} onClick={onOpen}>{course.progress ? 'Continuar' : 'Ver actividad'} <span>→</span></button></div>
  </article>
}

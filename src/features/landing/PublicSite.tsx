import type { ReactNode } from 'react'
import type { Course } from '../../shared/types/course'
import { CourseCard } from '../../shared/ui/CourseCard'
import eticoreLogo from '../../../resources/brand/eticore-logo-horizontal-inverse.svg'
import capicoreFront from '../../../resources/brand/capicore-front.svg'
import patternArcLarge from '../../../resources/brand/pattern-arc-large.svg'
import patternArcSmall from '../../../resources/brand/pattern-arc-small.svg'

type PublicSiteProps = {
  signedIn: boolean
  onHome: () => void
  onCatalog: () => void
  onLogin: () => void
  onRegister: () => void
  onPrivacy: () => void
  children: ReactNode
}

export function PublicSite({ signedIn, onHome, onCatalog, onLogin, onRegister, onPrivacy, children }: PublicSiteProps) {
  return <div className="public-site">
    <header className="public-header">
      <div className="public-header-inner">
        <button className="public-wordmark" onClick={onHome} aria-label="Eticore, ir al inicio">
          <img src={eticoreLogo} alt="Eticore" />
        </button>
        <nav className="public-nav" aria-label="Navegación del sitio">
          <button onClick={onHome}>Inicio</button>
          <button onClick={onCatalog}>Actividades</button>
          <button onClick={onPrivacy}>Privacidad</button>
        </nav>
        <div className="public-actions">
          {signedIn
            ? <button className="button button-teal" onClick={onHome}>Volver a mi espacio</button>
            : <>
              <button className="public-login" onClick={onLogin}>Iniciar sesión</button>
              <button className="button button-teal" onClick={onRegister}>Crear cuenta</button>
            </>}
        </div>
      </div>
    </header>
    <main className="public-main">{children}</main>
    <footer className="public-footer">
      <span>Eticore · Aprender para decidir con intención</span>
      <button onClick={onPrivacy}>Aviso de privacidad y términos</button>
    </footer>
  </div>
}

type PublicLandingProps = {
  courses: Course[]
  loading: boolean
  error: string | null
  onBrowse: () => void
  onLogin: () => void
  onRegister: () => void
  onOpenCourse: (course: Course) => void
}

const reflectionSteps = [
  { number: '01', title: 'Explora el caso', copy: 'Conoce el contexto antes de tomar postura.' },
  { number: '02', title: 'Mira el impacto', copy: 'Considera a las personas y consecuencias implicadas.' },
  { number: '03', title: 'Construye tu criterio', copy: 'Explica tus razones y decide con intención.' },
]

export function PublicLanding({ courses, loading, error, onBrowse, onLogin, onRegister, onOpenCourse }: PublicLandingProps) {
  return <div className="public-landing">
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-copy">
        <p className="eyebrow">ÉTICA APLICADA A LA TECNOLOGÍA</p>
        <h1 id="landing-title" className="landing-display">Pensar antes de decidir</h1>
        <p className="landing-lede">Un espacio para explorar dilemas tecnológicos, considerar sus efectos y formar una postura propia.</p>
        <div className="landing-actions">
          <button className="button button-teal" onClick={onRegister}>Comenzar a explorar <span aria-hidden="true">→</span></button>
          <button className="landing-text-link" onClick={onBrowse}>Ver actividades</button>
        </div>
        <p className="landing-signin">¿Ya tienes una cuenta? <button onClick={onLogin}>Inicia sesión</button></p>
      </div>
      <div className="landing-art">
        <div className="landing-pattern" aria-hidden="true">
          <img src={patternArcLarge} alt="" />
          <img src={patternArcSmall} alt="" />
          <img src={patternArcSmall} alt="" />
          <img src={patternArcLarge} alt="" />
          <img src={patternArcSmall} alt="" />
          <img src={patternArcLarge} alt="" />
        </div>
        <img className="landing-mascot" src={capicoreFront} alt="CapiCore, la capibara que acompaña la experiencia" />
        <span className="landing-art-caption">Un momento para mirar con atención</span>
      </div>
    </section>

    <section className="landing-principles" aria-labelledby="principles-title">
      <div className="landing-section-intro">
        <p className="eyebrow">APRENDER CON INTENCIÓN</p>
        <h2 id="principles-title" className="landing-display">La tecnología también se decide</h2>
        <p>Las decisiones sobre tecnología afectan vidas cotidianas. Eticore convierte esas preguntas en oportunidades para reflexionar.</p>
      </div>
      <ol className="reflection-steps">
        {reflectionSteps.map((step) => <li key={step.number}>
          <span className="step-number">{step.number}</span>
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
        </li>)}
      </ol>
    </section>

    <section className="landing-content" aria-labelledby="activities-title">
      <div className="landing-section-heading">
        <div>
          <p className="eyebrow">UN PRIMER ACERCAMIENTO</p>
          <h2 id="activities-title" className="landing-display">Explora las actividades</h2>
        </div>
        <button className="landing-text-link" onClick={onBrowse}>Ver catálogo <span aria-hidden="true">→</span></button>
      </div>
      {error && <div className="error-banner" role="alert">No se pudieron cargar las actividades. {error}</div>}
      {loading
        ? <p className="landing-status" role="status">Cargando actividades…</p>
        : courses.length
          ? <div className="course-grid">{courses.slice(0, 3).map((course) => <CourseCard key={course.id} course={course} onOpen={() => onOpenCourse(course)} />)}</div>
          : !error && <div className="landing-empty"><p>Aún no hay actividades de muestra.</p><button className="landing-text-link" onClick={onBrowse}>Explorar el catálogo <span aria-hidden="true">→</span></button></div>}
    </section>

    <section className="landing-join" aria-labelledby="join-title">
      <div>
        <p className="eyebrow">TU SIGUIENTE PASO</p>
        <h2 id="join-title" className="landing-display">Empieza con una pregunta</h2>
        <p>Crea una cuenta para guardar tu avance y continuar a tu ritmo.</p>
      </div>
      <button className="button button-teal" onClick={onRegister}>Crear cuenta <span aria-hidden="true">→</span></button>
    </section>
  </div>
}

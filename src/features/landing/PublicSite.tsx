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
  return <div className="public-site [min-height:100vh] [display:flex] [flex-direction:column] bg-paper text-ink [&_.auth-content]:px-5 [&_.auth-content]:py-[55px] [&_.auth-card]:shadow-[0_12px_36px_#0F2D4A0a] max-[700px]:[&_.auth-content]:px-[18px] max-[700px]:[&_.auth-content]:py-[30px]">
    <header className="public-header border-b border-white/10 bg-ink">
      <div className="public-header-inner mx-auto flex min-h-[78px] max-w-[1320px] items-center gap-9 px-[clamp(20px,5vw,72px)] py-3 max-[700px]:min-h-[65px] max-[700px]:flex-wrap max-[700px]:gap-x-4 max-[700px]:gap-y-2 max-[700px]:px-4 max-[700px]:py-3 max-[380px]:gap-x-2">
        <button className="public-wordmark flex shrink-0 cursor-pointer border-0 bg-transparent p-0 [&_img]:block [&_img]:w-[190px] max-[700px]:[&_img]:w-[155px] max-[380px]:[&_img]:w-[125px]" onClick={onHome} aria-label="Eticore, ir al inicio">
          <img src={eticoreLogo} alt="Eticore" />
        </button>
        <nav className="public-nav flex items-center gap-6 flex-1 [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-2 [&_button]:text-[13px] [&_button]:text-white/80 [&_button]:transition-colors [&_button]:hover:text-white [&_button:hover]:underline [&_button:hover]:underline-offset-4 max-[700px]:order-3 max-[700px]:flex-[1_0_100%] max-[700px]:justify-center max-[700px]:gap-5 max-[700px]:border-t max-[700px]:border-border max-[700px]:pt-2 max-[700px]:[&_button]:min-h-10 max-[700px]:[&_button]:px-1 max-[700px]:[&_button]:text-[11px]" aria-label="Navegación del sitio">
          <button onClick={onHome}>Inicio</button>
          <button onClick={onCatalog}>Actividades</button>
          <button onClick={onPrivacy}>Privacidad</button>
        </nav>
        <div className="public-actions flex items-center gap-6 max-[700px]:ml-auto max-[700px]:gap-2 max-[700px]:[&_.button]:px-3 max-[700px]:[&_.button]:py-2 max-[700px]:[&_.button]:text-[11px] max-[380px]:gap-1 max-[380px]:[&_.button]:px-2 max-[380px]:[&_.button]:text-[10px]">
          {signedIn
            ? <button className="button button-teal [min-height:42px] [border-radius:8px] [border:0] [padding:0_16px] [display:inline-flex] [gap:14px] [align-items:center] [justify-content:center] [font-size:12px] [font-weight:700] [cursor:pointer] [transition:transform_.16s_ease,_background_.16s_ease] hover:[transform:translateY(-1px)] disabled:[opacity:.58] disabled:[cursor:not-allowed] disabled:[transform:none] motion-reduce:transition-none motion-reduce:transform-none [color:#0F2D4A] [background:#14B8A6] hover:[background:var(--color-teal)]" onClick={onHome}>Volver a mi espacio</button>
            : <>
              <button className="public-login cursor-pointer border-0 bg-transparent p-2 text-[13px] text-white/80 transition-colors hover:text-white hover:underline hover:underline-offset-4 max-[700px]:min-h-10 max-[700px]:px-1 max-[700px]:text-[11px]" onClick={onLogin}>Iniciar sesión</button>
              <button className="button button-teal [min-height:42px] [border-radius:8px] [border:0] [padding:0_16px] [display:inline-flex] [gap:14px] [align-items:center] [justify-content:center] [font-size:12px] [font-weight:700] [cursor:pointer] [transition:transform_.16s_ease,_background_.16s_ease] hover:[transform:translateY(-1px)] disabled:[opacity:.58] disabled:[cursor:not-allowed] disabled:[transform:none] motion-reduce:transition-none motion-reduce:transform-none [color:#0F2D4A] [background:#14B8A6] hover:[background:var(--color-teal)]" onClick={onRegister}>Crear cuenta</button>
            </>}
        </div>
      </div>
    </header>
    <main className="public-main flex-1">{children}</main>
    <footer className="public-footer [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-2 [&_button]:text-[11px] [&_button]:text-subtle [&_button]:transition-colors [&_button]:hover:text-ink [&_button:hover]:underline [&_button:hover]:underline-offset-4 mx-auto flex w-full max-w-[1320px] justify-between gap-3 px-[clamp(20px,5vw,72px)] py-6 text-[11px] text-subtle max-[700px]:flex-col max-[700px]:px-4 max-[700px]:py-5 max-[700px]:text-[10px] max-[700px]:[&_button]:self-start max-[700px]:[&_button]:px-0 max-[700px]:[&_button]:text-left max-[700px]:[&_button]:text-[10px]">
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
  return <div className="public-landing mx-auto max-w-[1320px] px-[clamp(20px,5vw,72px)] pb-20 pt-8 max-[700px]:px-4 max-[700px]:pb-12 max-[700px]:pt-4">
    <section className="landing-hero grid min-h-[505px] grid-cols-[1.08fr_.92fr] overflow-hidden rounded-[28px] bg-white max-[900px]:min-h-[450px] max-[900px]:grid-cols-[1.05fr_.95fr] max-[700px]:grid-cols-1 max-[700px]:rounded-[20px]" aria-labelledby="landing-title">
      <div className="landing-copy flex flex-col items-start justify-center px-[clamp(28px,5vw,76px)] py-14 [&_h1]:mb-5 [&_h1]:mt-4 [&_h1]:max-w-[610px] [&_h1]:text-[clamp(42px,5.1vw,70px)] [&_h1]:leading-[1.02] [&_h1]:text-ink max-[700px]:px-6 max-[700px]:pb-9 max-[700px]:pt-10 max-[700px]:[&_h1]:max-w-[520px] max-[700px]:[&_h1]:text-[clamp(42px,12vw,58px)]">
        <p className="eyebrow [margin:0_0_10px] [font-size:10px] [letter-spacing:1.4px] [font-weight:700] [color:var(--color-muted)] m-0 text-[11px] font-bold tracking-[.16em] text-teal-strong">ÉTICA APLICADA A LA TECNOLOGÍA</p>
        <h1 id="landing-title" className="landing-display font-display font-normal tracking-[-.025em]">Pensar antes de decidir</h1>
        <p className="landing-lede m-0 max-w-[510px] text-[16px] leading-[1.8] text-muted max-[700px]:text-[14px] max-[700px]:leading-[1.75]">Un espacio para explorar dilemas tecnológicos, considerar sus efectos y formar una postura propia.</p>
        <div className="landing-actions mt-8 flex flex-wrap items-center gap-5 [&_.button]:min-h-12 [&_.button]:px-6 [&_.button]:text-sm [&_.button]:font-medium max-[700px]:mt-6 max-[700px]:gap-4 max-[700px]:[&_.button]:px-4 max-[700px]:[&_.button]:text-[12px]">
          <button className="button button-teal [min-height:42px] [border-radius:8px] [border:0] [padding:0_16px] [display:inline-flex] [gap:14px] [align-items:center] [justify-content:center] [font-size:12px] [font-weight:700] [cursor:pointer] [transition:transform_.16s_ease,_background_.16s_ease] hover:[transform:translateY(-1px)] disabled:[opacity:.58] disabled:[cursor:not-allowed] disabled:[transform:none] motion-reduce:transition-none motion-reduce:transform-none [color:#0F2D4A] [background:#14B8A6] hover:[background:var(--color-teal)]" onClick={onRegister}>Comenzar a explorar <span aria-hidden="true">→</span></button>
          <button className="landing-text-link inline-flex min-h-11 cursor-pointer items-center gap-2 border-0 bg-transparent p-1 text-sm font-medium text-ink underline decoration-teal-light decoration-2 underline-offset-[5px] transition-colors hover:text-teal-strong" onClick={onBrowse}>Ver actividades</button>
        </div>
        <p className="landing-signin mt-8 text-[13px] text-muted [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-1 [&_button]:font-medium [&_button]:text-ink [&_button]:underline [&_button]:decoration-teal-light [&_button]:underline-offset-4">¿Ya tienes una cuenta? <button onClick={onLogin}>Inicia sesión</button></p>
      </div>
      <div className="landing-art relative flex min-h-[505px] items-end justify-center overflow-hidden bg-ink px-6 pb-12 max-[900px]:min-h-[450px] max-[700px]:min-h-[350px] max-[700px]:rounded-b-[20px] max-[700px]:px-4 max-[700px]:pb-9">
        <div className="landing-pattern absolute inset-0 grid grid-cols-3 items-center justify-items-center gap-3 overflow-hidden opacity-90 [&_img:nth-child(odd)]:w-[clamp(86px,15vw,180px)] [&_img:nth-child(odd)]:opacity-70 [&_img:nth-child(even)]:w-[clamp(65px,11vw,130px)] [&_img:nth-child(even)]:opacity-55" aria-hidden="true">
          <img src={patternArcLarge} alt="" />
          <img src={patternArcSmall} alt="" />
          <img src={patternArcSmall} alt="" />
          <img src={patternArcLarge} alt="" />
          <img src={patternArcSmall} alt="" />
          <img src={patternArcLarge} alt="" />
        </div>
        <img className="landing-mascot relative z-[1] mb-3 h-[390px] w-auto max-w-[78%] object-contain drop-shadow-[0_18px_26px_#071c2c55] max-[900px]:h-[340px] max-[700px]:h-[285px] max-[700px]:max-w-[70%]" src={capicoreFront} alt="CapiCore, la capibara que acompaña la experiencia" />
        <span className="landing-art-caption absolute bottom-5 right-6 z-[2] max-w-[180px] text-right text-[11px] leading-relaxed text-teal-light max-[700px]:bottom-4 max-[700px]:right-4 max-[700px]:text-[10px]">Un momento para mirar con atención</span>
      </div>
    </section>

    <section className="landing-principles grid grid-cols-[.8fr_1.2fr] gap-16 border-b border-border px-[clamp(18px,3vw,40px)] py-20 max-[900px]:grid-cols-1 max-[900px]:gap-9 max-[700px]:gap-7 max-[700px]:px-1 max-[700px]:py-12" aria-labelledby="principles-title">
      <div className="landing-section-intro [&_h2]:mb-4 [&_h2]:mt-3 [&_h2]:max-w-[410px] [&_h2]:text-[clamp(32px,3.6vw,48px)] [&_h2]:leading-[1.08] [&_h2]:text-ink [&_>_p:last-child]:m-0 [&_>_p:last-child]:max-w-[440px] [&_>_p:last-child]:text-sm [&_>_p:last-child]:leading-[1.8] [&_>_p:last-child]:text-muted max-[700px]:[&_h2]:text-[36px]">
        <p className="eyebrow [margin:0_0_10px] [font-size:10px] [letter-spacing:1.4px] [font-weight:700] [color:var(--color-muted)] m-0 text-[11px] font-bold tracking-[.16em] text-teal-strong">APRENDER CON INTENCIÓN</p>
        <h2 id="principles-title" className="landing-display font-display font-normal tracking-[-.025em]">La tecnología también se decide</h2>
        <p>Las decisiones sobre tecnología afectan vidas cotidianas. Eticore convierte esas preguntas en oportunidades para reflexionar.</p>
      </div>
      <ol className="reflection-steps m-0 grid list-none grid-cols-3 gap-6 p-0 [&_li]:border-l [&_li]:border-teal-light [&_li]:pl-5 [&_li]:pt-1 [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-[15px] [&_h3]:font-semibold [&_h3]:text-ink [&_p]:m-0 [&_p]:text-[12px] [&_p]:leading-[1.7] [&_p]:text-muted max-[700px]:grid-cols-1 max-[700px]:gap-5 max-[700px]:[&_li]:grid max-[700px]:[&_li]:grid-cols-[38px_1fr] max-[700px]:[&_li]:gap-x-2 max-[700px]:[&_li]:border-l-0 max-[700px]:[&_li]:border-t max-[700px]:[&_li]:border-teal-light max-[700px]:[&_li]:px-0 max-[700px]:[&_li]:pt-4 max-[700px]:[&_h3]:mb-1 max-[700px]:[&_h3]:mt-0">
        {reflectionSteps.map((step) => <li key={step.number}>
          <span className="step-number text-xs font-bold tracking-[.1em] text-amber-strong max-[700px]:row-span-2 max-[700px]:pt-1">{step.number}</span>
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
        </li>)}
      </ol>
    </section>

    <section className="landing-content px-[clamp(18px,3vw,40px)] py-16 max-[700px]:px-0 max-[700px]:py-12" aria-labelledby="activities-title">
      <div className="landing-section-heading mb-7 flex items-end justify-between gap-6 [&_h2]:mb-0 [&_h2]:mt-3 [&_h2]:text-[clamp(30px,3vw,42px)] [&_h2]:leading-tight [&_h2]:text-ink [&_.landing-text-link]:mb-1 max-[700px]:items-start max-[700px]:gap-3 max-[700px]:[&_h2]:text-[32px] max-[700px]:[&_.landing-text-link]:mt-5 max-[700px]:[&_.landing-text-link]:text-[11px]">
        <div>
          <p className="eyebrow [margin:0_0_10px] [font-size:10px] [letter-spacing:1.4px] [font-weight:700] [color:var(--color-muted)] m-0 text-[11px] font-bold tracking-[.16em] text-teal-strong">UN PRIMER ACERCAMIENTO</p>
          <h2 id="activities-title" className="landing-display font-display font-normal tracking-[-.025em]">Explora las actividades</h2>
        </div>
        <button className="landing-text-link inline-flex min-h-11 cursor-pointer items-center gap-2 border-0 bg-transparent p-1 text-sm font-medium text-ink underline decoration-teal-light decoration-2 underline-offset-[5px] transition-colors hover:text-teal-strong" onClick={onBrowse}>Ver catálogo <span aria-hidden="true">→</span></button>
      </div>
      {error && <div className="error-banner [margin:12px_0] [padding:11px_13px] [border-radius:8px] [font-size:12px] [line-height:1.5] [color:#7b3114] [background:var(--color-amber-soft)]" role="alert">No se pudieron cargar las actividades. {error}</div>}
      {loading
        ? <p className="landing-status py-10 text-center text-sm text-muted" role="status">Cargando actividades…</p>
        : courses.length
          ? <div className="course-grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:16px] max-[700px]:[grid-template-columns:1fr]">{courses.slice(0, 3).map((course) => <CourseCard key={course.id} course={course} onOpen={() => onOpenCourse(course)} />)}</div>
          : !error && <div className="landing-empty flex items-center justify-between gap-4 rounded-2xl border border-border bg-white px-6 py-7 [&_p]:m-0 [&_p]:text-sm [&_p]:text-muted max-[700px]:items-start max-[700px]:flex-col"><p>Aún no hay actividades de muestra.</p><button className="landing-text-link inline-flex min-h-11 cursor-pointer items-center gap-2 border-0 bg-transparent p-1 text-sm font-medium text-ink underline decoration-teal-light decoration-2 underline-offset-[5px] transition-colors hover:text-teal-strong" onClick={onBrowse}>Explorar el catálogo <span aria-hidden="true">→</span></button></div>}
    </section>

    <section className="landing-join flex items-center justify-between gap-7 rounded-[24px] bg-ink px-[clamp(24px,5vw,64px)] py-10 text-white [&_.eyebrow]:text-teal-light [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-[clamp(30px,3.3vw,44px)] [&_h2]:leading-tight [&_h2]:text-white [&_p]:m-0 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-[#D5E0E7] [&_.button]:min-h-12 [&_.button]:shrink-0 [&_.button]:px-6 [&_.button]:text-sm [&_.button]:font-medium max-[700px]:items-start max-[700px]:flex-col max-[700px]:rounded-[20px] max-[700px]:px-6 max-[700px]:py-8 max-[700px]:[&_.button]:w-full max-[700px]:[&_.button]:justify-center" aria-labelledby="join-title">
      <div>
        <p className="eyebrow [margin:0_0_10px] [font-size:10px] [letter-spacing:1.4px] [font-weight:700] [color:var(--color-muted)] m-0 text-[11px] font-bold tracking-[.16em] text-teal-strong">TU SIGUIENTE PASO</p>
        <h2 id="join-title" className="landing-display font-display font-normal tracking-[-.025em]">Empieza con una pregunta</h2>
        <p>Crea una cuenta para guardar tu avance y continuar a tu ritmo.</p>
      </div>
      <button className="button button-teal [min-height:42px] [border-radius:8px] [border:0] [padding:0_16px] [display:inline-flex] [gap:14px] [align-items:center] [justify-content:center] [font-size:12px] [font-weight:700] [cursor:pointer] [transition:transform_.16s_ease,_background_.16s_ease] hover:[transform:translateY(-1px)] disabled:[opacity:.58] disabled:[cursor:not-allowed] disabled:[transform:none] motion-reduce:transition-none motion-reduce:transform-none [color:#0F2D4A] [background:#14B8A6] hover:[background:var(--color-teal)]" onClick={onRegister}>Crear cuenta <span aria-hidden="true">→</span></button>
    </section>
  </div>
}

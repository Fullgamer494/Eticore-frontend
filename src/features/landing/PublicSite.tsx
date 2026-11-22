import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CaretRightIcon } from '@phosphor-icons/react/dist/csr/CaretRight'
import { PersonSimpleCircleIcon } from '@phosphor-icons/react/dist/csr/PersonSimpleCircle'
import type { Course } from '../../shared/types/course'
import { CourseCard } from '../../shared/ui/CourseCard'
import eticoreLogo from '../../../resources/brand/eticore-logo-horizontal-inverse.svg'
import capicoreFront from '../../../resources/brand/capicore-front.svg'
import patternArcLarge from '../../../resources/brand/pattern-arc-large.svg'

type PublicSiteProps = {
  signedIn: boolean
  onHome: () => void
  onCatalog: () => void
  onLogin: () => void
  onRegister: () => void
  onPrivacy: () => void
  children: ReactNode
}

type AccessibilityPreferences = {
  largerText: boolean
  highContrast: boolean
  highlightControls: boolean
  underlineLinks: boolean
  reduceMotion: boolean
}

const accessibilityStorageKey = 'eticore-a11y-preferences'
const defaultAccessibilityPreferences: AccessibilityPreferences = {
  largerText: false,
  highContrast: false,
  highlightControls: false,
  underlineLinks: false,
  reduceMotion: false,
}

function readAccessibilityPreferences(): AccessibilityPreferences {
  try {
    if (typeof window === 'undefined') return defaultAccessibilityPreferences
    const saved = window.localStorage.getItem(accessibilityStorageKey)
    if (!saved) return defaultAccessibilityPreferences
    const parsed = JSON.parse(saved) as Partial<AccessibilityPreferences> & { largeText?: boolean }
    return {
      largerText: parsed.largerText === true || parsed.largeText === true,
      highContrast: parsed.highContrast === true,
      highlightControls: parsed.highlightControls === true,
      underlineLinks: parsed.underlineLinks === true,
      reduceMotion: parsed.reduceMotion === true,
    }
  } catch {
    return defaultAccessibilityPreferences
  }
}

export function PublicSite({ signedIn, onHome, onCatalog, onLogin, onRegister, onPrivacy, children }: PublicSiteProps) {
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [accessibility, setAccessibility] = useState<AccessibilityPreferences>(readAccessibilityPreferences)
  const accessibilityTrigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(accessibilityStorageKey, JSON.stringify(accessibility))
    } catch { /* Preferences remain active for this visit when storage is unavailable. */ }
  }, [accessibility])

  useEffect(() => {
    const root = document.documentElement
    if (accessibility.largerText) root.setAttribute('data-eticore-large-text', 'true')
    else root.removeAttribute('data-eticore-large-text')
    return () => root.removeAttribute('data-eticore-large-text')
  }, [accessibility.largerText])

  useEffect(() => {
    if (!accessibilityOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setAccessibilityOpen(false)
      accessibilityTrigger.current?.focus()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [accessibilityOpen])

  return <div className="public-site [min-height:100vh] [display:flex] [flex-direction:column] bg-paper text-ink [&_.auth-content]:px-5 [&_.auth-content]:py-[55px] [&_.auth-card]:shadow-[0_12px_36px_#0F2D4A0a] max-[700px]:[&_.auth-content]:px-[18px] max-[700px]:[&_.auth-content]:py-[30px]" data-text-scale={accessibility.largerText ? 'large' : 'standard'} data-contrast={accessibility.highContrast ? 'high' : 'standard'} data-control-highlight={accessibility.highlightControls ? 'on' : 'off'} data-underline-links={accessibility.underlineLinks ? 'on' : 'off'} data-motion={accessibility.reduceMotion ? 'reduce' : 'standard'}>
    <header className="public-header relative border-b border-white/10 bg-ink">
      <div className="public-header-inner mx-auto flex min-h-[78px] max-w-[1320px] items-center gap-9 px-[clamp(20px,5vw,72px)] py-3 max-[700px]:min-h-[65px] max-[700px]:flex-wrap max-[700px]:gap-x-4 max-[700px]:gap-y-2 max-[700px]:px-4 max-[700px]:py-3 max-[380px]:gap-x-2">
        <button className="public-wordmark flex shrink-0 cursor-pointer border-0 bg-transparent p-0 [&_img]:block [&_img]:w-[190px] max-[700px]:[&_img]:w-[155px] max-[380px]:[&_img]:w-[125px]" onClick={onHome} aria-label="Eticore, ir al inicio">
          <img src={eticoreLogo} alt="Eticore" />
        </button>
        <nav className="public-nav flex items-center gap-6 flex-1 [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-2 [&_button]:text-[13px] [&_button]:text-white/80 [&_button]:transition-colors [&_button]:hover:text-white [&_button:hover]:underline [&_button:hover]:underline-offset-4 max-[700px]:order-3 max-[700px]:flex-[1_0_100%] max-[700px]:justify-center max-[700px]:gap-5 max-[700px]:border-t max-[700px]:border-border max-[700px]:pt-2 max-[700px]:[&_button]:min-h-10 max-[700px]:[&_button]:px-1 max-[700px]:[&_button]:text-[11px]" aria-label="Navegación del sitio">
          <button onClick={onHome}>Inicio</button>
          <button onClick={onCatalog}>Actividades</button>
          <button onClick={onPrivacy}>Privacidad</button>
        </nav>
        <div className="public-actions flex items-center gap-5 max-[700px]:ml-auto max-[700px]:gap-2 max-[700px]:[&_.button]:px-3 max-[700px]:[&_.button]:py-2 max-[700px]:[&_.button]:text-[11px] max-[380px]:gap-1 max-[380px]:[&_.button]:px-2 max-[380px]:[&_.button]:text-[10px]">
          {signedIn
            ? <button className="button button-teal [min-height:42px] [border-radius:8px] [border:0] [padding:0_16px] [display:inline-flex] [gap:14px] [align-items:center] [justify-content:center] [font-size:12px] [font-weight:700] [cursor:pointer] [transition:transform_.16s_ease,_background_.16s_ease] hover:[transform:translateY(-1px)] disabled:[opacity:.58] disabled:[cursor:not-allowed] disabled:[transform:none] motion-reduce:transition-none motion-reduce:transform-none [color:#0F2D4A] [background:#14B8A6] hover:[background:var(--color-teal)]" onClick={onHome}>Volver a mi espacio</button>
            : <>
              <button className="public-login cursor-pointer border-0 bg-transparent p-2 text-[13px] text-white/80 transition-colors hover:text-white hover:underline hover:underline-offset-4 max-[700px]:min-h-10 max-[700px]:px-1 max-[700px]:text-[11px]" onClick={onLogin}>Iniciar sesión</button>
              <button className="button button-teal [min-height:42px] [border-radius:8px] [border:0] [padding:0_16px] [display:inline-flex] [gap:14px] [align-items:center] [justify-content:center] [font-size:12px] [font-weight:700] [cursor:pointer] [transition:transform_.16s_ease,_background_.16s_ease] hover:[transform:translateY(-1px)] disabled:[opacity:.58] disabled:[cursor:not-allowed] disabled:[transform:none] motion-reduce:transition-none motion-reduce:transform-none [color:#0F2D4A] [background:#14B8A6] hover:[background:var(--color-teal)]" onClick={onRegister}>Crear cuenta</button>
            </>}
        </div>
      </div>
    </header>
    <div className="fixed bottom-6 right-6 z-[100] max-[700px]:bottom-4 max-[700px]:right-4">
      <button ref={accessibilityTrigger} type="button" className="grid h-14 w-14 cursor-pointer place-items-center rounded-full border-2 border-white bg-teal text-ink shadow-[0_8px_24px_#0F2D4A35] transition-transform hover:-translate-y-1 hover:bg-teal-light focus-visible:outline-4 motion-reduce:transition-none motion-reduce:transform-none" aria-label={accessibilityOpen ? 'Cerrar ajustes de accesibilidad' : 'Abrir ajustes de accesibilidad'} title="Accesibilidad" aria-expanded={accessibilityOpen} aria-controls="public-accessibility-panel" onClick={() => setAccessibilityOpen((open) => !open)}>
        <PersonSimpleCircleIcon aria-hidden="true" size={30} weight="fill" />
      </button>
      {accessibilityOpen && <section id="public-accessibility-panel" role="dialog" aria-modal="false" aria-labelledby="public-accessibility-title" className="absolute bottom-[calc(100%_+_12px)] right-0 w-[min(360px,calc(100vw-32px))] rounded-2xl border border-border bg-white p-5 text-ink shadow-[0_16px_44px_#0F2D4A30]">
        <div className="mb-4 flex items-start justify-between gap-3"><div><h2 id="public-accessibility-title" className="mb-1 text-lg font-semibold text-ink">Ajustes de accesibilidad</h2><p className="mb-0 text-sm leading-relaxed text-muted">Se aplican a las páginas públicas y se guardan en este navegador.</p></div><button type="button" className="min-h-10 min-w-10 rounded-lg border border-border bg-white text-lg text-ink" aria-label="Cerrar ajustes de accesibilidad" onClick={() => { setAccessibilityOpen(false); accessibilityTrigger.current?.focus() }}>×</button></div>
        <div className="grid gap-1">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink"><input type="checkbox" checked={accessibility.largerText} onChange={(event) => setAccessibility((current) => ({ ...current, largerText: event.target.checked }))} className="h-6 w-6 shrink-0 accent-ink" /> Ampliar texto</label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink"><input type="checkbox" checked={accessibility.highContrast} onChange={(event) => setAccessibility((current) => ({ ...current, highContrast: event.target.checked }))} className="h-6 w-6 shrink-0 accent-ink" /> Aumentar contraste</label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink"><input type="checkbox" checked={accessibility.highlightControls} onChange={(event) => setAccessibility((current) => ({ ...current, highlightControls: event.target.checked }))} className="h-6 w-6 shrink-0 accent-ink" /> Resaltar controles</label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink"><input type="checkbox" checked={accessibility.underlineLinks} onChange={(event) => setAccessibility((current) => ({ ...current, underlineLinks: event.target.checked }))} className="h-6 w-6 shrink-0 accent-ink" /> Subrayar enlaces y acciones de navegación</label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink"><input type="checkbox" checked={accessibility.reduceMotion} onChange={(event) => setAccessibility((current) => ({ ...current, reduceMotion: event.target.checked }))} className="h-6 w-6 shrink-0 accent-ink" /> Reducir movimiento</label>
        </div>
        <button type="button" className="mt-3 min-h-10 cursor-pointer border-0 bg-transparent p-1 text-sm font-semibold text-ink underline underline-offset-4" onClick={() => setAccessibility(defaultAccessibilityPreferences)}>Restablecer ajustes</button>
      </section>}
    </div>
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
  return <div className="public-landing w-full pb-24 pt-0 max-[700px]:pb-14">
    <section className="landing-hero grid min-h-[620px] grid-cols-[1fr_.92fr] items-center gap-8 overflow-hidden bg-white pl-[clamp(30px,8vw,120px)] pr-[clamp(20px,3vw,48px)] max-[900px]:min-h-[520px] max-[900px]:pl-[clamp(28px,6vw,76px)] max-[700px]:grid-cols-1 max-[700px]:gap-0 max-[700px]:pl-0 max-[700px]:pr-0" aria-labelledby="landing-title">
      <div className="landing-copy relative z-[2] flex flex-col items-start py-16 max-[700px]:px-7 max-[700px]:pb-8 max-[700px]:pt-11">
        <p className="m-0 mb-5 text-xs font-bold tracking-[.18em] text-teal-strong">ÉTICA APLICADA A LA TECNOLOGÍA</p>
        <h1 id="landing-title" className="font-display [-webkit-text-stroke:.55px_currentColor] mb-7 max-w-[570px] text-[clamp(52px,6.3vw,84px)] font-normal leading-[1.02] tracking-[-.04em] text-ink"><span className="block">Pensar antes</span><span className="block"><span className="text-teal-strong">de decidir.</span></span></h1>
        <p className="mb-0 max-w-[470px] text-[17px] leading-[1.8] text-muted max-[700px]:text-[15px]">Explora dilemas tecnológicos, mira a quiénes afectan y construye una postura propia.</p>
        <div className="mt-9 flex flex-wrap items-center gap-5 max-[700px]:mt-7">
          <button className="button button-teal inline-flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-0 bg-teal px-7 text-sm font-bold text-ink transition-transform hover:-translate-y-1 motion-reduce:transition-none" onClick={onRegister}>Comienza a explorar <CaretRightIcon aria-hidden="true" size={16} weight="bold" /></button>
          <button className="inline-flex min-h-12 cursor-pointer items-center border-0 bg-transparent px-1 text-sm font-semibold text-ink underline decoration-teal-light decoration-2 underline-offset-8 transition-colors hover:text-teal-strong" onClick={onBrowse}>Ver actividades</button>
        </div>
        <p className="mt-8 mb-0 text-sm text-muted">¿Ya tienes cuenta? <button className="cursor-pointer border-0 bg-transparent p-1 font-semibold text-ink underline underline-offset-4" onClick={onLogin}>Inicia sesión</button></p>
      </div>
      <div className="landing-art relative flex min-h-[570px] items-end justify-center overflow-hidden bg-teal-soft px-8 pb-8 max-[900px]:min-h-[490px] max-[700px]:min-h-[390px]">
        <img className="relative z-[1] h-[490px] w-auto max-w-[82%] object-contain max-[900px]:h-[410px] max-[700px]:h-[335px]" src={capicoreFront} alt="CapiCore acompaña la experiencia de aprendizaje" />
        <span className="absolute bottom-8 right-8 text-xs font-semibold tracking-[.12em] text-teal-strong max-[700px]:bottom-5 max-[700px]:right-5">CURIOSIDAD · CRITERIO · IMPACTO</span>
      </div>
    </section>

    <section className="landing-principles grid grid-cols-[.8fr_1.2fr] gap-16 border-b border-border px-[clamp(10px,4vw,56px)] py-24 max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[700px]:gap-7 max-[700px]:px-1 max-[700px]:py-16" aria-labelledby="principles-title">
      <div>
        <p className="mb-4 text-xs font-bold tracking-[.18em] text-teal-strong">APRENDER CON INTENCIÓN</p>
        <h2 id="principles-title" className="font-display [-webkit-text-stroke:.35px_currentColor] mb-5 max-w-[440px] text-[clamp(38px,4.5vw,62px)] font-normal leading-[1.02] tracking-[-.035em] text-ink">La tecnología también se decide.</h2>
        <p className="mb-0 max-w-[440px] text-base leading-[1.8] text-muted">Las decisiones digitales tienen consecuencias reales. Aquí puedes detenerte a comprenderlas antes de elegir.</p>
      </div>
      <ol className="m-0 grid list-none grid-cols-3 gap-7 p-0 max-[700px]:grid-cols-1 max-[700px]:gap-0">
        {reflectionSteps.map((step) => <li className="border-t-2 border-teal-light pt-5 max-[700px]:py-5" key={step.number}>
          <span className="text-sm font-bold tracking-[.12em] text-amber-strong">{step.number}</span>
          <h3 className="mb-2 mt-7 text-xl font-semibold text-ink max-[700px]:mt-3">{step.title}</h3>
          <p className="mb-0 text-sm leading-[1.75] text-muted">{step.copy}</p>
        </li>)}
      </ol>
    </section>

    <section className="landing-content px-[clamp(10px,4vw,56px)] py-20 max-[700px]:px-0 max-[700px]:py-14" aria-labelledby="activities-title">
      <div className="mb-9 flex items-end justify-between gap-6 max-[700px]:items-start max-[700px]:flex-col">
        <div><p className="mb-3 text-xs font-bold tracking-[.18em] text-teal-strong">UN PRIMER ACERCAMIENTO</p><h2 id="activities-title" className="font-display [-webkit-text-stroke:.35px_currentColor] mb-0 text-[clamp(36px,4vw,54px)] font-normal leading-tight tracking-[-.035em] text-ink">Explora las actividades</h2></div>
        <button className="inline-flex min-h-11 cursor-pointer items-center gap-2 border-0 bg-transparent p-1 text-sm font-semibold text-ink underline decoration-teal-light decoration-2 underline-offset-8" onClick={onBrowse}>Ver catálogo <CaretRightIcon aria-hidden="true" size={16} weight="bold" /></button>
      </div>
      {error && <div className="my-4 rounded-xl bg-amber-soft px-5 py-4 text-sm leading-relaxed text-ink" role="alert">No se pudieron cargar las actividades. {error}</div>}
      {loading ? <p className="py-10 text-center text-base text-muted" role="status">Cargando actividades…</p>
        : courses.length ? <div className="grid grid-cols-2 gap-6 max-[700px]:grid-cols-1">{courses.slice(0, 3).map((course) => <CourseCard key={course.id} course={course} onOpen={() => onOpenCourse(course)} />)}</div>
          : !error && <div className="flex items-center justify-between gap-4 border-y border-border py-7 max-[700px]:items-start max-[700px]:flex-col"><p className="mb-0 text-base text-muted">Aún no hay actividades de muestra.</p><button className="inline-flex items-center gap-2 font-semibold text-ink underline underline-offset-4" onClick={onBrowse}>Explorar el catálogo <CaretRightIcon aria-hidden="true" size={16} weight="bold" /></button></div>}
    </section>

    <section className="landing-join relative flex items-center justify-between gap-8 overflow-hidden bg-ink px-[clamp(28px,8vw,120px)] py-14 text-white max-[700px]:items-start max-[700px]:flex-col max-[700px]:px-7 max-[700px]:py-10" aria-labelledby="join-title">
      <img className="pointer-events-none absolute -right-12 -top-24 w-[290px] opacity-25" src={patternArcLarge} alt="" aria-hidden="true" />
      <div className="relative z-[1]"><p className="mb-3 text-xs font-bold tracking-[.18em] text-teal-light">TU SIGUIENTE PASO</p><h2 id="join-title" className="font-display [-webkit-text-stroke:.35px_currentColor] mb-3 text-[clamp(36px,4vw,54px)] font-normal leading-tight tracking-[-.035em] text-white">Empieza con una pregunta</h2><p className="mb-0 text-base leading-relaxed text-white/80">Crea una cuenta para guardar tu avance y continuar a tu ritmo.</p></div>
      <button className="button button-teal relative z-[1] inline-flex min-h-14 shrink-0 cursor-pointer items-center gap-3 rounded-xl border-0 bg-teal px-7 text-sm font-bold text-ink transition-transform hover:-translate-y-1 motion-reduce:transition-none max-[700px]:w-full max-[700px]:justify-center" onClick={onRegister}>Crear cuenta <CaretRightIcon aria-hidden="true" size={16} weight="bold" /></button>
    </section>
  </div>
}

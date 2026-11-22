import { useEffect, useState } from 'react'
import type { Page } from './app/types'
import { useSession } from './features/auth/useSession'
import { PublicLanding, PublicSite } from './features/landing/PublicSite'
import { Home } from './features/dashboard/HomePage'
import { Catalog } from './features/catalog/CatalogPage'
import { useCatalog } from './features/catalog/useCatalog'
import { Learning, SamplePreview } from './features/learning/LearningPage'
import { useLearningSession } from './features/learning/useLearningSession'
import { Progress } from './features/progress/ProgressPage'
import { useLearningProgress } from './features/progress/useLearningProgress'
import { Profile } from './features/profile/ProfilePage'
import { useProfile } from './features/profile/useProfile'
import { AuthPage } from './features/auth/AuthPage'
import { LegalWorkspace, ManagementWorkspace } from './features/management/ManagementWorkspace'
import { checkApiHealth } from './features/management/api'

const pageTitles: Record<Page, string> = {
  landing: 'Eticore', home: 'Inicio', catalog: 'Explora', learning: 'Mi aprendizaje',
  progress: 'Mi progreso', profile: 'Mi perfil', auth: 'Acceso', admin: 'Administración', legal: 'Legal y privacidad',
}

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [health, setHealth] = useState<'unknown' | 'ok' | 'error'>('unknown')
  const session = useSession(setPage)
  const catalog = useCatalog(page === 'catalog' || page === 'home' || page === 'landing', Boolean(session.user))
  const progress = useLearningProgress(session.user, session.refreshUser)
  const learning = useLearningSession(session.user, setPage, progress.refresh, session.openLogin)
  const profile = useProfile(session.refreshUser)

  useEffect(() => {
    const controller = new AbortController()
    checkApiHealth(controller.signal).then(() => setHealth('ok')).catch(() => { if (!controller.signal.aborted) setHealth('error') })
    return () => controller.abort()
  }, [])

  function navigateTo(target: Page) {
    if (!session.user && target === 'home') { setPage('landing'); return }
    if (!session.user && ['learning', 'progress', 'profile', 'admin'].includes(target)) { session.openLogin(); return }
    if (target === 'admin' && !session.user?.roles.some((role) => role === 'ADMIN_TECNICO' || role === 'ADMIN_CONTENIDO')) {
      if (session.user) setPage('home')
      else session.openLogin()
      return
    }
    setPage(target)
  }

  async function logout() {
    progress.clear()
    await session.logout()
  }

  if (!session.sessionChecked) return <div className="boot-screen [min-height:100vh] [display:grid] [place-items:center] [color:var(--color-ink)] [background:var(--color-paper)]" role="status">Conectando con Eticore…</div>

  const publicSiteProps = {
    signedIn: Boolean(session.user),
    onHome: () => setPage(session.user ? 'home' : 'landing'),
    onCatalog: () => setPage('catalog'),
    onLogin: session.openLogin,
    onRegister: session.openRegistration,
    onPrivacy: () => setPage('legal'),
  }

  if (page === 'legal') return <PublicSite {...publicSiteProps}><LegalWorkspace roles={session.user?.roles ?? []} authenticated={Boolean(session.user)} /></PublicSite>
  if (page === 'auth' && !session.user) return <PublicSite {...publicSiteProps}><AuthPage mode={session.authMode} setMode={(mode) => { session.setAuthMode(mode); session.setAuthError(null); session.setAuthNotice(null) }} error={session.authError} notice={session.authNotice} busy={session.authBusy} onLogin={session.login} onRegister={session.register} onVerify={session.verify} /></PublicSite>
  if (page === 'catalog' && !session.user) return <PublicSite {...publicSiteProps}><Catalog query={catalog.query} setQuery={catalog.updateQuery} filters={catalog.filters} setFilters={catalog.updateFilters} courses={catalog.items} loading={catalog.status === 'idle'} error={catalog.error} onRetry={catalog.retry} nextCursor={catalog.cursor} loadingMore={catalog.loadingMore} onLoadMore={catalog.loadMore} routes={progress.routes} isAuthenticated={false} onOpen={learning.openCourse} /></PublicSite>
  if (page === 'learning' && learning.activeCourse && learning.samplePreview && !session.user) return <PublicSite {...publicSiteProps}><SamplePreview course={learning.activeCourse} sample={learning.samplePreview} onBack={() => setPage('catalog')} onLogin={session.openLogin} /></PublicSite>
  if (!session.user) return <PublicSite {...publicSiteProps}><PublicLanding courses={catalog.items.filter((course) => course.samplePublic).slice(0, 3)} loading={catalog.status === 'idle'} error={catalog.error} onBrowse={() => setPage('catalog')} onLogin={session.openLogin} onRegister={session.openRegistration} onOpenCourse={learning.openCourse} /></PublicSite>

  return <div className="app-shell [min-height:100vh] [display:flex] max-[700px]:[display:block] max-[700px]:[padding-bottom:68px]">
    <aside className="sidebar [width:252px] [flex:0_0_252px] [background:var(--color-surface)] [border-right:1px_solid_var(--color-border)] [display:flex] [flex-direction:column] [padding:28px_17px_18px] max-[900px]:[width:218px] max-[900px]:[flex-basis:218px] max-[700px]:[position:fixed] max-[700px]:[z-index:10] max-[700px]:[bottom:0] max-[700px]:[left:0] max-[700px]:[right:0] max-[700px]:[width:auto] max-[700px]:[height:62px] max-[700px]:[padding:5px_7px] max-[700px]:[border-right:0] max-[700px]:[border-top:1px_solid_var(--color-border)] max-[700px]:[display:block] max-[700px]:[&_>_.wordmark]:[display:none]" aria-label="Navegación principal">
      <button className="wordmark [display:block] [color:#0F2D4A] [text-decoration:none] [font-weight:700] [letter-spacing:0] [font-size:20px] [padding:0_12px_46px]" onClick={() => navigateTo('home')} aria-label="Eticore, inicio">Eticore</button>
      <div className="workspace-label [font-size:10px] [letter-spacing:1.4px] [font-weight:700] [color:var(--color-muted)] [padding:0_13px_11px] max-[700px]:[display:none]">TU ESPACIO</div>
      <nav className="nav-list [display:grid] [gap:4px] max-[700px]:[display:flex] max-[700px]:[justify-content:space-around] max-[700px]:[gap:3px] max-[700px]:[height:100%]">
        <NavButton page="home" current={page} onClick={navigateTo} icon="⌂" />
        <NavButton page="catalog" current={page} onClick={navigateTo} icon="⌕" />
        <NavButton page="learning" current={page} onClick={navigateTo} icon="▤" />
        <NavButton page="progress" current={page} onClick={navigateTo} icon="↗" />
        {session.user.roles.some((role) => role === 'ADMIN_TECNICO' || role === 'ADMIN_CONTENIDO') && <NavButton page="admin" current={page} onClick={navigateTo} icon="⚙" />}
      </nav>
      <div className="sidebar-bottom [margin-top:auto] [display:grid] [gap:10px] max-[700px]:[display:none]">
        <div className="route-card [border:1px_solid_var(--color-border)] [border-radius:11px] [padding:12px_10px] [display:flex] [align-items:center] [gap:9px] [&_div]:[display:grid] [&_div]:[gap:3px] [&_div]:[flex:1] [&_small]:[font-size:10px] [&_small]:[color:var(--color-muted)] [&_strong]:[font-size:12px]"><span className="route-dot [width:8px] [height:8px] [border-radius:50%] [background:#14B8A6]" /><div><small>RUTA ACTIVA</small><strong>{progress.progress?.ruta_nombre ?? 'Sin ruta'}</strong></div><span className="route-chevron [color:var(--color-muted)]">⌄</span></div>
        <button className="profile-link [&_>_span:nth-child(2)]:[display:grid] [&_>_span:nth-child(2)]:[gap:3px] [&_>_span:nth-child(2)]:[flex:1] [&_small]:[font-size:10px] [&_small]:[color:var(--color-muted)] [&_strong]:[font-size:12px] [border:0] [background:transparent] [display:flex] [align-items:center] [gap:10px] [padding:9px_7px] [text-align:left] [cursor:pointer]" onClick={() => navigateTo('profile')}><span className="avatar [width:34px] [height:34px] [border-radius:50%] [display:inline-grid] [place-items:center] [flex:0_0_auto] [background:var(--color-teal-soft)] [color:#0F2D4A] [font-size:11px] [font-weight:700]">{session.user.nombre_visualizacion.split(/\s+/).map((name) => name[0]).slice(0, 2).join('').toUpperCase()}</span><span><strong>{session.user.nombre_visualizacion}</strong><small>{session.user.roles[0]}</small></span><span className="route-chevron [color:var(--color-muted)]">···</span></button>
      </div>
    </aside>

    <main className="main-area [flex:1] [min-width:0]">
      <header className="topbar [height:68px] [border-bottom:1px_solid_var(--color-border)] [display:flex] [align-items:center] [justify-content:space-between] [padding:0_clamp(22px,_5vw,_70px)] [background:var(--color-surface)] max-[700px]:[height:58px] max-[700px]:[padding:0_18px]"><div className="mobile-brand [display:none] max-[700px]:[display:flex] max-[700px]:[align-items:center] max-[700px]:[gap:7px] max-[700px]:[color:#0F2D4A] max-[700px]:[font-size:16px] max-[700px]:[font-weight:800] max-[700px]:[font-weight:700]">Eticore</div><div className="breadcrumb [display:flex] [align-items:center] [gap:12px] [color:var(--color-muted)] [font-size:12px] [&_strong]:[color:#0F2D4A] [&_strong]:[font-weight:600] max-[700px]:[display:none]"><span>Mi espacio</span><span className="crumb-slash [color:var(--color-border)]">/</span><strong>{pageTitles[page]}</strong></div>
        <div className="topbar-actions [display:flex] [align-items:center] [gap:17px] max-[700px]:[gap:9px]"><div className="account-menu [position:relative]"><button className="demo-pill account-chip [color:var(--color-muted)] [border:1px_solid_var(--color-border)] [padding:7px_10px] [border-radius:30px] [font-size:10px] [display:flex] [align-items:center] [gap:7px] [&_span]:[width:6px] [&_span]:[height:6px] [&_span]:[background:#14B8A6] [&_span]:[border-radius:50%] max-[700px]:[font-size:9px] max-[700px]:[padding:6px_8px] [cursor:pointer] [font:inherit]" aria-expanded={accountMenuOpen} onClick={() => setAccountMenuOpen((open) => !open)}><span />{session.user.nombre_visualizacion}</button>
          {accountMenuOpen && <div className="account-menu-popover [position:absolute] [z-index:20] [top:calc(100%_+_8px)] [right:0] [width:170px] [display:grid] [padding:6px] [border:1px_solid_var(--color-border)] [border-radius:10px] [background:var(--color-surface)] [box-shadow:0_10px_30px_#0F2D4A20] [&_button]:[border:0] [&_button]:[border-radius:6px] [&_button]:[padding:10px] [&_button]:[background:transparent] [&_button]:[color:var(--color-ink)] [&_button]:[text-align:left] [&_button]:[font:inherit] [&_button]:[cursor:pointer] [&_button:hover]:[background:var(--color-teal-soft)]"><button onClick={() => { setAccountMenuOpen(false); navigateTo('profile') }}>Mi perfil</button><button onClick={() => { setAccountMenuOpen(false); void logout() }}>Cerrar sesión</button></div>}</div>
          <span className={`health-pill ${health} [color:var(--color-subtle)] [font-size:9px] [white-space:nowrap] [&.ok]:[color:var(--color-teal-strong)] [&.error]:[color:var(--color-amber-strong)]`} role="status" title={health === 'ok' ? 'API disponible' : health === 'error' ? 'API sin respuesta' : 'Comprobando API'}>API {health === 'ok' ? '●' : health === 'error' ? '!' : '…'}</span><button className="help-button [width:27px] [height:27px] [border:1px_solid_var(--color-border)] [background:var(--color-surface)] [color:var(--color-muted)] [border-radius:50%] [font-size:12px] [cursor:pointer]" aria-label="Ayuda">?</button></div>
      </header>
      {page === 'home' && <Home onExplore={() => setPage('catalog')} onContinue={() => setPage('catalog')} onOpenCourse={learning.openCourse} points={progress.points} progress={progress.progress} courses={catalog.items} />}
      {page === 'catalog' && <Catalog query={catalog.query} setQuery={catalog.updateQuery} filters={catalog.filters} setFilters={catalog.updateFilters} courses={catalog.items} loading={catalog.status === 'idle'} error={catalog.error} onRetry={catalog.retry} nextCursor={catalog.cursor} loadingMore={catalog.loadingMore} onLoadMore={catalog.loadMore} routes={progress.routes} isAuthenticated onOpen={learning.openCourse} />}
      {page === 'learning' && learning.activeCourse && learning.samplePreview && <SamplePreview course={learning.activeCourse} sample={learning.samplePreview} onBack={() => setPage('catalog')} onLogin={session.openLogin} />}
      {page === 'learning' && learning.activeCourse && !learning.samplePreview && <Learning key={learning.attempt?.id ?? 'opening-attempt'} course={learning.activeCourse} attempt={learning.attempt} busy={learning.busy} error={learning.error} notice={learning.notice} onSave={learning.saveStep} onRefresh={learning.refreshAttempt} onFinish={learning.finish} onBack={() => setPage('catalog')} />}
      {page === 'progress' && <Progress progress={progress.progress} points={progress.points} rank={progress.rank} badges={progress.badges} routes={progress.routes} history={progress.history} historyCursor={progress.historyCursor} historyLoading={progress.historyLoading} result={progress.result} routeError={progress.routeError} onLoadMoreHistory={progress.loadMoreHistory} onChooseRoute={progress.chooseRoute} onSwitchRoute={progress.changeRoute} onResume={learning.resumeAttempt} onViewResult={progress.viewResult} />}
      {page === 'profile' && <Profile user={session.user} routes={progress.routes} message={profile.message} onUpdate={profile.update} />}
      {page === 'admin' && <ManagementWorkspace roles={session.user.roles} />}
      <footer className="app-footer [max-width:1220px] [border-top:1px_solid_var(--color-border)] [margin:0_auto] [padding:16px_clamp(22px,_5vw,_70px)_23px] [display:flex] [justify-content:space-between] [gap:10px] [color:var(--color-subtle)] [font-size:9px] max-[700px]:[padding:13px_18px_16px] max-[700px]:[flex-direction:column] max-[700px]:[gap:4px] max-[700px]:[font-size:8px]"><span>Eticore · Aprender para decidir con intención</span><span>Contenido y progreso desde la API</span></footer>
    </main>
  </div>
}

function NavButton({ page, current, onClick, icon }: { page: Page; current: Page; onClick: (page: Page) => void; icon: string }) {
  return <button className={`nav-item ${current === page ? 'active' : ''} [appearance:none] [border:0] [background:transparent] [width:100%] [text-align:left] [color:var(--color-muted)] [padding:11px_13px] [border-radius:9px] [display:flex] [align-items:center] [gap:12px] [cursor:pointer] [font-size:14px] hover:[background:var(--color-teal-soft)] hover:[color:#0F2D4A] [&.active]:[background:var(--color-teal-soft)] [&.active]:[color:#0F2D4A] [&.active]:[font-weight:700] max-[700px]:[flex:1] max-[700px]:[justify-content:center] max-[700px]:[flex-direction:column] max-[700px]:[gap:2px] max-[700px]:[padding:4px_2px] max-[700px]:[font-size:9px] max-[700px]:[border-radius:7px]`} onClick={() => onClick(page)} aria-current={current === page ? 'page' : undefined}><span className="nav-icon [width:20px] [text-align:center] [font-size:19px] [line-height:1] max-[700px]:[font-size:17px]" aria-hidden="true">{icon}</span><span>{pageTitles[page]}</span></button>
}

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
import './styles/components.css'

const pageTitles: Record<Page, string> = {
  landing: 'Eticore', home: 'Inicio', catalog: 'Explora', learning: 'Mi aprendizaje',
  progress: 'Mi progreso', profile: 'Mi perfil', auth: 'Acceso', admin: 'Administración', legal: 'Legal y privacidad',
}

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [health, setHealth] = useState<'unknown' | 'ok' | 'error'>('unknown')
  const session = useSession(setPage)
  const catalog = useCatalog(page === 'catalog' || page === 'home' || page === 'landing')
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

  if (!session.sessionChecked) return <div className="boot-screen" role="status">Conectando con Eticore…</div>

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

  return <div className="app-shell">
    <aside className="sidebar" aria-label="Navegación principal">
      <button className="wordmark" onClick={() => navigateTo('home')} aria-label="Eticore, inicio">Eticore</button>
      <div className="workspace-label">TU ESPACIO</div>
      <nav className="nav-list">
        <NavButton page="home" current={page} onClick={navigateTo} icon="⌂" />
        <NavButton page="catalog" current={page} onClick={navigateTo} icon="⌕" />
        <NavButton page="learning" current={page} onClick={navigateTo} icon="▤" />
        <NavButton page="progress" current={page} onClick={navigateTo} icon="↗" />
        {session.user.roles.some((role) => role === 'ADMIN_TECNICO' || role === 'ADMIN_CONTENIDO') && <NavButton page="admin" current={page} onClick={navigateTo} icon="⚙" />}
      </nav>
      <div className="sidebar-bottom">
        <div className="route-card"><span className="route-dot" /><div><small>RUTA ACTIVA</small><strong>{progress.progress?.ruta_nombre ?? 'Sin ruta'}</strong></div><span className="route-chevron">⌄</span></div>
        <button className="profile-link" onClick={() => navigateTo('profile')}><span className="avatar">{session.user.nombre_visualizacion.split(/\s+/).map((name) => name[0]).slice(0, 2).join('').toUpperCase()}</span><span><strong>{session.user.nombre_visualizacion}</strong><small>{session.user.roles[0]}</small></span><span className="route-chevron">···</span></button>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="mobile-brand">Eticore</div><div className="breadcrumb"><span>Mi espacio</span><span className="crumb-slash">/</span><strong>{pageTitles[page]}</strong></div>
        <div className="topbar-actions"><div className="account-menu"><button className="demo-pill account-chip" aria-expanded={accountMenuOpen} onClick={() => setAccountMenuOpen((open) => !open)}><span />{session.user.nombre_visualizacion}</button>
          {accountMenuOpen && <div className="account-menu-popover"><button onClick={() => { setAccountMenuOpen(false); navigateTo('profile') }}>Mi perfil</button><button onClick={() => { setAccountMenuOpen(false); void logout() }}>Cerrar sesión</button></div>}</div>
          <span className={`health-pill ${health}`} role="status" title={health === 'ok' ? 'API disponible' : health === 'error' ? 'API sin respuesta' : 'Comprobando API'}>API {health === 'ok' ? '●' : health === 'error' ? '!' : '…'}</span><button className="help-button" aria-label="Ayuda">?</button></div>
      </header>
      {page === 'home' && <Home onExplore={() => setPage('catalog')} onContinue={() => setPage('catalog')} onOpenCourse={learning.openCourse} points={progress.points} progress={progress.progress} courses={catalog.items} />}
      {page === 'catalog' && <Catalog query={catalog.query} setQuery={catalog.updateQuery} filters={catalog.filters} setFilters={catalog.updateFilters} courses={catalog.items} loading={catalog.status === 'idle'} error={catalog.error} onRetry={catalog.retry} nextCursor={catalog.cursor} loadingMore={catalog.loadingMore} onLoadMore={catalog.loadMore} routes={progress.routes} isAuthenticated onOpen={learning.openCourse} />}
      {page === 'learning' && learning.activeCourse && learning.samplePreview && <SamplePreview course={learning.activeCourse} sample={learning.samplePreview} onBack={() => setPage('catalog')} onLogin={session.openLogin} />}
      {page === 'learning' && learning.activeCourse && !learning.samplePreview && <Learning key={learning.attempt?.id ?? 'opening-attempt'} course={learning.activeCourse} attempt={learning.attempt} busy={learning.busy} error={learning.error} notice={learning.notice} onSave={learning.saveStep} onRefresh={learning.refreshAttempt} onFinish={learning.finish} onBack={() => setPage('catalog')} />}
      {page === 'progress' && <Progress progress={progress.progress} points={progress.points} rank={progress.rank} badges={progress.badges} routes={progress.routes} history={progress.history} historyCursor={progress.historyCursor} historyLoading={progress.historyLoading} result={progress.result} routeError={progress.routeError} onLoadMoreHistory={progress.loadMoreHistory} onChooseRoute={progress.chooseRoute} onSwitchRoute={progress.changeRoute} onResume={learning.resumeAttempt} onViewResult={progress.viewResult} />}
      {page === 'profile' && <Profile user={session.user} routes={progress.routes} message={profile.message} onUpdate={profile.update} />}
      {page === 'admin' && <ManagementWorkspace roles={session.user.roles} />}
      <footer className="app-footer"><span>Eticore · Aprender para decidir con intención</span><span>Contenido y progreso desde la API</span></footer>
    </main>
  </div>
}

function NavButton({ page, current, onClick, icon }: { page: Page; current: Page; onClick: (page: Page) => void; icon: string }) {
  return <button className={`nav-item ${current === page ? 'active' : ''}`} onClick={() => onClick(page)} aria-current={current === page ? 'page' : undefined}><span className="nav-icon" aria-hidden="true">{icon}</span><span>{pageTitles[page]}</span></button>
}

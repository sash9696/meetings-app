import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/button.jsx'

function NavLinkButton({ to, label, active }) {
  return (
    <Link to={to} className={active ? 'btn' : 'btn btn--secondary'}>
      {label}
    </Link>
  )
}

export function AppShell({ user, onLogout, children }) {
  const location = useLocation()
  const path = location.pathname || ''
  const isAdmin = user?.role === 'admin'

  const isMeetings =
    path === '/' || path === '/meetings/new' || /^\/meetings\/[^/]+$/.test(path)
  const isDashboard = path === '/dashboard'
  const isAccount = path === '/account'
  const isUsers = path === '/users'

  return (
    <div className="app-screen">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-brand">
            <p className="topbar-title">Meeting Intelligence</p>
            <p className="topbar-email">{user?.email || ''}</p>
          </div>

          <nav className="topbar-nav" aria-label="Main">
            <NavLinkButton to="/" label="Meetings" active={isMeetings} />
            <NavLinkButton
              to="/dashboard"
              label="Dashboard"
              active={isDashboard}
            />
            {isAdmin ? (
              <NavLinkButton to="/users" label="Users" active={isUsers} />
            ) : null}
            <NavLinkButton to="/account" label="Account" active={isAccount} />
          </nav>

          <div className="topbar-nav">
            <Button type="button" variant="ghost" onClick={() => onLogout?.()}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}

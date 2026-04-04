import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'
import { AppShell } from './components/layout/AppShell.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import MeetingsPage from './pages/MeetingsPage.jsx'
import NewMeetingPage from './pages/NewMeetingPage.jsx'
import MeetingDetailPage from './pages/MeetingDetailPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import UsersPage from './pages/UsersPage.jsx'

function AdminOnly({ children }) {
  const { user } = useAuth()
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function Private({ children }) {
  const { ready, isAuthed, user, logout } = useAuth()

  if (!ready) {
    return (
      <div className="flex-center-screen">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  if (!isAuthed) return <Navigate to="/login" replace />

  return (
    <AppShell user={user} onLogout={logout}>
      {children}
    </AppShell>
  )
}

export default function App() {
  const { isAuthed, ready } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <Private>
              <MeetingsPage />
            </Private>
          }
        />
        <Route
          path="/meetings/new"
          element={
            <Private>
              <NewMeetingPage />
            </Private>
          }
        />
        <Route
          path="/meetings/:id"
          element={
            <Private>
              <MeetingDetailPage />
            </Private>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Private>
              <DashboardPage />
            </Private>
          }
        />
        <Route
          path="/account"
          element={
            <Private>
              <AccountPage />
            </Private>
          }
        />
        <Route
          path="/users"
          element={
            <Private>
              <AdminOnly>
                <UsersPage />
              </AdminOnly>
            </Private>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={ready && isAuthed ? '/' : '/login'}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

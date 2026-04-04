import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      const data = await login({ email, password })
      setUser(data.user)
      navigate('/', { replace: true })
    } catch (e2) {
      setErr(e2.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-screen app-screen--padded">
      <div className="container container--narrow">
        <h1 className="page-title">Meeting Intelligence</h1>
        <p className="page-sub">Sign in to access your meetings.</p>
        {err && <p className="error-text">{err}</p>}

        <form onSubmit={handleSubmit} className="stack mt-6">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            placeholder="Password (min 6)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            autoComplete="current-password"
          />
          <Button type="submit" disabled={busy} className="btn--block">
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/register')}
          className="btn--block mt-3"
        >
          Create account
        </Button>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import * as usersApi from '../api/users.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'

export default function AccountPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageOk, setMessageOk] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const data = await usersApi.getMe()
        if (!cancelled) setEmail(data?.user?.email || '')
      } catch {
        /* keep auth context email */
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setBusy(true)
    try {
      await usersApi.changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setMessageOk(true)
      setMessage('Password updated.')
    } catch (e2) {
      setMessageOk(false)
      setMessage(e2.message || 'Failed to update password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="page-head" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">Account</h1>
          <p className="page-sub">{email}</p>
          {user?.role === 'admin' ? (
            <span className="badge badge--admin">Admin</span>
          ) : null}
        </div>
      </div>

      <p className="muted mt-4">Change your password.</p>

      {message ? (
        <p className={messageOk ? 'success-text' : 'error-text'}>{message}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="stack mt-4 max-w-form">
        <label className="field-label">
          Current password
          <Input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <label className="field-label">
          New password
          <Input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <Button type="submit" disabled={busy} className="btn--fixed">
          {busy ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </div>
  )
}

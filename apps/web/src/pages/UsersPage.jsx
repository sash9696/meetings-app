import { useEffect, useState } from 'react'
import * as usersApi from '../api/users.js'
import { Button } from '../components/ui/button.jsx'

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return '—'
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  async function load() {
    setBusy(true)
    setErr('')
    try {
      const data = await usersApi.listUsers()
      setUsers(data.users ?? [])
    } catch (e) {
      setErr(e.message || 'Failed to load users')
      setUsers([])
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onDelete(id, email) {
    if (!window.confirm(`Remove user ${email}? Their meetings will be deleted.`)) {
      return
    }
    setDeletingId(id)
    setErr('')
    try {
      await usersApi.deleteUser(id)
      await load()
    } catch (e) {
      setErr(e.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="container container--wide">
      <div className="page-head">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-sub">Admin: manage accounts</p>
        </div>
        <Button type="button" variant="secondary" onClick={load} disabled={busy}>
          Refresh
        </Button>
      </div>

      {err ? <p className="error-text">{err}</p> : null}
      {busy ? <p className="muted">Loading…</p> : null}

      {!busy && users.length === 0 && !err ? (
        <p className="muted">No users.</p>
      ) : null}

      {!busy && users.length > 0 ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Meetings</th>
                <th>Joined</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>
                    {u.role === 'admin' ? (
                      <span className="badge badge--admin">admin</span>
                    ) : (
                      <span className="badge">user</span>
                    )}
                  </td>
                  <td>{u.meetingCount ?? 0}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    <Button
                      type="button"
                      variant="secondary"
                      className="btn--sm"
                      disabled={deletingId === u.id}
                      onClick={() => onDelete(u.id, u.email)}
                    >
                      {deletingId === u.id ? '…' : 'Remove'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

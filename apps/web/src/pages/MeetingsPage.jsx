import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listMeetings } from '../api/meetings.js'
import { useAuth } from '../auth/AuthContext.jsx'
import MeetingListItem from '../components/MeetingListItem.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card } from '../components/ui/card.jsx'

export default function MeetingsPage() {
  const { user } = useAuth()
  const [meetings, setMeetings] = useState([])
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setBusy(true)
      setErr('')
      try {
        const list = await listMeetings()
        if (!cancelled) setMeetings(list)
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Failed to load meetings')
      } finally {
        if (!cancelled) setBusy(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1 className="page-title">Meetings</h1>
          <p className="page-sub">{user?.email || ''}</p>
        </div>
        <Link to="/meetings/new" className="shrink-0">
          <Button type="button">New meeting</Button>
        </Link>
      </div>

      {err && <p className="error-text mb-4">{err}</p>}
      {busy && <p className="muted">Loading…</p>}

      {!busy && meetings.length === 0 && (
        <Card className="card--pad card--center">
          <p className="muted empty-inline">No meetings yet.</p>
          <Link to="/meetings/new" className="inline-block-mt">
            <Button type="button">Create your first meeting</Button>
          </Link>
        </Card>
      )}

      {!busy && meetings.length > 0 && (
        <Card className="card--flush">
          <ul className="list-plain">
            {meetings.map((m) => (
              <MeetingListItem key={m.id} meeting={m} />
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createMeeting } from '../api/meetings.js'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import { Textarea } from '../components/ui/textarea.jsx'

export default function NewMeetingPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [transcript, setTranscript] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      const m = await createMeeting({ title, transcript })
      navigate(`/meetings/${m.id}`, { replace: true })
    } catch (e2) {
      setErr(e2.message || 'Failed to create meeting')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <Link to="/" className="link-back">
        ← Back to meetings
      </Link>
      <h2 className="section-title">New meeting</h2>
      <p className="page-sub">Add a title and paste your transcript or notes.</p>
      {err && <p className="error-text">{err}</p>}

      <form onSubmit={handleCreate} className="stack mt-6">
        <label className="field-label">
          Title
          <Input
            placeholder="e.g. Weekly sync"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label className="field-label">
          Transcript / notes
          <Textarea
            className="textarea--tall"
            placeholder="Paste transcript or notes"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            required
            rows={14}
          />
        </label>
        <Button type="submit" disabled={busy} className="btn--fixed">
          {busy ? 'Saving…' : 'Save'}
        </Button>
      </form>
    </div>
  )
}

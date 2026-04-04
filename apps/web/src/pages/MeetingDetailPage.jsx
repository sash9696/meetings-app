import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMeeting, summarizeMeeting } from '../api/meetings.js'
import MeetingSummary from '../components/MeetingSummary.jsx'
import { Button } from '../components/ui/button.jsx'

const TERMINAL = new Set(['done', 'failed'])

export default function MeetingDetailPage() {
  const { id } = useParams()
  const [meeting, setMeeting] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  function load() {
    return getMeeting(id)
      .then((m) => {
        setMeeting(m)
        setErr('')
      })
      .catch((e) => setErr(e.message || 'Failed to load meeting'))
  }

  useEffect(() => {
    load()
  }, [id])

  useEffect(() => {
    if (!meeting || TERMINAL.has(meeting.status)) return undefined
    const t = setInterval(() => {
      load()
    }, 2000)
    return () => clearInterval(t)
  }, [meeting?.status, id])

  async function onSummarize() {
    setErr('')
    setBusy(true)
    try {
      await summarizeMeeting(id)
      await load()
    } catch (e) {
      setErr(e.message || 'Failed to start summarization')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <Link to="/" className="link-back">
        ← Back to meetings
      </Link>

      {err && !meeting && <p className="error-text mt-6">{err}</p>}

      {meeting ? (
        <>
          {err && <p className="error-text mt-4">{err}</p>}
          <h2 className="section-title">{meeting.title}</h2>
          <p className="page-sub">
            <span className="muted">Status:</span> {meeting.status}
          </p>

          <Button
            type="button"
            onClick={onSummarize}
            disabled={
              busy ||
              meeting.status === 'queued' ||
              meeting.status === 'processing'
            }
            className="mt-4"
          >
            {busy || meeting.status === 'queued' || meeting.status === 'processing'
              ? 'Summarizing…'
              : 'Generate summary'}
          </Button>

          <MeetingSummary meeting={meeting} />
        </>
      ) : (
        !err && <p className="muted mt-6">Loading…</p>
      )}
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import * as dashboardApi from '../api/dashboard.js'
import { useAuth } from '../auth/AuthContext.jsx'

function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {hint ? <div className="stat-hint">{hint}</div> : null}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setBusy(true)
      setErr('')
      try {
        const s = await dashboardApi.getDashboardStats()
        if (!cancelled) setStats(s)
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Failed to load dashboard')
      } finally {
        if (!cancelled) setBusy(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const completionPct = useMemo(() => {
    if (stats?.completionRate === undefined || stats?.completionRate === null) {
      return null
    }
    return `${Math.round(stats.completionRate * 100)}%`
  }, [stats])

  return (
    <div className="container container--wide">
      <div className="page-head" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">{user?.email || ''}</p>
        </div>
      </div>

      {err ? <p className="error-text">{err}</p> : null}

      {busy ? (
        <p className="muted mt-6">Loading stats…</p>
      ) : (
        <div className="stat-grid">
          <StatCard
            label="Total meetings"
            value={stats?.totalMeetings ?? 0}
            hint="All time for this account"
          />
          <StatCard
            label="Completion rate"
            value={completionPct ?? '—'}
            hint="done / total"
          />
          <StatCard
            label="Avg input tokens (est.)"
            value={stats?.avgInputTokensEstimate ?? 0}
            hint="from transcript length"
          />
          <StatCard
            label="Queued + processing"
            value={
              (stats?.counts?.queued ?? 0) + (stats?.counts?.processing ?? 0)
            }
            hint="in-flight jobs"
          />
          <StatCard
            label="Avg output tokens (est.)"
            value={stats?.avgOutputTokensEstimate ?? 0}
            hint="from summary length"
          />
          <StatCard
            label="Avg time (done)"
            value={`${stats?.avgProcessingSecondsDone ?? 0}s`}
            hint="created → last update"
          />
        </div>
      )}
    </div>
  )
}

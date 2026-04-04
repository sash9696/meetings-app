import { apiFetch } from './client.js'

function normMeeting(m) {
  if (!m) return null
  return {
    ...m,
    id: (m._id ?? m.id)?.toString?.() ?? m.id,
  }
}

export async function listMeetings() {
  const data = await apiFetch('/meetings')
  const raw = data.meetings ?? []
  return raw.map(normMeeting)
}

export async function getMeeting(id) {
  const data = await apiFetch(`/meetings/${id}`)
  return normMeeting(data.meeting)
}

export async function createMeeting({ title, transcript }) {
  const data = await apiFetch('/meetings', {
    method: 'POST',
    body: JSON.stringify({ title, transcript }),
  })
  return normMeeting(data.meeting)
}

export async function summarizeMeeting(id) {
  return apiFetch(`/meetings/${id}/summarize`, { method: 'POST' })
}
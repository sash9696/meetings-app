import { apiFetch } from './client.js'

export function getDashboardStats() {
  return apiFetch('/dashboard', { method: 'GET' })
}

import { apiFetch } from './client.js'

export function getMe() {
  return apiFetch('/users/me', { method: 'GET' })
}

export function changePassword({ currentPassword, newPassword }) {
  return apiFetch('/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

export function listUsers() {
  return apiFetch('/users', { method: 'GET' })
}

export function deleteUser(id) {
  return apiFetch(`/users/${id}`, { method: 'DELETE' })
}

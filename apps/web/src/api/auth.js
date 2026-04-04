import { apiFetch, setToken } from './client.js'

const USER_KEY = 'meetings_user'

export function getStoredUser() {
  try {
    const s = localStorage.getItem(USER_KEY)
    return s ? JSON.parse(s) : null
  } catch {
    return null
  }
}

function storeUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export async function register({ email, password }) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.token)
  storeUser(data.user)
  return data
}

export async function login({ email, password }) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.token)
  storeUser(data.user)
  return data
}

export async function fetchMe() {
  return apiFetch('/auth/me', { method: 'POST' })
}

export function logout() {
  setToken(null)
  storeUser(null)
}
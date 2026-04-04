import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from 'react'
  import { getToken } from '../api/client.js'
  import { getStoredUser, fetchMe, logout as doLogout } from '../api/auth.js'
  
  const AuthContext = createContext(null)
  

//   read the token _ meetings_user from localstorage -> set user quickly
  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [ready, setReady] = useState(false)
  
    useEffect(() => {
      let cancelled = false
  
      async function boot() {
        const token = getToken()
        const stored = getStoredUser()
        if (stored) setUser(stored)
  
        if (!token) {
          setReady(true)
          return
        }
  
        try {
          const data = await fetchMe()
          if (!cancelled && data?.user) setUser(data.user)
        } catch {
          /* keep stored user if /me fails */
        } finally {
          if (!cancelled) setReady(true)
        }
      }
  
      boot()
      return () => {
        cancelled = true
      }
    }, [])
  
    useEffect(() => {
      function onLogout() {
        setUser(null)
      }
      window.addEventListener('auth:logout', onLogout)
      return () => window.removeEventListener('auth:logout', onLogout)
    }, [])
  
    const value = useMemo(
      () => ({
        user,
        ready,
        isAuthed: !!getToken(),
        setUser,
        logout() {
          doLogout()
          setUser(null)
        },
      }),
      [user, ready]
    )
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  }
  
  export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth outside AuthProvider')
    return ctx
  }
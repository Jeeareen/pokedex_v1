import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { subscribeToAuthChanges, logoutUser } from '../services/authService'

interface AuthContextType {
  user: User | null
  authLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const logout = async () => {
    await logoutUser()
  }

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (authLoading) {
    return (
      <div className="auth-loading" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        <p>Initializing session...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, authLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

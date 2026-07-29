import { useState } from 'react'
import type { AuthMode } from '../../types/auth'
import { AuthModel } from './AuthModel'

export type { AuthMode }

export function useAuthViewModel() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleMode = () => {
    setMode((prev: AuthMode) => (prev === 'login' ? 'register' : 'login'))
    setError(null)
    setPassword('')
  }

  const handleSubmit = async (e?: React.FormEvent): Promise<boolean> => {
    if (e) {
      e.preventDefault()
    }

    setError(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        await AuthModel.login(email, password)
      } else {
        await AuthModel.register(email, password)
      }
      setPassword('')
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An authentication error occurred.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    error,
    clearError,
    toggleMode,
    handleSubmit,
  }
}

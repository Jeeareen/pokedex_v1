import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthViewModel } from './useAuthViewModel'

interface AuthViewProps {
  viewModel?: ReturnType<typeof useAuthViewModel>
}

function AuthView({ viewModel: propViewModel }: AuthViewProps) {
  const navigate = useNavigate()
  const defaultViewModel = useAuthViewModel()
  const {
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
  } = propViewModel || defaultViewModel

  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const isLogin = mode === 'login'

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleSubmit(e)
    if (success) {
      if (isLogin) {
        navigate('/')
      } else {
        setShowSuccessPopup(true)
      }
    }
  }

  const handleSuccessClose = () => {
    setShowSuccessPopup(false)
    navigate('/')
  }

  return (
    <div
      className="auth-view"
      style={{
        maxWidth: '400px',
        margin: '40px auto',
        padding: '24px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      {/* Center popup error message */}
      {error && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '24px 32px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              maxWidth: '350px',
              width: '90%',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#d32f2f' }}>Authentication Error</h3>
            <p style={{ margin: '16px 0', fontSize: '15px', color: '#333' }}>{error}</p>
            <button
              type="button"
              onClick={clearError}
              style={{
                padding: '8px 20px',
                backgroundColor: '#d32f2f',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Center popup confirmation message for registration */}
      {showSuccessPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '24px 32px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              maxWidth: '350px',
              width: '90%',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#4caf50' }}>Account Created!</h3>
            <p style={{ margin: '16px 0', fontSize: '15px', color: '#333' }}>
              Your account has been created successfully. Redirecting to home...
            </p>
            <button
              type="button"
              onClick={handleSuccessClose}
              style={{
                padding: '8px 20px',
                backgroundColor: '#4caf50',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {isLogin ? 'Login' : 'Create Account'}
      </h2>

      <form onSubmit={onSubmitForm}>
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="auth-email"
            style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold' }}
          >
            Email Address
          </label>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="auth-password"
            style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold' }}
          >
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#d32f2f',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
          }}
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>

      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          onClick={toggleMode}
          style={{
            background: 'none',
            border: 'none',
            color: '#1976d2',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline',
          }}
        >
          {isLogin
            ? "Don't have an account? Create one"
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  )
}

export default AuthView

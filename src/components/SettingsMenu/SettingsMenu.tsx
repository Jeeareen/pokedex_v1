import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Settings, LogOut, LogIn, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useMotion } from '../../context/MotionContext'
import { useAuth } from '../../context/AuthContext'

export const SettingsMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { reducedMotion, toggleReducedMotion } = useMotion()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    try {
      setIsOpen(false)
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Gear Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#ffd700] bg-[#0066cc] text-white hover:bg-[#0052a3] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors shadow-sm cursor-pointer flex-shrink-0"
        aria-label="Settings"
        aria-expanded={isOpen}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex items-center justify-center"
        >
          <Settings className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl z-50 p-4 origin-top-right text-slate-800"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-800">Settings</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                Preferences
              </span>
            </div>

            {/* Reduced Motion Toggle Item */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-800">
                  Accessibility: Reduce Motion
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Disables automatic rotation & animations
                </span>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={reducedMotion}
                onClick={toggleReducedMotion}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  reducedMotion ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className="sr-only">Toggle Reduce Motion</span>
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ${
                    reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Account / Auth Section */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Account
              </span>
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200/60 truncate">
                    <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{user.email || 'Logged In'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition border border-red-200/60 cursor-pointer active:scale-95"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-bold text-white bg-[#0066cc] hover:bg-[#0052a3] rounded-xl transition border border-[#ffd700] cursor-pointer shadow-sm active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Register</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SettingsMenu

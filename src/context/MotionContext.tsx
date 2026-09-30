import React, { createContext, useContext, useState, useEffect } from 'react'

interface MotionContextType {
  reducedMotion: boolean
  setReducedMotion: (value: boolean | ((prev: boolean) => boolean)) => void
  toggleReducedMotion: () => void
}

const MotionContext = createContext<MotionContextType | undefined>(undefined)

const STORAGE_KEY = 'pokedex_reduced_motion'

export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    // 1. Check local storage preference
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      return saved === 'true'
    }
    // 2. Fall back to OS prefers-reduced-motion preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })

  // Sync state changes with localStorage and DOM body class for CSS animation control
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(reducedMotion))
    } catch (e) {
      console.warn('Unable to save reduced motion setting to localStorage', e)
    }

    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion')
    } else {
      document.documentElement.classList.remove('reduced-motion')
    }
  }, [reducedMotion])

  const setReducedMotion = (value: boolean | ((prev: boolean) => boolean)) => {
    setReducedMotionState(value)
  }

  const toggleReducedMotion = () => {
    setReducedMotionState((prev) => !prev)
  }

  return (
    <MotionContext.Provider value={{ reducedMotion, setReducedMotion, toggleReducedMotion }}>
      {children}
    </MotionContext.Provider>
  )
}

export const useMotion = (): MotionContextType => {
  const context = useContext(MotionContext)
  if (!context) {
    throw new Error('useMotion must be used within a MotionProvider')
  }
  return context
}

'use client'

import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'

export type Theme = 'hell' | 'dunkel' | 'carbon' | 'glass'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dunkel')
  const [resolvedTheme, setResolvedTheme] = useState<Theme>('dunkel')
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)

    // Load theme from localStorage first, then cookie. Default stays dunkel.
    const stored = normalizeTheme(localStorage.getItem('theme') || getCookieTheme())
    setThemeState(stored)

    // Default theme is dunkel. Customer selection in localStorage wins.
    applyTheme(stored)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement
    html.dataset.theme = newTheme

    const isLight = newTheme === 'hell'
    html.classList.toggle('dark', !isLight)
    html.classList.toggle('light', isLight)
    html.style.colorScheme = isLight ? 'light' : 'dark'
    setResolvedTheme(newTheme)
  }

  const setTheme = (newTheme: Theme) => {
    const nextTheme = normalizeTheme(newTheme)
    setThemeState(nextTheme)
    localStorage.setItem('theme', nextTheme)
    document.cookie = `theme=${nextTheme}; path=/; max-age=31536000; samesite=lax`
    applyTheme(nextTheme)
  }

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Fallback for SSR/build time - return default values
    return {
      theme: 'dunkel' as const,
      resolvedTheme: 'dunkel' as const,
      setTheme: () => {},
    }
  }
  return context
}

function getCookieTheme() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)theme=(dunkel|hell|carbon|glass)(?:;|$)/)
  return match?.[1] || null
}

function normalizeTheme(value?: string | null): Theme {
  if (value === 'hell' || value === 'carbon' || value === 'glass') return value
  return 'dunkel'
}

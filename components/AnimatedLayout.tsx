'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { AnimatePresence } from 'framer-motion'
import { BottomTabBar } from './BottomTabBar'

interface AnimatedLayoutProps {
  children: ReactNode
}

export function AnimatedLayout({ children }: AnimatedLayoutProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Function to update theme based on system preference
    const updateThemeFromSystem = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const htmlElement = document.documentElement

      if (isDark) {
        htmlElement.classList.add('dark')
        setTheme('dark')
      } else {
        htmlElement.classList.remove('dark')
        setTheme('light')
      }
    }

    // Initial setup
    updateThemeFromSystem()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark')
        setTheme('dark')
      } else {
        document.documentElement.classList.remove('dark')
        setTheme('light')
      }
    }

    // Use addEventListener for better compatibility
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mounted, setTheme])

  // Prevent hydration mismatch - render nothing until mounted
  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-background overflow-hidden flex flex-col">
      {/* Main content area with responsive padding */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="mx-auto w-full h-full lg:max-w-6xl">
          <AnimatePresence initial={false}>
            {children}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  )
}

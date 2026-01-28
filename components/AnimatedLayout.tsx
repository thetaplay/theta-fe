'use client'

import { ReactNode, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BottomTabBar } from './BottomTabBar'

interface AnimatedLayoutProps {
  children: ReactNode
}

export function AnimatedLayout({ children }: AnimatedLayoutProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Force light mode always
    const htmlElement = document.documentElement
    htmlElement.classList.remove('dark')
    htmlElement.classList.add('light')
    htmlElement.style.colorScheme = 'light'
    document.body.style.backgroundColor = '#ffffff'
  }, [])

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

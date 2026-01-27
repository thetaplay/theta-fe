'use client'

import { ReactNode, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface IOSPageTransitionProps {
  children: ReactNode
}

export function IOSPageTransition({ children }: IOSPageTransitionProps) {
  const pathname = usePathname()
  const prevPathname = useRef<string | null>(null)
  const direction = useRef<'forward' | 'back' | null>(null)

  useEffect(() => {
    // Determine navigation direction
    const prev = prevPathname.current
    const current = pathname
    
    if (prev && current) {
      const prevIsEventList = prev === '/event'
      const prevIsEventDetail = /^\/event\/[^/]+$/.test(prev)
      const currentIsEventList = current === '/event'
      const currentIsEventDetail = /^\/event\/[^/]+$/.test(current)
      
      // Forward: list -> detail or detail -> detail
      if ((prevIsEventList && currentIsEventDetail) || 
          (prevIsEventDetail && currentIsEventDetail)) {
        direction.current = 'forward'
      }
      // Back: detail -> list
      else if (prevIsEventDetail && currentIsEventList) {
        direction.current = 'back'
      }
      // Other navigation
      else {
        direction.current = null
      }
    }
    
    prevPathname.current = pathname
  }, [pathname])

  // Determine animation direction based on route
  const isEventDetailPage = /^\/event\/[^/]+$/.test(pathname)
  const isEventListPage = pathname === '/event'
  const isLearnPage = pathname === '/learn'
  
  // Check if previous page was event-related
  const prevWasEventRelated = prevPathname.current && 
    (prevPathname.current === '/event' || /^\/event\/[^/]+$/.test(prevPathname.current))
  
  // Learn page: very fast transition (0.001s)
  if (isLearnPage) {
    return (
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.001,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    )
  }
  
  // Event detail page
  if (isEventDetailPage) {
    // If coming from non-event page (navbar), no transition
    if (!prevWasEventRelated) {
      return (
        <motion.div
          key={pathname}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0 }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      )
    }
    
    // Forward navigation: slide from right to left
    return (
      <motion.div
        key={pathname}
        initial={{ 
          opacity: 0, 
          x: 300,
        }}
        animate={{ 
          opacity: 1, 
          x: 0 
        }}
        exit={{ 
          opacity: 0, 
          x: direction.current === 'back' ? 300 : -300,
        }}
        transition={{
          type: 'spring',
          stiffness: 30,
          damping: 30,
          mass: 5,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    )
  }

  // Event list page
  if (isEventListPage) {
    // Event list should ALWAYS stay static (no movement)
    // Only the detail page moves on top of it
    return (
      <motion.div
        key={pathname}
        initial={{ opacity: 1, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 1, x: 0 }}
        transition={{ duration: 0 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    )
  }
  
  // Default transition for other pages
  return (
    <motion.div
      key={pathname}
      initial={{ 
        opacity: 0, 
        x: -300,
      }}
      animate={{ 
        opacity: 1, 
        x: 0 
      }}
      exit={{ 
        opacity: 0, 
        x: -300,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}

export default IOSPageTransition

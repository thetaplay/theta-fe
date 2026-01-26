'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface IOSPageTransitionProps {
  children: ReactNode
}

export function IOSPageTransition({ children }: IOSPageTransitionProps) {
  const pathname = usePathname()

  // Determine animation direction based on route depth
  const isDetailPage = pathname.includes('/event/') || pathname.includes('/[id]')
  const isNoSlideRoute = pathname.includes('/event') || pathname.includes('/learn')
  
  // No slide transition for event and learn pages - just fade in
  if (isNoSlideRoute) {
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
  
  return (
    <motion.div
      key={pathname}
      initial={{ 
        opacity: 0, 
        x: isDetailPage ? 300 : -300,
      }}
      animate={{ 
        opacity: 1, 
        x: 0 
      }}
      exit={{ 
        opacity: 0, 
        x: isDetailPage ? -300 : 300,
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

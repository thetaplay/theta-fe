'use client'

import React, { useEffect, useState } from 'react'
import { BoltFill } from '@/components/sf-symbols'

interface XPClaimToastProps {
  message: string
  xpAmount?: number
  streakCount?: number
  show: boolean
  onClose: () => void
}

export function XPClaimToast({ message, xpAmount, streakCount, show, onClose }: XPClaimToastProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="bg-gradient-to-r from-[#4CC658] to-green-400 text-white px-6 py-4 rounded-full shadow-lg flex items-center gap-3">
        <BoltFill size={24} className="text-yellow-300 flex-shrink-0" />
        <div>
          <p className="font-bold text-sm">{message}</p>
          {xpAmount && (
            <p className="text-xs opacity-90">+{xpAmount} XP{streakCount ? ` • Streak: ${streakCount}` : ''}</p>
          )}
        </div>
      </div>
    </div>
  )
}

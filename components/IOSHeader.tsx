'use client'

import React from "react"

import { ChevronLeft, Bell } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface IOSHeaderProps {
  title?: string
  subtitle?: string
  showBack?: boolean
  backHref?: string
  onBack?: () => void
  rightContent?: React.ReactNode
  centerContent?: React.ReactNode
}

export function IOSHeader({
  title,
  subtitle,
  showBack = false,
  backHref,
  onBack,
  rightContent,
  centerContent,
}: IOSHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  return (
    <div className="sticky top-0 z-40 glass border-b w-screen left-0 right-0">
      <div className="px-4 md:px-6 lg:px-8 py-3 safe-area-top w-full">
        <div className="flex items-center justify-between gap-3">
          {/* Left Section */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {showBack && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center p-2 rounded-full hover:bg-muted transition-colors shadow-sm"
              >
                <ChevronLeft size={24} strokeWidth={2} fill="currentColor" />
              </button>
            )}
            {!showBack && title && (
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-foreground truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-muted-foreground truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Center Section */}
          {centerContent && <div className="flex-1 flex justify-center">{centerContent}</div>}

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {rightContent ? (
              rightContent
            ) : (
              <button className="flex items-center justify-center p-2 rounded-full hover:bg-muted transition-colors relative shadow-sm">
                <Bell size={20} fill="currentColor" />
              </button>
            )}
          </div>
        </div>

        {/* Centered Title (for detail pages) */}
        {showBack && title && centerContent === undefined && (
          <div className="text-center mt-2">
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

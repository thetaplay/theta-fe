'use client'

import { useState, useRef } from 'react'
import { XMark, BellFill } from '@/components/sf-symbols'

interface Position {
  id: string
  title: string
  status: 'active' | 'settling' | 'settled' | 'claimed'
  maxLoss: string
  icon: string
  iconBg: string
  iconColor: string
  sfIcon?: any
}

interface SetAlertsModalProps {
  position: Position | null
  isClosing: boolean
  onClose: () => void
}

export function SetAlertsModal({ position, isClosing, onClose }: SetAlertsModalProps) {
  const [priceAlert, setPriceAlert] = useState(false)
  const [expiryAlert, setExpiryAlert] = useState(true)
  const [riskAlert, setRiskAlert] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const startY = useRef(0)
  const currentY = useRef(0)
  const velocityY = useRef(0)
  const lastTime = useRef(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  if (!position) return null

  const handleSave = () => {
    setShowSaved(true)
    setTimeout(() => {
      setShowSaved(false)
      onClose()
    }, 1500)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement
    if (contentRef.current && contentRef.current.contains(target) && contentRef.current.scrollTop > 0) {
      return
    }

    startY.current = e.touches[0].clientY
    currentY.current = e.touches[0].clientY
    lastTime.current = Date.now()
    setIsDragging(true)
    velocityY.current = 0
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const now = Date.now()
    const deltaTime = now - lastTime.current
    const newY = e.touches[0].clientY
    const deltaY = newY - currentY.current

    if (deltaTime > 0) {
      velocityY.current = deltaY / deltaTime
    }

    currentY.current = newY
    lastTime.current = now

    const diff = newY - startY.current

    if (diff > 0) {
      setDragOffset(diff)
    } else if (diff < 0) {
      setDragOffset(diff * 0.3)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)

    const shouldClose = dragOffset > 150 || (velocityY.current > 0.5 && dragOffset > 50)

    if (shouldClose) {
      onClose()
    } else {
      setDragOffset(0)
    }

    velocityY.current = 0
  }

  const backdropOpacity = isDragging ? Math.max(0, 1 - dragOffset / 400) : 1

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 z-[100] transition-opacity ${isClosing ? 'duration-300' : isDragging ? 'duration-0' : 'duration-300'
          }`}
        style={{
          opacity: isClosing ? 0 : backdropOpacity
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`fixed bottom-0 left-0 right-0 bg-card rounded-t-[2.5rem] shadow-2xl z-[101] flex flex-col max-h-[90%] overflow-hidden touch-none ${!isClosing && !isDragging && dragOffset === 0 ? 'animate-slide-up' : ''
          }`}
        style={{
          transform: isClosing ? 'translateY(100%)' : isDragging || dragOffset !== 0 ? `translateY(${Math.max(0, dragOffset)}px)` : 'translateY(0)',
          transition: isDragging ? 'none' : isClosing ? 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)' : dragOffset !== 0 ? 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)' : 'none'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1.5 bg-muted rounded-full"></div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="px-6 pb-10 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-foreground">Manage Alerts</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-muted"
            >
              <XMark size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* Position Info Card */}
          <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-2xl border border-border mb-6">
            <div className={`w-10 h-10 rounded-xl ${position.iconBg} flex items-center justify-center`}>
              {position.sfIcon && typeof position.sfIcon === 'function' ? (
                <position.sfIcon className={position.iconColor} size={20} />
              ) : (
                <span className={`material-symbols-outlined ${position.iconColor}`}>
                  {position.icon}
                </span>
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Position</p>
              <p className="text-sm font-bold text-foreground">{position.title}</p>
            </div>
          </div>

          {/* Alert Options */}
          <div className="space-y-4 mb-6">
            {/* Expiry Alert */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-foreground">Expiry reminder</h4>
                <p className="text-xs text-muted-foreground">Notify me 4 hours before this position expires.</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setExpiryAlert(!expiryAlert)
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                }}
                className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in flex-shrink-0"
              >
                <div className={`w-12 h-6 rounded-full transition-colors ${expiryAlert ? 'bg-[#4CC658]/20 border border-[#4CC658]/30' : 'bg-slate-200 border border-transparent'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${expiryAlert ? 'translate-x-6 border-2 border-[#4CC658]' : 'translate-x-0.5 border-2 border-slate-300'}`} />
                </div>
              </button>
            </div>

            <div className="h-px bg-border"></div>

            {/* Price Alert */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-foreground">Price move warning</h4>
                <p className="text-xs text-muted-foreground">Alert me if the asset price moves by more than 5%.</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setPriceAlert(!priceAlert)
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                }}
                className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in flex-shrink-0"
              >
                <div className={`w-12 h-6 rounded-full transition-colors ${priceAlert ? 'bg-[#4CC658]/20 border border-[#4CC658]/30' : 'bg-slate-200 border border-transparent'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${priceAlert ? 'translate-x-6 border-2 border-[#4CC658]' : 'translate-x-0.5 border-2 border-slate-300'}`} />
                </div>
              </button>
            </div>

            <div className="h-px bg-border"></div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="w-full bg-[#4CC658] text-white font-extrabold py-4 rounded-2xl shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2"
            >
              {showSaved ? (
                <>
                  <span className="material-symbols-outlined">check</span>
                  Saved!
                </>
              ) : (
                'Save alerts'
              )}
            </button>
          </div>

          {/* Success Notification */}
          {showSaved && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-bounce">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4CC658] flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm font-bold text-slate-900">check</span>
                </div>
                <span className="text-sm font-bold">Alerts updated</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

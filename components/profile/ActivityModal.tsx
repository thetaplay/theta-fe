'use client'

import { useState, useRef } from 'react'
import { XMark, LightbulbFill, BellFill, StarFill } from '@/components/sf-symbols'
import { useAssetPrice } from '@/hooks/useAssetPrice'
import { Bitcoin, Currency, CurrencyIcon } from 'lucide-react'
import { Ethereum } from '../sf-symbols/Ethereum'

interface Position {
  id: string
  title: string
  status: 'active' | 'settling' | 'settled' | 'claimed'
  endsIn?: string
  maxLoss: string
  icon: string
  iconBg: string
  iconColor: string
  sfIcon?: any
  // Additional fields for PnL calculation
  asset?: string
  type?: 'CALL' | 'PUT'
  strike?: number
  expiry?: number
  expiryDate?: string
  premium?: number
}

interface ActivityModalProps {
  position: Position | null
  isClosing: boolean
  onClose: () => void
  onExplain: () => void
  onSetAlerts: () => void
}

export function ActivityModal({ position, isClosing, onClose, onExplain, onSetAlerts }: ActivityModalProps) {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)
  const currentY = useRef(0)
  const velocityY = useRef(0)
  const lastTime = useRef(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  if (!position) return null

  // Fetch current oracle price for unrealized PnL
  const { price: currentPrice, isLoading: priceLoading } = useAssetPrice(position.asset || 'ETH')

  // Calculate unrealized PnL
  const calculateUnrealizedPnL = () => {
    if (!position.premium || !position.strike || !position.type || !currentPrice) {
      return { pnl: 0, pnlPercentage: 0, isProfit: false }
    }

    let intrinsicValue = 0
    if (position.type === 'CALL') {
      // Call option: profit if current price > strike
      intrinsicValue = Math.max(0, currentPrice - position.strike)
    } else {
      // Put option: profit if current price < strike
      intrinsicValue = Math.max(0, position.strike - currentPrice)
    }

    const pnl = intrinsicValue - position.premium
    const pnlPercentage = position.premium > 0 ? (pnl / position.premium) * 100 : 0

    return {
      pnl,
      pnlPercentage,
      isProfit: pnl >= 0,
      intrinsicValue
    }
  }

  const { pnl, pnlPercentage, isProfit, intrinsicValue } = calculateUnrealizedPnL()

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow drag from top area (not when scrolling content)
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

  const handleAssetIcon = (asset: string) => {
    switch (asset) {
      case 'BTC':
        return <Bitcoin />
      case 'ETH':
        return <Ethereum />
      default:
        return <Bitcoin />
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const now = Date.now()
    const deltaTime = now - lastTime.current
    const newY = e.touches[0].clientY
    const deltaY = newY - currentY.current

    // Calculate velocity
    if (deltaTime > 0) {
      velocityY.current = deltaY / deltaTime
    }

    currentY.current = newY
    lastTime.current = now

    const diff = newY - startY.current

    // Allow drag down and slight resistance when dragging up
    if (diff > 0) {
      setDragOffset(diff)
    } else if (diff < 0) {
      // Add slight resistance when dragging up
      setDragOffset(diff * 0.3)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)

    // Close if dragged down more than 150px OR velocity is high enough
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${position.iconBg}`}>
                {position.sfIcon && typeof position.sfIcon === 'function' ? (
                  <position.sfIcon className={position.iconColor} size={32} />
                ) : (
                  <span className={`material-symbols-outlined text-3xl ${position.iconColor}`}>
                    {position.icon}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-foreground">
                {position.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-muted/80 hover:bg-muted rounded-full transition-colors border border-border"
              aria-label="Close"
            >
              <XMark size={24} className="text-foreground" />
            </button>
          </div>

          {/* Settling Info */}
          {position.status === 'settling' && (
            <div className="bg-secondary-blue/10 border border-secondary-blue/20 rounded-3xl p-5 mb-6 flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                <StarFill size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-1">Expired — settling in progress</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your position has expired! The oracle is currently calculating your final payout. Check back soon to see if you won.
                </p>
              </div>
            </div>
          )}

          {/* Unrealized PnL Section (only for ACTIVE positions) */}
          {position.status === 'active' && (
            <div className={`rounded-3xl p-5 mb-6 ${isProfit ? 'bg-green-50/50 border border-green-100' : 'bg-red-50/50 border border-red-100'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-full ${isProfit ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                  <span className={`text-xl ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    {isProfit ? '↗' : '↘'}
                  </span>
                </div>
                <span className={`text-sm font-bold ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
                  Unrealized P&L
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium text-sm">Current {position.asset} Price</span>
                  <span className="text-sm font-bold text-foreground">
                    {priceLoading ? 'Loading...' : `$${currentPrice?.toFixed(2) || '0.00'}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium text-sm">Strike Price</span>
                  <span className="text-sm font-bold text-foreground">${position.strike?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium text-sm">Intrinsic Value</span>
                  <span className="text-sm font-bold text-foreground">${intrinsicValue?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium text-sm">Premium Paid</span>
                  <span className="text-sm font-bold text-foreground">-${position.premium?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-extrabold">Unrealized P&L</span>
                  <div className="text-right">
                    <span className={`text-xl font-extrabold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                      {isProfit ? '+' : ''}${pnl.toFixed(2)}
                    </span>
                    <p className={`text-[10px] font-bold uppercase tracking-tighter ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                      {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Position Details */}
          <div className="space-y-3 mb-8">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Position Details
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center p-4 bg-muted/40 rounded-2xl">
                <span className="text-sm font-medium text-muted-foreground">Max risk at entry</span>
                <span className="text-sm font-bold text-foreground">{position.maxLoss}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/40 rounded-2xl">
                <span className="text-sm font-medium text-muted-foreground">Asset protected</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 bg-border rounded-full overflow-hidden flex items-center justify-center">
                    {handleAssetIcon(position.asset || 'ETH')}
                  </span>
                  <span className="text-sm font-bold text-foreground">{position.asset}</span>
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/40 rounded-2xl">
                <span className="text-sm font-medium text-muted-foreground">Expiry Date</span>
                <span className="text-sm font-bold text-foreground">
                  {position.expiryDate
                    ? new Date(position.expiryDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {/* <div className="grid grid-cols-1 gap-3 pt-2">
            <button
              onClick={onExplain}
              className="flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl bg-slate-200 text-slate-900 font-bold shadow-[0_4px_0_0_#cbd5e1] active:shadow-none active:translate-y-[4px] transition-all hover:bg-[#4CC658]/20"
            >
              <LightbulbFill size={20} />
              <span className="text-xs font-bold">Explain this position</span>
            </button>
            <button
              onClick={onSetAlerts}
              className="flex flex-col items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-slate-200 text-slate-900 font-bold shadow-[0_4px_0_0_#cbd5e1] active:shadow-none active:translate-y-[4px] transition-all hover:bg-[#4CC658]/20"
            >
              <BellFill size={20} />
              <span className="text-xs font-bold">Set alerts</span>
            </button>
          </div> */}
        </div>
      </div>
    </>
  )
}

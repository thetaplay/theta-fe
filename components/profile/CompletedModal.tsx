'use client'

import { useState, useRef, useEffect } from 'react'
import { XMark, LightbulbFill, CheckmarkCircleFill } from '@/components/sf-symbols'
import { useRouter } from 'next/navigation'
import { useClaimPosition } from '@/hooks/useClaimPosition'
import { toast } from 'sonner'
import IOSPageTransition from '../layout/IOSPageTransition'

interface Position {
  id: string
  title: string
  status: 'active' | 'settling' | 'settled' | 'claimed'
  maxLoss: string
  icon: string
  iconBg: string
  iconColor: string
  sfIcon?: any
  finalPayout?: string
  premiumPaid?: string
  netOutcome?: string
  roi?: string
  collateral?: string
  protectionLevel?: string
  duration?: string
  settlementPrice?: string
  settledDate?: string
}

interface CompletedModalProps {
  position: Position | null
  isClosing: boolean
  onClose: () => void
  onExplain: () => void
}

export function CompletedModal({ position, isClosing, onClose, onExplain }: CompletedModalProps) {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isModalSuccess, setIsModalSuccess] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const startY = useRef(0)
  const currentY = useRef(0)
  const velocityY = useRef(0)
  const lastTime = useRef(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const { claimPosition, isPending, isSuccess } = useClaimPosition()

  if (!position) return null

  const handleClaim = async () => {
    if (!position.id || claiming || isPending) return

    try {
      setClaiming(true)
      await claimPosition(BigInt(position.id))
    } catch (error: any) {
      console.error('Claim error:', error)
      toast.error(error.message || 'Failed to claim position')
    } finally {
      setClaiming(false)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setIsModalSuccess(true)
    }
  }, [isSuccess])

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
      {isModalSuccess && (
        <IOSPageTransition>
          <div className="fixed inset-0 w-screen h-screen flex flex-col bg-slate-50 items-center justify-center z-[9999] overflow-hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

            <div className="relative w-[90%] max-w-[400px] bg-white rounded-[40px] p-8 shadow-2xl z-50 flex flex-col items-center text-center">
              {/* Confetti */}
              <div className="absolute top-0 inset-x-0 h-32 pointer-events-none overflow-hidden">
                <div className="absolute w-2 h-2 bg-blue-400 rounded-sm top-4 left-10 rotate-45"></div>
                <div className="absolute w-2 h-2 bg-yellow-400 rounded-sm top-10 left-20 -rotate-12"></div>
                <div className="absolute w-2 h-2 bg-red-400 rounded-sm top-6 right-16 rotate-12"></div>
              </div>

              {/* Icon */}
              <div className="relative mt-4 mb-6">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-6xl">🎉</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-white border-4 border-primary rounded-full flex items-center justify-center">
                  <span>👍</span>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2 mb-8">
                <h1 className="text-3xl font-black text-slate-900">Claim Success!</h1>
                <p className="text-slate-500 font-bold">You have claimed your position.</p>
              </div>

              {/* Achievement */}
              <div className="w-full bg-purple-50 border-2 border-purple-200 rounded-3xl p-4 flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    ⭐
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-purple-600 uppercase">Achievement</p>
                    <p className="text-sm font-black text-slate-900">Trade Master</p>
                  </div>
                </div>
                <span className="text-purple-600 font-black text-lg">+50 XP</span>
              </div>

              {/* Buttons */}
              <div className="w-full space-y-4">
                <button
                  onClick={() => onClose()}
                  className="w-full py-4 px-6 bg-[#4CC658] text-slate-900 font-bold rounded-2xl shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </IOSPageTransition>
      )}

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
      // onTouchStart={handleTouchStart}
      // onTouchMove={handleTouchMove}
      // onTouchEnd={handleTouchEnd}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1.5 bg-muted rounded-full"></div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="px-6 pb-12 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-foreground">{position.title}</h2>
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-600 text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border border-slate-200">
                  {position.status}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">{position.settledDate || 'Mar 24, 2024'}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <XMark size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* Final Outcome Card */}
          <div className={`bg-${position.netOutcome?.startsWith('+') ? 'green' : 'red'}-50/50 border border-${position.netOutcome?.startsWith('+') ? 'green' : 'red'}-100 rounded-[2rem] p-6 mb-8`}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-full bg-${position.netOutcome?.startsWith('+') ? 'green' : 'red'}-100 flex items-center justify-center`}>
                <CheckmarkCircleFill size={20} className={`text-${position.netOutcome?.startsWith('+') ? 'green' : 'red'}-600`} />
              </div>
              <span className={`text-sm font-bold text-${position.netOutcome?.startsWith('+') ? 'green' : 'red'}-700`}>Final Outcome</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Final Payout</span>
                <span className="text-lg font-bold text-foreground">{position.finalPayout || '$100.00 USDC'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Premium Paid</span>
                <span className="text-lg font-bold text-foreground">{position.premiumPaid || '-$10.00'}</span>
              </div>
              <div className={`h-px bg-${position.netOutcome?.startsWith('+') ? 'green' : 'red'}-200/50 my-2`}></div>
              <div className="flex justify-between items-center">
                <span className="text-foreground font-extrabold">Net Outcome</span>
                <div className="text-right">
                  <span className={`text-2xl font-extrabold ${position.netOutcome?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{position.netOutcome || '+$90.00'}</span>
                  <p className="text-xs font-bold">{position.roi || '900% ROI'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Position Summary */}
          <div className="bg-muted/40 rounded-3xl p-5 border border-border mb-6">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Position Summary</h4>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Collateral</p>
                <p className="text-sm font-bold text-foreground">{position.collateral || '$500.00 USDC'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Protection Level</p>
                <p className="text-sm font-bold text-foreground">{position.protectionLevel || '$3,200.00 ETH'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Duration</p>
                <p className="text-sm font-bold text-foreground">{position.duration || '7 Days'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Settlement Price</p>
                <p className="text-sm font-bold text-foreground">{position.settlementPrice || '$3,142.18 ETH'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {position.status === 'active' && <div className="flex flex-col gap-3">
            <button
              onClick={() => handleClaim()}
              disabled={claiming || isPending}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#4CC658] text-slate-900 text-sm font-bold shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {claiming || isPending ? 'Claiming...' : 'Claim Funds to Wallet'}
            </button>
            <button
              onClick={onExplain}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white border-2 border-border text-muted-foreground text-sm font-bold active:bg-muted/20 transition-all"
            >
              <LightbulbFill size={20} />
              Explain this outcome
            </button>
          </div>}
        </div>
      </div>
    </>
  )
}

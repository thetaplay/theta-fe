import { useState, useRef } from 'react'
import { XMark, CpuChip, Sparkles, QuestionmarkCircleFill, BrainHeadProfile, EyeFill } from '@/components/sf-symbols'
import { usePositionExplanation, type PositionDetails } from '@/hooks/usePositionExplanation'
import { useAssetPrice } from '@/hooks/useAssetPrice'
import { formatUnits } from 'viem'

interface Position {
  id: string
  title: string
  status: 'active' | 'settling' | 'settled' | 'claimed'
  maxLoss: string
  icon: string
  iconBg: string
  iconColor: string
  sfIcon?: any
  // For AI explanation
  asset?: string
  type?: 'CALL' | 'PUT'
  strike?: number
  expiry?: number
  premium?: number
  settlementPrice?: string // String format like "$3,142.18 ETH"
}

interface ExplainModalProps {
  position: Position | null
  isClosing: boolean
  onClose: () => void
}

export function ExplainModal({ position, isClosing, onClose }: ExplainModalProps) {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)
  const currentY = useRef(0)
  const velocityY = useRef(0)
  const lastTime = useRef(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  if (!position) return null

  // Fetch current oracle price for active positions
  const { price: oraclePrice } = useAssetPrice(position.asset || 'ETH')

  // Parse settlement price if available (format: "$3,142.18 ETH")
  const parsedSettlementPrice = position.settlementPrice
    ? parseFloat(position.settlementPrice.replace(/[$,]/g, '').split(' ')[0])
    : undefined

  // Use settlement price for settled positions, oracle price for active
  const currentPrice = position.status === 'settled' && parsedSettlementPrice
    ? parsedSettlementPrice
    : oraclePrice || position.strike // Fallback to strike

  // Prepare position details for AI explanation
  const positionDetails: PositionDetails | null = position.asset && position.type && position.strike && position.expiry && position.premium
    ? {
      asset: position.asset,
      type: position.type,
      strike: position.strike,
      expiry: position.expiry,
      premium: position.premium,
      status: position.status === 'active' ? 'ACTIVE' : position.status === 'settled' ? 'SETTLED' : 'CLAIMED'
    }
    : null

  // Fetch AI explanation
  const { data: explanation, isLoading: loadingExplanation } = usePositionExplanation(positionDetails)

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
          {/* Close Button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-muted"
            >
              <XMark size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* AI Avatar & Title */}
          <div className="flex flex-col items-center mt-2 mb-8">
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 border-4 border-white relative">
              <CpuChip size={44} className="text-white" />
              <div className="absolute -right-1 -top-1 bg-[#4CC658] p-1.5 rounded-full border-2 border-white shadow-sm">
                <Sparkles size={12} className="text-white" />
              </div>
            </div>
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-extrabold text-foreground">Strategy Explained</h2>
              <p className="text-sm font-bold text-indigo-600 mt-1 uppercase tracking-widest">{position.title}</p>
            </div>
          </div>

          {/* Explanation Content */}
          <div className="space-y-6 pb-6">
            {loadingExplanation ? (
              // Loading skeleton
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* What is this */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
                    <QuestionmarkCircleFill size={20} className="text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground">What is this?</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {explanation?.whatIsThis || "Think of this like an insurance policy for your crypto. If the price drops significantly, this position steps in to cover your losses."}
                    </p>
                  </div>
                </div>

                {/* Why was it chosen */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#4CC658]/10 flex-shrink-0 flex items-center justify-center">
                    <BrainHeadProfile size={20} className="text-[#4CC658]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground">Why was it chosen?</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {explanation?.whyChosen || "Market signals showed some short-term uncertainty. We selected this to help you stay in the game without worrying about sudden dips."}
                    </p>
                  </div>
                </div>

                {/* What to watch */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex-shrink-0 flex items-center justify-center">
                    <EyeFill size={20} className="text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground">What to watch?</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {explanation?.whatToWatch || "Keep an eye on the expiry timer. As it gets closer to zero, you'll want to decide if you need a new position or if the coast is clear!"}
                    </p>
                  </div>
                </div>

                {/* AI Note */}
                <div className="p-4 bg-muted/40 rounded-2xl border border-border">
                  <p className="text-xs text-muted-foreground italic text-center leading-relaxed">
                    "If market conditions change, you can review your strategy later. I'll keep you updated!"
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Close Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-4 bg-[#4CC658] text-white rounded-2xl font-bold text-lg shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

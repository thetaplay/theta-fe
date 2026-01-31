'use client'

import { useState, useEffect } from 'react'
import { CheckmarkCircleFill, BoltFill } from '@/components/sf-symbols'

interface QuestCompletionProps {
  xpGained: number
  newLevel?: number
  questTitle: string
  onClose: () => void
}

export default function QuestCompletion({
  xpGained,
  newLevel,
  questTitle,
  onClose,
}: QuestCompletionProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-3xl p-8 max-w-sm w-full text-center">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-[#4CC658] rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `bounce ${2 + Math.random()}s infinite`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Trophy Icon */}
        <div className="mb-6 relative inline-block">
          <div className="text-6xl">🏆</div>
          <div className="absolute -right-2 -top-2 bg-[#4CC658] rounded-full p-2 shadow-lg">
            <CheckmarkCircleFill size={24} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-2">AWESOME!</h2>
        <p className="text-sm text-muted-foreground mb-6">
          You completed: <strong>{questTitle}</strong>
        </p>

        {/* XP Gained */}
        <div className="bg-[#4CC658]/10 border border-[#4CC658] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BoltFill size={20} className="text-[#4CC658]" />
            <span className="text-sm font-semibold text-muted-foreground">
              Experience Gained
            </span>
          </div>
          <div className="text-4xl font-extrabold text-[#4CC658]">+{xpGained}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Keep the streak going!
          </p>
        </div>

        {/* Level Up */}
        {newLevel && (
          <div className="bg-indigo-100 rounded-2xl p-4 mb-6 border border-indigo-200">
            <p className="text-xs font-semibold text-indigo-600 mb-1">
              LEVEL UP!
            </p>
            <div className="text-3xl font-bold text-indigo-700">
              Level {newLevel}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#4CC658] shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] text-white font-bold py-4 rounded-2xl transition-all"
        >
          Continue
        </button>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { XMark, ArrowtriangleUpFill, ArrowtriangleDownFill, Award } from '@/components/sf-symbols'

interface ActivityData {
  id: number
  type: 'win' | 'loss' | 'achievement'
  title: string
  description: string
  time: string
  amount?: string
  details?: {
    asset?: string
    prediction?: string
    odds?: string
    outcome?: string
  }
}

interface ActivityModalProps {
  isOpen: boolean
  onClose: () => void
  activity: ActivityData | null
}

export function ActivityModal({
  isOpen,
  onClose,
  activity,
}: ActivityModalProps) {
  if (!activity) return null

  const getTypeStyles = (type: ActivityData['type']) => {
    switch (type) {
      case 'win':
        return 'bg-[#4CC658]/20 text-[#4CC658]'
      case 'loss':
        return 'bg-red-100 text-red-700'
      case 'achievement':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-slate-100'
    }
  }

  const getTypeLabel = (type: ActivityData['type']) => {
    switch (type) {
      case 'win':
        return 'ITM (In The Money)'
      case 'loss':
        return 'OTM (Out of Money)'
      case 'achievement':
        return 'Milestone'
      default:
        return type
    }
  }

  const getTypeIcon = (type: ActivityData['type']) => {
    switch (type) {
      case 'win':
        return <ArrowtriangleUpFill className="w-6 h-6" />
      case 'loss':
        return <ArrowtriangleDownFill className="w-6 h-6" />
      case 'achievement':
        return <Award className="w-6 h-6" />
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-[40px] z-50 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-muted rounded-full" />
            </div>

            {/* Content */}
            <div className="px-6 pb-8 pt-2">
              {/* Close Button & Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-extrabold text-foreground mb-2">
                    {activity.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors flex-shrink-0"
                >
                  <XMark size={20} />
                </button>
              </div>

              {/* Type Badge & Amount */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${getTypeStyles(activity.type)}`}>
                  {getTypeIcon(activity.type)}
                  <span className="text-sm font-bold">{getTypeLabel(activity.type)}</span>
                </div>
                {activity.amount && (
                  <span className={`text-2xl font-extrabold ${
                    activity.type === 'win' ? 'text-[#4CC658]' : 'text-red-600'
                  }`}>
                    {activity.amount}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">
                  Overview
                </h3>
                <p className="text-base text-foreground">
                  {activity.description}
                </p>
              </div>

              {/* Details */}
              {activity.details && (
                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                    Contract Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {activity.details.asset && (
                      <div className="bg-muted rounded-2xl p-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Asset</p>
                        <p className="text-sm font-bold text-foreground">{activity.details.asset}</p>
                      </div>
                    )}
                    {activity.details.prediction && (
                      <div className="bg-muted rounded-2xl p-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Prediction</p>
                        <p className="text-sm font-bold text-foreground">{activity.details.prediction}</p>
                      </div>
                    )}
                    {activity.details.odds && (
                      <div className="bg-muted rounded-2xl p-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Odds</p>
                        <p className="text-sm font-bold text-foreground">{activity.details.odds}</p>
                      </div>
                    )}
                    {activity.details.outcome && (
                      <div className="bg-muted rounded-2xl p-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Outcome</p>
                        <p className="text-sm font-bold text-foreground">{activity.details.outcome}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-[#4CC658] text-white shadow-lg shadow-[#4CC658]/50 hover:shadow-xl active:scale-95 transition-all">
                View Full Details
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


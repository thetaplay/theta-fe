'use client'

import { IOSHeader } from '@/components/IOSHeader'
import { useState } from 'react'
import { Calendar, BellFill, ArrowtriangleDownFill, ArrowtriangleUpFill, StarFill, Shield, ChartLineUptrendXyaxis, WaterDrop, XMark } from '@/components/sf-symbols'

import { ReactNode } from 'react'

interface Position {
  id: string
  title: string
  status: 'active' | 'settling' | 'settled'
  endsIn?: string
  maxLoss: string
  icon: string
  iconBg: string
  iconColor: string
  sfIcon?: ReactNode | typeof StarFill
  expiredDate?: string
  asset?: string
  expiryDate?: string
  finalPayout?: string
  premiumPaid?: string
  netOutcome?: string
  roi?: string
  collateral?: string
  protectionLevel?: string
  duration?: string
  settlementPrice?: string
}

const positions: Position[] = [
  {
    id: '1',
    title: 'Downside Protection',
    status: 'active',
    endsIn: '2d 4h',
    maxLoss: '$45.00',
    icon: 'shield',
    iconBg: 'bg-secondary-blue/30 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    sfIcon: Shield,
  },
  {
    id: '2',
    title: 'Growth Engine',
    status: 'active',
    endsIn: '5d 12h',
    maxLoss: '$120.00',
    icon: 'trending_up',
    iconBg: 'bg-secondary-purple/30 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    sfIcon: ChartLineUptrendXyaxis,
  },
  {
    id: '3',
    title: 'Yield Harvest',
    status: 'active',
    endsIn: '12h 15m',
    maxLoss: '$0.00 (Protected)',
    icon: 'water_drop',
    iconBg: 'bg-primary/10 dark:bg-primary/20',
    iconColor: 'text-primary-dark dark:text-primary',
    sfIcon: WaterDrop,
  },
]

export function ProfileClient() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'running' | 'end'>('all')
  const [isClosing, setIsClosing] = useState(false)

  const handleCloseModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setSelectedPosition(null)
      setIsClosing(false)
    }, 300)
  }

  const filteredPositions = positions.filter((position) => {
    if (activeTab === 'running') return position.status === 'active'
    if (activeTab === 'end') return position.status === 'settled' || position.status === 'settling'
    return true
  })

  const getStatusBadge = (status: Position['status']) => {
    if (status === 'active') {
      return (
        <span className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Active
        </span>
      )
    }
    if (status === 'settling') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-800/50">
          <span className="material-symbols-outlined text-sm font-bold">hourglass_empty</span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Settling</span>
        </div>
      )
    }
    return (
      <span className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
        Settled
      </span>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <IOSHeader
        title="Active Positions"
      />

      {/* Filter Tabs */}
      <div className="px-4 md:px-6 lg:px-8 pt-20 md:pt-24 lg:pt-24 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              activeTab === 'all'
                ? 'bg-green-500 text-white shadow-md shadow-green-500/50'
                : 'bg-muted text-foreground border border-border'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('running')}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              activeTab === 'running'
                ? 'bg-green-500 text-white shadow-md shadow-green-500/50'
                : 'bg-muted text-foreground border border-border'
            }`}
          >
            Running
          </button>
          <button
            onClick={() => setActiveTab('end')}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              activeTab === 'end'
                ? 'bg-green-500 text-white shadow-md shadow-green-500/50'
                : 'bg-muted text-foreground border border-border'
            }`}
          >
            End
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 md:px-6 lg:px-8 space-y-4">
        {filteredPositions.map((position) => (
          <div
            key={position.id}
            onClick={() => setSelectedPosition(position)}
            className="bg-card border border-border rounded-3xl p-5 shadow-card hover:shadow-xl transition-all duration-200 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">{position.title}</h3>
                </div>
                {position.endsIn && (
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                    <Calendar size={14} />
                    <span>Ends in {position.endsIn}</span>
                  </div>
                )}
              </div>
              <div className={`p-2 rounded-2xl ${position.iconBg}`}>
                {position.sfIcon && typeof position.sfIcon === 'function' ? (
                  <position.sfIcon className={position.iconColor} size={20} />
                ) : (
                  <span className={`material-symbols-outlined ${position.iconColor}`}>
                    {position.icon}
                  </span>
                )}
              </div>
            </div>

            <div className="py-3 px-4 bg-muted/50 rounded-2xl mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">Max loss</span>
                <span className="text-sm font-bold text-foreground">{position.maxLoss}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-muted text-muted-foreground text-xs font-bold border-b-4 border-border active:border-b-0 active:translate-y-[2px] transition-all"
              >
                <StarFill size={14} />
                Explain
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-muted text-muted-foreground text-xs font-bold border-b-4 border-border active:border-b-0 active:translate-y-[2px] transition-all"
              >
                <BellFill size={14} />
                Set alerts
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail */}
      {selectedPosition && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/60 z-[100]"
            onClick={handleCloseModal}
          />

          {/* Modal */}
          <div className={`fixed bottom-0 left-0 right-0 bg-card rounded-t-[2.5rem] shadow-2xl z-[101] flex flex-col max-h-[90%] overflow-hidden transition-transform duration-300 ${
            isClosing ? 'translate-y-full' : 'translate-y-0'
          }`}>
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1.5 bg-muted rounded-full"></div>
            </div>

            {/* Content */}
            <div className="px-6 pb-10 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${selectedPosition.iconBg}`}>
                    {selectedPosition.sfIcon && typeof selectedPosition.sfIcon === 'function' ? (
                      <selectedPosition.sfIcon className={selectedPosition.iconColor} size={32} />
                    ) : (
                      <span className={`material-symbols-outlined text-3xl ${selectedPosition.iconColor}`}>
                        {selectedPosition.icon}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-extrabold text-foreground">
                    {selectedPosition.title}
                  </h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2.5 bg-muted/80 hover:bg-muted rounded-full transition-colors border border-border"
                  aria-label="Close"
                >
                  <XMark size={24} className="text-foreground" />
                </button>
              </div>

              {/* Settling Info */}
              {selectedPosition.status === 'settling' && (
                <div className="bg-secondary-blue/10 border border-secondary-blue/20 rounded-3xl p-5 mb-6 flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                    <StarFill size={20} className="text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Expired — settling in progress</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This position has expired. Final payout will appear once settlement is complete. This usually takes just a few minutes.
                    </p>
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
                    <span className="text-sm font-bold text-foreground">{selectedPosition.maxLoss}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted/40 rounded-2xl">
                    <span className="text-sm font-medium text-muted-foreground">Asset protected</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-5 h-5 bg-border rounded-full overflow-hidden flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs">currency_bitcoin</span>
                      </span>
                      <span className="text-sm font-bold text-foreground">WBTC</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted/40 rounded-2xl">
                    <span className="text-sm font-medium text-muted-foreground">Expiry Date</span>
                    <span className="text-sm font-bold text-foreground">Oct 24, 2023</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                <button className="flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl bg-muted text-foreground border-b-4 border-border active:border-b-0 active:translate-y-[2px] transition-all">
                  <StarFill size={20} />
                  <span className="text-xs font-bold">Explain this position</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl bg-muted text-foreground border-b-4 border-border active:border-b-0 active:translate-y-[2px] transition-all">
                  <BellFill size={20} />
                  <span className="text-xs font-bold">Set alerts</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
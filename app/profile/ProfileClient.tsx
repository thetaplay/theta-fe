'use client'

import { IOSHeader } from '@/components/IOSHeader'
import { useState } from 'react'
import { Calendar, BellFill, ArrowtriangleDownFill, ArrowtriangleUpFill, LightbulbFill, Shield, ChartLineUptrendXyaxis, WaterDrop, XMark } from '@/components/sf-symbols'

import { ReactNode } from 'react'
import { ActivityModal } from './ActivityModal'
import { ExplainModal } from './ExplainModal'
import { SetAlertsModal } from './SetAlertsModal'
import { CompletedModal } from './CompletedModal'

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
  settledDate?: string
}

const positions: Position[] = [
  {
    id: '1',
    title: 'Fed Rate Decision',
    status: 'active',
    endsIn: '2d 4h',
    maxLoss: '$45.00',
    icon: 'shield',
    iconBg: 'bg-secondary-blue/30',
    iconColor: 'text-blue-600',
    sfIcon: Shield,
  },
  {
    id: '2',
    title: 'NVIDIA Q1 Earnings',
    status: 'active',
    endsIn: '5d 12h',
    maxLoss: '$120.00',
    icon: 'trending_up',
    iconBg: 'bg-secondary-purple/30',
    iconColor: 'text-purple-600',
    sfIcon: ChartLineUptrendXyaxis,
  },
  {
    id: '3',
    title: 'BTC Halving Event',
    status: 'active',
    endsIn: '12h 15m',
    maxLoss: '$0.00 (Protected)',
    icon: 'water_drop',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary-dark',
    sfIcon: WaterDrop,
  },
  {
    id: '4',
    title: 'CPI Data Release',
    status: 'settled',
    maxLoss: '$10.00',
    icon: 'shield',
    iconBg: 'bg-secondary-blue/30',
    iconColor: 'text-blue-600',
    sfIcon: Shield,
    settledDate: 'Mar 24, 2024',
    finalPayout: '$100.00 USDC',
    premiumPaid: '-$10.00',
    netOutcome: '+$90.00',
    roi: '900% ROI',
    collateral: '$500.00 USDC',
    protectionLevel: '$3,200.00 ETH',
    duration: '7 Days',
    settlementPrice: '$3,142.18 ETH',
  },
]

export function ProfileClient() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  const [isClosing, setIsClosing] = useState(false)
  const [activeModal, setActiveModal] = useState<'activity' | 'explain' | 'alerts' | null>(null)

  const handleCloseModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setSelectedPosition(null)
      setActiveModal(null)
      setIsClosing(false)
    }, 300)
  }

  const handleOpenExplain = () => {
    setActiveModal('explain')
    setIsClosing(false)
  }

  const handleOpenAlerts = () => {
    setActiveModal('alerts')
    setIsClosing(false)
  }

  const filteredPositions = positions.filter((position) => {
    if (activeTab === 'active') return position.status === 'active'
    if (activeTab === 'completed') return position.status === 'settled' || position.status === 'settling'
    return true
  })

  const getStatusBadge = (status: Position['status']) => {
    if (status === 'active') {
      return (
        <span className="bg-[#4CC658]/20 text-[#4CC658] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Active
        </span>
      )
    }
    if (status === 'settling') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
          <span className="material-symbols-outlined text-sm font-bold">hourglass_empty</span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Settling</span>
        </div>
      )
    }
    return (
      <span className="bg-slate-100 text-slate-600 text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border border-slate-200">
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
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
              activeTab === 'active'
                ? 'bg-[#4CC658] text-slate-900 shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px]'
                : 'bg-muted text-foreground border border-border'
            }`}
          >
            Active Positions
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
              activeTab === 'completed'
                ? 'bg-[#4CC658] text-slate-900 shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px]'
                : 'bg-muted text-foreground border border-border'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 md:px-6 lg:px-8 space-y-4">
        {filteredPositions.map((position) => (
          <div
            key={position.id}
            onClick={() => {
              setSelectedPosition(position)
              setActiveModal('activity')
            }}
            className="bg-gradient-to-br from-card to-muted/20 border border-border rounded-3xl p-5 shadow-[0_4px_0_0_#cbd5e1] hover:shadow-xl transition-all duration-200 cursor-pointer"
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

            <div className="py-3 px-4 bg-gradient-to-br from-muted/50 to-muted/20 rounded-2xl mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">Max loss</span>
                <span className="text-sm font-bold text-foreground">{position.maxLoss}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedPosition(position)
                  setActiveModal('explain')
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-200 text-slate-900 text-xs font-bold shadow-[0_4px_0_0_#cbd5e1] active:shadow-none active:translate-y-[4px] transition-all"
              >
                <LightbulbFill size={14} />
                Explain
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedPosition(position)
                  setActiveModal('alerts')
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-slate-200 text-slate-900 text-xs font-bold shadow-[0_4px_0_0_#cbd5e1] active:shadow-none active:translate-y-[4px] transition-all"
              >
                <BellFill size={14} />
                Set alerts
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {activeModal === 'activity' && selectedPosition?.status !== 'settled' && (
        <ActivityModal
          position={selectedPosition}
          isClosing={isClosing}
          onClose={handleCloseModal}
          onExplain={handleOpenExplain}
          onSetAlerts={handleOpenAlerts}
        />
      )}

      {activeModal === 'activity' && selectedPosition?.status === 'settled' && (
        <CompletedModal
          position={selectedPosition}
          isClosing={isClosing}
          onClose={handleCloseModal}
          onExplain={handleOpenExplain}
        />
      )}

      {activeModal === 'explain' && (
        <ExplainModal
          position={selectedPosition}
          isClosing={isClosing}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'alerts' && (
        <SetAlertsModal
          position={selectedPosition}
          isClosing={isClosing}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
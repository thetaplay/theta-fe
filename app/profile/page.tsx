'use client'

import { useUserPositions } from '@/hooks/useUserPositions'
import { usePosition } from '@/hooks/usePosition'
import { useAccount } from 'wagmi'
import { useEffect, useState, ReactNode, useMemo } from 'react'
import {
  Calendar,
  BellFill,
  LightbulbFill,
  Shield,
  ChartLineUptrendXyaxis,
  ExclamationmarkCircle,
} from '@/components/sf-symbols'
import { formatUnits } from 'viem'

import { ActivityModal } from '@/components/profile/ActivityModal'
import { ExplainModal } from '@/components/profile/ExplainModal'
import { SetAlertsModal } from '@/components/profile/SetAlertsModal'
import { CompletedModal } from '@/components/profile/CompletedModal'
import { PageLayout } from '@/components/layout/PageLayout'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PositionStatus } from '@/lib/settlement/keeper'

interface Position {
  id: string
  title: string
  status: 'active' | 'settling' | 'settled' | 'claimed'
  endsIn?: string
  maxLoss: string
  icon: string
  iconBg: string
  iconColor: string
  sfIcon?: ReactNode | typeof Shield
  expiredDate?: string
  asset?: string
  type?: 'CALL' | 'PUT'
  strike?: number
  expiry?: number
  expiryDate?: string
  premium?: number
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

type UITab = 'ACTIVE' | 'COMPLETED'

const tabs: Array<{ key: UITab; label: string }> = [
  { key: 'ACTIVE', label: 'Active Positions' },
  { key: 'COMPLETED', label: 'Completed' },
]

// Helper function to calculate duration
function calculateDuration(createdAt: number, expiry: number): string {
  const durationSeconds = expiry - createdAt
  const days = Math.floor(durationSeconds / (24 * 60 * 60))
  const hours = Math.floor((durationSeconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((durationSeconds % (60 * 60)) / 60)
  const seconds = Math.floor(durationSeconds % 60)

  if (days > 0) return `${days} Day${days !== 1 ? 's' : ''}`
  if (hours > 0) return `${hours} Hour${hours !== 1 ? 's' : ''}`
  if (minutes > 0) return `${minutes} Minute${minutes !== 1 ? 's' : ''}`
  return `${seconds} Second${seconds !== 1 ? 's' : ''}`
}

// Helper function to calculate time remaining
function calculateTimeRemaining(expiryDate: Date): string {
  const now = new Date()
  const diff = expiryDate.getTime() - now.getTime()

  if (diff <= 0) return '0h'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`

  return `${seconds}s`
}

/**
 * Component to fetch and display a single position
 * NOTE: This still fetches per-card (usePosition).
 * Tabs only decide whether a card should render:
 * - ACTIVE tab => only ACTIVE
 * - COMPLETED tab => everything except ACTIVE (SETTLING/SETTLED/CLAIMED/etc)
 */
function PositionCard({
  positionId,
  tab,
}: {
  positionId: bigint
  tab: UITab
}) {
  const {
    position,
    isLoading,
    premiumPaidUSDC,
    payoutUSDC,
    strikePrice,
    expiryDate,
    isExpired,
    statusText,
    statusPosition,
  } = usePosition(positionId)

  if (isLoading || !position) {
    return (
      <div className="bg-gradient-to-br from-card to-muted/20 border border-border rounded-3xl p-5 animate-pulse">
        <div className="h-20 bg-gray-200 rounded" />
      </div>
    )
  }

  const shouldRender =
    tab === 'ACTIVE'
      ? statusPosition === PositionStatus.ACTIVE
      : statusPosition !== PositionStatus.ACTIVE

  if (!shouldRender) return null

  // Map blockchain position to UI Position interface
  const uiPosition: Position = {
    id: positionId.toString(),
    title: `${position.underlyingAsset} ${position.isCall ? 'CALL' : 'PUT'}`,
    status:
      statusText === 'ACTIVE'
        ? 'active'
        : statusText === 'CLAIMED'
          ? 'claimed'
          : statusText === 'SETTLED'
            ? 'settled'
            : 'settled',
    endsIn: !isExpired ? calculateTimeRemaining(expiryDate) : undefined,
    maxLoss: `$${premiumPaidUSDC.toFixed(2)}`,
    icon: position.isCall ? 'trending_up' : 'shield',
    iconBg: position.isCall ? 'bg-secondary-purple/30' : 'bg-secondary-blue/30',
    iconColor: position.isCall ? 'text-purple-600' : 'text-blue-600',
    sfIcon: position.isCall ? ChartLineUptrendXyaxis : Shield,
    asset: position.underlyingAsset,
    type: position.isCall ? 'CALL' : 'PUT',
    strike: strikePrice,
    expiry: Number(position.expiry),
    expiryDate: expiryDate.toLocaleDateString(),
    premium: premiumPaidUSDC,

    // PnL data for settled positions
    ...(statusText !== 'ACTIVE' && {
      finalPayout: `$${payoutUSDC.toFixed(2)} USDC`,
      premiumPaid: `-$${premiumPaidUSDC.toFixed(2)}`,
      netOutcome:
        payoutUSDC - premiumPaidUSDC >= 0
          ? `+$${(payoutUSDC - premiumPaidUSDC).toFixed(2)}`
          : `-$${Math.abs(payoutUSDC - premiumPaidUSDC).toFixed(2)}`,
      roi:
        premiumPaidUSDC > 0
          ? `${(((payoutUSDC - premiumPaidUSDC) / premiumPaidUSDC) * 100).toFixed(0)}% ROI`
          : '0% ROI',
      collateral: `$${premiumPaidUSDC.toFixed(2)} USDC`,
      protectionLevel: `$${strikePrice.toFixed(2)} ${position.underlyingAsset}`,
      duration: calculateDuration(Number(position.createdAt), Number(position.expiry)),
      settlementPrice: position.settlementPrice
        ? `$${Number(formatUnits(position.settlementPrice, 18)).toFixed(2)} ${position.underlyingAsset}`
        : 'Pending',
      settledDate: expiryDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }),
  }

  return <PositionCardUI position={uiPosition} />
}

// UI Component (separated for clarity)
function PositionCardUI({ position }: { position: Position }) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [activeModal, setActiveModal] = useState<'activity' | 'explain' | 'alerts' | null>(null)
  const [isClosing, setIsClosing] = useState(false)

  const handleCloseModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setSelectedPosition(null)
      setActiveModal(null)
      setIsClosing(false)
    }, 300)
  }

  return (
    <>
      <div
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
              <Badge
                className={cn(
                  'capitalize',
                  position.status === 'active'
                    ? 'bg-green-100 text-green-600'
                    : position.status === 'settled'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                )}
              >
                {position.status}
              </Badge>
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

        <div className="py-3 px-4 bg-muted-foreground/5 rounded-2xl mb-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground">Max loss</span>
            <span className="text-sm font-bold text-foreground">{position.maxLoss}</span>
          </div>
        </div>

        {position.status !== 'active' && <div className="py-3 px-4 bg-muted-foreground/5 rounded-2xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground">PnL</span>
            <span className={cn("text-sm font-bold", position?.netOutcome?.startsWith("+") ? "text-green-500" : "text-red-500")}>{position.netOutcome}</span>
          </div>
        </div>}

        {position.status === 'active' && <div className="grid grid-cols-2 gap-3">
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
        </div>}
      </div>

      {/* Modals */}
      {activeModal === 'activity' && selectedPosition?.status === 'active' && (
        <ActivityModal
          position={selectedPosition}
          isClosing={isClosing}
          onClose={handleCloseModal}
          onExplain={() => setActiveModal('explain')}
          onSetAlerts={() => setActiveModal('alerts')}
        />
      )}

      {activeModal === 'activity' &&
        (selectedPosition?.status === 'settled' || selectedPosition?.status === 'claimed' || selectedPosition?.status === 'settling') && (
          <CompletedModal
            position={selectedPosition}
            isClosing={isClosing}
            onClose={handleCloseModal}
            onExplain={() => setActiveModal('explain')}
          />
        )}

      {activeModal === 'explain' && (
        <ExplainModal position={selectedPosition} isClosing={isClosing} onClose={handleCloseModal} />
      )}

      {activeModal === 'alerts' && (
        <SetAlertsModal position={selectedPosition} isClosing={isClosing} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default function ProfilePage() {
  const { isConnected } = useAccount()
  const { positionIds, refetch, isLoading } = useUserPositions()

  const [activeTab, setActiveTab] = useState<UITab>('ACTIVE')


  // Fetch once on connect (tab switching is UI filter only)
  useEffect(() => {
    if (isConnected) refetch()
  }, [isConnected, refetch])

  // Sort positionIds descending (terbaru → terlama)
  const sortedIds = useMemo(() => {
    return [...positionIds].sort((a, b) =>
      a > b ? -1 : a < b ? 1 : 0
    )
  }, [positionIds])

  return (
    <PageLayout title={activeTab === 'ACTIVE' ? 'Active Positions' : 'Completed Positions'}>
      {/* Filter Tabs */}
      <div className="px-4 md:px-6 lg:px-8 pb-3">
        <div className="grid grid-cols-2 gap-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                'py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200',
                activeTab === t.key
                  ? 'bg-[#4CC658] text-slate-900 shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px]'
                  : 'bg-muted text-foreground border border-border'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {isConnected ? (
        <div className="flex-1 overflow-y-auto pb-24 px-4 md:px-6 lg:px-8 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-card to-muted/20 border border-border rounded-3xl p-5 animate-pulse"
                >
                  <div className="h-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : sortedIds.length > 0 ? (
            sortedIds.map((id) => (
              <PositionCard key={id.toString()} positionId={id} tab={activeTab} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full mt-24">
              <ExclamationmarkCircle width={48} height={48} />
              <h2 className="mt-4 text-lg font-bold">No positions found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {activeTab === 'ACTIVE'
                  ? 'You have no active positions.'
                  : 'You have no completed positions.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full mt-24">
          <ExclamationmarkCircle width={48} height={48} />
          <h2 className="mt-4 text-lg font-bold">Please connect your wallet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Connect your wallet to view your positions.
          </p>
        </div>
      )}
    </PageLayout>
  )
}

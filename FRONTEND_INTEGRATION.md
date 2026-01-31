# Frontend Integration Guide - Nawasena (Wagmi + Viem)

> Modern Web3 integration using **wagmi v2** and **viem** for type-safe, efficient React development

## 📦 Installation

```bash
npm install wagmi viem @tanstack/react-query
# or
yarn add wagmi viem @tanstack/react-query
# or
pnpm add wagmi viem @tanstack/react-query
```

## 🔧 Setup

### 1. Wagmi Configuration

Create `config/wagmi.ts`:

```typescript
import { http, createConfig } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected(),
    walletConnect({ projectId: 'YOUR_WALLETCONNECT_PROJECT_ID' }),
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
```

### 2. Contract Addresses & ABIs

Create `config/contracts.ts`:

```typescript
import { Address } from 'viem'

// Update after deployment
export const CONTRACTS = {
  PRICE_ORACLE: '0x...' as Address,
  POSITION_REGISTRY: '0x...' as Address,
  OPTION_SETTLEMENT: '0x...' as Address,
  MOCK_OPTION_BOOK: '0x...' as Address,
  PAYOUT_VAULT: '0x...' as Address,
  CLAIM_ROUTER: '0x...' as Address,
  MOCK_USDC: '0x...' as Address,
} as const

// Import ABIs from compiled contracts
import PriceOracleABI from '../abis/PriceOracle.json'
import PositionRegistryABI from '../abis/PositionRegistry.json'
import OptionSettlementABI from '../abis/OptionSettlement.json'
import MockOptionBookABI from '../abis/MockOptionBook.json'
import ClaimRouterABI from '../abis/ClaimRouter.json'
import ERC20ABI from '../abis/ERC20.json'

export const ABIS = {
  PriceOracle: PriceOracleABI,
  PositionRegistry: PositionRegistryABI,
  OptionSettlement: OptionSettlementABI,
  MockOptionBook: MockOptionBookABI,
  ClaimRouter: ClaimRouterABI,
  ERC20: ERC20ABI,
} as const
```

### 3. Root Layout Setup

```typescript
// app/layout.tsx or _app.tsx
'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

---

## 🚀 Core Integration Functions

### 1. Get Current Oracle Price

```typescript
'use client'

import { useReadContract } from 'wagmi'
import { CONTRACTS, ABIS } from '@/config/contracts'
import { formatEther } from 'viem'

export function useOraclePrice(asset: string) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACTS.PRICE_ORACLE,
    abi: ABIS.PriceOracle,
    functionName: 'getLatestPrice',
    args: [asset],
  })

  return {
    price: data ? Number(formatEther(data as bigint)) : null,
    isLoading,
    error,
  }
}

// Usage in component
function PriceDisplay({ asset }: { asset: string }) {
  const { price, isLoading } = useOraclePrice(asset)
  
  if (isLoading) return <div>Loading price...</div>
  
  return <div>{asset}: ${price?.toFixed(2)}</div>
}
```

### 2. Get User Recommendations (Backend API)

```typescript
import { useQuery } from '@tanstack/react-query'

interface UserProfile {
  goal: 'PROTECT_ASSET' | 'CAPTURE_UPSIDE' | 'EARN_SAFELY'
  riskComfort: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
  confidence: 'LOW' | 'MID' | 'HIGH'
  amount: number
}

interface Recommendation {
  id: string
  asset: string
  type: 'CALL' | 'PUT'
  strike: number
  expiry: number
  premium: number
  order: any // Full order struct
  nonce: bigint
  signature: `0x${string}`
}

export function useRecommendations(profile: UserProfile) {
  return useQuery({
    queryKey: ['recommendations', profile],
    queryFn: async () => {
      const params = new URLSearchParams({
        goal: profile.goal,
        riskComfort: profile.riskComfort,
        confidence: profile.confidence,
        amount: profile.amount.toString(),
      })
      
      const response = await fetch(`/api/recommendations?${params}`)
      if (!response.ok) throw new Error('Failed to fetch recommendations')
      
      const data = await response.json()
      return data.recommendations as Recommendation[]
    },
    enabled: !!profile.amount,
  })
}
```

### 3. Buy Option (Fill Order)

```typescript
'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, ABIS } from '@/config/contracts'
import { parseUnits } from 'viem'

export function useBuyOption() {
  const { data: hash, writeContract, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const buyOption = async (recommendation: Recommendation) => {
    // 1. First approve USDC
    await approveUSDC(recommendation.premium)
    
    // 2. Then fill order
    writeContract({
      address: CONTRACTS.MOCK_OPTION_BOOK,
      abi: ABIS.MockOptionBook,
      functionName: 'fillOrder',
      args: [
        recommendation.order,
        recommendation.nonce,
        recommendation.signature,
        '0x0000000000000000000000000000000000000000', // referrer
        '0x0000000000000000000000000000000000000000000000000000000000000000', // strategyId
      ],
    })
  }

  return {
    buyOption,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// Approve USDC helper
export function useApproveUSDC() {
  const { writeContract } = useWriteContract()
  
  const approve = (amount: number) => {
    writeContract({
      address: CONTRACTS.MOCK_USDC,
      abi: ABIS.ERC20,
      functionName: 'approve',
      args: [CONTRACTS.MOCK_OPTION_BOOK, parseUnits(amount.toString(), 6)],
    })
  }
  
  return { approve }
}
```

### 4. Get User Positions

```typescript
import { useReadContract, useAccount } from 'wagmi'
import { CONTRACTS, ABIS } from '@/config/contracts'

export function useUserPositions() {
  const { address } = useAccount()
  
  // Get position IDs
  const { data: positionIds } = useReadContract({
    address: CONTRACTS.POSITION_REGISTRY,
    abi: ABIS.PositionRegistry,
    functionName: 'getPositionsOf',
    args: [address!],
    query: {
      enabled: !!address,
    },
  })

  return {
    positionIds: positionIds as bigint[] | undefined,
  }
}

// Get single position details
export function usePosition(positionId: bigint) {
  const { data, isLoading } = useReadContract({
    address: CONTRACTS.POSITION_REGISTRY,
    abi: ABIS.PositionRegistry,
    functionName: 'getPosition',
    args: [positionId],
  })

  if (!data) return { position: null, isLoading }

  const position = data as any[]
  
  return {
    position: {
      user: position[0],
      underlyingAsset: position[1],
      isCall: position[2],
      strikes: position[3],
      expiry: position[4],
      premiumPaid: position[5],
      status: position[6],
      settlementPrice: position[7],
      payout: position[8],
      claimable: position[9],
    },
    isLoading,
  }
}
```

### 5. Calculate Real-time PnL

```typescript
import { useReadContract } from 'wagmi'
import { CONTRACTS, ABIS } from '@/config/contracts'
import { formatUnits } from 'viem'

export function useUnrealizedPnL(positionId: bigint, currentPrice: bigint) {
  const { data } = useReadContract({
    address: CONTRACTS.POSITION_REGISTRY,
    abi: ABIS.PositionRegistry,
    functionName: 'getUnrealizedPnL',
    args: [positionId, currentPrice],
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  })

  if (!data) return null

  const [unrealizedPayout, pnl, isProfitable] = data as [bigint, bigint, boolean]

  return {
    unrealizedPayout: Number(formatUnits(unrealizedPayout, 6)),
    pnl: Number(formatUnits(pnl, 6)),
    isProfitable,
  }
}

// Combined hook for position + real-time PnL
export function usePositionWithPnL(positionId: bigint) {
  const { position } = usePosition(positionId)
  const { price } = useOraclePrice(position?.underlyingAsset || 'ETH')
  
  const currentPrice = price ? parseUnits(price.toString(), 18) : 0n
  const pnlData = useUnrealizedPnL(positionId, currentPrice)
  
  return {
    position,
    pnl: pnlData,
    currentPrice: price,
  }
}
```

### 6. Claim Position Payout

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, ABIS } from '@/config/contracts'

export function useClaimPosition() {
  const { data: hash, writeContract, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const claim = (positionId: bigint) => {
    writeContract({
      address: CONTRACTS.CLAIM_ROUTER,
      abi: ABIS.ClaimRouter,
      functionName: 'claim',
      args: [positionId],
    })
  }

  return {
    claim,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// Batch claim multiple positions
export function useClaimMany() {
  const { data: hash, writeContract, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const claimMany = (positionIds: bigint[]) => {
    writeContract({
      address: CONTRACTS.CLAIM_ROUTER,
      abi: ABIS.ClaimRouter,
      functionName: 'claimMany',
      args: [positionIds],
    })
  }

  return {
    claimMany,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  }
}
```

---

## 🎨 React Component Examples

### Complete Position Dashboard

```typescript
'use client'

import { useAccount } from 'wagmi'
import { useUserPositions, usePositionWithPnL } from '@/hooks/usePositions'
import { useClaimPosition } from '@/hooks/useClaim'

function PositionCard({ positionId }: { positionId: bigint }) {
  const { position, pnl, currentPrice } = usePositionWithPnL(positionId)
  const { claim, isPending } = useClaimPosition()
  
  if (!position) return <div>Loading...</div>

  const isExpired = Date.now() / 1000 > Number(position.expiry)
  const status = ['ACTIVE', 'SETTLED', 'CLAIMED'][position.status]

  return (
    <div className="border rounded-lg p-4 shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">
            {position.isCall ? '📈 CALL' : '📉 PUT'} {position.underlyingAsset}
          </h3>
          <p className="text-sm text-gray-600">
            Strike: ${Number(formatUnits(position.strikes[0], 18))}
          </p>
          <p className="text-sm text-gray-600">
            Premium: ${Number(formatUnits(position.premiumPaid, 6))}
          </p>
        </div>
        
        <div className="text-right">
          <span className={`px-2 py-1 rounded text-xs ${
            status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
            status === 'SETTLED' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {status}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            {isExpired ? 'Expired' : `Expires in ${Math.floor((Number(position.expiry) * 1000 - Date.now()) / 86400000)}d`}
          </p>
        </div>
      </div>

      {/* Real-time PnL for active positions */}
      {status === 'ACTIVE' && pnl && (
        <div className={`mt-4 p-3 rounded ${pnl.isProfitable ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-600">Current Price</p>
              <p className="font-semibold">${currentPrice?.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Unrealized PnL</p>
              <p className={`font-bold ${pnl.isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                {pnl.isProfitable ? '📈' : '📉'} ${Math.abs(pnl.pnl).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {((pnl.pnl / Number(formatUnits(position.premiumPaid, 6))) * 100).toFixed(1)}% ROI
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settled positions */}
      {status === 'SETTLED' && (
        <div className="mt-4 p-3 rounded bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-600">Settlement Price</p>
              <p className="font-semibold">${Number(formatUnits(position.settlementPrice, 18))}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Payout</p>
              <p className="font-bold text-green-600">${Number(formatUnits(position.payout, 6))}</p>
            </div>
          </div>
          
          {Number(position.claimable) > 0 && (
            <button
              onClick={() => claim(positionId)}
              disabled={isPending}
              className="w-full mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isPending ? 'Claiming...' : `Claim $${Number(formatUnits(position.claimable, 6))}`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function PositionDashboard() {
  const { address, isConnected } = useAccount()
  const { positionIds } = useUserPositions()

  if (!isConnected) {
    return <div>Please connect your wallet</div>
  }

  if (!positionIds || positionIds.length === 0) {
    return <div>No positions yet</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {positionIds.map((id) => (
        <PositionCard key={id.toString()} positionId={id} />
      ))}
    </div>
  )
}
```

### Option Recommendation Flow

```typescript
'use client'

import { useState } from 'react'
import { useRecommendations } from '@/hooks/useRecommendations'
import { useBuyOption } from '@/hooks/useBuyOption'
import { formatUnits } from 'viem'

export function OptionRecommendations() {
  const [profile, setProfile] = useState({
    goal: 'CAPTURE_UPSIDE' as const,
    riskComfort: 'MODERATE' as const,
    confidence: 'HIGH' as const,
    amount: 1000,
  })

  const { data: recommendations, isLoading } = useRecommendations(profile)
  const { buyOption, isPending, isSuccess } = useBuyOption()

  if (isLoading) return <div>Loading recommendations...</div>

  return (
    <div className="space-y-6">
      {/* Profile Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Your Profile</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Goal</label>
            <select 
              value={profile.goal}
              onChange={(e) => setProfile({...profile, goal: e.target.value as any})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="PROTECT_ASSET">Protect Asset</option>
              <option value="CAPTURE_UPSIDE">Capture Upside</option>
              <option value="EARN_SAFELY">Earn Safely</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Risk Comfort</label>
            <select
              value={profile.riskComfort}
              onChange={(e) => setProfile({...profile, riskComfort: e.target.value as any})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="CONSERVATIVE">Conservative</option>
              <option value="MODERATE">Moderate</option>
              <option value="AGGRESSIVE">Aggressive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Confidence</label>
            <select
              value={profile.confidence}
              onChange={(e) => setProfile({...profile, confidence: e.target.value as any})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="LOW">Low (30 days)</option>
              <option value="MID">Mid (14 days)</option>
              <option value="HIGH">High (7 days)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Amount (USDC)</label>
            <input
              type="number"
              value={profile.amount}
              onChange={(e) => setProfile({...profile, amount: Number(e.target.value)})}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations?.map((rec) => (
          <div key={rec.id} className="bg-white p-6 rounded-lg shadow border-2 border-blue-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{rec.type} {rec.asset}</h3>
                <p className="text-sm text-gray-600">Recommended for you</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {profile.riskComfort}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Strike Price</span>
                <span className="font-semibold">${rec.strike}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Premium</span>
                <span className="font-semibold">${rec.premium}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires</span>
                <span className="font-semibold">
                  {new Date(rec.expiry * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Positions</span>
                <span className="font-semibold">
                  {Math.floor(profile.amount / rec.premium)}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Max Profit</span>
                <span className="text-green-600 font-semibold">
                  ${rec.premium * 10}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Max Loss</span>
                <span className="text-red-600 font-semibold">
                  ${rec.premium}
                </span>
              </div>
            </div>

            <button
              onClick={() => buyOption(rec)}
              disabled={isPending}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Processing...' : `Buy for $${rec.premium}`}
            </button>

            {isSuccess && (
              <p className="mt-2 text-green-600 text-sm text-center">
                ✅ Position created successfully!
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🔄 Real-time Price Updates

```typescript
import { useReadContract } from 'wagmi'
import { CONTRACTS, ABIS } from '@/config/contracts'
import { formatEther } from 'viem'

export function useLivePrice(asset: string, refetchInterval = 10000) {
  const { data, isLoading } = useReadContract({
    address: CONTRACTS.PRICE_ORACLE,
    abi: ABIS.PriceOracle,
    functionName: 'getLatestPrice',
    args: [asset],
    query: {
      refetchInterval, // Refetch every 10 seconds
    },
  })

  return {
    price: data ? Number(formatEther(data as bigint)) : null,
    isLoading,
  }
}

// Usage
function LivePriceDisplay({ asset }: { asset: string }) {
  const { price, isLoading } = useLivePrice(asset)
  
  if (isLoading) return <div className="animate-pulse">Loading...</div>
  
  return (
    <div className="flex items-center gap-2">
      <span className="font-bold">{asset}</span>
      <span className="text-2xl">${price?.toFixed(2)}</span>
      <span className="text-green-500 text-sm">● Live</span>
    </div>
  )
}
```

---

## 🎯 Complete Flow: Buy to Claim

```typescript
'use client'

export function CompleteOptionFlow() {
  const [step, setStep] = useState<'profile' | 'recommendations' | 'tracking' | 'claim'>('profile')
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null)
  const [positionId, setPositionId] = useState<bigint | null>(null)

  // Step 1: Get recommendations
  const { data: recommendations } = useRecommendations(profile)
  
  // Step 2: Buy option
  const { buyOption, isSuccess: buySuccess } = useBuyOption()
  
  // Step 3: Track PnL
  const { pnl } = usePositionWithPnL(positionId!)
  
  // Step 4: Claim
  const { claim, isSuccess: claimSuccess } = useClaimPosition()

  useEffect(() => {
    if (buySuccess && selectedRec) {
      setStep('tracking')
      // Extract position ID from event (you'd need to parse transaction receipt)
    }
  }, [buySuccess])

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Step indicator */}
      <div className="flex justify-between mb-8">
        {['Profile', 'Select Option', 'Track PnL', 'Claim'].map((label, idx) => (
          <div key={label} className={`flex-1 text-center ${
            idx <= ['profile', 'recommendations', 'tracking', 'claim'].indexOf(step)
              ? 'text-blue-600 font-semibold'
              : 'text-gray-400'
          }`}>
            <div className="text-2xl mb-2">{idx + 1}</div>
            <div className="text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Content based on step */}
      {step === 'profile' && (
        <ProfileForm onComplete={() => setStep('recommendations')} />
      )}
      
      {step === 'recommendations' && (
        <RecommendationList 
          recommendations={recommendations}
          onSelect={(rec) => {
            setSelectedRec(rec)
            buyOption(rec)
          }}
        />
      )}
      
      {step === 'tracking' && positionId && (
        <PnLTracker 
          positionId={positionId}
          onExpiry={() => setStep('claim')}
        />
      )}
      
      {step === 'claim' && positionId && (
        <ClaimInterface
          positionId={positionId}
          onClaim={() => claim(positionId)}
        />
      )}
    </div>
  )
}
```

---

## 🛠️ Utility Hooks

### Format Helpers

```typescript
import { formatUnits } from 'viem'

export function formatUSDC(amount: bigint): string {
  return `$${Number(formatUnits(amount, 6)).toFixed(2)}`
}

export function formatPrice(price: bigint): string {
  return `$${Number(formatUnits(price, 18)).toFixed(2)}`
}

export function formatExpiry(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days < 0) return 'Expired'
  if (days === 0) return 'Expires today'
  if (days === 1) return 'Expires tomorrow'
  return `Expires in ${days} days`
}

export function formatROI(pnl: number, premium: number): string {
  const roi = (pnl / premium) * 100
  return `${roi > 0 ? '+' : ''}${roi.toFixed(1)}%`
}
```

### Transaction Toast Notifications

```typescript
import { useWaitForTransactionReceipt } from 'wagmi'
import { useEffect } from 'react'
import { toast } from 'sonner' // or your toast library

export function useTransactionToast(hash: `0x${string}` | undefined) {
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isLoading) {
      toast.loading('Transaction pending...', { id: hash })
    }
    if (isSuccess) {
      toast.success('Transaction confirmed!', { id: hash })
    }
    if (isError) {
      toast.error('Transaction failed', { id: hash })
    }
  }, [isLoading, isSuccess, isError, hash])

  return { isLoading, isSuccess, isError }
}
```

---

## ✅ Summary

### Integration Checklist

Frontend integration with wagmi + viem:
- ✅ Configure wagmi with chains and connectors
- ✅ Setup contract addresses and ABIs
- ✅ Fetch current oracle prices
- ✅ Get personalized recommendations from backend
- ✅ Execute buy transactions with proper approvals
- ✅ Monitor real-time PnL for active positions
- ✅ Claim settled positions
- ✅ Handle loading/error states properly
- ✅ Display transaction feedback to users

### Key Benefits of Wagmi + Viem

1. **Type Safety** - Full TypeScript support with viem
2. **React Hooks** - Clean, declarative data fetching
3. **Auto Refetch** - Built-in cache invalidation
4. **Optimistic Updates** - Better UX
5. **Multi-chain** - Easy to support multiple networks
6. **Modern Stack** - Industry standard for 2024+

All data flows through smart contracts with Chainlink Oracle for trustless pricing! 🚀


## 📦 Installation

```bash
npm install ethers
# or
yarn add ethers
```

## 🔧 Contract Setup

### Contract Addresses (Update after deployment)

```typescript
// config/contracts.ts
export const CONTRACTS = {
  // Sepolia Testnet
  PRICE_ORACLE: "0x...",
  POSITION_REGISTRY: "0x...",
  OPTION_SETTLEMENT: "0x...",
  MOCK_OPTION_BOOK: "0x...",
  PAYOUT_VAULT: "0x...",
  CLAIM_ROUTER: "0x...",
  MOCK_USDC: "0x..."
};
```

### Contract ABIs

```typescript
// abis/PriceOracle.json
import PriceOracleABI from './PriceOracle.json';
import PositionRegistryABI from './PositionRegistry.json';
import OptionSettlementABI from './OptionSettlement.json';
import MockOptionBookABI from './MockOptionBook.json';
import ClaimRouterABI from './ClaimRouter.json';
import ERC20 from './ERC20.json';
```

## 🚀 Core Integration Functions

### 1. Get Current Oracle Price

```typescript
import { ethers } from 'ethers';
import { CONTRACTS } from './config/contracts';
import PriceOracleABI from './abis/PriceOracle.json';

async function getCurrentPrice(asset: string): Promise<number> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const oracle = new ethers.Contract(
    CONTRACTS.PRICE_ORACLE,
    PriceOracleABI,
    provider
  );
  
  const priceWei = await oracle.getLatestPrice(asset);
  const priceFormatted = Number(ethers.formatEther(priceWei));
  
  return priceFormatted;
}

// Usage
const ethPrice = await getCurrentPrice("ETH");
console.log(`Current ETH Price: $${ethPrice}`);
```

### 2. Get User Recommendations

```typescript
interface UserProfile {
  goal: "PROTECT_ASSET" | "CAPTURE_UPSIDE" | "EARN_SAFELY";
  riskComfort: "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE";
  confidence: "LOW" | "MID" | "HIGH";
  amount: number;
}

async function getRecommendations(profile: UserProfile) {
  const params = new URLSearchParams({
    goal: profile.goal,
    riskComfort: profile.riskComfort,
    confidence: profile.confidence,
    amount: profile.amount.toString()
  });
  
  const response = await fetch(`/api/recommendations?${params}`);
  const data = await response.json();
  
  return data.recommendations;
}

// Usage
const recommendations = await getRecommendations({
  goal: "CAPTURE_UPSIDE",
  riskComfort: "MODERATE",
  confidence: "HIGH",
  amount: 1000
});
```

### 3. Buy Option (Fill Order)

```typescript
async function buyOption(recommendation: any) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const optionBook = new ethers.Contract(
    CONTRACTS.MOCK_OPTION_BOOK,
    MockOptionBookABI,
    signer
  );
  
  const usdc = new ethers.Contract(
    CONTRACTS.MOCK_USDC,
    ERC20,
    signer
  );
  
  // 1. Approve USDC spending
  const approveTx = await usdc.approve(
    CONTRACTS.MOCK_OPTION_BOOK,
    recommendation.order.price
  );
  await approveTx.wait();
  console.log("USDC approved");
  
  // 2. Fill order
  const tx = await optionBook.fillOrder(
    recommendation.order,
    recommendation.nonce,
    recommendation.signature,
    ethers.ZeroAddress, // referrer
    ethers.ZeroHash // strategyId
  );
  
  const receipt = await tx.wait();
  console.log("Position created!", receipt.hash);
  
  // Extract position ID from event
  const event = receipt.logs.find(
    log => log.topics[0] === ethers.id("OrderFilled(uint256,address,uint256,uint64,bytes32)")
  );
  const positionId = ethers.toNumber(event.topics[1]);
  
  return { positionId, txHash: receipt.hash };
}
```

### 4. Get User Positions

```typescript
async function getUserPositions(userAddress: string) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const registry = new ethers.Contract(
    CONTRACTS.POSITION_REGISTRY,
    PositionRegistryABI,
    provider
  );
  
  const positionIds = await registry.getPositionsOf(userAddress);
  
  const positions = await Promise.all(
    positionIds.map(async (id) => {
      const position = await registry.getPosition(id);
      return {
        id: Number(id),
        ...formatPosition(position)
      };
    })
  );
  
  return positions;
}

function formatPosition(position: any) {
  return {
    user: position.user,
    underlyingAsset: position.underlyingAsset,
    type: position.isCall ? "CALL" : "PUT",
    strike: Number(ethers.formatEther(position.strikes[0])),
    expiry: Number(position.expiry),
    expiryDate: new Date(Number(position.expiry) * 1000),
    premiumPaid: Number(ethers.formatUnits(position.premiumPaid, 6)),
    status: ["ACTIVE", "SETTLED", "CLAIMED"][position.status],
    settlementPrice: position.settlementPrice > 0 
      ? Number(ethers.formatEther(position.settlementPrice))
      : null,
    payout: Number(ethers.formatUnits(position.payout, 6)),
    claimable: Number(ethers.formatUnits(position.claimable, 6))
  };
}
```

### 5. Calculate Real-time PnL

```typescript
async function getUnrealizedPnL(positionId: number) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  const registry = new ethers.Contract(
    CONTRACTS.POSITION_REGISTRY,
    PositionRegistryABI,
    provider
  );
  
  const oracle = new ethers.Contract(
    CONTRACTS.PRICE_ORACLE,
    PriceOracleABI,
    provider
  );
  
  // Get position
  const position = await registry.getPosition(positionId);
  
  // Get current price
  const currentPrice = await oracle.getLatestPrice(position.underlyingAsset);
  
  // Calculate unrealized PnL
  const { unrealizedPayout, pnl, isProfitable } = 
    await registry.getUnrealizedPnL(positionId, currentPrice);
  
  return {
    currentPrice: Number(ethers.formatEther(currentPrice)),
    unrealizedPayout: Number(ethers.formatUnits(unrealizedPayout, 6)),
    pnl: Number(ethers.formatUnits(pnl, 6)),
    pnlPercent: (Number(ethers.formatUnits(pnl, 6)) / Number(ethers.formatUnits(position.premiumPaid, 6))) * 100,
    isProfitable
  };
}
```

### 6. Claim Position Payout

```typescript
async function claimPosition(positionId: number) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const claimRouter = new ethers.Contract(
    CONTRACTS.CLAIM_ROUTER,
    ClaimRouterABI,
    signer
  );
  
  const tx = await claimRouter.claim(positionId);
  const receipt = await tx.wait();
  
  console.log("Claimed successfully!", receipt.hash);
  return receipt.hash;
}
```

## 🎨 React Component Examples

### Position Dashboard

```typescript
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'; // or your Web3 library

function PositionDashboard() {
  const { address } = useAccount();
  const [positions, setPositions] = useState([]);
  const [pnlData, setPnlData] = useState({});
  
  useEffect(() => {
    if (!address) return;
    
    async function loadPositions() {
      const userPositions = await getUserPositions(address);
      setPositions(userPositions);
      
      // Load real-time PnL for active positions
      const pnlPromises = userPositions
        .filter(p => p.status === "ACTIVE")
        .map(async (p) => {
          const pnl = await getUnrealizedPnL(p.id);
          return [p.id, pnl];
        });
      
      const pnlResults = await Promise.all(pnlPromises);
      const pnlMap = Object.fromEntries(pnlResults);
      setPnlData(pnlMap);
    }
    
    loadPositions();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadPositions, 30000);
    return () => clearInterval(interval);
  }, [address]);
  
  return (
    <div className="dashboard">
      {positions.map(position => (
        <PositionCard
          key={position.id}
          position={position}
          pnl={pnlData[position.id]}
        />
      ))}
    </div>
  );
}

function PositionCard({ position, pnl }) {
  const isExpired = Date.now() / 1000 > position.expiry;
  
  return (
    <div className="position-card">
      <h3>{position.type} {position.underlyingAsset}</h3>
      <p>Strike: ${position.strike}</p>
      <p>Premium Paid: ${position.premiumPaid}</p>
      <p>Expires: {position.expiryDate.toLocaleDateString()}</p>
      
      {position.status === "ACTIVE" && pnl && (
        <div className={pnl.isProfitable ? "profit" : "loss"}>
          <p>Current PnL: ${pnl.pnl.toFixed(2)} ({pnl.pnlPercent.toFixed(1)}%)</p>
          <p>Current Price: ${pnl.currentPrice}</p>
        </div>
      )}
      
      {position.status === "SETTLED" && (
        <div>
          <p>Settlement Price: ${position.settlementPrice}</p>
          <p>Payout: ${position.payout}</p>
          {position.claimable > 0 && (
            <button onClick={() => claimPosition(position.id)}>
              Claim ${position.claimable}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

### Option Recommendation Flow

```typescript
function OptionRecommendations() {
  const [profile, setProfile] = useState({
    goal: "CAPTURE_UPSIDE",
    riskComfort: "MODERATE",
    confidence: "HIGH",
    amount: 1000
  });
  
  const [recommendations, setRecommendations] = useState([]);
  const [buying, setBuying] = useState(false);
  
  async function fetchRecs() {
    const recs = await getRecommendations(profile);
    setRecommendations(recs);
  }
  
  async function handleBuy(rec) {
    setBuying(true);
    try {
      const { positionId, txHash } = await buyOption(rec);
      alert(`Success! Position #${positionId} created. TX: ${txHash}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setBuying(false);
    }
  }
  
  return (
    <div>
      <ProfileForm profile={profile} onChange={setProfile} />
      <button onClick={fetchRecs}>Get Recommendations</button>
      
      <div className="recommendations">
        {recommendations.map(rec => (
          <div key={rec.id} className="rec-card">
            <h3>{rec.type} {rec.asset}</h3>
            <p>Strike: ${rec.strikePrice}</p>
            <p>Premium: ${rec.premium}</p>
            <p>Expires: {rec.expiryDays} days</p>
            <p>Max Profit: ${rec.metadata.maxProfit}</p>
            <p>Max Loss: ${rec.metadata.maxLoss}</p>
            <p>{rec.explanation}</p>
            
            <button 
              onClick={() => handleBuy(rec)}
              disabled={buying}
            >
              {buying ? "Processing..." : `Buy for $${rec.premium}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🔄 Real-time Price Updates

```typescript
// Use WebSocket or polling for real-time prices
function useLivePrice(asset: string) {
  const [price, setPrice] = useState(null);
  
  useEffect(() => {
    async function fetchPrice() {
      const currentPrice = await getCurrentPrice(asset);
      setPrice(currentPrice);
    }
    
    fetchPrice();
    const interval = setInterval(fetchPrice, 10000); // Every 10s
    
    return () => clearInterval(interval);
  }, [asset]);
  
  return price;
}

// Usage
function LivePriceDisplay({ asset }) {
  const price = useLivePrice(asset);
  return <div>{asset}: ${price}</div>;
}
```

## 🎯 Complete Example: Buy to Claim Flow

```typescript
async function completeOptionFlow() {
  // 1. Get recommendations
  const recommendations = await getRecommendations({
    goal: "CAPTURE_UPSIDE",
    riskComfort: "MODERATE",
    confidence: "HIGH",
    amount: 1000
  });
  
  // 2. User selects first recommendation
  const selected = recommendations[0];
  
  // 3. Buy option
  const { positionId } = await buyOption(selected);
  console.log("Position created:", positionId);
  
  // 4. Monitor real-time PnL
  const interval = setInterval(async () => {
    const pnl = await getUnrealizedPnL(positionId);
    console.log("Current PnL:", pnl);
    
    if (pnl.pnlPercent > 50) {
      console.log("🎉 50% profit!");
    }
  }, 30000);
  
  // 5. Wait for expiry (in real app, this is automatic)
  // ... time passes ...
  
  // 6. After settlement (backend calls settlement.settle())
  const position = await getPosition(positionId);
  if (position.status === "SETTLED" && position.claimable > 0) {
    // 7. Claim payout
    await claimPosition(positionId);
    console.log("Claimed payout!");
  }
}
```

## 🛠️ Utility Functions

```typescript
// Format timestamp to readable date
export function formatExpiry(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return "Expired";
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";
  return `Expires in ${days} days`;
}

// Format PnL with color
export function formatPnL(pnl: number) {
  const color = pnl >= 0 ? "green" : "red";
  const sign = pnl >= 0 ? "+" : "";
  return `<span style="color: ${color}">${sign}$${pnl.toFixed(2)}</span>`;
}

// Calculate ROI
export function calculateROI(payout: number, premium: number): string {
  const roi = ((payout - premium) / premium) * 100;
  return `${roi > 0 ? '+' : ''}${roi.toFixed(1)}%`;
}
```

## ✅ Summary

Frontend integration checklist:
- ✅ Connect to contracts using ethers.js
- ✅ Fetch recommendations from backend API
- ✅ Display options with real-time pricing
- ✅ Execute buy transactions
- ✅ Monitor real-time PnL for active positions
- ✅ Claim settled positions

All data flows through smart contracts with Chainlink Oracle for trustless pricing! 🚀

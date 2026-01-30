import { useReadContract } from 'wagmi'
import { CONTRACTS, ABIS } from '@/lib/blockchain/contracts'
import { formatUnits, parseUnits } from 'viem'
import { usePosition } from './usePosition'

export function useOraclePrice(asset: string) {
    const { data, isLoading, error } = useReadContract({
        address: CONTRACTS.PRICE_ORACLE,
        abi: ABIS.PriceOracle,
        functionName: 'getLatestPrice',
        args: [asset],
        query: {
            refetchInterval: 10000, // Refetch every 10 seconds
        },
    })

    return {
        price: data ? Number(formatUnits(data as bigint, 18)) : null,
        priceRaw: data as bigint | undefined,
        isLoading,
        error,
    }
}

export function useUnrealizedPnL(positionId: bigint | undefined, currentPrice: bigint | undefined) {
    const { data, isLoading, error } = useReadContract({
        address: CONTRACTS.POSITION_REGISTRY,
        abi: ABIS.PositionRegistry,
        functionName: 'getUnrealizedPnL',
        args: positionId !== undefined && currentPrice !== undefined ? [positionId, currentPrice] : undefined,
        query: {
            enabled: positionId !== undefined && currentPrice !== undefined,
            refetchInterval: 10000, // Refetch every 10 seconds
        },
    })

    if (!data) {
        return {
            unrealizedPayout: null,
            pnl: null,
            isProfitable: null,
            isLoading,
            error,
        }
    }

    const [unrealizedPayout, pnl, isProfitable] = data as [bigint, bigint, boolean]

    return {
        unrealizedPayout: Number(formatUnits(unrealizedPayout, 6)),
        unrealizedPayoutRaw: unrealizedPayout,
        pnl: Number(formatUnits(pnl, 6)),
        pnlRaw: pnl,
        isProfitable,
        isLoading,
        error,
    }
}

// Combined hook for position + real-time PnL
export function usePositionWithPnL(positionId: bigint | undefined) {
    const positionData = usePosition(positionId)
    const { position } = positionData

    // Get current price for the underlying asset
    const { price, priceRaw } = useOraclePrice(position?.underlyingAsset || 'ETH')

    // Get unrealized PnL
    const pnlData = useUnrealizedPnL(positionId, priceRaw)

    return {
        ...positionData,
        currentPrice: price,
        pnl: pnlData,
    }
}

import { useReadContract } from 'wagmi'
import { CONTRACTS, ABIS } from '@/lib/blockchain/contracts'
import { formatUnits } from 'viem'

export interface Position {
    user: string
    collateralToken: string
    premiumPaid: bigint
    underlyingAsset: string
    isCall: boolean
    isLong: boolean
    strikes: bigint[]
    expiry: bigint
    createdAt: bigint
    status: number // 0: ACTIVE, 1: SETTLED, 2: CLAIMED
    strategyId: string
    referrer: string
    orderHash: string
    settlementPrice: bigint
    payout: bigint
    claimable: bigint
    claimed: boolean
}

export function usePosition(positionId: bigint | undefined) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.POSITION_REGISTRY,
        abi: ABIS.PositionRegistry,
        functionName: 'getPosition',
        args: positionId !== undefined ? [positionId] : undefined,
        query: {
            enabled: positionId !== undefined,
        },
    })

    if (!data) {
        return {
            position: null,
            isLoading,
            error,
            refetch,
        }
    }

    // Parse the response - wagmi already returns as object structure
    const positionData = data as any

    const position: Position = {
        user: positionData.user,
        collateralToken: positionData.collateralToken,
        premiumPaid: positionData.premiumPaid,
        underlyingAsset: positionData.underlyingAsset,
        isCall: positionData.isCall,
        isLong: positionData.isLong,
        strikes: positionData.strikes,
        expiry: positionData.expiry,
        createdAt: positionData.createdAt,
        status: positionData.status,
        strategyId: positionData.strategyId,
        referrer: positionData.referrer,
        orderHash: positionData.orderHash,
        settlementPrice: positionData.settlementPrice,
        payout: positionData.payout,
        claimable: positionData.claimable,
        claimed: positionData.claimed,
    }

    return {
        position,
        isLoading,
        error,
        refetch,
        // Helper methods with safety checks
        premiumPaidUSDC: position.premiumPaid ? Number(formatUnits(position.premiumPaid, 6)) : 0,
        payoutUSDC: position.payout ? Number(formatUnits(position.payout, 6)) : 0,
        claimableUSDC: position.claimable ? Number(formatUnits(position.claimable, 6)) : 0,
        strikePrice: position.strikes && position.strikes.length > 0
            ? Number(formatUnits(position.strikes[0], 18))
            : 0,
        expiryDate: new Date(Number(position.expiry) * 1000),
        isExpired: Date.now() / 1000 > Number(position.expiry),
        statusPosition: position.status,
        statusText: ['ACTIVE', 'SETTLED', 'CLAIMED'][position.status] as 'ACTIVE' | 'SETTLED' | 'CLAIMED',
    }
}

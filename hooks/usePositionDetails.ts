import { useReadContract } from 'wagmi'
import { CONTRACTS, ABIS } from '@/lib/blockchain/contracts'
import { formatUnits } from 'viem'

export function usePositionDetails(positionId: bigint | undefined) {
    const { data: position } = useReadContract({
        address: CONTRACTS.POSITION_REGISTRY,
        abi: ABIS.PositionRegistry,
        functionName: 'getPosition',
        args: positionId ? [positionId] : undefined,
        query: {
            enabled: !!positionId,
            refetchInterval: 10000,
        },
    })

    if (!position) return null

    const [owner, asset, isCall, strikes, expiry, premium, status] = position as any[]

    return {
        owner,
        asset: asset as string,
        type: isCall ? 'CALL' : 'PUT',
        strike: Number(formatUnits(strikes[0], 18)),
        expiry: Number(expiry),
        premium: Number(formatUnits(premium, 6)),
        status: ['ACTIVE', 'SETTLED', 'CLAIMED'][status] as 'ACTIVE' | 'SETTLED' | 'CLAIMED',
    }
}

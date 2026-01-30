import { useReadContract, useAccount } from 'wagmi'
import { CONTRACTS, ABIS } from '@/lib/blockchain/contracts'

export function useUserPositions() {
    const { address } = useAccount()

    // Get user's position IDs
    const { data: positionIds, refetch } = useReadContract({
        address: CONTRACTS.POSITION_REGISTRY,
        abi: ABIS.PositionRegistry,
        functionName: 'getPositionsOf',
        args: [address!],
        query: {
            enabled: !!address,
            refetchInterval: 10000, // Refetch every 10s
        },
    })

    console.log('=== useUserPositions Debug ===')
    console.log('address:', address)
    console.log('positionIds:', positionIds)
    console.log('positionIds type:', typeof positionIds)
    console.log('positionIds length:', positionIds ? (positionIds as any).length : 'N/A')

    return {
        positionIds: (positionIds as bigint[]) || [],
        isLoading: !positionIds && !!address,
        refetch,
    }
}

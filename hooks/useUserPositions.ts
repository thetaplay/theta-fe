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

    return {
        positionIds: (positionIds as bigint[]) || [],
        isLoading: !positionIds && !!address,
        refetch,
    }
}

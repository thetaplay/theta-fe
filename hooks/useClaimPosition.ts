import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, ABIS } from '@/lib/blockchain/contracts'

export function useClaimPosition() {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

    const claimPosition = async (positionId: bigint) => {
        await writeContract({
            address: CONTRACTS.CLAIM_ROUTER,
            abi: ABIS.ClaimRouter,
            functionName: 'claim',
            args: [positionId],
        })
    }

    const claimBatch = async (positionIds: bigint[]) => {
        await writeContract({
            address: CONTRACTS.CLAIM_ROUTER,
            abi: ABIS.ClaimRouter,
            functionName: 'claimBatch',
            args: [positionIds],
        })
    }

    return {
        claimPosition,
        claimBatch,
        isPending: isPending || isLoading,
        isSuccess,
        txHash: hash,
    }
}

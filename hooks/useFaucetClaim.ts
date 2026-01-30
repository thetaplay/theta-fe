'use client'

import { useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, ABIS } from '@/lib/blockchain/contracts'
import { formatUnits } from 'viem'
import { useMockUSDC } from './useMockUSDC'

export function useFaucetClaim() {
    const { address, isConnected } = useAccount()
    const { refetch: refetchBalance } = useMockUSDC()

    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    // Read claim amount
    const { data: claimAmountData } = useReadContract({
        address: CONTRACTS.MOCK_USDC,
        abi: ABIS.MockUSDC,
        functionName: 'CLAIM_AMOUNT',
    })

    // Read last claim time
    const { data: lastClaim } = useReadContract({
        address: CONTRACTS.MOCK_USDC,
        abi: ABIS.MockUSDC,
        functionName: 'lastClaim',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && isConnected,
        },
    })

    // Read claim interval
    const { data: claimInterval } = useReadContract({
        address: CONTRACTS.MOCK_USDC,
        abi: ABIS.MockUSDC,
        functionName: 'CLAIM_INTERVAL',
    })

    // Calculate if can claim
    const canClaim = () => {
        if (!lastClaim || !claimInterval) return true
        const now = Math.floor(Date.now() / 1000)
        return now >= (Number(lastClaim) + Number(claimInterval))
    }

    // Calculate time until next claim
    const getTimeUntilNextClaim = () => {
        if (!lastClaim || !claimInterval) return 0
        const now = Math.floor(Date.now() / 1000)
        const nextClaimTime = Number(lastClaim) + Number(claimInterval)
        return Math.max(0, nextClaimTime - now)
    }

    // Format time remaining
    const formatTimeRemaining = (seconds: number) => {
        if (seconds === 0) return 'Now'
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        if (hours > 0) return `${hours}h ${minutes}m`
        return `${minutes}m`
    }

    // Handle claim transaction
    const handleClaim = async () => {
        try {
            await writeContract({
                address: CONTRACTS.MOCK_USDC,
                abi: ABIS.MockUSDC,
                functionName: 'claim',
            })
        } catch (error) {
            console.error('Claim failed:', error)
        }
    }

    // Refetch balance on success
    useEffect(() => {
        if (isSuccess) {
            // Delay to ensure blockchain state is updated
            setTimeout(() => refetchBalance(), 2000)
        }
    }, [isSuccess, refetchBalance])

    // Format claim amount
    const claimAmount = claimAmountData
        ? formatUnits(claimAmountData as bigint, 6)
        : '1000'

    return {
        claimAmount,
        claimInterval,
        canClaim: canClaim(),
        timeUntilNextClaim: getTimeUntilNextClaim(),
        formatTimeRemaining,
        handleClaim,
        isPending,
        isConfirming,
        isSuccess,
    }
}

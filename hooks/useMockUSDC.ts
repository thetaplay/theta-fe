'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi'
import { CONTRACTS, ABIS } from '@/lib/blockchain/contracts'
import { formatUnits } from 'viem'

export function useMockUSDC() {
    const { address, isConnected } = useAccount()
    const [balance, setBalance] = useState<string>('0.00')

    // Read balance from contract
    const { data: balanceData, refetch } = useReadContract({
        address: CONTRACTS.MOCK_USDC,
        abi: ABIS.MockUSDC,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && isConnected,
            refetchInterval: 10000, // Refetch every 10 seconds
        },
    })

    // Watch for Transfer events to update balance in real-time
    useWatchContractEvent({
        address: CONTRACTS.MOCK_USDC,
        abi: ABIS.MockUSDC,
        eventName: 'Transfer',
        onLogs: (logs: any) => {
            // Check if any transfer involves this user's address
            if (address && logs.some((log: any) => {
                // Type guard for args
                const args = log.args as { from?: string; to?: string } | undefined
                return args && (args.from === address || args.to === address)
            })) {
                refetch()
            }
        },
    })

    // Update balance when data changes
    useEffect(() => {
        if (balanceData) {
            // MockUSDC has 6 decimals
            const formatted = formatUnits(balanceData as bigint, 6)
            setBalance(parseFloat(formatted).toFixed(2))
        } else {
            setBalance('0.00')
        }
    }, [balanceData])

    return {
        balance,
        isLoading: !balanceData && isConnected,
        refetch,
    }
}

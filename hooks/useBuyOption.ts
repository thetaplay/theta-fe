import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { CONTRACTS, ABIS } from '@/lib/blockchain/contracts'
import { parseUnits } from 'viem'
import { useState, useEffect } from 'react'
import { publicClient } from '@/lib/blockchain/client'

export function useBuyOption() {
    const { address } = useAccount()
    const [step, setStep] = useState<'idle' | 'checking' | 'approving' | 'buying' | 'success' | 'error'>('idle')
    const [error, setError] = useState<string | null>(null)

    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    // Auto-update step to success when transaction confirms
    useEffect(() => {
        if (isSuccess && step === 'buying') {
            setStep('success')
        }
    }, [isSuccess, step])

    const checkAndApprove = async (amount: number) => {
        if (!address) throw new Error('Wallet not connected')

        setStep('checking')
        setError(null)

        try {
            // Check current allowance
            const allowance = await publicClient.readContract({
                address: CONTRACTS.MOCK_USDC,
                abi: ABIS.MockUSDC,
                functionName: 'allowance',
                args: [address, CONTRACTS.MOCK_OPTION_BOOK],
            })

            const requiredAmount = parseUnits(amount.toString(), 6) // USDC has 6 decimals

            if ((allowance as bigint) < requiredAmount) {
                // Need approval
                setStep('approving')

                await writeContract({
                    address: CONTRACTS.MOCK_USDC,
                    abi: ABIS.MockUSDC,
                    functionName: 'approve',
                    args: [CONTRACTS.MOCK_OPTION_BOOK, requiredAmount],
                })

                return true // Approval needed and requested
            }

            return false // Already approved
        } catch (err: any) {
            setError(err.message || 'Approval failed')
            setStep('error')
            throw err
        }
    }

    const buyOption = async (order: any, nonce: string, signature: string) => {
        if (!address) throw new Error('Wallet not connected')

        setStep('buying')
        setError(null)

        try {
            console.log("order", order)
            console.log("nonce", nonce)
            console.log("signature", signature)

            // Convert signature to bytes format
            const signatureBytes = signature as `0x${string}`

            // fillOrder expects: (order, nonce, signature, referrer, strategyId)
            // referrer: address (use zero address if no referrer)
            // strategyId: bytes32 (use zero bytes32 for default strategy)
            const referrer = '0x0000000000000000000000000000000000000000' as `0x${string}`
            const strategyId = '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`

            await writeContract({
                address: CONTRACTS.MOCK_OPTION_BOOK,
                abi: ABIS.MockOptionBook,
                functionName: 'fillOrder',
                args: [order, BigInt(nonce), signatureBytes, referrer, strategyId],
            })

            // Transaction sent, waiting for confirmation...
        } catch (err: any) {
            setError(err.message || 'Transaction failed')
            setStep('error')
            console.log("err", err)
            throw err
        }
    }

    const reset = () => {
        setStep('idle')
        setError(null)
    }

    return {
        checkAndApprove,
        buyOption,
        step,
        error,
        isPending: isPending || isConfirming,
        isSuccess,
        txHash: hash,
        reset,
    }
}

'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, ABIS } from '@/lib/blockchain/contracts'
import { formatUnits } from 'viem'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { WaterDrop } from '@/components/sf-symbols'

export function FaucetClaim() {
    const { address, isConnected } = useAccount()
    const [open, setOpen] = useState(false)
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    // Read user's USDC balance
    const { data: balance, refetch: refetchBalance } = useReadContract({
        address: CONTRACTS.MOCK_USDC,
        abi: ABIS.MockUSDC,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 5000,
        },
    })

    console.log('balance', balance)

    // Read claim amount
    const { data: claimAmount } = useReadContract({
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
            enabled: !!address,
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

    const formatTimeRemaining = (seconds: number) => {
        if (seconds === 0) return 'Now'
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        if (hours > 0) return `${hours}h ${minutes}m`
        return `${minutes}m`
    }

    const handleClaim = async () => {
        try {
            await writeContract({
                address: CONTRACTS.MOCK_USDC,
                abi: ABIS.MockUSDC,
                functionName: 'claim',
            })
            setTimeout(() => refetchBalance(), 2000)
        } catch (error) {
            console.error('Claim failed:', error)
        }
    }

    // Refetch on success
    useEffect(() => {
        if (isSuccess) {
            refetchBalance()
        }
    }, [isSuccess, refetchBalance])

    if (!isConnected) return null

    const timeRemaining = getTimeUntilNextClaim()
    const isClaimable = canClaim()
    const formattedBalance = balance ? formatUnits(balance as bigint, 6) : '0'
    const formattedClaimAmount = claimAmount ? formatUnits(claimAmount as bigint, 6) : '1000'

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-500/10 text-blue-600 text-sm font-bold hover:bg-blue-500/20 transition-all border border-blue-200">
                    <WaterDrop size={16} />
                    Faucet
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <WaterDrop size={24} className="text-blue-600" />
                        </div>
                        USDC Faucet
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Balance */}
                    <div className="bg-white border-2 border-slate-100 rounded-2xl p-4">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Your Balance</p>
                        <p className="text-3xl font-extrabold text-slate-900">
                            {parseFloat(formattedBalance).toLocaleString()}{' '}
                            <span className="text-lg text-slate-400">USDC</span>
                        </p>
                    </div>

                    {/* Claim Amount */}
                    <div className="bg-gradient-to-br from-blue-50 to-transparent border-2 border-blue-100 rounded-2xl p-4">
                        <p className="text-xs font-semibold text-blue-600 mb-1">Claim Amount</p>
                        <p className="text-2xl font-extrabold text-blue-700">
                            {parseFloat(formattedClaimAmount).toLocaleString()}{' '}
                            <span className="text-base">USDC</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Free test tokens for Base Sepolia</p>
                    </div>

                    {/* Status Messages */}
                    {!isClaimable && (
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
                            <p className="text-xs font-semibold text-orange-600 mb-1">Next claim available in</p>
                            <p className="text-xl font-extrabold text-orange-700">
                                {formatTimeRemaining(timeRemaining)}
                            </p>
                        </div>
                    )}

                    {(isPending || isConfirming) && (
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <div>
                                    <p className="text-sm font-bold text-blue-900">
                                        {isPending ? 'Confirm in wallet...' : 'Processing transaction...'}
                                    </p>
                                    <p className="text-xs text-blue-700">Please wait</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isSuccess && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">✓</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-green-900">Claim successful!</p>
                                    <p className="text-xs text-green-700">USDC added to your balance</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Claim Button */}
                    <button
                        onClick={handleClaim}
                        disabled={!isClaimable || isPending || isConfirming}
                        className="w-full py-4 px-6 bg-[#4CC658] text-slate-900 font-bold rounded-xl shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                    >
                        {isPending || isConfirming ? (
                            <>
                                <div className="w-5 h-5 border-3 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : isClaimable ? (
                            <>
                                <WaterDrop size={20} />
                                Claim {parseFloat(formattedClaimAmount).toLocaleString()} USDC
                            </>
                        ) : (
                            'Cooldown active'
                        )}
                    </button>

                    <p className="text-xs text-center text-slate-400">
                        Testnet tokens only • {claimInterval ? `${Number(claimInterval) / 3600}h` : '24h'} cooldown
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

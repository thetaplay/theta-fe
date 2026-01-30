'use client'

import { useRecommendations } from '@/hooks/useRecommendations'
import { useBuyOption } from '@/hooks/useBuyOption'
import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { ConnectButton } from '@/components/wallet/ConnectButton'
import { cn } from '@/lib/utils'

interface RecommendationCardProps {
    recommendation: any
    onBuy: () => void
    buying: boolean
}

function RecommendationCard({ recommendation, onBuy, buying }: RecommendationCardProps) {
    const { asset, type, strike, expiry, premium, metadata } = recommendation

    const expiryDate = new Date(expiry * 1000).toLocaleDateString()

    return (
        <div className="bg-white rounded-3xl border-2 border-slate-100 p-6 hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                        {asset} {type}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Strike: ${strike?.toLocaleString()} | Expires: {expiryDate}
                    </p>
                </div>
                <span className="text-2xl">
                    {type === 'CALL' ? '📈' : '🛡️'}
                </span>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Premium</span>
                    <span className="font-bold text-slate-900">${premium?.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Potential PnL</span>
                    <span className="font-bold text-primary">
                        +${metadata?.maxProfit?.toFixed(2) || '0.00'}
                    </span>
                </div>
                {/* <div className="flex justify-between text-sm">
                    <span className="text-slate-600">ROI</span>
                    <span className="font-bold text-blue-600">
                        +{metadata?.roi || '0'}%
                    </span>
                </div> */}
            </div>

            <div className="pt-3 border-t border-slate-100 mb-4">
                <p className="text-xs text-slate-500 font-medium mb-2">Why this option?</p>
                <p className="text-xs text-slate-700">{metadata?.explanation || 'AI recommended'}</p>
            </div>

            <button
                onClick={onBuy}
                disabled={buying}
                className="w-full py-3 px-6 bg-[#4CC658] text-slate-900 font-bold rounded-xl shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
                {buying ? 'Processing...' : `Buy for $${premium?.toFixed(2)}`}
            </button>
        </div>
    )
}

interface OptionsDisplayProps {
    profile: {
        goal?: string
        riskComfort?: string
        confidence?: string
        amount?: number
    }
    header?: boolean
    onBack: () => void
    onSuccess: () => void
}

export function OptionsDisplay({ profile, header = true, onBack, onSuccess }: OptionsDisplayProps) {
    const { isConnected } = useAccount()
    const [selectedRec, setSelectedRec] = useState<any>(null)
    const [transactionError, setTransactionError] = useState<string | null>(null)

    // Map UI values to API values
    const apiProfile = {
        goal: profile.goal === 'protect' ? 'PROTECT_ASSET' :
            profile.goal === 'upside' ? 'CAPTURE_UPSIDE' : 'EARN_SAFELY',
        riskComfort: profile.riskComfort === 'conservative' ? 'CONSERVATIVE' :
            profile.riskComfort === 'moderate' ? 'MODERATE' : 'AGGRESSIVE',
        confidence: profile.confidence, // Already in uppercase: 'HIGH', 'MID', or 'LOW'
        amount: profile.amount || 100,
    }

    const { data: recommendations, isLoading, error } = useRecommendations(apiProfile as any)
    const { checkAndApprove, buyOption, step, error: buyError, isPending, isSuccess, reset } = useBuyOption()

    // Listen for transaction success and call onSuccess
    useEffect(() => {
        if (isSuccess && step === 'success') {
            onSuccess()
        }
    }, [isSuccess, step, onSuccess])

    const handleBuy = async (rec: any) => {
        if (!isConnected) {
            setTransactionError('Please connect your wallet first')
            return
        }

        setSelectedRec(rec)
        setTransactionError(null) // Clear previous errors

        try {
            // Step 1: Check and approve if needed (this waits for approval to complete)
            await checkAndApprove(rec.premium)

            // Step 2: Buy option (automatically proceeds after approval if needed)
            await buyOption(rec.order, rec.nonce, rec.signature)

            // Success will be handled by useEffect when transaction confirms
        } catch (err: any) {
            console.error('Buy error:', err)

            // Detailed error messages
            let errorMessage = 'Transaction failed'

            if (err.message) {
                if (err.message.includes('User rejected')) {
                    errorMessage = 'Transaction cancelled by user'
                } else if (err.message.includes('insufficient funds')) {
                    errorMessage = 'Insufficient balance to complete transaction'
                } else if (err.message.includes('allowance')) {
                    errorMessage = 'Token approval failed. Please try again'
                } else if (err.message.includes('nonce')) {
                    errorMessage = 'Invalid transaction nonce. Please refresh and try again'
                } else {
                    errorMessage = err.message
                }
            }

            setTransactionError(errorMessage)
            reset()
            setSelectedRec(null)
        }
    }

    if (!isConnected) {
        return (
            <div className="fixed inset-0 w-screen h-screen flex flex-col bg-slate-50 z-[9999]">
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center space-y-6">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-5xl">🔐</span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-extrabold text-slate-900">Connect Wallet</h2>
                            <p className="text-slate-500 font-medium">Connect your wallet to view and buy options</p>
                        </div>
                        <ConnectButton />
                        <button
                            onClick={onBack}
                            className="text-slate-400 hover:text-slate-600 font-bold"
                        >
                            ← Go Back
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={cn(header && "w-screen h-screen flex flex-col fixed inset-0 z-[10]")}>
            {/* Header */}
            {header && <div className="px-6 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-white/95 border-b border-slate-100 z-10">
                <button
                    onClick={onBack}
                    disabled={isPending}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                    ←
                </button>
                <div className="flex-1 px-4">
                    <div className="flex gap-1 justify-center">
                        <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                        <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                        <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                        <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                    </div>
                </div>
                <button
                    onClick={() => window.location.href = '/'}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold"
                >
                    ✕
                </button>
            </div>
            }

            {/* Content */}
            <div className={cn("flex-1 overflow-y-auto", header && "px-6 pt-6 pb-32")}>
                <div className="mb-8">
                    <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-2">
                        AI Recommended Options
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                        Based on your profile: {apiProfile.goal.replace('_', ' ')} | {apiProfile.riskComfort}
                    </p>
                </div>

                {/* Transaction Status */}
                {step !== 'idle' && step !== 'success' && (
                    <div className="mb-6 p-4 rounded-2xl bg-blue-50 border-2 border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                                {step === 'approving' && '🔓'}
                                {step === 'buying' && '⚡'}
                                {step === 'checking' && '🔍'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-blue-900">
                                    {step === 'checking' && 'Checking allowance...'}
                                    {step === 'approving' && 'Approving USDC...'}
                                    {step === 'buying' && 'Buying option...'}
                                </p>
                                <p className="text-xs text-blue-700">Please confirm in your wallet</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transaction Error */}
                {transactionError && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-200">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-bold text-red-900">{transactionError}</p>
                            <button
                                onClick={() => setTransactionError(null)}
                                className="text-red-400 hover:text-red-600 font-bold"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {(error || buyError) && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-200">
                        <p className="text-sm font-bold text-red-900">
                            {error?.message || buyError || 'An error occurred'}
                        </p>
                    </div>
                )}

                {/* Loading */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500 font-medium">Finding best options...</p>
                    </div>
                )}

                {/* Recommendations */}
                {!isLoading && recommendations && recommendations.length > 0 && (
                    <div className="space-y-4">
                        {recommendations.map((rec: any, idx: number) => (
                            <RecommendationCard
                                key={idx}
                                recommendation={rec}
                                onBuy={() => handleBuy(rec)}
                                buying={isPending && selectedRec === rec}
                            />
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!isLoading && (!recommendations || recommendations.length === 0) && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-5xl">🤔</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No options available</h3>
                        <p className="text-slate-500 mb-6">Try adjusting your preferences</p>
                        <button
                            onClick={onBack}
                            className="py-3 px-6 bg-slate-200 text-slate-900 font-bold rounded-xl"
                        >
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

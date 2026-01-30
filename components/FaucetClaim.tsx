'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { WaterDrop } from '@/components/sf-symbols'
import { useMockUSDC } from '@/hooks/useMockUSDC'
import { useFaucetClaim } from '@/hooks/useFaucetClaim'

export function FaucetClaim() {
    const { isConnected } = useAccount()
    const [open, setOpen] = useState(false)

    // Use custom hooks instead of direct contract calls
    const { balance } = useMockUSDC()
    const {
        claimAmount,
        claimInterval,
        canClaim,
        timeUntilNextClaim,
        formatTimeRemaining,
        handleClaim,
        isPending,
        isConfirming,
        isSuccess,
    } = useFaucetClaim()

    if (!isConnected) return null

    // Format balance for display
    const formattedBalance = balance || '0'
    const formattedClaimAmount = claimAmount

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left">
                    <WaterDrop size={16} className="text-muted-foreground" />
                    <span className='text-sm font-medium text-foreground'>
                        Claim USDC
                    </span>
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
                    <div className="bg-gradient-to-br from-green-50 to-transparent border-2 border-green-100 rounded-2xl p-4">
                        <p className="text-xs font-semibold text-green-600 mb-1">Claim Amount</p>
                        <p className="text-2xl font-extrabold text-green-700">
                            {parseFloat(formattedClaimAmount).toLocaleString()}{' '}
                            <span className="text-base">USDC</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Free test tokens for Base Sepolia</p>
                    </div>

                    {/* Status Messages */}
                    {!canClaim && (
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
                            <p className="text-xs font-semibold text-orange-600 mb-1">Next claim available in</p>
                            <p className="text-xl font-extrabold text-orange-700">
                                {formatTimeRemaining(timeUntilNextClaim)}
                            </p>
                        </div>
                    )}

                    {(isPending || isConfirming) && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                <div>
                                    <p className="text-sm font-bold text-green-900">
                                        {isPending ? 'Confirm in wallet...' : 'Processing transaction...'}
                                    </p>
                                    <p className="text-xs text-green-700">Please wait</p>
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
                        disabled={!canClaim || isPending || isConfirming}
                        className="w-full py-4 px-6 bg-[#4CC658] text-slate-900 font-bold rounded-xl shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                    >
                        {isPending || isConfirming ? (
                            <>
                                <div className="w-5 h-5 border-3 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : canClaim ? (
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

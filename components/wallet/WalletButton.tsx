'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { ConnectButton as OnchainKitConnectButton } from '@/components/wallet/ConnectButton'
import { useMockUSDC } from '@/hooks/useMockUSDC'
import { useState } from 'react'
import { ChevronDown, Copy, LogOut, Check, Wallet as WalletIcon } from 'lucide-react'
import { FaucetClaim } from '../FaucetClaim'

export function WalletButton() {
    const { address, isConnected } = useAccount()
    const { balance, isLoading } = useMockUSDC()
    const { disconnect } = useDisconnect()
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    // Handle copy address
    const handleCopy = () => {
        if (address) {
            navigator.clipboard.writeText(address)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // If not connected, show connect button
    if (!isConnected || !address) {
        return <OnchainKitConnectButton />
    }

    // Truncate address: 0x1234...5678
    const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`

    return (
        <div className="relative">
            {/* Wallet Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-card to-muted/30 border border-border shadow-sm hover:shadow-md transition-all active:scale-95"
            >
                {/* Balance */}
                {/* <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Balance
                    </span>
                    {isLoading ? (
                        <div className="w-16 h-3 bg-muted animate-pulse rounded" />
                    ) : (
                        <span className="text-sm font-bold text-foreground">
                            ${balance}
                        </span>
                    )}
                </div> */}

                {/* Divider */}
                {/* <div className="w-px h-8 bg-border" /> */}

                {/* Address */}
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#4CC658] animate-pulse" />
                    <span className="text-xs font-medium text-foreground">{truncated}</span>
                    <ChevronDown
                        size={14}
                        className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-br from-primary/5 to-transparent border-b border-border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <WalletIcon size={20} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                                        Wallet
                                    </p>
                                    <p className="text-sm font-bold text-foreground">{truncated}</p>
                                </div>
                            </div>

                            {/* Balance Card */}
                            <div className="bg-gradient-to-br from-[#4CC658]/10 to-transparent border border-[#4CC658]/20 rounded-xl p-3">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                    Mock USDC Balance
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    ${balance}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-2">
                            {/* Copy Address */}
                            <FaucetClaim />
                            <button
                                onClick={handleCopy}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                            >
                                {copied ? (
                                    <Check size={16} className="text-[#4CC658]" />
                                ) : (
                                    <Copy size={16} className="text-muted-foreground" />
                                )}
                                <span className="text-sm font-medium text-foreground">
                                    {copied ? 'Copied!' : 'Copy Address'}
                                </span>
                            </button>

                            {/* Disconnect */}
                            <button
                                onClick={() => {
                                    disconnect()
                                    setIsOpen(false)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left group"
                            >
                                <LogOut size={16} className="text-muted-foreground group-hover:text-red-500" />
                                <span className="text-sm font-medium text-foreground group-hover:text-red-500">
                                    Disconnect
                                </span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

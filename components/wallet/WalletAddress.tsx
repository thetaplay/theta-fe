'use client'

import { useAccount } from 'wagmi'
import { ConnectButton } from '@/components/wallet/ConnectButton'

export function WalletAddress() {
    const { address, isConnected } = useAccount()

    if (!isConnected || !address) {
        return <ConnectButton />
    }

    // Truncate address: 0x1234...5678
    const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`

    return (
        <div className="px-3 py-1.5 rounded-full bg-muted text-xs font-medium flex items-center gap-1 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {truncated}
        </div>
    )
}

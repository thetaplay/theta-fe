'use client'

import { ReactNode } from 'react'
import { IOSHeader } from './IOSHeader'
import IOSPageTransition from './IOSPageTransition'
import { WalletButton } from '@/components/wallet/WalletButton'
import { BellFill } from '../sf-symbols'
import { useAccount } from 'wagmi'

interface PageLayoutProps {
    title: string
    subtitle?: string
    rightContent?: ReactNode
    withTransition?: boolean
    showBack?: boolean
    onBack?: () => void
    showWallet?: boolean // Option to hide wallet if needed
    showLogo?: boolean // Show logo instead of title
    children: ReactNode
}

export function PageLayout({
    title,
    subtitle,
    rightContent,
    withTransition = true,
    showBack = false,
    onBack,
    showWallet = true, // Show wallet by default
    showLogo = false, // Show logo by default on home page
    children
}: PageLayoutProps) {
    const { isConnected } = useAccount()
    // Use WalletButton as default if no rightContent provided and showWallet is true
    const headerRightContent = rightContent !== undefined
        ? rightContent
        : (showWallet ? <div className='flex items-center gap-2'>
            <WalletButton />
            {isConnected &&
                <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-md active:scale-95 transition-transform">
                    <BellFill size={20} />
                </button>
            }
        </div> : undefined)

    const content = (
        <div className="w-full h-screen flex flex-col bg-gray-100">
            <IOSHeader showBack={showBack} onBack={onBack} title={title} subtitle={subtitle} rightContent={headerRightContent} showLogo={showLogo} />
            <div className="flex-1 overflow-y-auto p-4 pt-16 pb-24 mt-0">
                <div className="space-y-4 mt-4">
                    {children}
                </div>
            </div>
        </div>
    )

    if (withTransition) {
        return <IOSPageTransition>{content}</IOSPageTransition>
    }

    return content
}

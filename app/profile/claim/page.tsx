'use client'

import { IOSHeader } from '@/components/IOSHeader'
import { ChevronLeft } from '@/components/sf-symbols'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ClaimPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  const handleClaim = () => {
    setIsClaiming(true)
    setTimeout(() => {
      setIsClaiming(false)
      setClaimed(true)
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    }, 2000)
  }

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Header */}
      <IOSHeader
        title="Claim Funds"
        leftContent={
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-foreground" />
          </button>
        }
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pt-20 md:pt-24 lg:pt-24 pb-24">
        {/* Success Animation */}
        {claimed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 mx-4 text-center shadow-2xl">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-green-600 text-5xl">check_circle</span>
              </div>
              <h3 className="text-2xl font-extrabold text-foreground mb-2">Claimed Successfully!</h3>
              <p className="text-sm text-muted-foreground">Funds sent to your wallet</p>
            </div>
          </div>
        )}

        {/* Claim Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-3xl">account_balance_wallet</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-foreground">Ready to Claim</h2>
              <p className="text-sm text-muted-foreground">Downside Protection</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-4 bg-white rounded-2xl">
              <span className="text-sm font-medium text-muted-foreground">Final Payout</span>
              <span className="text-lg font-bold text-foreground">$100.00 USDC</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white rounded-2xl">
              <span className="text-sm font-medium text-muted-foreground">Premium Paid</span>
              <span className="text-lg font-bold text-foreground">-$10.00</span>
            </div>
            <div className="h-px bg-green-200"></div>
            <div className="flex justify-between items-center p-4 bg-green-100 rounded-2xl">
              <span className="text-sm font-extrabold text-foreground">Net Amount</span>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-green-600">+$90.00</span>
                <p className="text-xs font-bold text-green-500">900% ROI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="bg-card border border-border rounded-3xl p-5 mb-6">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Destination Wallet</h4>
          <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-2xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">wallet</span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Connected Wallet</p>
              <p className="text-xs text-muted-foreground font-mono">0x1234...5678</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-blue-600 text-xl">info</span>
            <div>
              <h4 className="font-bold text-blue-900 text-sm mb-1">Transaction Details</h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Funds will be transferred to your connected wallet. Gas fees will be covered by the protocol.
              </p>
            </div>
          </div>
        </div>

        {/* Claim Button */}
        <button
          onClick={handleClaim}
          disabled={isClaiming || claimed}
          className="w-full py-4 px-6 bg-[#4CC658] text-slate-900 font-bold rounded-2xl shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isClaiming ? (
            <>
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              Processing...
            </>
          ) : claimed ? (
            <>
              <span className="material-symbols-outlined">check</span>
              Claimed!
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">download</span>
              Claim $90.00 USDC
            </>
          )}
        </button>
      </div>
    </div>
  )
}

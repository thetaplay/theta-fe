'use client'

import { useRouter } from 'next/navigation'
import { IOSHeader } from '@/components/layout/IOSHeader'
import { MarketSentimentCard } from '@/components/home/MarketSentimentCard'
import { AssetPriceCard } from '@/components/home/AssetPriceCard'
import { BoltFill, Flame } from '@/components/sf-symbols'
import { PageLayout } from '@/components/layout/PageLayout'

export default function HomePage() {
  const router = useRouter()
  return (
    <PageLayout title="Nawasena" showLogo={true}>
      {/* Highlight Event Card */}
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-purple-800/40 rounded-3xl blur-xl" />
        <div className="relative bg-gradient-to-br from-purple-900 to-purple-800 border border-purple-700/50 rounded-3xl p-6 overflow-hidden">
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-700/30 rounded-full blur-3xl -z-10" />

          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-semibold">
                Featured Event Option
              </span>
              <h2 className="text-xl font-bold text-white mt-3">
                FOMC Rate Decision Prediction
              </h2>
            </div>
            <BoltFill className="text-purple-300" size={24} />
          </div>

          <p className="text-sm text-purple-200 mb-4">
            Predict: Hold vs Cut vs Hike | Odds: 1.85x-2.10x | Closes: Jan 29
          </p>

          {/* Countdown */}
          <div className="flex gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-300">2</p>
              <p className="text-xs text-purple-300/70">days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-300">14</p>
              <p className="text-xs text-purple-300/70">hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-300">32</p>
              <p className="text-xs text-purple-300/70">mins</p>
            </div>
          </div>
          <button
            className="w-full py-2.5 px-6 bg-white text-slate-900 font-bold rounded-xl shadow-[0_4px_0_0_#cbd5e1] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-1.5"
            onClick={() => router.push('/trade')}
          >
            Place Prediction
          </button>
        </div>
      </div>

      {/* Asset Price Section */}
      <div className="mb-6">
        <AssetPriceCard />
      </div>

      {/* Market Sentiment Section */}
      <div className="mb-6">
        <MarketSentimentCard />
      </div>

      {/* Stats Cards */}
      {/* <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-3">
          Your Prediction Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-4">
            <p className="text-sm text-muted-foreground mb-1">
              Win Rate
            </p>
            <p className="text-3xl font-bold text-primary">68%</p>
            <p className="text-xs text-muted-foreground mt-2">
              profitable trades
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-100/20 to-transparent border border-blue-200/30 rounded-3xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Total XP</p>
            <p className="text-3xl font-bold text-blue-600">
              1,250
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Level 5
            </p>
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="bg-card border border-border rounded-3xl p-5 soft-shadow mb-4">
        <h3 className="font-semibold text-foreground mb-2">
          Ready to trade?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start making predictions on upcoming market events and build your reputation.
        </p>
        <button
          className="flex items-center justify-center gap-1.5 py-2.5 px-6 rounded-xl bg-[#4CC658] text-slate-900 font-bold shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all w-full"
          onClick={() => router.push('/event')}
        >
          Explore Events
        </button>
      </div>
    </PageLayout>
  )
}

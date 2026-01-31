'use client'

import { useEffect, useState } from 'react'
import { XMark, CheckmarkCircleFill, ArrowUpRight, ArrowDownLeft } from '@/components/sf-symbols'
import { useAssetPrice } from '@/hooks/useAssetPrice'

interface ViewMarketOverviewModalProps {
  onClose: () => void
  onComplete: () => void
}

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  trend: 'up' | 'down'
  volume: string
  marketCap: string
}

export default function ViewMarketOverviewModal({ onClose, onComplete }: ViewMarketOverviewModalProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const btcPrice = useAssetPrice('BTC', 30000)
  const ethPrice = useAssetPrice('ETH', 30000)
  const [btcChange, setBtcChange] = useState(0)
  const [ethChange, setEthChange] = useState(0)

  useEffect(() => {
    const initialBtc = localStorage.getItem('initial_btc_price')

    if (!initialBtc && btcPrice.price > 0) {
      localStorage.setItem('initial_btc_price', btcPrice.price.toString())
      setBtcChange(0)
    } else if (initialBtc && btcPrice.price > 0) {
      const change = ((btcPrice.price - parseFloat(initialBtc)) / parseFloat(initialBtc)) * 100
      setBtcChange(change)
    }
  }, [btcPrice.price])

  useEffect(() => {
    const initialEth = localStorage.getItem('initial_eth_price')

    if (!initialEth && ethPrice.price > 0) {
      localStorage.setItem('initial_eth_price', ethPrice.price.toString())
      setEthChange(0)
    } else if (initialEth && ethPrice.price > 0) {
      const change = ((ethPrice.price - parseFloat(initialEth)) / parseFloat(initialEth)) * 100
      setEthChange(change)
    }
  }, [ethPrice.price])

  const marketData: MarketData[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: btcPrice.price,
      change: 0,
      changePercent: Number(btcChange.toFixed(2)),
      trend: btcChange >= 0 ? 'up' : 'down',
      volume: '—',
      marketCap: '—'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: ethPrice.price,
      change: 0,
      changePercent: Number(ethChange.toFixed(2)),
      trend: ethChange >= 0 ? 'up' : 'down',
      volume: '—',
      marketCap: '—'
    }
  ]

  const formatPrice = (price: number) => {
    if (!price) return '---'
    return price.toLocaleString()
  }

  const trend24h = (btcChange + ethChange) / 2
  const marketSentiment = trend24h >= 1
    ? { bullish: 70, neutral: 20, bearish: 10 }
    : trend24h <= -1
      ? { bullish: 10, neutral: 20, bearish: 70 }
      : { bullish: 25, neutral: 50, bearish: 25 }

  const handleComplete = () => {
    setIsCompleted(true)
    setTimeout(() => {
      onComplete()
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
      <div className="w-full bg-white rounded-t-3xl shadow-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-bold">Market Overview</h2>
            <p className="text-green-100 text-sm mt-0.5">Real-time market data and sentiment</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-700 rounded-full transition"
          >
            <XMark width={24} height={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 space-y-6">
          {/* Market Sentiment */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Market Sentiment</h3>
            
            <div className="space-y-3">
              {/* Bullish */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="font-semibold text-gray-700">Bullish</span>
                  </div>
                  <span className="font-bold text-lg text-green-600">{marketSentiment.bullish}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${marketSentiment.bullish}%` }} />
                </div>
              </div>

              {/* Neutral */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="font-semibold text-gray-700">Neutral</span>
                  </div>
                  <span className="font-bold text-lg text-yellow-600">{marketSentiment.neutral}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: `${marketSentiment.neutral}%` }} />
                </div>
              </div>

              {/* Bearish */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="font-semibold text-gray-700">Bearish</span>
                  </div>
                  <span className="font-bold text-lg text-red-600">{marketSentiment.bearish}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${marketSentiment.bearish}%` }} />
                </div>
              </div>
            </div>

            <p className="text-sm text-purple-700 mt-4 font-medium">
              Overall: {trend24h >= 1 ? 'Bullish Momentum' : trend24h <= -1 ? 'Bearish Momentum' : 'Sideways / Neutral'}
            </p>
          </div>

          {/* Top Movers */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Top Movers</h3>
            <div className="space-y-3">
              {marketData.map((asset, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                        {asset.symbol}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{asset.name}</h4>
                        <p className="text-sm text-gray-500">{asset.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">${formatPrice(asset.price)}</p>
                      <div className={`flex items-center gap-1 justify-end font-bold text-sm ${
                        asset.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {asset.trend === 'up' ? (
                          <ArrowUpRight width={16} height={16} />
                        ) : (
                          <ArrowDownLeft width={16} height={16} />
                        )}
                        {asset.changePercent > 0 ? '+' : ''}{asset.changePercent}%
                      </div>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">24h Volume</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{asset.volume}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Market Cap</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{asset.marketCap}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">📈 Key Insights</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Bitcoin shows steady demand as price updates in real time</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Ethereum price is tracking live oracle updates</span>
              </li>
            </ul>
          </div>

          {/* Completion Message */}
          {isCompleted && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 text-center animate-pulse">
              <div className="flex justify-center mb-3">
                <CheckmarkCircleFill width={48} height={48} className="text-green-600" />
              </div>
              <p className="text-green-900 font-bold text-lg">Market Check Complete!</p>
              <p className="text-green-700 text-sm mt-1">+20 XP Earned</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleComplete}
            disabled={isCompleted}
            className="w-full px-6 py-3 bg-[#4CC658] hover:bg-[#45B950] disabled:bg-[#4CC658]/60 text-black font-semibold rounded-full shadow-[0_4px_0_0_#3BAE4B] active:shadow-none active:translate-y-[4px] transition flex items-center justify-center gap-2"
          >
              {isCompleted ? (
                <>
                  <CheckmarkCircleFill width={20} height={20} />
                  Completed
                </>
              ) : (
                <>Mark as Complete</>
              )}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}

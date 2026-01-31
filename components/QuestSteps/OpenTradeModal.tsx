'use client'

import { useEffect, useState } from 'react'
import { XMark, CheckmarkCircleFill } from '@/components/sf-symbols'
import { useAssetPrice } from '@/hooks/useAssetPrice'

interface OpenTradeModalProps {
  onClose: () => void
  onComplete: () => void
}

interface TradeForm {
  side: 'buy' | 'sell'
  symbol: string
  quantity: number
  price: number
  orderType: 'market' | 'limit'
  leverage: number
}

export default function OpenTradeModal({ onClose, onComplete }: OpenTradeModalProps) {
  const btcPrice = useAssetPrice('BTC', 30000)
  const ethPrice = useAssetPrice('ETH', 30000)
  const [formData, setFormData] = useState<TradeForm>({
    side: 'buy',
    symbol: 'BTC',
    quantity: 1,
    price: 0,
    orderType: 'market',
    leverage: 1
  })
  const [isCompleted, setIsCompleted] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const assets = [
    { symbol: 'BTC', name: 'Bitcoin', price: btcPrice.price },
    { symbol: 'ETH', name: 'Ethereum', price: ethPrice.price }
  ]

  useEffect(() => {
    if (formData.orderType !== 'market') return
    const currentPrice = formData.symbol === 'BTC' ? btcPrice.price : ethPrice.price
    if (currentPrice > 0 && currentPrice !== formData.price) {
      setFormData(prev => ({ ...prev, price: currentPrice }))
    }
  }, [formData.symbol, formData.orderType, btcPrice.price, ethPrice.price, formData.price])

  const selectedAsset = assets.find(a => a.symbol === formData.symbol)
  const totalValue = formData.quantity * formData.price * formData.leverage
  const estimatedFee = totalValue * 0.001 // 0.1% fee

  const formatPrice = (price: number) => {
    if (!price) return '---'
    return price.toLocaleString()
  }

  const handleExecuteTrade = () => {
    setConfirmed(true)
    setTimeout(() => {
      setIsCompleted(true)
      setTimeout(() => {
        onComplete()
        onClose()
      }, 1500)
    }, 800)
  }

  if (isCompleted) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
        <div className="w-full bg-white rounded-t-3xl shadow-2xl max-h-[95vh] flex flex-col items-center justify-center py-12 px-6">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-bounce">
            <CheckmarkCircleFill width={56} height={56} className="text-green-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trade Executed!</h2>
          
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              Successfully {formData.side === 'buy' ? 'bought' : 'sold'} {formData.quantity} {formData.symbol}
            </p>
            <div className="bg-green-50 p-4 rounded-xl border border-green-200 inline-block">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2 text-center text-sm text-gray-600 mb-8">
            <p>✓ Order confirmed on blockchain</p>
            <p>✓ Trade added to your portfolio</p>
          </div>

          <button
            onClick={() => {
              onComplete()
              onClose()
            }}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
        <div className="w-full bg-white rounded-t-3xl shadow-2xl max-h-[95vh] flex flex-col items-center justify-center py-12 px-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 animate-spin">
            <BoltFill width={32} height={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Processing Trade...</h2>
          <p className="text-gray-600 mt-2">Please wait while we process your order</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
      <div className="w-full bg-white rounded-t-3xl shadow-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-bold">Open Trade</h2>
            <p className="text-green-50 text-sm mt-0.5">Execute a buy or sell order</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-700 rounded-full transition"
          >
            <XMark width={24} height={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 space-y-6">
          {/* Trade Side Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Trade Side
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormData({ ...formData, side: 'buy' })}
                className={`py-3 rounded-xl font-bold transition ${
                  formData.side === 'buy'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Buy 📈
              </button>
              <button
                onClick={() => setFormData({ ...formData, side: 'sell' })}
                className={`py-3 rounded-xl font-bold transition ${
                  formData.side === 'sell'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sell 📉
              </button>
            </div>
          </div>

          {/* Asset Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Asset
            </label>
            <div className="space-y-2">
              {assets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setFormData({ ...formData, symbol: asset.symbol, price: asset.price || 0 })}
                  className={`w-full p-3 rounded-xl text-left transition border-2 ${
                    formData.symbol === asset.symbol
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{asset.name}</p>
                      <p className="text-sm text-gray-600">{asset.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${formatPrice(asset.price)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              placeholder="Enter quantity"
              step="0.001"
            />
            <p className="text-xs text-gray-600 mt-2">
              Current price: ${formatPrice(formData.price)}
            </p>
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Order Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormData({ ...formData, orderType: 'market' })}
                className={`py-2 rounded-lg font-semibold transition ${
                  formData.orderType === 'market'
                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Market
              </button>
              <button
                onClick={() => setFormData({ ...formData, orderType: 'limit' })}
                className={`py-2 rounded-lg font-semibold transition ${
                  formData.orderType === 'limit'
                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Limit
              </button>
            </div>
          </div>

          {/* Leverage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Leverage: {formData.leverage}x
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.leverage}
              onChange={(e) => setFormData({ ...formData, leverage: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>1x (No leverage)</span>
              <span>10x (Maximum)</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 space-y-3">
            <h3 className="font-bold text-gray-900">Order Summary</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Side</p>
                <p className="text-lg font-bold text-gray-900 capitalize mt-1">{formData.side}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Amount</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formData.quantity} {formData.symbol}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-green-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Entry Price:</span>
                <span className="font-bold text-gray-900">${formData.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Trading Fee (0.1%):</span>
                <span className="font-bold text-gray-900">${estimatedFee.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-green-200 flex justify-between">
                <span className="font-bold text-gray-900">Total Value:</span>
                <span className="text-xl font-bold text-green-600">${totalValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Risk Warning */}
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-900">
              ⚠️ <span className="font-semibold">Risk Notice:</span> Trading with leverage increases both potential profits and losses. Start small and learn risk management.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleExecuteTrade}
            className="w-full px-6 py-3 bg-[#4CC658] hover:bg-[#45B950] text-black font-semibold rounded-full shadow-[0_4px_0_0_#3BAE4B] active:shadow-none active:translate-y-[4px] transition flex items-center justify-center gap-2"
          >
            Execute Trade
          </button>
        </div>
      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}

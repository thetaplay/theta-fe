'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, CandlestickChart, CandlestickChartIcon, ChartBar } from 'lucide-react'
import { useAssetPrice } from '@/hooks/useAssetPrice'

interface Asset {
    symbol: string
    name: string
    icon: string
    color: string
}

const ASSETS: Asset[] = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: 'bg-orange-100 text-orange-600' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: 'bg-blue-100 text-blue-600' },
]

export function AssetPriceCard() {
    const btcPrice = useAssetPrice('BTC', 30000) // Refresh every 30s
    const ethPrice = useAssetPrice('ETH', 30000)

    const [btcChange, setBtcChange] = useState(0)
    const [ethChange, setEthChange] = useState(0)

    // Track previous prices for change calculation
    useEffect(() => {
        // Get initial price from localStorage (saved once at the beginning)
        const initialBtc = localStorage.getItem('initial_btc_price')

        if (!initialBtc && btcPrice.price > 0) {
            // First time getting price - save as initial
            localStorage.setItem('initial_btc_price', btcPrice.price.toString())
            setBtcChange(0) // No change on first load
        } else if (initialBtc && btcPrice.price > 0) {
            // Calculate change based on INITIAL price, not previous price
            const change = ((btcPrice.price - parseFloat(initialBtc)) / parseFloat(initialBtc)) * 100
            setBtcChange(change)
        }
    }, [btcPrice.price])

    useEffect(() => {
        // Get initial price from localStorage (saved once at the beginning)
        const initialEth = localStorage.getItem('initial_eth_price')

        if (!initialEth && ethPrice.price > 0) {
            // First time getting price - save as initial
            localStorage.setItem('initial_eth_price', ethPrice.price.toString())
            setEthChange(0) // No change on first load
        } else if (initialEth && ethPrice.price > 0) {
            // Calculate change based on INITIAL price, not previous price
            const change = ((ethPrice.price - parseFloat(initialEth)) / parseFloat(initialEth)) * 100
            setEthChange(change)
        }
    }, [ethPrice.price])

    const formatPrice = (price: number) => {
        if (price === 0) return '---'
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price)
    }

    const formatChange = (change: number) => {
        if (change === 0) return '0.0'
        return `${change >= 0 ? '+' : ''}${change.toFixed(2)}`
    }

    return (
        <div className="w-full bg-card border border-border rounded-3xl p-6 card-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                        Live Asset Prices
                    </h3>
                    <h2 className="text-2xl font-bold text-foreground">Market</h2>
                </div>
            </div>

            {/* Asset Cards */}
            <div className="space-y-3">
                {/* BTC */}
                <div className="bg-gradient-to-br from-orange-50/50 to-transparent border border-orange-100/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-orange-600">₿</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-foreground">Bitcoin</h4>
                                <p className="text-xs text-muted-foreground">BTC</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {btcPrice.isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-5 bg-muted animate-pulse rounded" />
                                </div>
                            ) : btcPrice.error ? (
                                <p className="text-xs text-red-500">Error</p>
                            ) : (
                                <>
                                    <p className="text-lg font-bold text-foreground">
                                        {formatPrice(btcPrice.price)}
                                    </p>
                                    <div className="flex items-center gap-1 justify-end mt-0.5">
                                        {btcChange >= 0 ? (
                                            <TrendingUp className="text-[#4CC658]" size={14} />
                                        ) : (
                                            <TrendingDown className="text-red-500" size={14} />
                                        )}
                                        <span
                                            className={`text-xs font-bold ${btcChange >= 0 ? 'text-[#4CC658]' : 'text-red-500'
                                                }`}
                                        >
                                            {formatChange(btcChange)}%
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ETH */}
                <div className="bg-gradient-to-br from-blue-50/50 to-transparent border border-blue-100/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-blue-600">Ξ</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-foreground">Ethereum</h4>
                                <p className="text-xs text-muted-foreground">ETH</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {ethPrice.isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-5 bg-muted animate-pulse rounded" />
                                </div>
                            ) : ethPrice.error ? (
                                <p className="text-xs text-red-500">Error</p>
                            ) : (
                                <>
                                    <p className="text-lg font-bold text-foreground">
                                        {formatPrice(ethPrice.price)}
                                    </p>
                                    <div className="flex items-center gap-1 justify-end mt-0.5">
                                        {ethChange >= 0 ? (
                                            <TrendingUp className="text-[#4CC658]" size={14} />
                                        ) : (
                                            <TrendingDown className="text-red-500" size={14} />
                                        )}
                                        <span
                                            className={`text-xs font-bold ${ethChange >= 0 ? 'text-[#4CC658]' : 'text-red-500'
                                                }`}
                                        >
                                            {formatChange(ethChange)}%
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#4CC658] animate-pulse" />
                    <span className="text-xs text-muted-foreground font-medium">Live via Oracle</span>
                </div>
                <span className="text-xs text-muted-foreground">
                    Updates every 30s
                </span>
            </div>
        </div>
    )
}

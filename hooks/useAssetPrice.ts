'use client'

import { useState, useEffect } from 'react'
import { getOraclePrice } from '@/lib/blockchain/getOraclePrice'

interface AssetPrice {
    price: number
    lastUpdate: Date
    isLoading: boolean
    error: string | null
}

export function useAssetPrice(assetSymbol: string, refreshInterval = 30000) {
    const [priceData, setPriceData] = useState<AssetPrice>({
        price: 0,
        lastUpdate: new Date(),
        isLoading: true,
        error: null,
    })

    useEffect(() => {
        let isMounted = true

        const fetchPrice = async () => {
            try {
                const price = await getOraclePrice(assetSymbol)
                if (isMounted) {
                    setPriceData({
                        price,
                        lastUpdate: new Date(),
                        isLoading: false,
                        error: null,
                    })
                }
            } catch (error) {
                if (isMounted) {
                    setPriceData(prev => ({
                        ...prev,
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Failed to fetch price',
                    }))
                }
            }
        }

        // Fetch immediately
        fetchPrice()

        // Set up interval for periodic updates
        const interval = setInterval(fetchPrice, refreshInterval)

        return () => {
            isMounted = false
            clearInterval(interval)
        }
    }, [assetSymbol, refreshInterval])

    return priceData
}

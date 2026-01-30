'use client'

import { useState, useEffect } from 'react'

interface FearGreedData {
    value: number // 0-100
    value_classification: string // "Extreme Fear", "Fear", "Neutral", "Greed", "Extreme Greed"
    timestamp: string
    time_until_update: string
}

interface FearGreedResponse {
    name: string
    data: FearGreedData[]
    metadata: {
        error: string | null
    }
}

export function useFearGreedIndex(refreshInterval = 300000) { // Default 5 minutes
    const [data, setData] = useState<FearGreedData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const response = await fetch('https://api.alternative.me/fng/')

                if (!response.ok) {
                    throw new Error('Failed to fetch Fear & Greed Index')
                }

                const json: FearGreedResponse = await response.json()

                if (json.data && json.data.length > 0) {
                    setData(json.data[0]) // Latest data
                    setError(null)
                } else {
                    throw new Error('No data available')
                }
            } catch (err: any) {
                console.error('Error fetching Fear & Greed Index:', err)
                setError(err.message || 'Failed to fetch data')
            } finally {
                setIsLoading(false)
            }
        }

        // Initial fetch
        fetchData()

        // Set up interval for refresh
        const interval = setInterval(fetchData, refreshInterval)

        return () => clearInterval(interval)
    }, [refreshInterval])

    return { data, isLoading, error }
}

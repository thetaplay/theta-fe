import { useQuery } from '@tanstack/react-query'

export interface PositionExplanation {
    whatIsThis: string
    whyChosen: string
    whatToWatch: string
}

export interface PositionDetails {
    asset: string
    type: 'CALL' | 'PUT'
    strike: number
    expiry: number
    premium: number
    status: 'ACTIVE' | 'SETTLED' | 'CLAIMED'
    isLong?: boolean
}

export function usePositionExplanation(position: PositionDetails | null) {
    return useQuery({
        queryKey: ['position-explanation', position?.asset, position?.type, position?.strike, position?.expiry],
        queryFn: async () => {
            if (!position) throw new Error('No position provided')

            const response = await fetch('/api/positions/explain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(position),
            })

            if (!response.ok) {
                throw new Error('Failed to fetch explanation')
            }

            const data = await response.json()
            return data.explanation as PositionExplanation
        },
        enabled: !!position,
        staleTime: 1000 * 60 * 60, // Cache for 1 hour
        retry: 1,
    })
}

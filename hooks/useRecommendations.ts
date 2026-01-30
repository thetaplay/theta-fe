import { useQuery } from '@tanstack/react-query'

interface UserProfile {
    goal: 'PROTECT_ASSET' | 'CAPTURE_UPSIDE' | 'EARN_SAFELY'
    riskComfort: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
    confidence: 'LOW' | 'MID' | 'HIGH'
    amount: number
}

export function useRecommendations(profile: UserProfile) {
    return useQuery({
        queryKey: ['recommendations', profile],
        queryFn: async () => {
            const params = new URLSearchParams({
                goal: profile.goal,
                riskComfort: profile.riskComfort,
                confidence: profile.confidence,
                amount: profile.amount.toString(),
            })

            const res = await fetch(`/api/recommendations?testMode=profit&${params}`)
            if (!res.ok) throw new Error('Failed to fetch recommendations')

            const { recommendations } = await res.json()
            return recommendations
        },
        enabled: !!profile.amount && profile.amount > 0,
    })
}

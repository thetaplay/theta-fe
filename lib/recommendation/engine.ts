import { getOraclePrice } from '../blockchain/getOraclePrice'
import { determineOptionType, calculateStrike, calculateExpiry } from './strategies'
import { estimatePremium } from './pricing'

export interface UserProfile {
    goal: 'PROTECT_ASSET' | 'CAPTURE_UPSIDE' | 'EARN_SAFELY'
    riskComfort: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
    confidence: 'LOW' | 'MID' | 'HIGH'
    amount: number
}

export interface Recommendation {
    id: string
    asset: string
    type: 'CALL' | 'PUT'
    currentPrice: number
    strike: number
    expiry: number
    expiryDate: string
    premium: number
    maxPositions: number
    metadata: {
        otmPercentage: number
        daysToExpiry: number
        breakeven: number
        maxProfit: number
        maxLoss: number
        explanation: string
    }
}

export async function generateRecommendations(
    profile: UserProfile
): Promise<Recommendation[]> {
    // For hackathon, we'll generate recommendations for ETH and BTC
    const assets = ['ETH', 'BTC']
    const recommendations: Recommendation[] = []

    for (const asset of assets) {
        try {
            // 1. Fetch current price from oracle
            const currentPrice = await getOraclePrice(asset)

            // 2. Determine option type based on goal
            const optionType = determineOptionType(profile.goal)

            // 3. Calculate strike price based on risk
            const strike = calculateStrike(currentPrice, optionType, profile.riskComfort)

            // 4. Calculate expiry based on confidence
            const expiry = calculateExpiry(profile.confidence)
            const daysToExpiry = Math.floor((expiry - Date.now() / 1000) / 86400)

            // 5. Estimate premium
            const premium = estimatePremium({
                currentPrice,
                strike,
                daysToExpiry,
                optionType,
            })

            // 6. Calculate additional metadata
            const maxPositions = Math.floor(profile.amount / premium)
            const breakeven = optionType === 'CALL'
                ? strike + premium
                : strike - premium
            const maxProfit = premium * 10 // 10x cap
            const maxLoss = premium

            // 7. Generate explanation
            const explanation = generateExplanation(profile, optionType, currentPrice, strike, daysToExpiry)

            recommendations.push({
                id: `${asset}-${optionType}-${Date.now()}`,
                asset,
                type: optionType,
                currentPrice,
                strike: Math.round(strike * 100) / 100,
                expiry,
                expiryDate: new Date(expiry * 1000).toISOString(),
                premium: Math.round(premium * 100) / 100,
                maxPositions,
                metadata: {
                    otmPercentage: Math.abs((strike - currentPrice) / currentPrice) * 100,
                    daysToExpiry,
                    breakeven: Math.round(breakeven * 100) / 100,
                    maxProfit,
                    maxLoss,
                    explanation,
                },
            })
        } catch (error) {
            console.error(`Failed to generate recommendation for ${asset}:`, error)
            // Continue with other assets
        }
    }

    return recommendations
}

function generateExplanation(
    profile: UserProfile,
    optionType: 'CALL' | 'PUT',
    currentPrice: number,
    strike: number,
    days: number
): string {
    const direction = optionType === 'CALL' ? 'rise above' : 'fall below'
    const riskLevel = profile.riskComfort.toLowerCase()

    return `${optionType} option with ${riskLevel} risk profile. ` +
        `Profitable if asset ${direction} $${strike.toFixed(2)} ` +
        `within ${days} days. Current price: $${currentPrice.toFixed(2)}.`
}

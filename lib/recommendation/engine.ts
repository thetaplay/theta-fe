import { getOraclePrice } from '../blockchain/getOraclePrice'
import { determineOptionType, calculateStrike, calculateExpiry } from './strategies'
import { estimatePremium } from './pricing'

export interface UserProfile {
    goal: 'PROTECT_ASSET' | 'CAPTURE_UPSIDE' | 'EARN_SAFELY'
    riskComfort: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
    confidence: 'LOW' | 'MID' | 'HIGH'
    amount: number
    testMode?: 'profit' | 'loss' // For settlement testing
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

/**
 * Generate test recommendations for settlement testing
 * Creates positions that will definitely be profitable or unprofitable
 */
export async function generateTestRecommendations(
    testMode: 'profit' | 'loss'
): Promise<Recommendation[]> {
    const assets = ['ETH', 'BTC']
    const recommendations: Recommendation[] = []

    for (const asset of assets) {
        try {
            // 1. Fetch current price from oracle
            const currentPrice = await getOraclePrice(asset)

            // 2. For testing, we'll create CALL options
            const optionType: 'CALL' | 'PUT' = 'CALL'

            // 3. MANIPULATE strike price for guaranteed profit/loss
            let strike: number
            let explanation: string

            if (testMode === 'profit') {
                // PROFIT: Strike WAY BELOW current price (Deep ITM)
                // User will definitely make money
                strike = currentPrice * 0.70 // 30% below current price
                explanation = `🎯 TEST PROFIT: Strike $${strike.toFixed(2)} is 30% BELOW current $${currentPrice.toFixed(2)}. Position will be profitable at settlement!`
            } else {
                // LOSS: Strike WAY ABOVE current price (Deep OTM)
                // User will definitely lose money
                strike = currentPrice * 1.50 // 50% above current price
                explanation = `📉 TEST LOSS: Strike $${strike.toFixed(2)} is 50% ABOVE current $${currentPrice.toFixed(2)}. Position will expire worthless!`
            }

            // 4. SHORT expiry for quick testing (5 minutes)
            const expiry = Math.floor(Date.now() / 1000) + (5 * 60) // 5 minutes
            const minutesToExpiry = 5
            const daysToExpiry = minutesToExpiry / (24 * 60) // Convert to fractional days for pricing

            // 5. Estimate premium (very low due to short time)
            const premium = estimatePremium({
                currentPrice,
                strike,
                daysToExpiry,
                optionType,
            })

            // 6. Calculate metadata
            const maxPositions = Math.floor(1000 / premium) // Assume $1000 budget
            const breakeven = strike + premium
            const intrinsicValue = testMode === 'profit' ? Math.max(0, currentPrice - strike) : 0
            const maxProfit = testMode === 'profit' ? intrinsicValue - premium : -premium
            const maxLoss = premium

            recommendations.push({
                id: `TEST-${testMode.toUpperCase()}-${asset}-${Date.now()}`,
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
                    daysToExpiry: minutesToExpiry,
                    breakeven: Math.round(breakeven * 100) / 100,
                    maxProfit,
                    maxLoss,
                    explanation,
                },
            })
        } catch (error) {
            console.error(`Failed to generate test recommendation for ${asset}:`, error)
        }
    }

    return recommendations
}

export async function generateRecommendations(
    profile: UserProfile
): Promise<Recommendation[]> {
    // TEST MODE: Generate profit/loss scenarios for settlement testing
    if (profile.testMode) {
        console.log(`🧪 TEST MODE: Generating ${profile.testMode.toUpperCase()} scenario`)
        return generateTestRecommendations(profile.testMode)
    }

    // NORMAL MODE: For hackathon, we'll generate recommendations for ETH and BTC
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

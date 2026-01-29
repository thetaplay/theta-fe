export const STRATEGY_CONFIG = {
    goal: {
        PROTECT_ASSET: 'PUT',
        CAPTURE_UPSIDE: 'CALL',
        EARN_SAFELY: 'PUT', // Deep OTM
    },
    riskComfort: {
        CONSERVATIVE: 0.05, // 5% OTM
        MODERATE: 0.10,     // 10% OTM
        AGGRESSIVE: 0.20,   // 20% OTM
    },
    confidence: {
        LOW: 30,    // 30 days
        MID: 14,    // 14 days
        HIGH: 7,    // 7 days
    },
} as const

type Goal = keyof typeof STRATEGY_CONFIG.goal
type RiskComfort = keyof typeof STRATEGY_CONFIG.riskComfort
type Confidence = keyof typeof STRATEGY_CONFIG.confidence

export function determineOptionType(goal: Goal): 'CALL' | 'PUT' {
    return STRATEGY_CONFIG.goal[goal] as 'CALL' | 'PUT'
}

export function calculateStrike(
    currentPrice: number,
    optionType: 'CALL' | 'PUT',
    riskComfort: RiskComfort
): number {
    const otmPercentage = STRATEGY_CONFIG.riskComfort[riskComfort]

    if (optionType === 'CALL') {
        // Strike above current price
        return currentPrice * (1 + otmPercentage)
    } else {
        // Strike below current price
        return currentPrice * (1 - otmPercentage)
    }
}

export function calculateExpiry(confidence: Confidence): number {
    const days = STRATEGY_CONFIG.confidence[confidence]
    const secondsPerDay = 24 * 60 * 60
    return Math.floor(Date.now() / 1000) + (days * secondsPerDay)
}

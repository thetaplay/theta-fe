/**
 * Simplified premium calculation
 * In production, use Black-Scholes or similar pricing model
 */
export function estimatePremium(params: {
    currentPrice: number
    strike: number
    daysToExpiry: number
    optionType: 'CALL' | 'PUT'
}): number {
    const { currentPrice, strike, daysToExpiry, optionType } = params

    // Intrinsic value
    let intrinsic = 0
    if (optionType === 'CALL') {
        intrinsic = Math.max(0, currentPrice - strike)
    } else {
        intrinsic = Math.max(0, strike - currentPrice)
    }

    // Time value (simplified)
    // Real formula: use implied volatility, risk-free rate, etc.
    const timeValue = (currentPrice * 0.01) * Math.sqrt(daysToExpiry / 365)

    // Total premium
    const premium = intrinsic + timeValue

    // Minimum premium (1% of current price)
    const minPremium = currentPrice * 0.01

    return Math.max(premium, minPremium)
}

/**
 * Simplified premium calculation
 * In production, use Black-Scholes or similar pricing model
 * Now retail-friendly: adjusts premium based on user budget
 */
export function estimatePremium(params: {
    currentPrice: number
    strike: number
    daysToExpiry: number
    optionType: 'CALL' | 'PUT'
    userBudget?: number // User's total budget
}): number {
    const { currentPrice, strike, daysToExpiry, optionType, userBudget } = params

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

    // Total premium calculation
    const calculatedPremium = intrinsic + timeValue

    // RETAIL-FRIENDLY ADJUSTMENT
    // Instead of 1% minimum, we make it affordable for smaller budgets
    // Aim for premium that allows at least 2-3 positions with user's budget
    let finalPremium = calculatedPremium

    if (userBudget) {
        // Target: user can buy at least 2 positions with their budget
        const maxAffordablePremium = userBudget / 2

        // If calculated premium is too expensive, cap it
        if (calculatedPremium > maxAffordablePremium) {
            finalPremium = maxAffordablePremium * 0.9 // 90% of max to allow some buffer
        }

        // Still maintain a reasonable minimum (0.5% of current price or $1, whichever is higher)
        const absoluteMinimum = Math.max(currentPrice * 0.005, 1)
        finalPremium = Math.max(finalPremium, absoluteMinimum)
    } else {
        // Fallback: use original 1% minimum
        const minPremium = currentPrice * 0.01
        finalPremium = Math.max(calculatedPremium, minPremium)
    }

    return finalPremium
}

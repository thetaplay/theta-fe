import { NextRequest, NextResponse } from 'next/server'
import { generateExplanation } from '@/lib/ai/openrouter'
import { z } from 'zod'

const ExplainOutcomeRequestSchema = z.object({
    positionType: z.enum(['CALL', 'PUT']),
    strike: z.number(),
    settlementPrice: z.number(),
    expiry: z.number(),
    asset: z.string(),
    premiumPaid: z.number(),
    payout: z.number(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate request
        const validated = ExplainOutcomeRequestSchema.parse(body)

        const { positionType, strike, settlementPrice, expiry, asset, premiumPaid, payout } = validated

        // Generate AI explanation for the outcome
        const explanation = await generateExplanation({
            positionType,
            strike,
            currentPrice: settlementPrice, // Use settlement price for settled positions
            expiry,
            status: 'SETTLED',
            asset,
            premiumPaid,
        })

        // Add outcome-specific context
        const netProfit = payout - premiumPaid
        const roi = premiumPaid > 0 ? ((netProfit / premiumPaid) * 100).toFixed(0) : '0'
        const wasSuccessful = netProfit > 0

        // Enhance explanation with outcome details
        const enhancedExplanation = {
            ...explanation,
            outcome: {
                wasSuccessful,
                netProfit,
                roi,
                summary: wasSuccessful
                    ? `Great news! Your position ended profitable with a ${roi}% return.`
                    : `Your position settled with a loss of $${Math.abs(netProfit).toFixed(2)}.`
            }
        }

        return NextResponse.json({
            success: true,
            explanation: enhancedExplanation,
        })
    } catch (error: any) {
        console.error('Explain outcome API error:', error)

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to generate outcome explanation'
            },
            { status: 400 }
        )
    }
}

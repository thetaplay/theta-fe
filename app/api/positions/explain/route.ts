import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateExplanation } from '@/lib/ai/openrouter'

const PositionSchema = z.object({
    asset: z.string(),
    type: z.enum(['CALL', 'PUT']),
    strike: z.number(),
    expiry: z.number(),
    premium: z.number(),
    status: z.enum(['ACTIVE', 'SETTLED', 'CLAIMED']),
    isLong: z.boolean().optional(),
    currentPrice: z.number().optional(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const position = PositionSchema.parse(body)

        console.log('=== Position Explanation Request ===')
        console.log('Position:', position)

        // Use the existing generateExplanation function
        const explanation = await generateExplanation({
            positionType: position.type,
            strike: position.strike,
            currentPrice: position.currentPrice || position.strike, // Use strike as fallback
            expiry: position.expiry,
            status: position.status,
            asset: position.asset,
            premiumPaid: position.premium,
        })

        console.log('Generated explanation:', explanation)

        return NextResponse.json({
            success: true,
            explanation,
        })
    } catch (error: any) {
        console.error('Explanation error:', error)
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
        })

        // Fallback generic explanation
        return NextResponse.json({
            success: true,
            explanation: {
                whatIsThis: "This is an options contract that gives you the right, but not obligation, to buy or sell an asset at a specific price before expiry.",
                whyChosen: "This position was selected based on market conditions and your investment goals to help you manage risk or capture potential gains.",
                whatToWatch: "Keep an eye on the asset price and time remaining. As expiry approaches, you'll want to decide whether to exercise or let it expire.",
            },
        })
    }
}

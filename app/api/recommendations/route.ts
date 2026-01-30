import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateRecommendations } from '@/lib/recommendation/engine'
import { signOrder } from '@/lib/signing/orderSigner'
import { CONTRACTS } from '@/lib/blockchain/contracts'

const ProfileSchema = z.object({
    goal: z.enum(['PROTECT_ASSET', 'CAPTURE_UPSIDE', 'EARN_SAFELY']),
    riskComfort: z.enum(['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE']),
    confidence: z.enum(['LOW', 'MID', 'HIGH']),
    amount: z.number().min(1),
    testMode: z.enum(['profit', 'loss']).optional(), // For settlement testing
})

// Helper to convert BigInt to string for JSON serialization
function serializeBigInt(obj: any): any {
    if (typeof obj === 'bigint') {
        return obj.toString()
    }
    if (Array.isArray(obj)) {
        return obj.map(serializeBigInt)
    }
    if (obj && typeof obj === 'object') {
        const serialized: any = {}
        for (const key in obj) {
            serialized[key] = serializeBigInt(obj[key])
        }
        return serialized
    }
    return obj
}


export async function GET(request: NextRequest) {
    try {
        // Parse query params
        const searchParams = request.nextUrl.searchParams
        const testMode = searchParams.get('testMode') as 'profit' | 'loss' | null

        const profile = {
            goal: searchParams.get('goal'),
            riskComfort: searchParams.get('riskComfort'),
            confidence: searchParams.get('confidence'),
            amount: Number(searchParams.get('amount')),
            ...(testMode && { testMode }), // Add testMode if provided
        }

        console.log('📊 Recommendation request:', { ...profile, testMode: testMode || 'normal' })

        // Validate
        const validated = ProfileSchema.parse(profile)

        // Generate recommendations
        const recommendations = await generateRecommendations(validated)

        // Sign orders for each recommendation
        const signedRecommendations = await Promise.all(
            recommendations.map(async (rec) => {
                const { order, nonce, signature } = await signOrder({
                    asset: rec.asset,
                    type: rec.type,
                    strike: rec.strike,
                    expiry: rec.expiry,
                    premium: rec.premium,
                    collateral: CONTRACTS.MOCK_USDC,
                })

                return {
                    ...rec,
                    order: serializeBigInt(order),
                    nonce: nonce.toString(),
                    signature,
                }
            })
        )

        return NextResponse.json({
            success: true,
            recommendations: signedRecommendations,
        })
    } catch (error: any) {
        console.error('Recommendations error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        )
    }
}

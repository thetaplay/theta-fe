import { NextRequest, NextResponse } from 'next/server'
import { publicClient } from '@/lib/blockchain/client'
import { CONTRACTS, ABIS } from '@/lib/blockchain/contracts'
import { generateExplanation } from '@/lib/ai/openrouter'
import { formatUnits } from 'viem'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: positionIdStr } = await params
        const positionId = BigInt(positionIdStr)

        // Read position from contract
        const position = await publicClient.readContract({
            address: CONTRACTS.POSITION_REGISTRY,
            abi: ABIS.PositionRegistry,
            functionName: 'getPosition',
            args: [positionId],
        })

        if (!position) {
            return NextResponse.json(
                { success: false, error: 'Position not found' },
                { status: 404 }
            )
        }

        // Parse position data
        const positionData = position as any[]
        const underlyingAsset = positionData[1] as string
        const isCall = positionData[2] as boolean
        const strikes = positionData[3] as bigint[]
        const expiry = positionData[4] as bigint
        const premiumPaid = positionData[5] as bigint
        const status = positionData[6] as number

        // Get current oracle price
        const currentPriceRaw = await publicClient.readContract({
            address: CONTRACTS.PRICE_ORACLE,
            abi: ABIS.PriceOracle,
            functionName: 'getLatestPrice',
            args: [underlyingAsset],
        })

        const currentPrice = Number(formatUnits(currentPriceRaw as bigint, 18))
        const strike = Number(formatUnits(strikes[0], 18))
        const premium = Number(formatUnits(premiumPaid, 6))

        // Determine position status
        const statusMap = ['ACTIVE', 'SETTLED', 'CLAIMED']
        const positionStatus = statusMap[status] as 'ACTIVE' | 'SETTLED' | 'CLAIMED'

        // Generate explanation with AI
        const explanation = await generateExplanation({
            positionType: isCall ? 'CALL' : 'PUT',
            strike,
            currentPrice,
            expiry: Number(expiry),
            status: positionStatus,
            asset: underlyingAsset,
            premiumPaid: premium,
        })

        return NextResponse.json({
            success: true,
            explanation,
            metadata: {
                positionId: positionIdStr,
                generatedAt: Date.now(),
                positionType: isCall ? 'CALL' : 'PUT',
                status: positionStatus,
            },
        })
    } catch (error: any) {
        console.error('Explain position error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

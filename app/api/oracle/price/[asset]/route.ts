import { NextRequest, NextResponse } from 'next/server'
import { getOraclePrice } from '@/lib/blockchain/getOraclePrice'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ asset: string }> }
) {
    try {
        // Next.js 15+ requires awaiting params
        const { asset: assetParam } = await params
        const asset = assetParam.toUpperCase()
        const price = await getOraclePrice(asset)

        return NextResponse.json({
            success: true,
            asset,
            price,
            timestamp: Date.now(),
        })
    } catch (error: any) {
        console.error('Oracle price error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

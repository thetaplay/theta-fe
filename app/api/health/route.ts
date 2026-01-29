import { NextResponse } from 'next/server'
import { publicClient } from '@/lib/blockchain/client'

export async function GET() {
    try {
        // Check blockchain connection
        const blockNumber = await publicClient.getBlockNumber()

        return NextResponse.json({
            status: 'healthy',
            blockchain: {
                connected: true,
                network: 'base sepolia',
                blockNumber: blockNumber.toString(),
            },
            timestamp: Date.now(),
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                error: error.message,
            },
            { status: 500 }
        )
    }
}

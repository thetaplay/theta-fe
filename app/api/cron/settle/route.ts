import { NextRequest, NextResponse } from 'next/server'
import { runSettlementKeeper } from '@/lib/settlement/keeper'

/**
 * Settlement Keeper Cron Endpoint
 * 
 * This endpoint is called by Vercel Cron every 5 minutes to automatically
 * settle expired options positions.
 * 
 * For local testing, you can call this endpoint manually:
 * curl -H "Authorization: Bearer !@qwertyuiop" http://localhost:3000/api/cron/settle
 * 
 * Configuration in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/settle",
 *     "schedule": "* /5 * * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    console.log('[Cron] Settlement keeper triggered')

    // Only enforce auth in production (allow local testing)
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        console.error('[Cron] Unauthorized access attempt')
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        const result = await runSettlementKeeper()

        if (result.success) {
            console.log(`[Cron] ✅ Settlement completed: ${result.settled} positions settled`)
            return NextResponse.json(result)
        } else {
            console.error('[Cron] ❌ Settlement failed:', result.error)
            return NextResponse.json(result, { status: 500 })
        }
    } catch (error: any) {
        console.error('[Cron] Unexpected error:', error)
        return NextResponse.json(
            {
                success: false,
                settled: 0,
                error: error.message,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        )
    }
}

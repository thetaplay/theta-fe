import { NextRequest, NextResponse } from 'next/server'
import { monitorAlerts } from '@/lib/alerts/monitor'

// Vercel Cron job endpoint
// Add to vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/monitor-alerts",
//     "schedule": "*/5 * * * *"
//   }]
// }

export async function GET(request: NextRequest) {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    console.log('Auth header:', authHeader)
    console.log('Cron secret:', cronSecret)

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        console.log('[Cron] Alert monitoring job started')
        await monitorAlerts()

        return NextResponse.json({
            success: true,
            message: 'Alert monitoring completed',
            timestamp: new Date().toISOString(),
        })
    } catch (error: any) {
        console.error('[Cron] Alert monitoring failed:', error)
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        )
    }
}

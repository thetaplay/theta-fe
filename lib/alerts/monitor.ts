import { getActiveAlerts, createNotification, updateAlert } from '@/lib/db/supabase'
import { publicClient } from '@/lib/blockchain/client'
import { CONTRACTS, ABIS } from '@/lib/blockchain/contracts'
import { formatUnits } from 'viem'

// Monitor alerts and send notifications
export async function monitorAlerts() {
    console.log('[Scheduler] Starting alert monitoring...')

    try {
        const alerts = await getActiveAlerts()
        console.log(`[Scheduler] Found ${alerts.length} active alerts`)

        for (const alert of alerts) {
            try {
                if (alert.type === 'EXPIRY_REMINDER') {
                    await checkExpiryReminder(alert)
                } else if (alert.type === 'PRICE_MOVE') {
                    await checkPriceMove(alert)
                }
            } catch (error) {
                console.error(`[Scheduler] Error processing alert ${alert.id}:`, error)
            }
        }

        console.log('[Scheduler] Alert monitoring completed')
    } catch (error) {
        console.error('[Scheduler] Alert monitoring failed:', error)
        throw error
    }
}

// Check expiry reminder alerts
async function checkExpiryReminder(alert: any) {
    // Read position from contract
    const position = await publicClient.readContract({
        address: CONTRACTS.POSITION_REGISTRY,
        abi: ABIS.PositionRegistry,
        functionName: 'getPosition',
        args: [BigInt(alert.position_id)],
    })

    if (!position) return

    const positionData = position as any[]
    const expiry = positionData[4] as bigint
    const underlyingAsset = positionData[1] as string
    const isCall = positionData[2] as boolean

    // Calculate hours until expiry
    const expiryTime = Number(expiry) * 1000
    const hoursLeft = Math.max(0, (expiryTime - Date.now()) / (1000 * 60 * 60))

    // Check if we should trigger
    const threshold = alert.hours_before_expiry || 4
    const shouldTrigger = hoursLeft <= threshold && !alert.last_triggered

    if (shouldTrigger) {
        console.log(
            `[Scheduler] Triggering expiry reminder for position ${alert.position_id}`
        )

        await createNotification({
            user_id: alert.user_id,
            alert_id: alert.id,
            position_id: alert.position_id,
            type: 'EXPIRY_REMINDER',
            title: 'Position Expiring Soon ⏰',
            message: `Your ${underlyingAsset} ${isCall ? 'CALL' : 'PUT'
                } position expires in ${Math.floor(hoursLeft)} hours. Review your strategy now!`,
        })

        // Mark as triggered
        await updateAlert(alert.id, {
            last_triggered: new Date().toISOString(),
        })
    }
}

// Check price move alerts
async function checkPriceMove(alert: any) {
    // Read position from contract
    const position = await publicClient.readContract({
        address: CONTRACTS.POSITION_REGISTRY,
        abi: ABIS.PositionRegistry,
        functionName: 'getPosition',
        args: [BigInt(alert.position_id)],
    })

    if (!position) return

    const positionData = position as any[]
    const underlyingAsset = positionData[1] as string
    const isCall = positionData[2] as boolean

    // Get current oracle price
    const currentPriceRaw = await publicClient.readContract({
        address: CONTRACTS.PRICE_ORACLE,
        abi: ABIS.PriceOracle,
        functionName: 'getLatestPrice',
        args: [underlyingAsset],
    })

    const currentPrice = Number(formatUnits(currentPriceRaw as bigint, 18))

    // Check if we have a last price to compare
    if (!alert.last_price) {
        // First time, just store the current price
        await updateAlert(alert.id, {
            last_price: currentPrice,
        })
        return
    }

    // Calculate price change percentage
    const priceChange = ((currentPrice - alert.last_price) / alert.last_price) * 100
    const threshold = (alert.threshold || 0.05) * 100 // Convert to percentage

    if (Math.abs(priceChange) >= threshold) {
        console.log(
            `[Scheduler] Triggering price alert for position ${alert.position_id}: ${priceChange.toFixed(
                2
            )}% change`
        )

        const direction = priceChange > 0 ? 'up' : 'down'
        const emoji = priceChange > 0 ? '📈' : '📉'

        await createNotification({
            user_id: alert.user_id,
            alert_id: alert.id,
            position_id: alert.position_id,
            type: 'PRICE_MOVE',
            title: `Price Alert ${emoji}`,
            message: `${underlyingAsset} moved ${direction} ${Math.abs(
                priceChange
            ).toFixed(2)}%! Your ${isCall ? 'CALL' : 'PUT'
                } position may be affected. Current price: $${currentPrice.toFixed(2)}`,
        })

        // Update last price
        await updateAlert(alert.id, {
            last_price: currentPrice,
        })
    }
}

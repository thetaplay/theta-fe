import { NextRequest, NextResponse } from 'next/server'
import {
    getUserAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
    type AlertType,
} from '@/lib/db/supabase'
import { z } from 'zod'

// Validation schemas
const CreateAlertSchema = z.object({
    userId: z.string(),
    positionId: z.number(),
    type: z.enum(['EXPIRY_REMINDER', 'PRICE_MOVE']),
    threshold: z.number().optional(),
    hoursBeforeExpiry: z.number().optional(),
})

const UpdateAlertSchema = z.object({
    enabled: z.boolean().optional(),
    threshold: z.number().optional(),
    hoursBeforeExpiry: z.number().optional(),
})

// GET: List user's alerts for a position
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const userId = searchParams.get('userId')
        const positionId = searchParams.get('positionId')

        if (!userId || !positionId) {
            return NextResponse.json(
                { success: false, error: 'userId and positionId required' },
                { status: 400 }
            )
        }

        const alerts = await getUserAlerts(userId, parseInt(positionId))

        return NextResponse.json({
            success: true,
            alerts,
        })
    } catch (error: any) {
        console.error('Get alerts error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

// POST: Create new alert
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validated = CreateAlertSchema.parse(body)

        const alert = await createAlert({
            user_id: validated.userId,
            position_id: validated.positionId,
            type: validated.type as AlertType,
            threshold: validated.threshold,
            hours_before_expiry: validated.hoursBeforeExpiry,
        })

        return NextResponse.json({
            success: true,
            alert,
        })
    } catch (error: any) {
        console.error('Create alert error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        )
    }
}

// PUT: Update alert
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Alert ID required' },
                { status: 400 }
            )
        }

        const validated = UpdateAlertSchema.parse(updates)
        const alert = await updateAlert(id, validated)

        return NextResponse.json({
            success: true,
            alert,
        })
    } catch (error: any) {
        console.error('Update alert error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        )
    }
}

// DELETE: Remove alert
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Alert ID required' },
                { status: 400 }
            )
        }

        await deleteAlert(id)

        return NextResponse.json({
            success: true,
            message: 'Alert deleted',
        })
    } catch (error: any) {
        console.error('Delete alert error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from 'next/server'
import {
    getUserNotifications,
    markNotificationRead,
    markAllRead,
} from '@/lib/db/supabase'

// GET: Get user notifications
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const userId = searchParams.get('userId')
        const unreadOnly = searchParams.get('unreadOnly') === 'true'

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'userId required' },
                { status: 400 }
            )
        }

        const notifications = await getUserNotifications(userId, unreadOnly)

        return NextResponse.json({
            success: true,
            notifications,
            count: notifications.length,
        })
    } catch (error: any) {
        console.error('Get notifications error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

// POST: Mark notification as read
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { notificationId, userId, markAll } = body

        if (markAll && userId) {
            await markAllRead(userId)
            return NextResponse.json({
                success: true,
                message: 'All notifications marked as read',
            })
        }

        if (!notificationId) {
            return NextResponse.json(
                { success: false, error: 'notificationId required' },
                { status: 400 }
            )
        }

        await markNotificationRead(notificationId)

        return NextResponse.json({
            success: true,
            message: 'Notification marked as read',
        })
    } catch (error: any) {
        console.error('Mark notification error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

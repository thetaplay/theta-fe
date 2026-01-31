import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Alert types
export type AlertType = 'EXPIRY_REMINDER' | 'PRICE_MOVE'

export interface Alert {
    id: string
    user_id: string
    position_id: number
    type: AlertType
    enabled: boolean
    threshold?: number
    hours_before_expiry?: number
    last_triggered?: string
    last_price?: number
    created_at: string
    updated_at: string
}

export interface Notification {
    id: string
    user_id: string
    alert_id: string
    position_id: number
    type: string
    title: string
    message: string
    read: boolean
    sent_at: string
}

// Get active alerts
export async function getActiveAlerts() {
    const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('enabled', true)

    if (error) throw error
    return data as Alert[]
}

// Get user alerts for a position
export async function getUserAlerts(userId: string, positionId: number) {
    const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .eq('position_id', positionId)

    if (error) throw error
    return data as Alert[]
}

// Create alert
export async function createAlert(alert: {
    user_id: string
    position_id: number
    type: AlertType
    threshold?: number
    hours_before_expiry?: number
}) {
    const { data, error } = await supabase
        .from('alerts')
        .insert([alert])
        .select()
        .single()

    if (error) throw error
    return data as Alert
}

// Update alert
export async function updateAlert(id: string, updates: Partial<Alert>) {
    const { data, error } = await supabase
        .from('alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data as Alert
}

// Delete alert
export async function deleteAlert(id: string) {
    const { error } = await supabase.from('alerts').delete().eq('id', id)

    if (error) throw error
}

// Create notification
export async function createNotification(notification: {
    user_id: string
    alert_id: string
    position_id: number
    type: string
    title: string
    message: string
}) {
    const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single()

    if (error) throw error
    return data as Notification
}

// Get user notifications
export async function getUserNotifications(userId: string, unreadOnly = false) {
    let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('sent_at', { ascending: false })

    if (unreadOnly) {
        query = query.eq('read', false)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Notification[]
}

// Mark notification as read
export async function markNotificationRead(id: string) {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

    if (error) throw error
}

// Mark all notifications as read for user
export async function markAllRead(userId: string) {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

    if (error) throw error
}

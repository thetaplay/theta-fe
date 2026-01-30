# AI Explain & Alert System - Quick Setup Guide

## 🚀 Quick Start (5 Steps)

### 1. Get OpenRouter API Key

1. Visit https://openrouter.ai/
2. Sign up / Log in
3. Go to "Keys" section
4. Create new key
5. Copy the key

### 2. Update Environment Variables

Add to `.env.local`:
```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxx...
```

### 3. Run Supabase Migration

**Option A: Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to "SQL Editor"
4. Copy contents from `supabase/alerts_schema.sql`
5. Run the SQL

**Option B: Supabase CLI**
```bash
supabase db push
```

### 4. Test the APIs

```bash
# Test explain position (replace with real position ID)
curl http://localhost:3000/api/positions/1/explain

# Test create alert
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "positionId": 1,
    "type": "EXPIRY_REMINDER",
    "hoursBeforeExpiry": 4
  }'

# Test scheduler manually
curl http://localhost:3000/api/cron/monitor-alerts
```

### 5. Deploy to Vercel

```bash
# Vercel will automatically setup cron jobs from vercel.json
vercel --prod
```

---

## 📝 Frontend Integration Examples

### Explain Position Modal

```typescript
'use client'

import { useState } from 'react'

export function ExplainButton({ positionId }: { positionId: number }) {
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState(null)

  async function handleExplain() {
    setLoading(true)
    try {
      const res = await fetch(`/api/positions/${positionId}/explain`)
      const data = await res.json()
      setExplanation(data.explanation)
      // Show modal with explanation
    } catch (error) {
      console.error('Failed to get explanation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleExplain} disabled={loading}>
      {loading ? 'Loading...' : '💡 Explain'}
    </button>
  )
}
```

### Set Alerts UI

```typescript
'use client'

import { useState } from 'react'

export function AlertSettings({ userId, positionId }: { userId: string; positionId: number }) {
  const [expiryAlert, setExpiryAlert] = useState(true)
  const [priceAlert, setPriceAlert] = useState(false)

  async function saveAlerts() {
    // Create expiry reminder
    if (expiryAlert) {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          positionId,
          type: 'EXPIRY_REMINDER',
          hoursBeforeExpiry: 4,
        }),
      })
    }

    // Create price alert
    if (priceAlert) {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          positionId,
          type: 'PRICE_MOVE',
          threshold: 0.05, // 5%
        }),
      })
    }
  }

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={expiryAlert}
          onChange={(e) => setExpiryAlert(e.target.checked)}
        />
        Notify 4 hours before expiry
      </label>
      <label>
        <input
          type="checkbox"
          checked={priceAlert}
          onChange={(e) => setPriceAlert(e.target.checked)}
        />
        Alert on 5% price move
      </label>
      <button onClick={saveAlerts}>Save alerts</button>
    </div>
  )
}
```

### Notifications Display

```typescript
'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function NotificationPoller({ userId }: { userId: string }) {
  useEffect(() => {
    // Poll every 30 seconds
    const interval = setInterval(async () => {
      const res = await fetch(`/api/notifications?userId=${userId}&unreadOnly=true`)
      const { notifications } = await res.json()

      // Show toast for new notifications
      notifications.forEach((notif: any) => {
        toast.success(notif.title, {
          description: notif.message,
        })

        // Mark as read
        fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId: notif.id }),
        })
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [userId])

  return null
}
```

---

## 🧪 Testing Workflow

### 1. Test Explain Position

1. Buy an option (or use existing position)
2. Get position ID from transaction
3. Call `/api/positions/{id}/explain`
4. Verify response has 3 sections
5. Check explanation makes sense

### 2. Test Alerts

1. Create an alert via API
2. Manually trigger scheduler: `GET /api/cron/monitor-alerts`
3. Check `notifications` table in Supabase
4. Fetch notifications via `/api/notifications`
5. Verify notification content

### 3. Test Price Move Alert

1. Create price move alert with 1% threshold (for testing)
2. Wait for price to move (or modify `last_price` in database)
3. Run scheduler
4. Check for notification

### 4. Test Expiry Reminder

1. Create position expiring in < 4 hours
2. Create expiry reminder alert
3. Run scheduler
4. Verify notification sent

---

## 🔍 Troubleshooting

### OpenRouter Errors

**Problem:** "Invalid API key"
**Solution:** Check `OPENROUTER_API_KEY` in `.env.local`

**Problem:** Rate limit errors
**Solution:** OpenRouter has generous limits, but add retry logic if needed

### Database Errors

**Problem:** "Table alerts does not exist"
**Solution:** Run Supabase migration: `supabase/alerts_schema.sql`

**Problem:** "Row level security"
**Solution:** Disable RLS or add policies in Supabase dashboard

### Scheduler Not Running

**Problem:** Cron not triggering
**Solution:** 
- Development: Call endpoint manually
- Production: Check Vercel dashboard → Cron tab

### No Notifications

**Problem:** Scheduler runs but no notifications
**Solution:**
1. Check alerts table has enabled=true
2. Verify position exists in contract
3. Check scheduler logs
4. Manually test monitor logic

---

## 📊 Monitoring

### View Scheduler Logs (Vercel)

1. Go to Vercel dashboard
2. Select project
3. Go to "Logs"
4. Filter by `/api/cron/monitor-alerts`

### Database Queries

```sql
-- Check active alerts
SELECT * FROM alerts WHERE enabled = true;

-- Check recent notifications
SELECT * FROM notifications ORDER BY sent_at DESC LIMIT 10;

-- Check unread notifications for user
SELECT * FROM notifications WHERE user_id = 'USER_ID' AND read = false;
```

---

## 🎯 OpenRouter Model Options

Current: `anthropic/claude-3-haiku` (fast, cheap)

**Alternatives:**
- `openai/gpt-4o-mini` - Faster OpenAI model
- `anthropic/claude-3.5-sonnet` - Better quality, slower
- `meta-llama/llama-3.1-8b-instruct` - Open source, cheap

**To change model:**
Edit `lib/ai/openrouter.ts`:
```typescript
export const DEFAULT_MODEL = 'openai/gpt-4o-mini'
```

---

## 💰 Cost Estimates (OpenRouter)

Claude Haiku pricing:
- Input: $0.25 / 1M tokens
- Output: $1.25 / 1M tokens

**Per explanation (~500 tokens):**
- Cost: ~$0.001 (0.1 cent)
- 1000 explanations ≈ $1

**For hackathon:** $5-10 should be plenty!

---

## ✅ Production Checklist

- [ ] Add `OPENROUTER_API_KEY` to Vercel environment variables
- [ ] Add `CRON_SECRET` for security
- [ ] Run Supabase migration
- [ ] Test explain endpoint
- [ ] Test alert creation
- [ ] Verify scheduler runs every 5 minutes
- [ ] Monitor costs on OpenRouter dashboard
- [ ] Add error tracking (Sentry, etc.)
- [ ] Setup database backups

---

## 🎉 You're Ready!

The system is fully implemented and ready to integrate with your UI. Just:

1. ✅ Get API key
2. ✅ Run migration
3. ✅ Connect frontend buttons
4. ✅ Deploy!

Happy hacking! 🚀

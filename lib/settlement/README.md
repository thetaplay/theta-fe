# Settlement Keeper Bot

Automated bot untuk settle expired options positions.

## 🎯 Cara Kerja

Bot ini berjalan otomatis setiap 5 menit (di production Vercel) dan:
1. Query blockchain untuk semua positions yang sudah expired tapi belum settled
2. Batch settle positions tersebut (max 10 positions per batch)
3. Log hasil settlement

## 🚀 Setup

### Environment Variables

Pastikan sudah set di `.env.local` atau Vercel environment variables:

```bash
# RPC URL
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Private key dengan owner permissions di OptionSettlement contract
MARKET_MAKER_PRIVATE_KEY=0x...

# Security untuk cron endpoint
CRON_SECRET=!@qwertyuiop

# Optional: ukuran batch (default 10)
SETTLEMENT_BATCH_SIZE=10
```

### Vercel Configuration

Bot sudah dikonfigurasi di `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/settle",
    "schedule": "*/5 * * * *"
  }]
}
```

## 🧪 Local Testing

### 1. Test via curl

Running dev server:
```bash
npm run dev
```

Di terminal lain:
```bash
curl -H "Authorization: Bearer !@qwertyuiop" http://localhost:3000/api/cron/settle
```

### 2. Test langsung di browser

Buka: http://localhost:3000/api/cron/settle?secret=!@qwertyuiop

### 3. Expected Response

Success response:
```json
{
  "success": true,
  "settled": 2,
  "txHash": "0x...",
  "timestamp": "2026-01-30T14:25:00.000Z"
}
```

No positions to settle:
```json
{
  "success": true,
  "settled": 0,
  "timestamp": "2026-01-30T14:25:00.000Z"
}
```

Error response:
```json
{
  "success": false,
  "settled": 0,
  "error": "Settlement transaction failed",
  "timestamp": "2026-01-30T14:25:00.000Z"
}
```

## 🔍 Monitoring

### Vercel Dashboard

1. Go to your project di Vercel
2. Klik tab "Cron Jobs"
3. Monitor execution logs dan status

### Check Blockchain

Setelah settlement:
- Buka Base Sepolia explorer: https://sepolia.basescan.org/
- Search transaction hash dari response
- Verify `PositionSettled` events emitted

### Debug Logs

Check console logs:
```bash
# Local
npm run dev

# Production
vercel logs --follow
```

Look for:
- `[Keeper] 🤖 Starting settlement keeper check...`
- `[Keeper] Found X expired positions`
- `[Keeper] ✅ Successfully settled X positions`

## ⚠️ Troubleshooting

### "Unauthorized" error
- Check `CRON_SECRET` di environment variables
- Pastikan header Authorization match

### "MARKET_MAKER_PRIVATE_KEY not configured"
- Set private key di `.env.local` (local) atau Vercel env vars (production)

### "Settlement transaction failed"
- Check keeper account punya owner permissions di OptionSettlement contract
- Check gas balance cukup di keeper wallet
- Check RPC URL masih valid

### Positions tidak di-settle
- Check apakah position benar-benar expired (expiry timestamp < now)
- Check position status masih ACTIVE (0), bukan SETTLED (1) atau CLAIMED (2)
- Check logs untuk error messages

## 📊 Gas Optimization

Bot menggunakan `settleBatch()` untuk settle multiple positions dalam 1 transaction:

- Single settle: ~100k gas
- Batch 10 positions: ~500k gas (5x lebih efficient!)

Adjust `SETTLEMENT_BATCH_SIZE` sesuai kebutuhan gas limit.

## 🔐 Security

- ✅ Cron endpoint protected dengan Bearer token
- ✅ Private key tidak pernah exposed di client
- ✅ Hanya owner address yang bisa call settleBatch
- ✅ Transaction simulation check sebelum submit

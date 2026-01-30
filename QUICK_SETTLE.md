# Quick Settlement Guide

## Masalah Sekarang

Bot keeper scanning terlalu banyak blocks (18M - 22M = 4 juta blocks), makanya lama dan timeout.

# Settle position ID 0
cast send 0xBA186524322C9AD92962cb9d4E15E694A23A4dD4 \
  "settle(uint256)" 0 \
  --private-key 0xcc60a12acf58309780a88193ccce62bf84c27c109a0a6e0f02f62400704a3d66 \
  --rpc-url https://base-sepolia-rpc.publicnode.com

# Settle position ID 1
cast send 0xBA186524322C9AD92962cb9d4E15E694A23A4dD4 \
  "settle(uint256)" 1 \
  --private-key 0xcc60a12acf58309780a88193ccce62bf84c27c109a0a6e0f02f62400704a3d66 \
  --rpc-url https://base-sepolia-rpc.publicnode.com
```

### Option 2: Via TypeScript Script

```bash
# Install tsx if not yet
npm install -D tsx

# Settle specific position
npx tsx scripts/manual-settle.ts 0
npx tsx scripts/manual-settle.ts 1
```

### Option 3: Via UI (if you have position IDs)

Kalau kamu tahu position ID yang expired dari UI, gunakan salah satu cara di atas.

## 🔧 Fix untuk Production Bot

### 1. Update Deployment Block

Sudah di-set: `DEPLOYMENT_BLOCK=22650000` di `.env.local`

Tapi ini masih tebakan. **Cara terbaik:**

1.  Buka https://sepolia.basescan.org/address/0xFE4bC24B54fD807c27d175C51fAaC71BEa6Eaf6D
2. Cek Contract Creation transaction block 
3. Update `DEPLOYMENT_BLOCK` dengan block number tersebut

### 2. Get Alchemy RPC (Free)

Public RPC tidak reliable. Daftar gratis di:
- https://www.alchemy.com/ 
- Create app untuk Base Sepolia
- Update `.env.local`:

```bash
BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
```

###  3. Alternative: Skip Event Scanning

Kalau pakai database untuk track positions, lebih baik query dari database langsung daripada scan blockchain events.

## 🚀 Deploy Production Bot

Setelah fix RPC:

1. Set env vars di Vercel
2. Deploy
3. Bot auto-run setiap 5 menit

## ❓ Position IDs yang Expired?

Kalau kamu bisa kasih tahu position IDs yang expired, I can help settle them immediately.

Example:
```bash
# Jika position 0, 1, 2 expired
npx tsx scripts/manual-settle.ts 0
npx tsx scripts/manual-settle.ts 1
npx tsx scripts/manual-settle.ts 2
```

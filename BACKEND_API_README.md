# Nawasena Backend API - Setup Guide

## Overview

Backend API yang terintegrasi dengan Nawasena smart contracts untuk:
- Option recommendation engine
- Order signing untuk market maker
- Oracle price fetching
- Health monitoring

**Network:** Base Sepolia Testnet

## 🚀 Quick Start

### 1. Install Dependencies

Sudah terinstall:
```bash
pnpm add viem zod
```

### 2. Environment Configuration

Edit file `.env.local` dan tambahkan:

```bash
# Blockchain Configuration
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
MARKET_MAKER_PRIVATE_KEY=0x... # Your market maker private key
```

> **⚠️ Important: Market Maker Private Key**
> 
> Private key ini TIDAK harus owner contract. Ini adalah wallet untuk market maker yang akan:
> - Sign orders untuk user
> - Menyediakan liquidity
> - Memerlukan USDC collateral
> 
> Buat wallet baru khusus untuk market maker dan pastikan:
> 1. ✅ Ada ETH untuk gas fees
> 2. ✅ Ada USDC untuk collateral
> 3. ✅ Sudah approve USDC ke MockOptionBook contract

### 3. Run Development Server

```bash
pnpm dev
```

Server akan berjalan di `http://localhost:3000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

Test blockchain connectivity dan status server.

### Get Oracle Price
```
GET /api/oracle/price/{asset}
```

Parameter:
- `asset`: ETH, BTC, atau asset lain yang didukung oracle

Contoh:
```bash
curl http://localhost:3000/api/oracle/price/ETH
```

Response:
```json
{
  "success": true,
  "asset": "ETH",
  "price": 3000.52,
  "timestamp": 1706432100000
}
```

### Get Recommendations
```
GET /api/recommendations
```

Query Parameters:
- `goal`: PROTECT_ASSET | CAPTURE_UPSIDE | EARN_SAFELY
- `riskComfort`: CONSERVATIVE | MODERATE | AGGRESSIVE
- `confidence`: LOW (30 days) | MID (14 days) | HIGH (7 days)
- `amount`: Amount in USDC

Contoh:
```bash
curl "http://localhost:3000/api/recommendations?goal=CAPTURE_UPSIDE&riskComfort=MODERATE&confidence=HIGH&amount=1000"
```

Response:
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "ETH-CALL-1706432100",
      "asset": "ETH",
      "type": "CALL",
      "currentPrice": 3000,
      "strike": 3300,
      "expiry": 1707036900,
      "premium": 60.5,
      "maxPositions": 16,
      "order": { ... },
      "signature": "0x...",
      "nonce": "1706432100000",
      "metadata": {
        "otmPercentage": 10,
        "daysToExpiry": 7,
        "breakeven": 3360.5,
        "maxProfit": 605,
        "maxLoss": 60.5,
        "explanation": "..."
      }
    }
  ]
}
```

## 🧪 Testing dengan Postman

Import 2 file ini ke Postman:
1. `ThetaPlay-Backend-API.postman_collection.json` - Collection dengan semua endpoints
2. `ThetaPlay.postman_environment.json` - Environment variables

Collection sudah include:
- ✅ Health check
- ✅ Oracle price untuk ETH dan BTC
- ✅ Recommendations dengan berbagai profil
- ✅ Validation tests
- ✅ Test assertions otomatis

## 🏗️ Architecture

```
Backend API
├── lib/
│   ├── blockchain/
│   │   ├── client.ts          # Viem public client
│   │   ├── contracts.ts       # Contract addresses & ABIs
│   │   └── getOraclePrice.ts  # Oracle integration
│   ├── recommendation/
│   │   ├── strategies.ts      # Strategy config
│   │   ├── pricing.ts         # Premium calculation
│   │   └── engine.ts          # Main recommendation logic
│   └── signing/
│       └── orderSigner.ts     # Order signing for market maker
└── app/api/
    ├── health/route.ts
    ├── oracle/price/[asset]/route.ts
    └── recommendations/route.ts
```

## 📝 Strategy Configuration

### Goals
- **PROTECT_ASSET**: Protective PUT options
- **CAPTURE_UPSIDE**: Bullish CALL options
- **EARN_SAFELY**: Deep OTM PUT for premium collection

### Risk Levels
- **CONSERVATIVE**: 5% OTM (Out of The Money)
- **MODERATE**: 10% OTM
- **AGGRESSIVE**: 20% OTM

### Confidence Levels
- **LOW**: 30 days expiry
- **MID**: 14 days expiry
- **HIGH**: 7 days expiry

## 🔒 Security Notes

1. **Never commit** private keys to git
2. Market maker wallet harus terpisah dari owner wallet
3. Set reasonable collateral limits di order signing
4. Implement rate limiting untuk production

## 🐛 Troubleshooting

### Error: "Oracle price fetch failed"
- Check RPC URL di `.env.local`
- Verify PriceOracle contract address
- Ensure blockchain is synced

### Error: "MARKET_MAKER_PRIVATE_KEY not set"
- Add private key ke `.env.local`
- Format: `0x...` (harus diawali 0x)

### Error: "Failed to generate recommendation"
- Check oracle is returning valid prices
- Verify network connectivity

## 📚 Next Steps

1. ⚙️ Setup market maker wallet dengan USDC
2. 🧪 Test semua endpoints dengan Postman
3. 🎨 Integrate dengan frontend
4. 📊 Add analytics tracking
5. 🚀 Deploy ke production

## 📖 Documentation

- [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) - Full backend integration guide
- [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) - Frontend integration guide

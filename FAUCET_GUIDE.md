# USDC Faucet - Quick Guide

## 🎯 What Is This?

A faucet component that lets users claim test USDC tokens on Base Sepolia for testing the options platform.

## 🔧 Usage

### Add to Any Page

```typescript
import { FaucetClaim } from '@/components/FaucetClaim'

export default function Page() {
  return (
    <div>
      <FaucetClaim />
    </div>
  )
}
```

## 📋 Features

- ✅ **Real-time Balance** - Shows current USDC balance
- ✅ **Claim Amount Display** - Shows how much USDC you'll get
- ✅ **Cooldown Timer** - Shows time until next claim
- ✅ **Transaction Status** - Loading states and success feedback
- ✅ **Connect Wallet Prompt** - Shows when not connected
- ✅ **Auto-refresh** - Balance updates automatically

## 🎨 Integration Examples

### In Profile Page

```typescript
// app/profile/page.tsx
import { FaucetClaim } from '@/components/FaucetClaim'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1>My Profile</h1>
      
      {/* Faucet for testing */}
      <FaucetClaim />
      
      {/* Other profile content */}
    </div>
  )
}
```

### In Trade Page

```typescript
// app/trade/page.tsx
import { FaucetClaim } from '@/components/FaucetClaim'

export default function TradePage() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        {/* Trade interface */}
      </div>
      <div className="space-y-4">
        {/* Faucet in sidebar */}
        <FaucetClaim />
      </div>
    </div>
  )
}
```

### Standalone Faucet Page

```typescript
// app/faucet/page.tsx
import { FaucetClaim } from '@/components/FaucetClaim'

export default function FaucetPage() {
  return (
    <div className="max-w-md mx-auto pt-8">
      <h1 className="text-2xl font-bold mb-4">Test USDC Faucet</h1>
      <FaucetClaim />
    </div>
  )
}
```

## 🔍 Component States

### 1. Not Connected
Shows prompt to connect wallet

### 2. Connected - Can Claim
Shows claim button enabled with balance

### 3. Connected - Cooldown
Shows time until next claim, button disabled

### 4. Claiming
Shows loading state during transaction

### 5. Success
Shows success message, balance updates

## 📊 MockUSDC Contract Details

**Claim Amount:** 1000 USDC (usually)  
**Claim Interval:** 24 hours (configurable)  
**Decimals:** 6 (like real USDC)

## 🧪 Testing

1. Connect wallet
2. Click "Claim Test USDC"
3. Approve transaction
4. Wait for confirmation
5. Balance updates automatically
6. Try claiming again - should show cooldown

## 🎨 Styling

Component uses:
- Tailwind CSS
- Shadcn UI components (Button, Card)
- Lucide icons
- Gradient backgrounds (blue/indigo theme)

## 💡 Tips

- Add to profile page for easy access
- Show in trade page sidebar for convenience
- Balance auto-refreshes every 5 seconds
- Cooldown timer shows hours/minutes remaining

## 🔗 Dependencies

Make sure you have:
- Wagmi hooks configured
- Contract addresses in `lib/blockchain/contracts.ts`
- MockUSDC ABI imported
- Wallet providers setup

---

**Ready to use!** Just import and add to your page. 🚀

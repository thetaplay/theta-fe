import { privateKeyToAccount } from 'viem/accounts'
import { encodePacked, keccak256, parseUnits } from 'viem'
import type { Address } from 'viem'

// Get market maker account from environment variable
const getMarketMakerAccount = () => {
    const privateKey = process.env.MARKET_MAKER_PRIVATE_KEY

    if (!privateKey) {
        throw new Error('MARKET_MAKER_PRIVATE_KEY not set in environment variables')
    }

    return privateKeyToAccount(privateKey as `0x${string}`)
}

export interface OrderParams {
    asset: string
    type: 'CALL' | 'PUT'
    strike: number
    expiry: number
    premium: number
    collateral: Address
}

export async function signOrder(params: OrderParams) {
    const MARKET_MAKER_ACCOUNT = getMarketMakerAccount()
    const nonce = BigInt(Date.now()) // Unique nonce

    // Construct order struct
    const order = {
        maker: MARKET_MAKER_ACCOUNT.address,
        collateral: params.collateral,
        underlyingAsset: params.asset,
        isCall: params.type === 'CALL',
        strikes: [parseUnits(params.strike.toString(), 18)],
        expiry: BigInt(params.expiry),
        price: parseUnits(params.premium.toString(), 6), // USDC has 6 decimals
        maxCollateralUsable: parseUnits('100000', 6), // 100k USDC max
        isLong: true,
        extraOptionData: '0x' as `0x${string}`,
    }

    // Create order hash (simplified - match your contract's hash logic)
    const orderHash = keccak256(
        encodePacked(
            ['address', 'uint256', 'uint64', 'uint256'],
            [order.maker, order.strikes[0], order.expiry, nonce]
        )
    )

    // Sign the order hash
    const signature = await MARKET_MAKER_ACCOUNT.signMessage({
        message: { raw: orderHash },
    })

    return {
        order,
        nonce,
        signature,
        orderHash,
    }
}

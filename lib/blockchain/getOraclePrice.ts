import { publicClient } from './client'
import { CONTRACTS, ABIS } from './contracts'
import { formatEther } from 'viem'

export async function getOraclePrice(asset: string): Promise<number> {
    try {
        const price = await publicClient.readContract({
            address: CONTRACTS.PRICE_ORACLE,
            abi: ABIS.PriceOracle,
            functionName: 'getLatestPrice',
            args: [asset],
        })

        // Convert from 18 decimals to number
        return Number(formatEther(price as bigint))
    } catch (error) {
        console.error(`Failed to fetch price for ${asset}:`, error)
        throw new Error(`Oracle price fetch failed for ${asset}`)
    }
}

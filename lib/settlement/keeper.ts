import {
    createPublicClient,
    createWalletClient,
    http,
    Address,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import PositionRegistryABI from '@/contracts/ABIS/PositionRegistry.json'
import OptionSettlementABI from '@/contracts/ABIS/OptionSettlement.json'

const CONTRACTS = {
    PositionRegistry: '0xFE4bC24B54fD807c27d175C51fAaC71BEa6Eaf6D' as Address,
    OptionSettlement: '0xBA186524322C9AD92962cb9d4E15E694A23A4dD4' as Address,
}

export enum PositionStatus {
    ACTIVE = 0,
    SETTLED = 1,
    CLAIMED = 2,
}

interface Position {
    id: bigint
    expiry: bigint
    status: number
    asset: string
}

interface SettlementResult {
    success: boolean
    settled: number
    txHash?: string
    error?: string
    timestamp: string
}

/**
 * Get all positions by iterating through position IDs
 * More efficient than scanning millions of blocks for events
 */
async function getAllPositions(publicClient: any): Promise<Position[]> {
    const positions: Position[] = []

    // Start from position 0 and keep incrementing until we hit error
    // Most contracts start position counter from 0
    let positionId = 0
    const maxPositions = 1000 // Safety limit to avoid infinite loop

    console.log(`[Keeper] Fetching positions by ID...`)

    for (let i = 0; i < maxPositions; i++) {
        try {
            const position = await publicClient.readContract({
                address: CONTRACTS.PositionRegistry,
                abi: PositionRegistryABI,
                functionName: 'getPosition',
                args: [BigInt(positionId)],
            })

            // If we got a valid position, add it
            if (position && position.user !== '0x0000000000000000000000000000000000000000') {
                positions.push({
                    id: BigInt(positionId),
                    expiry: BigInt(position.expiry),
                    status: position.status,
                    asset: position.underlyingAsset,
                })
                console.log(`[Keeper] Found position ${positionId} (status: ${position.status}, expiry: ${position.expiry})`)
            }

            positionId++
        } catch (error: any) {
            // If we get an error, likely means position doesn't exist
            // Stop searching
            console.log(`[Keeper] Reached end of positions at ID ${positionId}`)
            break
        }
    }

    console.log(`[Keeper] Found ${positions.length} total positions`)
    return positions
}

/**
 * Find positions that are expired but not yet settled
 */
function findExpiredPositions(positions: Position[]): Position[] {
    const now = BigInt(Math.floor(Date.now() / 1000))

    const expired = positions.filter(
        (p) => p.status === PositionStatus.ACTIVE && p.expiry <= now
    )

    console.log(
        `[Keeper] Found ${expired.length} expired positions out of ${positions.length} total positions`
    )

    return expired
}

/**
 * Settle expired positions in batch
 */
async function settleBatch(
    positionIds: bigint[],
    walletClient: any,
    publicClient: any
): Promise<{ success: boolean; hash?: string; error?: string }> {
    if (positionIds.length === 0) {
        return { success: true }
    }

    try {
        console.log(`[Keeper] Settling ${positionIds.length} positions:`, positionIds.map(id => id.toString()))

        // Simulate transaction first to catch errors
        const { request } = await publicClient.simulateContract({
            account: walletClient.account,
            address: CONTRACTS.OptionSettlement,
            abi: OptionSettlementABI,
            functionName: 'settleBatch',
            args: [positionIds],
        })

        // Execute transaction
        const hash = await walletClient.writeContract(request)
        console.log(`[Keeper] Settlement transaction sent: ${hash}`)

        // Wait for confirmation
        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        console.log(`[Keeper] Settlement confirmed with status: ${receipt.status}`)

        return {
            success: receipt.status === 'success',
            hash,
        }
    } catch (error: any) {
        console.error('[Keeper] Settlement failed:', error)
        return {
            success: false,
            error: error.message || 'Settlement transaction failed',
        }
    }
}

/**
 * Main keeper function - finds and settles expired positions
 */
export async function runSettlementKeeper(): Promise<SettlementResult> {
    console.log('[Keeper] 🤖 Starting settlement keeper check...')

    try {
        // Initialize blockchain clients
        const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'
        const privateKey = process.env.MARKET_MAKER_PRIVATE_KEY

        if (!privateKey) {
            throw new Error('MARKET_MAKER_PRIVATE_KEY not configured')
        }

        const publicClient = createPublicClient({
            chain: baseSepolia,
            transport: http(rpcUrl),
        })

        const account = privateKeyToAccount(privateKey as `0x${string}`)
        const walletClient = createWalletClient({
            account,
            chain: baseSepolia,
            transport: http(rpcUrl),
        })

        console.log(`[Keeper] Using keeper account: ${account.address}`)

        // 1. Fetch all positions by iterating IDs (much faster than event scanning)
        const allPositions = await getAllPositions(publicClient)
        console.log(`[Keeper] Found ${allPositions.length} total positions`)

        // 2. Find expired positions
        const expiredPositions = findExpiredPositions(allPositions)

        if (expiredPositions.length === 0) {
            console.log('[Keeper] ✅ No expired positions to settle')
            return {
                success: true,
                settled: 0,
                timestamp: new Date().toISOString(),
            }
        }

        // 3. Batch settle (max 10 at a time to avoid gas issues)
        const batchSize = parseInt(process.env.SETTLEMENT_BATCH_SIZE || '10')
        const positionIds = expiredPositions.slice(0, batchSize).map((p) => p.id)

        console.log(`[Keeper] Settling batch of ${positionIds.length} positions`)

        const result = await settleBatch(positionIds, walletClient, publicClient)

        if (result.success) {
            console.log(
                `[Keeper] ✅ Successfully settled ${positionIds.length} positions`
            )
            return {
                success: true,
                settled: positionIds.length,
                txHash: result.hash,
                timestamp: new Date().toISOString(),
            }
        } else {
            console.error('[Keeper] ❌ Settlement failed:', result.error)
            return {
                success: false,
                settled: 0,
                error: result.error,
                timestamp: new Date().toISOString(),
            }
        }
    } catch (error: any) {
        console.error('[Keeper] ❌ Keeper check failed:', error)
        return {
            success: false,
            settled: 0,
            error: error.message || 'Unknown error',
            timestamp: new Date().toISOString(),
        }
    }
}

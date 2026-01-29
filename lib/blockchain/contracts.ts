import { Address } from 'viem'

// Import contract addresses
const contractAddresses = {
    MockUSDC: '0x706915753fD3A019AA989c0A3c7406E9DDE2bFca',
    PositionRegistry: '0xFE4bC24B54fD807c27d175C51fAaC71BEa6Eaf6D',
    PriceOracle: '0x3c3c8bc273293AC802d05F09d17F7a853D5feCC5',
    MockOptionBook: '0xb80981218b29E133bFf79bF08fE2059dc26112E1',
    PayoutVault: '0x5Ac5992F4FB5A7B76F870f4160E7dCC08952F2f2',
    OptionSettlement: '0xBA186524322C9AD92962cb9d4E15E694A23A4dD4',
    ClaimRouter: '0x29CBC862e4097fb4c429dE99a13A57941c77cd17',
} as const

export const CONTRACTS = {
    PRICE_ORACLE: contractAddresses.PriceOracle as Address,
    POSITION_REGISTRY: contractAddresses.PositionRegistry as Address,
    MOCK_OPTION_BOOK: contractAddresses.MockOptionBook as Address,
    OPTION_SETTLEMENT: contractAddresses.OptionSettlement as Address,
    PAYOUT_VAULT: contractAddresses.PayoutVault as Address,
    CLAIM_ROUTER: contractAddresses.ClaimRouter as Address,
    MOCK_USDC: contractAddresses.MockUSDC as Address,
} as const

// Import ABIs
import PriceOracleABI from '@/contracts/ABIS/PriceOracle.json'
import PositionRegistryABI from '@/contracts/ABIS/PositionRegistry.json'
import MockOptionBookABI from '@/contracts/ABIS/MockOptionBook.json'
import OptionSettlementABI from '@/contracts/ABIS/OptionSettlement.json'
import PayoutVaultABI from '@/contracts/ABIS/PayoutVault.json'
import ClaimRouterABI from '@/contracts/ABIS/ClaimRouter.json'
import MockUSDCABI from '@/contracts/ABIS/MockUSDC.json'

export const ABIS = {
    PriceOracle: PriceOracleABI,
    PositionRegistry: PositionRegistryABI,
    MockOptionBook: MockOptionBookABI,
    OptionSettlement: OptionSettlementABI,
    PayoutVault: PayoutVaultABI,
    ClaimRouter: ClaimRouterABI,
    MockUSDC: MockUSDCABI,
} as const

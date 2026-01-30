import { http, createConfig } from 'wagmi'
import { baseSepolia, base } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
    chains: [baseSepolia, base],
    connectors: [
        coinbaseWallet({
            appName: 'ThetaPlay Options',
            preference: 'smartWalletOnly', // Coinbase Smart Wallet
        }),
        injected(),
    ],
    transports: {
        [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL),
        [base.id]: http(),
    },
    ssr: true,
})

declare module 'wagmi' {
    interface Register {
        config: typeof config
    }
}

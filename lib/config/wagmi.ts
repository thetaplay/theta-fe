import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [baseSepolia],
    connectors: [
        coinbaseWallet({
            appName: 'Nawasena - Trading Options',
            preference: 'smartWalletOnly', // Coinbase Smart Wallet
        }),
        injected(),
    ],
    transports: {
        [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL),
    },
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
})

declare module 'wagmi' {
    interface Register {
        config: typeof config
    }
}

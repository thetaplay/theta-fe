'use client'

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet'
import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
} from '@coinbase/onchainkit/identity'

export function ConnectButton() {
    return (
        <Wallet>
            <ConnectWallet
                className="!bg-white !text-primary !border !border-primaryF !shadow-sm hover:!shadow-md !transition-all !rounded-xl !px-3 !py-2 !text-sm !font-medium !text-foreground hover:!scale-[1.02] active:!scale-95"
            >
                <Avatar className="h-6 w-6" />
                <Name className="!text-sm !font-medium !text-foreground" />
            </ConnectWallet>
            <WalletDropdown className="!bg-card !border !border-border !rounded-2xl !shadow-xl !min-w-[280px]">
                <Identity
                    className="px-4 pt-3 pb-2 !bg-gradient-to-br !from-primary/5 !to-transparent border-b !border-border"
                    hasCopyAddressOnClick
                >
                    <Avatar className="!w-10 !h-10" />
                    <Name className="!text-sm !font-bold !text-foreground" />
                    <Address className="!text-xs !font-medium !text-muted-foreground" />
                    <EthBalance className="!text-xs !text-muted-foreground" />
                </Identity>
                <WalletDropdownDisconnect className="!text-sm !font-medium !text-foreground hover:!text-red-500 !rounded-xl !m-2 hover:!bg-red-50" />
            </WalletDropdown>
        </Wallet>
    )
}

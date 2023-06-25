
import "solana-wallets-vue/styles.css";

import { PhantomWalletAdapter, SolflareWalletAdapter, PhantomWalletAdapterConfig } from "@solana/wallet-adapter-wallets";

export const walletOptions = {
    wallets: [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter()
    ],
    autoConnect: true,
};


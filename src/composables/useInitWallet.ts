
import "solana-wallets-vue/styles.css";

import { PhantomWalletAdapter, SolflareWalletAdapter, BraveWalletAdapter } from "@solana/wallet-adapter-wallets";

export const walletOptions = {
    wallets: [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new BraveWalletAdapter({}),

    ],
    autoConnect: true,
};


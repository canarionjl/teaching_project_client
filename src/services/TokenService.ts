import { useWorkspace } from "@/composables/useWallet";
import { fetchSystemInitialization } from "./FetchAccountService"
import * as useFindPDAMethods from "@/composables/useFindPDAMethods"
import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { useAuthStore } from "@/store/authCodeStore";

class TokenService {

    private workspace: any;

    constructor() {
        this.workspace = useWorkspace()
    }

    async getTokensBalance() {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet
        const connection = this.workspace.connection

        const mint = await useFindPDAMethods.findPDAforMint(program.programId)
        const associatedTokenAccount = await getAssociatedTokenAddress(mint,anchorWallet.value.publicKey, false);

        const tokenAccount = await getAccount(connection, associatedTokenAccount);

        return Number(tokenAccount.amount)/10

    }


}

export default TokenService
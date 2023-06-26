import { useWorkspace } from "@/composables/useWallet";
import { fetchSystemInitialization } from "./FetchAccountService"
import * as useFindPDAMethods from "@/composables/useFindPDAMethods"
import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useAuthStore } from "@/store/authCodeStore";

class SystemService {

    private workspace: any;

    constructor() {
        this.workspace = useWorkspace()
    }

    async systemIsInitialized() {

        let isInitialized = false

        try {
        const systemAccount = await this.fetchSystemAccount()
        isInitialized = systemAccount.systemIsInitialized

        } catch {

        }
        return isInitialized

    }

    async fetchSystemAccount() {
        
        return await fetchSystemInitialization(this.workspace.program.value)

    }

    async initializeSystem (): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const initialization_system_account = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)
        const degree_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "degree")
        const faculty_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "faculty")
        const specialty_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "specialty")
        const subject_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "subject")
        const code_id_relation_account = await useFindPDAMethods.findPDAforCodeIdRelation(program.programId)
        const high_rank_account = await useFindPDAMethods.findPDAforHighRank(program.programId, anchorWallet)
      
        const mint = await useFindPDAMethods.findPDAforMint(program.programId)
        const [mint_auth_pda, bump] = await useFindPDAMethods.findPDAforMintAuthority(program.programId, mint, "1111")

        const store = useAuthStore()
        const authCode = store.authCode
      
        const result = await program.methods.initializateNewSystem(authCode)
          .accounts({
            authority: anchorWallet.publicKey,
            initializationSystemAccount: initialization_system_account,
            highRankAccount: high_rank_account,
            codeIdSubjectRelation: code_id_relation_account,
            degreeIdHandler: degree_id_generator_pda,
            facultyIdHandler: faculty_id_generator_pda,
            specialtyIdHandler: specialty_id_generator_pda,
            subjectIdHandler: subject_id_generator_pda,
            mintAuthorityAccount: mint_auth_pda,
            mint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
      
      
      
        return result;
      
    
    
    }
}

export default SystemService
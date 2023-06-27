import { useWorkspace } from "@/composables/useWallet";
import { fetchHighRankAccount, fetchProfessorAccount, fetchStudentAccount } from "./FetchAccountService"
import * as useFindPDAMethods from "@/composables/useFindPDAMethods"
import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";

class UserService {

    private workspace: any;

    constructor() {
        this.workspace = useWorkspace()
    }

    async fetchProfessorAccountForWallet() {
        return await fetchProfessorAccount(this.workspace.program.value, this.workspace.anchorWallet)
    }

    async fetchStudentAccountForWallet() {
        return await fetchStudentAccount(this.workspace.program.value, this.workspace.anchorWallet)
    }

    async fetchHighRankAccountForWallet() {
        return await fetchHighRankAccount(this.workspace.program.value, this.workspace.anchorWallet)
    }

    async initializeHighRank(): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const pda = await useFindPDAMethods.findPDAforHighRank(program.programId, anchorWallet)
        const id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "highRank")

        const result = await program.methods.createHighRank("1111")
            .accounts({
                authority: anchorWallet.publicKey,
                highRankIdHandler: id_generator_pda,
                highRankAccount: pda,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        return result;
    }

    async initializeProfessor(subjects: Array<number>): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const pda = await useFindPDAMethods.findPDAforProfessor(program.programId, anchorWallet)
        const id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "professor")
        const high_rank_id_handler = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "highRank")
        const codeIdRelation = await useFindPDAMethods.findPDAforCodeIdRelation(program.programId)
        const systemInitialization = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)

        const mint = await useFindPDAMethods.findPDAforMint(program.programId)
        const associatedTokenAccount = await getAssociatedTokenAddress(mint, anchorWallet.value.publicKey, false);

        const result = await program.methods.createProfessor("2222", subjects)
            .accounts({
                authority: anchorWallet.publicKey,
                initializationSystemAccount: systemInitialization,
                professorIdHandler: id_generator_pda,
                highRankIdHandler: high_rank_id_handler,
                professorAccount: pda,
                codeIdSubjectRelation: codeIdRelation,
                mint: mint,
                tokenAccount: associatedTokenAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY
            })
            .rpc();

        return result;
    }

    async initializeStudent(subjects: Array<number>): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const pda = await useFindPDAMethods.findPDAforStudent(program.programId, anchorWallet)
        const id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "student")
        const high_rank_id_handler = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "highRank")
        const codeIdRelation = await useFindPDAMethods.findPDAforCodeIdRelation(program.programId)
        const systemInitialization = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)

        const mint = await useFindPDAMethods.findPDAforMint(program.programId)
        const associatedTokenAccount = await getAssociatedTokenAddress(mint, anchorWallet.value.publicKey, false);

        const result = await program.methods.createStudent("3333", subjects)
            .accounts({
                authority: anchorWallet.publicKey,
                initializationSystemAccount: systemInitialization,
                studentIdHandler: id_generator_pda,
                highRankIdHandler: high_rank_id_handler,
                studentAccount: pda,
                codeIdSubjectRelation: codeIdRelation,
                mint: mint,
                tokenAccount: associatedTokenAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY
            })
            .rpc();

        return result;
    }

    async walletUserExistsWithProfile(profile: string) {

        switch (profile) {

            case "highRank":

                try {
                    const result = await this.fetchHighRankAccountForWallet()
                    return result.identifierCodeHash == "0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c"
                } catch {
                    return false
                }

            case "professor":

                try {
                    const result = await this.fetchProfessorAccountForWallet()
                    return result.identifierCodeHash == "edee29f882543b956620b26d0ee0e7e950399b1c4222f5de05e06425b4c995e9"
                } catch {
                    return false
                }

            case "student":

                try {
                    const result = await this.fetchStudentAccountForWallet()
                    return result.identifierCodeHash == "318aee3fed8c9d040d35a7fc1fa776fb31303833aa2de885354ddf3d44d8fb69"
                } catch {
                    return false
                }

            default:

                return false

        }

    }

}

export default UserService
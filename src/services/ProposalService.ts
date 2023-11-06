import { useWorkspace } from "@/composables/useWallet";
import * as useFindPDAMethods from "@/composables/useFindPDAMethods"
import { fetchIdAccount, fetchProfessorProposalAccount, fetchProposalAccount, fetchProposalIdAccount, fetchSubjectAccount } from "./FetchAccountService";
import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";

class ProposalService {

    private workspace: any;

    constructor() {
        this.workspace = useWorkspace()
    }

    async createProposalByStudent(title: string, content: string, subject_id: number): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const subject = await fetchSubjectAccount(program, subject_id)

        const proposal_id_account = await fetchProposalIdAccount(program, false, subject.code)
        const smaller_proposal_id_available = proposal_id_account.smallerIdAvailable

        const professor_proposal_id_account = await fetchProposalIdAccount(program, true, subject.code)
        const smaller_professor_proposal_id_available = professor_proposal_id_account.smallerIdAvailable

        const pda = await useFindPDAMethods.findPDAforProposal(program.programId, smaller_proposal_id_available, subject.code)
        const student_pda = await useFindPDAMethods.findPDAforStudent(program.programId, anchorWallet)
        const id_generator_pda = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, false, subject.code)
        const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)
        const subject_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "subject")
        const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, smaller_professor_proposal_id_available, subject.code)
        const professor_proposal_id_handler = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, true, subject.code)
        const code_id_relation_account = await useFindPDAMethods.findPDAforCodeIdRelation(program.programId)
        const systemInitialization = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)

        const result = await program.methods.createProposalByStudent(title, content)
            .accounts({
                authority: anchorWallet.publicKey,
                initializationSystemAccount: systemInitialization,
                studentCreator: student_pda,
                proposalIdHandler: id_generator_pda,
                professorProposalIdHandler: professor_proposal_id_handler,
                subjectIdHandler: subject_id_generator_pda,
                proposalAccount: pda,
                professorProposalAccount: professor_proposal_pda,
                subjectAccount: subject_pda,
                codeIdSubjectRelation: code_id_relation_account,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        return result;
    }

    async createProposalByProfessor(title: string, content: string, subject_id: number): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const subject = await fetchSubjectAccount(program, subject_id)

        const proposal_id_account = await fetchProposalIdAccount(program, false, subject.code)
        const smaller_proposal_id_available = proposal_id_account.smallerIdAvailable

        const professor_proposal_id_account = await fetchProposalIdAccount(program, true, subject.code)
        const smaller_professor_proposal_id_available = professor_proposal_id_account.smallerIdAvailable

        const pda = await useFindPDAMethods.findPDAforProposal(program.programId, smaller_proposal_id_available, subject.code)
        const professor_pda = await useFindPDAMethods.findPDAforProfessor(program.programId, anchorWallet)
        const id_generator_pda = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, false, subject.code)
        const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)
        const subject_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "subject")
        const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, smaller_professor_proposal_id_available, subject.code)
        const professor_proposal_id_handler = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, true, subject.code)
        const code_id_relation_account = await useFindPDAMethods.findPDAforCodeIdRelation(program.programId)
        const systemInitialization = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)

        const result = await program.methods.createProposalByProfessor(title, content)
            .accounts({
                authority: anchorWallet.publicKey,
                initializationSystemAccount: systemInitialization,
                professorCreator: professor_pda,
                proposalIdHandler: id_generator_pda,
                professorProposalIdHandler: professor_proposal_id_handler,
                subjectIdHandler: subject_id_generator_pda,
                proposalAccount: pda,
                professorProposalAccount: professor_proposal_pda,
                subjectAccount: subject_pda,
                codeIdSubjectRelation: code_id_relation_account,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        return result;
    }

    async getProposalForSubjectWithState(state: any, code: number) {

        const program = this.workspace.program.value

        const proposals = [];
        const smaller_proposal_id_available = (await fetchProposalIdAccount(this.workspace.program.value, false, code)).smallerIdAvailable

        for (let i = 1; i < smaller_proposal_id_available; i++) {
            let proposal
            try {
                proposal = await fetchProposalAccount(program, i, code)
                console.log(proposal)
            } catch {
                continue
            }
       
            if (JSON.stringify(proposal.state) == JSON.stringify(state)) {
                proposals.push(proposal)
            }
        }

        return proposals
    }

    async getProposalForSubjectArrayWithState(state: any, subjects: any[]) {

        const proposals = [];

        for (let i = 0; i < subjects.length; i++) {

            const proposalForSubject = await this.getProposalForSubjectWithState(state, subjects[i].code)
            const subject_proposal_tuple = [subjects[i].name, subjects[i].code, proposalForSubject]
            proposals.push(subject_proposal_tuple)

        }
        return proposals
    }

    async getProposalsForHighRank(param: number) {

        const program = this.workspace.program.value
        const proposalsForHighRank = [];
        let state = null;

        if (param == 2) {
            state = { waitingForHighRank: {} }
        }
        else if (param == 3) {
            state = { rejected: {} }
        }
        else {
            return []
        }

        const smaller_subject_id_available = (await fetchIdAccount(this.workspace.program.value, "subject")).smallerIdAvailable

        for (let i = 1; i < smaller_subject_id_available; i++) {

            const subject = await fetchSubjectAccount(program, i)

            const proposalForSubject = await this.getProposalForSubjectWithState(state, subject.code)
            const subject_proposal_tuple = [subject.name, subject.code, proposalForSubject]
            proposalsForHighRank.push(subject_proposal_tuple)

        }

        return proposalsForHighRank

    }

    async fetchProposalAccountWithId(id: number, subject_code: number) {
        return await fetchProposalAccount(this.workspace.program.value, id, subject_code)
    }

    async fetchProfessorProposalAccountWithId(id: number, subject_code: number) {
        return await fetchProfessorProposalAccount(this.workspace.program.value, id, subject_code)
    }

    async voteProposalByStudent(proposal_id: number, subject_id: number, profesor_proposal_id: number, vote: boolean, subject_code: number): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)
        const subject_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "subject")
        const student_pda = await useFindPDAMethods.findPDAforStudent(program.programId, anchorWallet)
        const proposal_pda = await useFindPDAMethods.findPDAforProposal(program.programId, proposal_id, subject_code)
        const id_professor_generator_pda = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, true, subject_code)
        const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, profesor_proposal_id, subject_code)

        const result = await program.methods.voteProposalByStudent(vote)
            .accounts({
                authority: anchorWallet.publicKey,
                votingStudent: student_pda,
                subjectIdHandler: subject_id_generator_pda,
                proposalAccount: proposal_pda,
                subjectAccount: subject_pda,
                professorProposalIdHandler: id_professor_generator_pda,
                professorProposalAccount: professor_proposal_pda
            })

            .rpc();

        return result;
    }

    async voteProposalByProfessor(proposal_id: number, subject_id: number, profesor_proposal_id: number, vote: boolean, subject_code: number): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)
        const subject_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "subject")
        const professor_pda = await useFindPDAMethods.findPDAforProfessor(program.programId, anchorWallet)
        const proposal_pda = await useFindPDAMethods.findPDAforProposal(program.programId, proposal_id, subject_code)
        const id_professor_generator_pda = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, true, subject_code)
        const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, profesor_proposal_id, subject_code)

        const result = await program.methods.voteProposalByProfessor(vote)
            .accounts({
                authority: anchorWallet.publicKey,
                votingProfessor: professor_pda,
                subjectIdHandler: subject_id_generator_pda,
                proposalAccount: proposal_pda,
                subjectAccount: subject_pda,
                professorProposalIdHandler: id_professor_generator_pda,
                professorProposalAccount: professor_proposal_pda
            })
            .rpc();

        return result;
    }

    async updateProposalByProfessor(proposal_id: number, profesor_proposal_id: number, subject_code: number, subject_id: number, reference: string): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const professor_account = await useFindPDAMethods.findPDAforProfessor(program.programId, anchorWallet)
        const proposal_pda = await useFindPDAMethods.findPDAforProposal(program.programId, proposal_id, subject_code)
        const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, profesor_proposal_id, subject_code)
        const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)


        const result = await program.methods.updateProposalByProfessor(reference)
            .accounts({
                authority: anchorWallet.publicKey,
                professorAccount: professor_account,
                proposalAccount: proposal_pda,
                professorProposalAccount: professor_proposal_pda,
                subjectAccount: subject_pda
            })
            .rpc();

        return result;
    }

    async updateProposalByHighRank(proposal_id: number, profesor_proposal_id: number, subject_code: number, subject_id: number, vote: boolean): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const high_rank_account = await useFindPDAMethods.findPDAforHighRank(program.programId, anchorWallet)
        const proposal_pda = await useFindPDAMethods.findPDAforProposal(program.programId, proposal_id, subject_code)
        const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, profesor_proposal_id, subject_code)
        const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)

        const result = await program.methods.updateProposalByHighRank(vote)
            .accounts({
                authority: anchorWallet.publicKey,
                highRankAccount: high_rank_account,
                proposalAccount: proposal_pda,
                professorProposalAccount: professor_proposal_pda,
                subjectAccount: subject_pda
            })
            .rpc();

        return result;
    }

    async giveCreditToStudent(proposal_id: number, student_creator_public_key: anchor.web3.PublicKey, identifier_code: string, subject_code: number): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const high_rank_account = await useFindPDAMethods.findPDAforHighRank(program.programId, anchorWallet)
        const proposal_account_pda = await useFindPDAMethods.findPDAforProposal(program.programId, proposal_id, subject_code)
        const creator_account_pda = await useFindPDAMethods.findPDAforStudentPublicKey(program.programId, student_creator_public_key)
        const mint = await useFindPDAMethods.findPDAforMint(program.programId)
        const [pda, bump] = await useFindPDAMethods.findPDAforMintAuthority(program.programId, mint, identifier_code)


        const mintAuthority = { pda: pda, bump: bump };

        const associatedTokenAccount = await getAssociatedTokenAddress(mint, student_creator_public_key, false);

        const result = await program.methods.giveCreditsToWinningStudent(identifier_code, subject_code, mintAuthority.bump)
            .accounts({
                authority: anchorWallet.publicKey,
                highRankAccount: high_rank_account,
                proposalAccount: proposal_account_pda,
                creatorAccount: creator_account_pda,
                tokenAccount: associatedTokenAccount,
                mintAuthorityAccount: mintAuthority.pda,
                mint: mint,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,

            })
            .rpc();

        return result;

    }


    async giveCreditToProfessor(proposal_id: number, student_creator_public_key: anchor.web3.PublicKey, identifier_code: string, subject_code: number): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const high_rank_account = await useFindPDAMethods.findPDAforHighRank(program.programId, anchorWallet)
        const proposal_account_pda = await useFindPDAMethods.findPDAforProposal(program.programId, proposal_id, subject_code)
        const creator_account_pda = await useFindPDAMethods.findPDAforProfessorPublicKey(program.programId, student_creator_public_key)
        const mint = await useFindPDAMethods.findPDAforMint(program.programId)
        const [pda, bump] = await useFindPDAMethods.findPDAforMintAuthority(program.programId, mint, identifier_code)

        const mintAuthority = { pda: pda, bump: bump };

        const associatedTokenAccount = await getAssociatedTokenAddress(mint, student_creator_public_key, false);

        const result = await program.methods.giveCreditsToWinningProfessor(identifier_code, subject_code, mintAuthority.bump)
            .accounts({
                authority: anchorWallet.publicKey,
                highRankAccount: high_rank_account,
                proposalAccount: proposal_account_pda,
                creatorAccount: creator_account_pda,
                tokenAccount: associatedTokenAccount,
                mintAuthorityAccount: mintAuthority.pda,
                mint: mint,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .rpc();

        return result;

    }

    async deleteRejectedProposalByHighRank(proposal_id: number, subject_id: number, professor_proposal_id: number, subject_code: number): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const proposal_pda = await useFindPDAMethods.findPDAforProposal(program.programId, proposal_id, subject_code)
        const high_rank_pda = await useFindPDAMethods.findPDAforHighRank(program.programId, anchorWallet)
        const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)
        const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, professor_proposal_id, subject_code)

        const result = await program.methods.deleteRejectedProposalAccount()
            .accounts({
                authority: anchorWallet.publicKey,
                highRankAccount: high_rank_pda,
                proposalAccount: proposal_pda,
                professorProposalAccount: professor_proposal_pda,
                subjectAccount: subject_pda,
            })
            .rpc();

        return result;
    }

}

export default ProposalService




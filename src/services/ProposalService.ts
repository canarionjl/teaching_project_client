import { useWorkspace } from "@/composables/useWallet";
import * as useFindPDAMethods from "@/composables/useFindPDAMethods"
import { fetchProposalAccount, fetchProposalIdAccount, fetchSubjectAccount } from "./FetchAccountService";
import * as anchor from "@project-serum/anchor";

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

    async getProposalForSubjectWithState(state: any, id: number, code: number) {

        const program = this.workspace.program.value

        const proposals = [];
        const smaller_proposal_id_available = (await fetchProposalIdAccount(this.workspace.program.value, false, code)).smallerIdAvailable

        for (let i = 1; i < smaller_proposal_id_available; i++) {

            const proposal = await fetchProposalAccount(program, i, code)

            if (JSON.stringify(proposal.state) == JSON.stringify(state)) {
                proposals.push(proposal)
            }
        }

        return proposals
    }

    async getProposalForSubjectArrayWithState(state: any, subjects: any[]) {

        const proposals = [];

        for (let i = 0; i < subjects.length; i++) {

            const proposalForSubject = await this.getProposalForSubjectWithState(state, subjects[i].id, subjects[i].code)
            const subject_proposal_tuple = [subjects[i].name, subjects[i].code, proposalForSubject]
            proposals.push(subject_proposal_tuple)

        }
        return proposals
    }

    async fetchProposalAccountWithId(id: number, subject_code: number) {
        return await fetchProposalAccount(this.workspace.program.value, id, subject_code)
    }

    async voteProposalByStudent (proposal_id: number, subject_id: number, profesor_proposal_id: number, vote: boolean, subject_code: number): Promise<string> {

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

    async voteProposalByProfessor (proposal_id: number, subject_id: number, profesor_proposal_id: number, vote: boolean, subject_code: number): Promise<string> {

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

}

export default ProposalService




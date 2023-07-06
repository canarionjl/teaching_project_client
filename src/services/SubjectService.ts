import { useWorkspace } from "@/composables/useWallet";
import { fetchSubjectAccount, fetchIdAccount, fetchProfessorAccount, fetchStudentAccount } from "./FetchAccountService"
import { getCourse } from "@/composables/useAuxFunctions";
import * as useFindPDAMethods from "@/composables/useFindPDAMethods"
import * as anchor from "@project-serum/anchor";

class SubjectService {

    private workspace: any;

    constructor() {
        this.workspace = useWorkspace()
    }

    async getSubjectsWith(specialty_id: number, course: number) {

        const courseObject = await getCourse(course, 0)

        const subjects = [];
        const smaller_subject_id_available: number = (await fetchIdAccount(this.workspace.program.value, "subject")).smallerIdAvailable


        for (let i = 1; i < smaller_subject_id_available; i++) {

            let subjectMustBePushed = false;
            const subject = await fetchSubjectAccount(this.workspace.program.value, i)

            if (subject.specialtyId == specialty_id) {
                if (course == 0) {
                    subjectMustBePushed = true;
                } else {
                    if (JSON.stringify(subject.course) == JSON.stringify(courseObject)) {
                        subjectMustBePushed = true;
                    }
                }

                if (subjectMustBePushed) subjects.push(subject)

            }
        }

        return subjects;
    }

    async getSubjectsForUser (isProfessor: boolean) {

        const anchorWallet = this.workspace.anchorWallet
        const program = this.workspace.program.value

        const subjects = [];
        let user: any;

        if(isProfessor) {
            user = await fetchProfessorAccount(program, anchorWallet) 
        } else {
            user = await fetchStudentAccount(program, anchorWallet)
        }

        console.log(user)

        const smaller_subject_id_available: number = (await fetchIdAccount(program, "subject")).smallerIdAvailable
            
        for (let i = 1; i < smaller_subject_id_available; i++) {
            
            const subject = await fetchSubjectAccount(program, i)
            const subjectMustBePushed = user.subjects.includes(subject.code)

            if(subjectMustBePushed) {
                subjects.push(subject)
            }

        }    

        return subjects
    }

    async createSubject (name: string, degree_id: number, specialty_id: number, course: any, code: number, reference: string): Promise<string>  {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const smaller_subject_id_available = (await fetchIdAccount(this.workspace.program.value, "subject")).smallerIdAvailable

        const pda = await useFindPDAMethods.findPDAforSubject(program.programId,smaller_subject_id_available)
        const high_rank_pda = await useFindPDAMethods.findPDAforHighRank(program.programId, anchorWallet)
        const id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "subject")
        const degree_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "degree")
        const specialty_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "specialty")
        const code_id_relation_pda = await useFindPDAMethods.findPDAforCodeIdRelation(program.programId)
        const systemInitialization = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)
        const proposalIdHandlerForSubject = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, false, code)
        const professorProposalIdHandlerForSubject = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, true, code)
    
        const result = await program.methods.createSubject(name, degree_id, specialty_id, course, code, reference)
            .accounts({
                authority: anchorWallet.publicKey,
                initializationSystemAccount: systemInitialization,
                highRank: high_rank_pda,
                subjectIdHandler: id_generator_pda,
                degreeIdHandler: degree_id_generator_pda,
                specialtyIdHandler: specialty_id_generator_pda,
                subjectAccount: pda,
                codeIdSubjectRelationAccount: code_id_relation_pda,
                proposalIdHandler: proposalIdHandlerForSubject,
                professorProposalIdHandler: professorProposalIdHandlerForSubject,
                systemProgram: anchor.web3.SystemProgram.programId
            })
            .rpc();
    
        return result;
    }

    async fetchSubjectAccountWithId(id: number) {
        const program = this.workspace.program.value
        return await fetchSubjectAccount(program, id)
    }

}

export default SubjectService
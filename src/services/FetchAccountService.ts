import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import * as useFindPDAMethods from '@/composables/useFindPDAMethods'
import { TeachingProjectHandler } from "@/program/types/teaching_project_handler";


export const fetchHighRankAccount = async (program: Program<TeachingProjectHandler>, authority: anchor.web3.PublicKey) => {
    return await program.account.highRank.fetch(await useFindPDAMethods.findPDAforHighRank(program.programId, authority))
}

export const fetchProfessorAccount = async (program: Program<TeachingProjectHandler>, anchorWallet: any) => {
    return await program.account.professor.fetch(await useFindPDAMethods.findPDAforProfessor(program.programId, anchorWallet))
}

export const fetchStudentAccount = async (program: Program<TeachingProjectHandler>, anchorWallet: any) => {
    return await program.account.student.fetch(await useFindPDAMethods.findPDAforStudent(program.programId,anchorWallet))
}

export const fetchFacultyAccount = async (program: Program<TeachingProjectHandler>, id: number) => {
    return await program.account.faculty.fetch(await useFindPDAMethods.findPDAforFaculty(program.programId, id))
}

export const fetchDegreeAccount = async (program: Program<TeachingProjectHandler>, id: number) => {
    return await program.account.degree.fetch(await useFindPDAMethods.findPDAforDegree(program.programId, id))
};

export const fetchSpecialtyAccount = async (program: Program<TeachingProjectHandler>, id: number) => {
    return await program.account.specialty.fetch(await useFindPDAMethods.findPDAforSpecialty(program.programId, id))
}

export const fetchSubjectAccount = async (program: Program<TeachingProjectHandler>, id: number) => {
    return await program.account.subject.fetch(await useFindPDAMethods.findPDAforSubject(program.programId, id))
}

export const fetchProposalAccount = async (program: Program<TeachingProjectHandler>, id: number, subject_code: number) => {
    return await program.account.proposal.fetch(await useFindPDAMethods.findPDAforProposal(program.programId, id, subject_code))
}

export const fetchProfessorProposalAccount = async (program: Program<TeachingProjectHandler>, id: number, subject_code: number) => {
    return await program.account.professorProposal.fetch(await useFindPDAMethods.findPDAforProfessorProposal(program.programId, id, subject_code))
}

export const fetchIdAccount = async (program: Program<TeachingProjectHandler>, account_info: string) => {
    return await program.account.idHandler.fetch(await useFindPDAMethods.findPDAforIdGenerator(program.programId, account_info))
}

export const fetchProposalIdAccount = async (program: Program<TeachingProjectHandler>, is_professor: boolean, subject_code: number) => {
    return await program.account.idHandler.fetch(await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, is_professor, subject_code))
}

export const fetchCodeIdRelationAccount = async (program: Program<TeachingProjectHandler>) => {
    return await program.account.codeIdSubjectRelation.fetch(await useFindPDAMethods.findPDAforCodeIdRelation(program.programId))
}

export const fetchSystemInitialization = async (program: Program<TeachingProjectHandler>) => {
    return await program.account.systemInitialization.fetch(await useFindPDAMethods.findPDAforSystemInitialization(program.programId))
}
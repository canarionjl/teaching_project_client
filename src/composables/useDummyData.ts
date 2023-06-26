import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TeachingProjectHandler } from "@/program/types/teaching_project_handler";
import { ConfirmOptions, Connection } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";

import * as useFindPDAMethods from "@/composables/useFindPDAMethods"
import { fetchIdAccount } from "@/services/FetchAccountService";
import { useWorkspace } from "./useWallet";


const confirmOptions: ConfirmOptions = { commitment: "confirmed" };

// helper functions
const createWallet = async (connection: Connection, funds: number): Promise<anchor.web3.Keypair> => {
    const wallet = anchor.web3.Keypair.generate();
    const tx = await connection.requestAirdrop(
        wallet.publicKey,
        anchor.web3.LAMPORTS_PER_SOL * funds
    );
    // wait for confirmation
    const latestBlockHash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: tx
    });

    // check balance
    const balance = await connection.getBalance(wallet.publicKey);
    if (balance < funds) {
        throw new Error("Requested amount exceeds target" +
            "network's airdrop limit.");
    }
    return wallet;
}

const getExtraFunds = async (connection: Connection, funds: number, wallet: any) => {

    connection.requestAirdrop(wallet.publicKey, 100000)
}

const initializeHighRank = async (program: Program<TeachingProjectHandler>, anchorWallet: any): Promise<string> => {

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

const initializeProfessor = async (program: Program<TeachingProjectHandler>, anchorWallet: any, subjects: Array<number>): Promise<string> => {

    const pda = await useFindPDAMethods.findPDAforProfessor(program.programId, anchorWallet)
    const id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "professor")
    const high_rank_id_handler = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "highRank")
    const codeIdRelation = await useFindPDAMethods.findPDAforCodeIdRelation(program.programId)
    const systemInitialization = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)

    const result = await program.methods.createProfessor("2222", subjects)
        .accounts({
            authority: anchorWallet.publicKey,
            initializationSystemAccount: systemInitialization,
            professorIdHandler: id_generator_pda,
            highRankIdHandler: high_rank_id_handler,
            professorAccount: pda,
            codeIdSubjectRelation: codeIdRelation,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

    return result;
}

const initializeStudent = async (program: Program<TeachingProjectHandler>, authority: anchor.web3.Keypair, subjects: Array<number>): Promise<string> => {

    const pda = await useFindPDAMethods.findPDAforStudent(program.programId, authority.publicKey)
    const id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "student")
    const high_rank_id_handler = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "highRank")
    const codeIdRelation = await useFindPDAMethods.findPDAforCodeIdRelation(program.programId)
    const systemInitialization = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)

    const result = await program.methods.createStudent("3333", subjects)
        .accounts({
            authority: authority.publicKey,
            initializationSystemAccount: systemInitialization,
            studentIdHandler: id_generator_pda,
            highRankIdHandler: high_rank_id_handler,
            studentAccount: pda,
            codeIdSubjectRelation: codeIdRelation,
            systemProgram: anchor.web3.SystemProgram.programId
        })
        .signers([authority])
        .rpc();

    return result;
}

// const initializeSystem = async (program: Program<TeachingProjectHandler>, anchorWallet: any): Promise<string> => {

//     const initialization_system_account = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)
//     const degree_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "degree")
//     const faculty_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "faculty")
//     const specialty_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "specialty")
//     const subject_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "subject")
//     const code_id_relation_account = await useFindPDAMethods.findPDAforCodeIdRelation(program.programId)
//     const high_rank_account = await useFindPDAMethods.findPDAforHighRank(program.programId, anchorWallet)


//     const result = await program.methods.initializateNewSystem()
//         .accounts({
//             authority: anchorWallet.publicKey,
//             initializationSystemAccount: initialization_system_account,
//             highRankAccount: high_rank_account,
//             codeIdSubjectRelation: code_id_relation_account,
//             degreeIdHandler: degree_id_generator_pda,
//             facultyIdHandler: faculty_id_generator_pda,
//             specialtyIdHandler: specialty_id_generator_pda,
//             subjectIdHandler: subject_id_generator_pda,
//             systemProgram: anchor.web3.SystemProgram.programId,
//         })
//         .rpc();

//     return result;
// }

const initializeFaculty = async (program: Program<TeachingProjectHandler>, anchorWallet: any, id: number, name: string): Promise<string> => {

    console.log(program.programId)

    const pda = await useFindPDAMethods.findPDAforFaculty(program.programId, id)
    const high_rank_pda = await useFindPDAMethods.findPDAforHighRank(program.programId, anchorWallet)
    const id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "faculty")
    const system_initialization_pda = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)


    const result = await program.methods.createFaculty(name)
        .accounts({
            authority: anchorWallet.publicKey,
            initializationSystemAccount: system_initialization_pda,
            facultyIdHandler: id_generator_pda,
            highRank: high_rank_pda,
            facultyAccount: pda,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

    return result;
}

const initializeDegree = async (program: Program<TeachingProjectHandler>, anchorWallet: any, id: number, name: string, faculty_id: number): Promise<string> => {

    const pda = await useFindPDAMethods.findPDAforDegree(program.programId, id)
    const high_rank_pda = await useFindPDAMethods.findPDAforHighRank(program.programId, anchorWallet)
    const id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "degree")
    const faculty_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "faculty")
    const systemInitialization = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)

    const result = await program.methods.createDegree(name, faculty_id)
        .accounts({
            authority: anchorWallet.publicKey,
            initializationSystemAccount: systemInitialization,
            degreeIdHandler: id_generator_pda,
            facultyIdHandler: faculty_id_generator_pda,
            highRank: high_rank_pda,
            degreeAccount: pda,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

    return result;
}

const initializeSpecialty = async (program: Program<TeachingProjectHandler>, anchorWallet: any, id: number, name: string, degree_id: number): Promise<string> => {

    const pda = await useFindPDAMethods.findPDAforSpecialty(program.programId, id)
    const high_rank_pda = await useFindPDAMethods.findPDAforHighRank(program.programId, anchorWallet)
    const id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "specialty")
    const degree_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "degree")
    const systemInitialization = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)


    const result = await program.methods.createSpecialty(name, degree_id)
        .accounts({
            authority: anchorWallet.publicKey,
            initializationSystemAccount: systemInitialization,
            specialtyIdHandler: id_generator_pda,
            degreeIdHandler: degree_id_generator_pda,
            highRank: high_rank_pda,
            specialtyAccount: pda,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

    return result;
}

// const initializeSubject = async (program: Program<TeachingProjectHandler>, anchorWallet: any, id: number, name: string, degree_id: number, specialty_id: number, course: any, code: number): Promise<string> => {

//     const pda = await useFindPDAMethods.findPDAforSubject(program.programId, id)
//     const high_rank_pda = await useFindPDAMethods.findPDAforHighRank(program.programId, anchorWallet)
//     const id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "subject")
//     const degree_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "degree")
//     const specialty_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "specialty")
//     const code_id_relation_pda = await useFindPDAMethods.findPDAforCodeIdRelation(program.programId)
//     const systemInitialization = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)
//     const proposalIdHandlerForSubject = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, false, code)
//     const professorProposalIdHandlerForSubject = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, true, code)

//     const result = await program.methods.createSubject(name, degree_id, specialty_id, course, code)
//         .accounts({
//             authority: anchorWallet.publicKey,
//             initializationSystemAccount: systemInitialization,
//             highRank: high_rank_pda,
//             subjectIdHandler: id_generator_pda,
//             degreeIdHandler: degree_id_generator_pda,
//             specialtyIdHandler: specialty_id_generator_pda,
//             subjectAccount: pda,
//             codeIdSubjectRelationAccount: code_id_relation_pda,
//             proposalIdHandler: proposalIdHandlerForSubject,
//             professorProposalIdHandler: professorProposalIdHandlerForSubject,
//             systemProgram: anchor.web3.SystemProgram.programId
//         })
//         .rpc();

//     return result;
// }

const initializeProposalByStudent = async (program: Program<TeachingProjectHandler>, authority: anchor.web3.Keypair, id: number, title: string, content: string, subject_id: number, professor_proposal_id: number, subject_code: number): Promise<string> => {

    const pda = await useFindPDAMethods.findPDAforProposal(program.programId, id, subject_code)
    const student_pda = await useFindPDAMethods.findPDAforStudent(program.programId, authority.publicKey)
    const id_generator_pda = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, false, subject_code)
    const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)
    const subject_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "subject")
    const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, professor_proposal_id, subject_code)
    const professor_proposal_id_handler = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, true, subject_code)
    const code_id_relation_account = await useFindPDAMethods.findPDAforCodeIdRelation(program.programId)
    const systemInitialization = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)

    const result = await program.methods.createProposalByStudent(title, content)
        .accounts({
            authority: authority.publicKey,
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
        .signers([authority])
        .rpc();

    return result;
}

const initializeProposalByProfessor = async (program: Program<TeachingProjectHandler>, authority: anchor.web3.Keypair, id: number, title: string, content: string, subject_id: number, professor_proposal_id: number, subject_code: number): Promise<string> => {

    const pda = await useFindPDAMethods.findPDAforProposal(program.programId, id, subject_code)
    const professor_pda = await useFindPDAMethods.findPDAforProfessor(program.programId, authority.publicKey)
    const id_generator_pda = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, false, subject_code)
    const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)
    const subject_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "subject")
    const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, professor_proposal_id, subject_code)
    const professor_proposal_id_handler = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, true, subject_code)
    const code_id_relation_account = await useFindPDAMethods.findPDAforCodeIdRelation(program.programId)
    const systemInitialization = await useFindPDAMethods.findPDAforSystemInitialization(program.programId)



    const result = await program.methods.createProposalByProfessor(title, content)
        .accounts({
            authority: authority.publicKey,
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
        .signers([authority])
        .rpc();

    return result;
}

const voteProposalByStudent = async (program: Program<TeachingProjectHandler>, authority: anchor.web3.Keypair, proposal_id: number, subject_id: number, profesor_proposal_id: number, vote: boolean, subject_code: number): Promise<string> => {

    const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)
    const subject_id_generator_pda = await useFindPDAMethods.findPDAforIdGenerator(program.programId, "subject")
    const student_pda = await useFindPDAMethods.findPDAforStudent(program.programId, authority.publicKey)
    const proposal_pda = await useFindPDAMethods.findPDAforProposal(program.programId, proposal_id, subject_code)
    const id_professor_generator_pda = await useFindPDAMethods.findPDAforProposalIdGenerator(program.programId, true, subject_code)
    const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, profesor_proposal_id, subject_code)

    const result = await program.methods.voteProposalByStudent(vote)
        .accounts({
            authority: authority.publicKey,
            votingStudent: student_pda,
            subjectIdHandler: subject_id_generator_pda,
            proposalAccount: proposal_pda,
            subjectAccount: subject_pda,
            professorProposalIdHandler: id_professor_generator_pda,
            professorProposalAccount: professor_proposal_pda
        })
        .signers([authority])
        .rpc(confirmOptions);

    return result;
}

// const updateProposalByProfessor = async (program: Program<TeachingProjectHandler>, authority: anchor.web3.Keypair, proposal_id: number, profesor_proposal_id: number, subject_code: number, subject_id: number): Promise<string> => {

//     const professor_account = await useFindPDAMethods.findPDAforProfessor(program.programId, authority.publicKey)
//     const proposal_pda = await useFindPDAMethods.findPDAforProposal(program.programId, proposal_id, subject_code)
//     const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, profesor_proposal_id, subject_code)
//     const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)


//     const result = await program.methods.updateProposalByProfessor()
//         .accounts({
//             authority: authority.publicKey,
//             professorAccount: professor_account,
//             proposalAccount: proposal_pda,
//             professorProposalAccount: professor_proposal_pda,
//             subjectAccount: subject_pda
//         })
//         .signers([authority])
//         .rpc(confirmOptions);

//     return result;
// }

const updateProposalByHighRank = async (program: Program<TeachingProjectHandler>, authority: anchor.web3.Keypair, proposal_id: number, profesor_proposal_id: number, subject_code: number, subject_id: number): Promise<string> => {

    const high_rank_account = await useFindPDAMethods.findPDAforHighRank(program.programId, authority.publicKey)
    const proposal_pda = await useFindPDAMethods.findPDAforProposal(program.programId, proposal_id, subject_code)
    const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, profesor_proposal_id, subject_code)
    const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)


    const result = await program.methods.updateProposalByHighRank(true)
        .accounts({
            authority: authority.publicKey,
            highRankAccount: high_rank_account,
            proposalAccount: proposal_pda,
            professorProposalAccount: professor_proposal_pda,
            subjectAccount: subject_pda
        })
        .signers([authority])
        .rpc(confirmOptions);

    return result;
}

const giveCreditToStudent = async (program: Program<TeachingProjectHandler>, authority: anchor.web3.Keypair, proposal_id: number, student_creator_public_key: anchor.web3.PublicKey, identifier_code: string, subject_code: number, subject_id: number): Promise<string> => {

    const high_rank_account = await useFindPDAMethods.findPDAforHighRank(program.programId, authority.publicKey)
    const proposal_account_pda = await useFindPDAMethods.findPDAforProposal(program.programId, proposal_id, subject_code)
    const creator_account_pda = await useFindPDAMethods.findPDAforStudent(program.programId, student_creator_public_key)
    const mint = await useFindPDAMethods.findPDAforMint(program.programId)
    const [pda, bump] = await useFindPDAMethods.findPDAforMintAuthority(program.programId, mint, identifier_code)
    const subject_account_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)


    const mintAuthority = { pda: pda, bump: bump };

    const associatedTokenAccount = await getAssociatedTokenAddress(mint, creator_account_pda, true);

    const result = await program.methods.giveCreditsToWinningStudent("1111", subject_code, mintAuthority.bump)
        .accounts({
            authority: authority.publicKey,
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
        .signers([authority])
        .rpc();

    return result;

}

const deleteRejectedProposalByHighRank = async (program: Program<TeachingProjectHandler>, authority: anchor.web3.Keypair, proposal_id: number, subject_id: number, professor_proposal_id: number, subject_code: number): Promise<string> => {

    const proposal_pda = await useFindPDAMethods.findPDAforProposal(program.programId, proposal_id, subject_code)
    const high_rank_pda = await useFindPDAMethods.findPDAforHighRank(program.programId, authority.publicKey)
    const subject_pda = await useFindPDAMethods.findPDAforSubject(program.programId, subject_id)
    const professor_proposal_pda = await useFindPDAMethods.findPDAforProfessorProposal(program.programId, professor_proposal_id, subject_code)

    const result = await program.methods.deleteRejectedProposalAccount()
        .accounts({
            authority: authority.publicKey,
            highRankAccount: high_rank_pda,
            proposalAccount: proposal_pda,
            professorProposalAccount: professor_proposal_pda,
            subjectAccount: subject_pda,
        })
        .signers([authority])
        .rpc();

    return result;
}







let wallet1: anchor.web3.Keypair;
let wallet2: anchor.web3.Keypair;
let wallet3: anchor.web3.Keypair;
let wallet4: anchor.web3.Keypair;
let alternativeWallet: anchor.web3.Keypair;



// wallet2 = await createWallet(connection, 40); // Professor
// wallet3 = await createWallet(connection, 10); // Student
// wallet4 = await createWallet(connection, 10);
// alternativeWallet = await createWallet(connection, 10)

export const initDummyData = async () => {

    const { anchorWallet, program } = useWorkspace()

    await initializeProfessor(program.value, anchorWallet, [43222])

    // await initializeHighRank(program.value, anchorWallet)

    // await initializeSystem(program.value, anchorWallet)

    // const facultyIdAccount = await fetchIdAccount(program.value, "faculty")
    // const faculty_id = facultyIdAccount.smallerIdAvailable

    // const NUMBER_OF_ELEMENTS = 3

    // const courses = [{First:{}}, {Second:{}}, {Third: {}}]


    // for (let i = faculty_id; i < faculty_id + NUMBER_OF_ELEMENTS; i++) {

    //     await initializeFaculty(program.value, anchorWallet, i, "Facultad " + i)

    //     const degreeIdAccount = await fetchIdAccount(program.value, "degree")
    //     const degree_id = degreeIdAccount.smallerIdAvailable

    //     for (let j = degree_id; j < degree_id + NUMBER_OF_ELEMENTS; j++) {
    //         await initializeDegree(program.value, anchorWallet, j, "Grado " + j + " de la facultad: " + i, i)

    //         const specialtyIdAccount = await fetchIdAccount(program.value, "specialty")
    //         const specialty_id = specialtyIdAccount.smallerIdAvailable

    //         for (let k = specialty_id; k < specialty_id + NUMBER_OF_ELEMENTS; k++) {
    //             await initializeSpecialty(program.value, anchorWallet, k, "Especialidad " + k + " del grado " + j, j)

    //             const subjectIdAccount = await fetchIdAccount(program.value, "subject")
    //             const subject_id = subjectIdAccount.smallerIdAvailable

    //             for (let m = subject_id; m < subject_id + NUMBER_OF_ELEMENTS; m++) {
    //                 await initializeSubject(program.value, anchorWallet, m, "Asignatura " + m + " de la especialidad " + k, j, k, {first: {}}, 40000 + m)
    //             }
    //         }
    //     }
    // }

}



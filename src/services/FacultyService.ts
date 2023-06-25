import { useWorkspace } from "@/composables/useWallet";
import { fetchFacultyAccount, fetchIdAccount } from "./FetchAccountService"
import { Program } from "@project-serum/anchor";
import * as useFindPDAMethods from "@/composables/useFindPDAMethods"
import { TeachingProjectHandler } from "@/program/types/teaching_project_handler";
import * as anchor from "@project-serum/anchor";

class FacultyService {

    private workspace: any;

    constructor() {
        this.workspace = useWorkspace()
    }

    async getAllFaculties() {

        const faculties = [];
        const smaller_faculty_id_available: number = (await fetchIdAccount(this.workspace.program.value, "faculty")).smallerIdAvailable

        for (let i = 1; i < smaller_faculty_id_available; i++) {
            const faculty = await fetchFacultyAccount(this.workspace.program.value, i)
            faculties.push(faculty)
        }

        return faculties;
    }

    async getFacultyWithId(id: number) {

        return await fetchFacultyAccount(this.workspace.program.value, id)
        
    }


    async createFaculty(name: string): Promise<string> {

        const anchorWallet = this.workspace.anchorWallet
        const program = this.workspace.program.value

        const smaller_faculty_id_available: number = (await fetchIdAccount(this.workspace.program.value, "faculty")).smallerIdAvailable

        const pda = await useFindPDAMethods.findPDAforFaculty(program.programId, smaller_faculty_id_available)
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


}

export default FacultyService
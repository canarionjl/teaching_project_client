import { useWorkspace } from "@/composables/useWallet";
import { fetchDegreeAccount, fetchIdAccount } from "./FetchAccountService"
import * as useFindPDAMethods from "@/composables/useFindPDAMethods"
import * as anchor from "@project-serum/anchor";

class DegreeService {

    private workspace: any;

    constructor() {
        this.workspace = useWorkspace()
    }

    async getAllDegreesForFaculty(id: number) {

        const degrees = [];
        const smaller_degree_id_available: number = (await fetchIdAccount(this.workspace.program.value, "degree")).smallerIdAvailable

        for (let i = 1; i < smaller_degree_id_available; i++) {
            const degree = await fetchDegreeAccount(this.workspace.program.value, i)
            if (degree.facultyId == id) {
                degrees.push(degree)
            }
        }

        return degrees;
    }

    async createDegree (name: string, faculty_id: number): Promise<string> {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const smaller_degree_id_available: number = (await fetchIdAccount(this.workspace.program.value, "degree")).smallerIdAvailable

        const pda = await useFindPDAMethods.findPDAforDegree(program.programId, smaller_degree_id_available )
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


}

export default DegreeService
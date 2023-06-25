import { useWorkspace } from "@/composables/useWallet";
import { fetchSpecialtyAccount, fetchIdAccount } from "./FetchAccountService"
import * as useFindPDAMethods from "@/composables/useFindPDAMethods"
import * as anchor from "@project-serum/anchor";

class SpecialtyService {

    private workspace: any;

    constructor() {
        this.workspace = useWorkspace()
    }

    async getAllSpecialtysForDegree(id: number) {

        const specialties = [];
        const smaller_specialty_id_available: number = (await fetchIdAccount(this.workspace.program.value, "specialty")).smallerIdAvailable

        for (let i = 1; i < smaller_specialty_id_available; i++) {
            const specialty = await fetchSpecialtyAccount(this.workspace.program.value, i)
            if (specialty.degreeId == id) {
                specialties.push(specialty)
            }
        }

        return specialties;
    }

    async getSpecialtyWithId(id: number) {

        return await fetchSpecialtyAccount(this.workspace.program.value, id)
        
    }

    async createSpecialty (name: string, degree_id: number): Promise<string>  {

        const program = this.workspace.program.value
        const anchorWallet = this.workspace.anchorWallet

        const smaller_degree_id_available: number = (await fetchIdAccount(this.workspace.program.value, "specialty")).smallerIdAvailable

        const pda = await useFindPDAMethods.findPDAforSpecialty(program.programId, smaller_degree_id_available)
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
    
}

export default SpecialtyService
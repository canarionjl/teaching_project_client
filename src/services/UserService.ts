import { useWorkspace } from "@/composables/useWallet";
import { fetchProfessorAccount, fetchStudentAccount } from "./FetchAccountService"
import * as useFindPDAMethods from "@/composables/useFindPDAMethods"
import * as anchor from "@project-serum/anchor";

class UserService {

    private workspace: any;

    constructor() {
        this.workspace = useWorkspace()
    }

    async fetchProfessorAccountForWallet () {
        return await fetchProfessorAccount(this.workspace.program.value, this.workspace.anchorWallet)
    }

    
    async fetchStudentAccountForWallet () {
        return await fetchStudentAccount(this.workspace.program.value, this.workspace.anchorWallet)
    }

}

export default UserService
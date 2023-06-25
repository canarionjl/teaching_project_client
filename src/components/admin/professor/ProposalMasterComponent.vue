<template>
    <div id="component">

        <div v-if="isLoading" id="loading">

            <h3>Cargando...</h3>

        </div>

        <div v-if="!isLoading">

            <div v-if="!error" class="mt-5 mx-4">

                <div id="title" class=" mb-5 mt-3">

                    <h1>MIS PROPUESTAS PENDIENTES</h1>

                </div>

                <div v-for="(elm, index) in proposalListOrderedBySubjects" :key=index id="proposalList">

                    <h2>{{ elm[0] }}</h2>
                    <hr class="hr pb-4">

                    <div v-for="(proposal, i) in elm[2]" :key=i class="mb-5">

                        <ProposalListComponent :name="proposal.title" :id="proposal.id" :showVotingInfo="true"
                            :votingInfo="userHasVotedTheSelectedProposal(proposal)" :subjectCode="elm[1]" />

                    </div>

                </div>

            </div>

            <div id="error" v-if="error">

                <ErrorMessageComponent :errorMessage="errorMessage" />

            </div>

        </div>

    </div>
</template>

<script lang="ts" setup>

import ProposalService from "@/services/ProposalService";
import { onMounted, Ref, ref } from "vue";
import { storeToRefs } from 'pinia';

import ErrorMessageComponent from '@/components/error/ErrorMessageComponent.vue'
import ProposalListComponent from "@/components/proposals/ProposalListComponent.vue";
import SubjectService from "@/services/SubjectService";
import { useAuthStore } from "@/store/authCodeStore";
import { getUserInfo } from "@/composables/useAuxFunctions"
import { userHasVotedTheProposal } from "@/composables/useProposalFunctions";

let proposalListOrderedBySubjects: Ref = ref(null);
let error: Ref = ref(false);
let errorMessage: Ref = ref("")
let isLoading: Ref = ref(true)
let userInfoRef: Ref = ref(null)


const store = useAuthStore()
const { hashedAuthCode } = storeToRefs(store)

onMounted(async () => {

    await getData()

})

async function getData() {

    let isProfessor = false

    try {

        await getCurrentUserInfo()

        if (hashedAuthCode.value.toString() == "edee29f882543b956620b26d0ee0e7e950399b1c4222f5de05e06425b4c995e9") {
            isProfessor = true
        }
        else if (hashedAuthCode.value.toString() == "318aee3fed8c9d040d35a7fc1fa776fb31303833aa2de885354ddf3d44d8fb69") {
            isProfessor = false
        }
        else {
            throw new Error("User not authorized: user is neither a professor nor a student")
        }

        const subjectList = await new SubjectService().getSubjectsForUser(isProfessor)
        proposalListOrderedBySubjects.value = await new ProposalService().getProposalForSubjectArrayWithState({ votationInProgress: {} }, subjectList)

        isLoading.value = false;

    } catch (err) {
   
        isLoading.value = false;
        error.value = true;
        errorMessage.value = "No se ha podido recuperar la lista de asignaturas"
        
    }

    if (!error.value && proposalListOrderedBySubjects.value.length == 0) {

        error.value = true;
        errorMessage.value = "No se encuentra ninguna asignatura que cumpla con los requisitos indicados"

    }
}

function userHasVotedTheSelectedProposal(proposal: any): boolean {

    while (userInfoRef.value == null);

    return userHasVotedTheProposal(userInfoRef.value, proposal)

}

async function getCurrentUserInfo() {

    userInfoRef.value = await getUserInfo()

}


</script>

<style lang="scss" scoped>
#component {
    font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

#error {

    h1 {
        color: #ff0000;
        text-align: center;
        font-size: xxx-large;
        margin-top: 5%;
    }

    width: 100%;

}

#loading {

    h3 {
        color: $complementary;
        text-align: center;
        font-weight: bold;
        padding: 30px;
    }

}

#proposalList {

    hr {
        border-top: 10px solid $complementary;
        margin-top: 0px;
    }
}

#title {
    text-align: center;
    font-weight: bold;
    color: white;
    background-color: $primary;
    border-radius: 15px;
    padding: 25px;
    margin-inline: 15px;
}
</style>
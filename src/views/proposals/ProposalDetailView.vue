<template>
    <div id="component">

        <div v-if="isLoading" id="loading" class="m-5">

            <h3>Cargando...</h3>

        </div>

        <div v-if="!isLoading">

            <div v-if="!error">

                <div id="proposaltData">

                    <div id="title" class=" mb-2 mt-2">
                        <div class="d-flex flex-column justify-content-between align-items-center">
                            <div>
                                <h3 id="proposalTitle" class=" pb-5">{{ proposal.title }}</h3>
                            </div>
                            <div>
                                <h4 class="pb-2" id="proposalContent">{{ proposal.content }}</h4>
                            </div>
                        </div>
                    </div>

                    <div id="content">

                        <div class="d-flex flex-row justify-content-between align-items-center">

                            <div class="d-flex flex-column justify-content-between align-items-start">

                                <h4>Fecha de publicación: <b>{{ publishing_date }}</b></h4>
                                <h4>Fecha de finalización: <b>{{ ending_date }}</b></h4>

                            </div>

                            <div class="d-flex flex-column justify-content-between align-items-start ">

                                <h3>Asignatura: <b>{{ subject.name }}</b></h3>

                            </div>

                        </div>

                    </div>

                    <div id="buttons" v-show="!userHasVoted">

                        <div class="d-flex flex-row justify-content-center align-items-center">

                            <button class="btn btn-primary btn-lg m-5 p-3">VOTAR A FAVOR ✅</button>
                            <button class="btn btn-primary btn-lg m-5 p-3">VOTAR EN CONTRA ❌</button>

                        </div>

                    </div>

                    <div v-show="userHasVoted" id="userHasVoted">

                        <h2>¡Genial! Ya has votado por esta propuesta 😀</h2>

                    </div>

                </div>

            </div>

        </div>

        <div id="error" v-if="error">

            <ErrorMessageComponent :errorMessage="errorMessage" />

        </div>

    </div>
</template>

<script lang="ts" setup>

import SubjectService from '@/services/SubjectService';
import { onMounted, Ref, ref } from 'vue';
import { useRoute } from "vue-router";
import ProposalService from '@/services/ProposalService';
import { convertUnixTimestampToDate, getProposalState, getReturn, getUserInfo } from '@/composables/useAuxFunctions';
import { userHasVotedTheProposal } from '@/composables/useProposalFunctions';
import { useAuthStore } from '@/store/authCodeStore';
import { storeToRefs } from 'pinia';


let proposal: Ref = ref(null)
let subject: Ref = ref(null)
let publishing_date: Ref = ref(null)
let ending_date: Ref = ref(null)
let current_state: Ref = ref(null)

let userHasVoted: Ref = ref(false)

let isLoading: Ref = ref(true)
let error: Ref = ref(false)
let errorMessage: Ref = ref("")

onMounted(async () => {

    const route = useRoute()

    try {

        const proposal_id = Number(route.params.proposal_id).valueOf()
        const subject_code = Number(route.params.subject_code).valueOf()

        proposal.value = await new ProposalService().fetchProposalAccountWithId(proposal_id, subject_code)
        subject.value = await new SubjectService().fetchSubjectAccountWithId(proposal.value.subjectId)
        userHasVoted.value = userHasVotedTheProposal(await getUserInfo(), proposal.value)

        isLoading.value = false;

    } catch {

        errorMessage.value = "No se ha podido recuperar la información de la propuesta"
        isLoading.value = false
        error.value = true

    }

    setProposalData()

})


function setProposalData() {

    publishing_date.value = convertUnixTimestampToDate(proposal.value.publishingTimestamp)
    ending_date.value = convertUnixTimestampToDate(proposal.value.endingTimestamp)
    current_state.value = getProposalState(proposal.value.state)

}

async function voteProposal(vote: boolean): Promise<string> {

    let tx = "";

    const store = useAuthStore()
    const { hashedAuthCode } = storeToRefs(store)

    if (hashedAuthCode.value.toString() == "edee29f882543b956620b26d0ee0e7e950399b1c4222f5de05e06425b4c995e9") {

        tx = await new ProposalService().voteProposalByProfessor(
            proposal.value.id, subject.value.id,
            proposal.value.associatedProfessorProposalId,
            vote,
            subject.value.code
        )

    }
    else if (hashedAuthCode.value.toString() == "318aee3fed8c9d040d35a7fc1fa776fb31303833aa2de885354ddf3d44d8fb69") {

        tx = await new ProposalService().voteProposalByStudent(
            proposal.value.id, subject.value.id,
            proposal.value.associatedProfessorProposalId,
            vote,
            subject.value.code
        )

    }


    return tx;
}

async function onVoteButtonClicked(vote: boolean) {

    const tx = await voteProposal(vote)

    if (tx != "") {
        const log = await getReturn(true, false, tx)
        if (log == true) {
            userHasVoted.value = true
        }
    }

    else {

        error.value = true
        errorMessage.value = "Para votar debe estar registrado como profesor o estudiante y matriculado en la asignatura" +
        "Si cumple con estos requisitos, vuelva a intentarlo más tarde"

    }

}

</script>

<style lang="scss" scoped>
#component {
    font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

#title,
#content {
    text-align: center;
    color: black;
    background-color: $complementary-light;
    border-radius: 15px;
    padding: 20px;
    margin-inline: 15px;

    h2,
    h3,
    h4 {
        padding-inline: 15px;
    }
}

#proposalTitle {
    font-weight: bold;
    text-decoration: underline;
}

b {
    font-weight: bold;
}


#proposalData {
    background-color: white;
    margin: 15px;
    border-radius: 15px;
    padding: 15px;
    text-align: center;
}

#loading {
    h3 {
        color: $complementary;
        font-weight: bold;
    }

    text-align:center;
}

#userHasVoted {
    padding: 35px;
    text-align: center;
    color: green;
    font-weight: bold;
}

.btn-primary {
    background-color: $primary !important;
    border: $primary !important;
    font-weight: bolder !important;
}
</style>
<template>
    <div id="component">

        <div v-if="isLoading" id="loading" class="m-5">

            <h3>Cargando...</h3>

        </div>

        <div v-if="!isLoading">

            <div v-if="!error">

                <div id="proposalData">

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
                                <h4>Votos a favor: <b id="supporting" class="p-1">{{ proposal.supportingVotes }}</b></h4>

                            </div>

                            <div class="d-flex flex-column justify-content-between align-items-start ">

                                <h4>Asignatura: <b>{{ subject.name }}</b></h4>
                                <h4>Estado: <b>{{ current_state }}</b></h4>
                                <h4>Votos en contra: <b id="against" class="p-1">{{ proposal.againstVotes }}</b></h4>

                            </div>

                        </div>

                    </div>

                    <div class="m-3" v-if="readingModeRef == false">

                        <div v-if="proposalStateRef == 0">

                            <VotingComponent @resultInfoEmit="setResultInfo" />

                        </div>

                        <div v-if="proposalStateRef == 1">

                            <UpdateTeachingProjectComponent @resultInfoEmit="setResultInfo" />

                        </div>

                        <div v-if="highRankViewRef == true">

                            <div v-if="proposalStateRef == 2">

                                <ValidateProposalComponent @resultInfoEmit="setResultInfo" />

                            </div>

                            <div v-if="proposalStateRef == 3">

                                <DeleteProposalComponent @resultInfoEmit="setResultInfo" />

                            </div>

                        </div>

                    </div>

                    <div v-if="resultRef == true">

                        <SuccessMessageComponent :msg="resultMessageRef" />

                    </div>

                    <div v-if="resultRef == false">

                        <ErrorMessageComponent :errorMessage="resultMessageRef" />

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
import { onBeforeMount, Ref, ref } from 'vue';
import { useRoute } from "vue-router";
import ProposalService from '@/services/ProposalService';
import { convertUnixTimestampToDate, getStateString } from '@/composables/useAuxFunctions';
import VotingComponent from '@/components/proposals/professor&student/VotingComponent.vue';
import UpdateTeachingProjectComponent from '@/components/proposals/professor&student/UpdateTeachingProjectComponent.vue'
import { useProposalStore } from '@/store/proposalStore';
import ErrorMessageComponent from '@/components/error/ErrorMessageComponent.vue';
import SuccessMessageComponent from '@/components/success/SuccessMessageComponent.vue';
import ValidateProposalComponent from '@/components/proposals/highRank/ValidateProposalComponent.vue';
import DeleteProposalComponent from '@/components/proposals/highRank/DeleteProposalComponent.vue';
import { useAuthStore } from '@/store/authCodeStore';

let proposal: Ref = ref(null)
let subject: Ref = ref(null)
let associatedProfessorProposal: Ref = ref(null)

let publishing_date: Ref = ref(-1)
let ending_date: Ref = ref(-1)
let current_state: Ref = ref("Desconocido")

let isLoading: Ref = ref(true)
let error: Ref = ref(false)
let errorMessage: Ref = ref("")

let readingModeRef: Ref = ref(true)
let proposalStateRef: Ref = ref(false)

let resultRef: Ref = ref(null)
let resultMessageRef: Ref = ref("")

let highRankViewRef: Ref = ref(false)

onBeforeMount(async () => {

    const route = useRoute()

    try {

        const proposal_id = Number(route.params.proposal_id).valueOf()
        console.log("Proposal ID: ", proposal_id)

        const subject_code = Number(route.params.subject_code).valueOf()
        const reading_mode = String(route.params.readingMode).valueOf()
        const proposalState = Number(route.params.proposalState).valueOf()

        readingModeRef.value = reading_mode == 'true'
        proposalStateRef.value = proposalState

        const authStore = useAuthStore()

        if (
            (proposalState == 2 || proposalState == 3) &&
            authStore.hashedAuthCode.toString() != "0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c"
        ) {
            highRankViewRef.value = false
        } else {
            highRankViewRef.value = true
        }

        proposal.value = await new ProposalService().fetchProposalAccountWithId(proposal_id, subject_code)
        subject.value = await new SubjectService().fetchSubjectAccountWithId(proposal.value.subjectId)
        associatedProfessorProposal.value = await new ProposalService().fetchProfessorProposalAccountWithId(proposal_id, subject_code)

        const store = useProposalStore()
        store.setProposal(proposal.value)
        store.setSubject(subject.value)
        store.setProfessorProposal(associatedProfessorProposal.value)

        isLoading.value = false;

    } catch {

        errorMessage.value = "No se ha podido recuperar la información de la propuesta"
        isLoading.value = false
        error.value = true

    }

    setProposalData()

})



function setProposalData() {

    if (proposal.value != null) {

        publishing_date.value = convertUnixTimestampToDate(proposal.value.publishingTimestamp)
        ending_date.value = convertUnixTimestampToDate(proposal.value.endingTimestamp)
        current_state.value = getStateString(proposal.value.state)

    }

}


function setResultInfo(data: any) {

    resultRef.value = data.isOk
    resultMessageRef.value = data.resultMessage

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

#supporting {
    color: rgb(46, 188, 46);
    font-size: 27px;
    font-weight: bolder;
}

#against {
    color: red;
    font-size: 27px;
    font-weight: bolder;
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

.btn-primary {
    background-color: $primary !important;
    border: $primary !important;
    font-weight: bolder !important;
}
</style>
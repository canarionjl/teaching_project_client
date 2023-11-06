<template>
    <div id="component">

        <div v-if="isLoading" id="loading" class="m-5">

            <h3>Cargando...</h3>

        </div>

        <div v-if="!isLoading">

            <div v-if="!error">

                <div id="subjectData">

                    <div id="title" class=" mb-2 mt-2">

                        <h1>{{ subject.name }}</h1>

                    </div>

                    <div id="content">

                        <div class="d-flex flex-row justify-content-between align-items-center">

                            <div class="d-flex flex-column justify-content-between align-items-start">

                                <h2><b>{{ faculty.name }}</b></h2>
                                <h3>{{ specialty.name }}</h3>

                            </div>

                            <div class="d-flex flex-column justify-content-between align-items-start ">

                                <h2><b>Código: <i>{{ subject.code }}</i></b></h2>
                                <h3>Course: <i>{{ getCourseIndex(subject.course) }}º</i></h3>
                            </div>

                        </div>

                    </div>

                    <div id="buttons">

                        <div class="d-flex flex-row justify-content-center align-items-center">

                            <button class="btn btn-primary btn-lg m-5 p-3" @click="onWatchTeachingProjectSystem">Ver
                                proyecto docente</button>

                            <div v-if="!readingModeRef">
                                <router-link :to="{ name: 'createProposal', params: { subject_id: subject.id } }">
                                    <button class="btn btn-primary btn-lg m-5 p-3">Crear nueva propuesta</button>
                                </router-link>
                            </div>

                        </div>

                    </div>

                </div>

                <div id="pendingProposals" class="mt-5 mx-4">

                    <h2>Propuestas pendientes</h2>
                    <hr class="hr">

                    <div v-if="getArrayLength(pendingProposalList) == 0" class="mt-4">

                        <h6 class="noProposalsInfo">No hay propuestas pendientes para esta asignatura actualmente</h6>

                    </div>

                    <div v-else v-for="(proposal, index) in pendingProposalList" :key="index">

                        <ProposalListComponent :name="proposal.title" :id="proposal.id" :showVotingInfo="!readingModeRef"
                            :votingInfo="userHasVotedTheSelectedProposal(proposal)" :subjectCode="subject.code"
                            :proposalState="evaluateProposalState(proposal)" />

                    </div>

                </div>

                <div id="acceptedProposals" class="mt-5 mx-4">

                    <h2>Propuestas aceptadas</h2>
                    <hr class="hr">


                    <div v-if="getArrayLength(acceptedProposalList) == 0" class="mt-4">

                        <h6 class="noProposalsInfo">Todavía no hay propuestas aceptadas para esta asignatura</h6>

                    </div>

                    <div v-else v-for="(proposal, index) in acceptedProposalList" :key="index">

                        <ProposalListComponent :name="proposal.title" :id="proposal.id" :showVotingInfo="!readingModeRef"
                            :votingInfo="userHasVotedTheSelectedProposal(proposal)" :subjectCode="subject.code"
                            :proposalState="-1" />

                    </div>

                </div>

                <div id="rejectedProposals" class="mt-5 mx-4">

                    <h2>Propuestas rechazadas</h2>
                    <hr class="hr">


                    <div v-if="getArrayLength(rejectedProposalList) == 0" class="mt-4">

                        <h6 class="noProposalsInfo">No hay propuestas rechazadas para esta asignatura</h6>

                    </div>

                    <div v-else v-for="(proposal, index) in rejectedProposalList" :key="index">

                        <ProposalListComponent :name="proposal.title" :id="proposal.id" :showVotingInfo="!readingModeRef"
                            :votingInfo=userHasVotedTheSelectedProposal(proposal) :subjectCode="subject.code"
                            :proposalState="-1" />

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

import SubjectService from '@/services/SubjectService';
import { onMounted, Ref, ref } from 'vue';
import { useRoute } from "vue-router";
import ProposalListComponent from '@/components/proposals/ProposalListComponent.vue';
import ProposalService from '@/services/ProposalService';
import DegreeService from '@/services/DegreeService';
import SpecialtyService from '@/services/SpecialtyService';
import { getCourseIndex, getArrayLength, getUserInfo, compareValueOfObjects } from '@/composables/useAuxFunctions';
import IpfsService from '@/services/IpfsService';
import { userHasVotedTheProposal } from '@/composables/useProposalFunctions';

let subject: Ref = ref(null)
let faculty: Ref = ref(null)
let specialty: Ref = ref(null)
let pendingProposalList: Ref = ref(null)
let acceptedProposalList: Ref = ref(null)
let rejectedProposalList: Ref = ref(null)

let isLoading: Ref = ref(true)
let error: Ref = ref(false)
let errorMessage: Ref = ref("")

let userInfoRef: Ref = ref(null)

let readingModeRef: Ref = ref(true)

onMounted(async () => {

    const route = useRoute()

    try {

        await getCurrentUserInfo()

        const id = Number(route.params.id).valueOf()

        const readingMode = String(route.params.readingMode).valueOf() == 'true'
        readingModeRef.value = readingMode

        subject.value = await new SubjectService().fetchSubjectAccountWithId(id)

        const votationInProgressProposalList = await new ProposalService().getProposalForSubjectWithState({ votationInProgress: {} }, subject.value.code)
        
        const waitingForTeacherProposalList = await new ProposalService().getProposalForSubjectWithState({ waitingForTeacher: {} }, subject.value.code)
        const waitingForHighRankProposalList = await new ProposalService().getProposalForSubjectWithState({ waitingForHighRank: {} }, subject.value.code)
        
        pendingProposalList.value = []
        pendingProposalList.value.push(...votationInProgressProposalList, ...waitingForTeacherProposalList, ...waitingForHighRankProposalList)
        const acceptedProposals = await new ProposalService().getProposalForSubjectWithState({ acceptedAndTokensGranted: {} }, subject.value.code)
        acceptedProposalList.value = acceptedProposals

        const rejectedProposals = await new ProposalService().getProposalForSubjectWithState({ rejected: {} }, subject.value.code)
        rejectedProposalList.value = rejectedProposals
        
        faculty.value = await new DegreeService().getDegreeWithId(subject.value.degreeId)
        specialty.value = await new SpecialtyService().getSpecialtyWithId(subject.value.specialtyId)
       
        isLoading.value = false;

    } catch (err) {
        console.log(err)
        errorMessage.value = "No se ha podido recuperar la información de la asignatura"
        isLoading.value = false;
        error.value = true;

    }

})

function onWatchTeachingProjectSystem() {
    new IpfsService().watchTeachingProject(subject.value.teachingProjectReference)
}

function userHasVotedTheSelectedProposal(proposal: any) {

    if (readingModeRef.value) return false
    console.log("se entro aqui")
    while (userInfoRef.value == null);
    return userHasVotedTheProposal(userInfoRef.value, proposal)

}

async function getCurrentUserInfo() {

    userInfoRef.value = await getUserInfo()

}

function evaluateProposalState(proposal: any) {

    let states = [{ votationInProgress: {} }, { waitingForTeacher: {} }, { waitingForHighRank: {} }]

    for (let i = 0; i < states.length; i++) {
        if (compareValueOfObjects(states[i], proposal.state)) return i
    }

    return -1

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

i {
    font-weight: bold;
    color: red;
}

#pendingProposals,
#acceptedProposals,
#rejectedProposals {
    hr {
        border-top: 10px solid $complementary;
        margin-top: 0px;
    }
}

.noProposalsInfo {
    text-align: center;
    color: red;
}

#subjectData {
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
}
</style>
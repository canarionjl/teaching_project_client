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

                            <button class="btn btn-primary btn-lg m-5 p-3">Ver proyecto docente</button>

                            <router-link :to="{ name: 'createProposal', params: { subject_id: subject.id } }">
                                <button class="btn btn-primary btn-lg m-5 p-3">Crear nueva propuesta</button>
                            </router-link>


                        </div>

                    </div>

                </div>

                <div id="pendingProposals" class="mt-5 mx-4">

                    <h2>Propuestas pendientes</h2>
                    <hr class="hr">

                    <div v-for="(proposal, index) in pendingProposalList" :key="index">

                        <ProposalListComponent :name="proposal.title" :id="proposal.id" :showVotingInfo="false" :votingInfo="false" :subjectCode="subject.code"/>

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

import { fetchSubjectAccount } from '@/services/FetchAccountService';
import SubjectService from '@/services/SubjectService';
import { onMounted, Ref, ref } from 'vue';
import { useRoute } from "vue-router";
import ProposalListComponent from '@/components/proposals/ProposalListComponent.vue';
import ProposalService from '@/services/ProposalService';
import FacultyService from '@/services/FacultyService';
import SpecialtyService from '@/services/SpecialtyService';
import { getCourseIndex } from '@/composables/useAuxFunctions';

let subject: Ref = ref(null)
let faculty: Ref = ref(null)
let specialty: Ref = ref(null)
let pendingProposalList: Ref = ref(null)


let isLoading: Ref = ref(true)
let error: Ref = ref(false)
let errorMessage: Ref = ref("")

onMounted(async () => {
    const route = useRoute()

    try {
        const id = Number(route.params.id).valueOf()
        subject.value = await new SubjectService().fetchSubjectAccountWithId(id)
        pendingProposalList.value = await new ProposalService().getProposalForSubjectWithState({ votationInProgress: {} }, subject.value.id, subject.value.code)
        faculty.value = await new FacultyService().getFacultyWithId(subject.value.id)
        specialty.value = await new SpecialtyService().getSpecialtyWithId(subject.value.id)
        isLoading.value = false;
    } catch {
        errorMessage.value = "No se ha podido recuperar la información de la asignatura"
        isLoading.value = false;
        error.value = true;
    }

})

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


#pendingProposals {
    hr {
        border-top: 10px solid $complementary;
        margin-top: 0px;
    }
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
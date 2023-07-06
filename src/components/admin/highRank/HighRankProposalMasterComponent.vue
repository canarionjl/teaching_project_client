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

                    <div v-if="getArrayLength(elm[2]) > 0">

                        <h2>{{ elm[0] }}</h2>
                        <hr class="hr pb-4">

                        <div v-for="(proposal, i) in elm[2]" :key=i class="mb-5">

                            <ProposalListComponent :name="proposal.title" :id="proposal.id"
                                :showVotingInfo="showVotingInfoRef" :votingInfo="false" :subjectCode="elm[1]"
                                :proposalState="props.proposalState" />

                        </div>

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
import { onMounted, Ref, ref, defineProps } from "vue";
import ErrorMessageComponent from '@/components/error/ErrorMessageComponent.vue'
import ProposalListComponent from "@/components/proposals/ProposalListComponent.vue";
import { useAuthStore } from "@/store/authCodeStore";
import { getArrayLength } from "@/composables/useAuxFunctions"


let proposalListOrderedBySubjects: Ref = ref(null);
let error: Ref = ref(false);
let errorMessage: Ref = ref("")
let isLoading: Ref = ref(true)

let showVotingInfoRef: Ref = ref(true)

const store = useAuthStore()
const hashedAuthCode = store.hashedAuthCode

const props = defineProps({

    proposalState: {
        type: Number,
        required: true
    }

})

onMounted(async () => {

    await getData()

})

async function getData() {

    try {

        let proposalState = props.proposalState

        if (proposalState != 2 && proposalState != 3 || hashedAuthCode.toString() != "0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c") {

            throw new Error("User not authorized: user is not a high rank")

        }

        proposalListOrderedBySubjects.value = await new ProposalService().getProposalsForHighRank(proposalState)

        isLoading.value = false;

    } catch (err) {

        isLoading.value = false;
        error.value = true;
        errorMessage.value = "No se ha podido recuperar la lista de propuestas"

    }

    if (!error.value && proposalListOrderedBySubjects.value.length == 0) {

        error.value = true;
        errorMessage.value = "No se encuentra ninguna propuesta que cumpla con los requisitos indicados"

    }
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
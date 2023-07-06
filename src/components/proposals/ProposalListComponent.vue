<template>
    <div v-if="isLoading" id="loading">

        <h3>Cargando...</h3>

    </div>

    <div v-if="!isLoading">

        <div v-if="!error">

            <div class="d-flex flex-row justify-content-between align-items-center px-5 py-2">

                <div class="d-flex flex-row justify-content-start align-items-center col-9">

                    <h4>{{ nameRef }}</h4>
                    <h6 class="px-2" v-show="showVotingInfoRef && props.proposalState < 2" id="votingInfo">(<i>{{ votingInfoRef }}has votado esta
                            propuesta</i> {{ emojiVotingInfoRef }})
                    </h6>


                </div>

                <router-link
                    :to="{ name: 'proposalDetail', params: { proposal_id: idRef, subject_code: subjectCode, readingMode: (!showVotingInfoRef).toString(), proposalState: (props.proposalState).toString() } }">
                    <button class="btn btn-primary ">Ver propuesta</button>
                </router-link>

            </div>

            <hr class="hr mx-5">

        </div>

    </div>
</template>

<script lang="ts" setup>

import { defineProps, Ref, ref, onBeforeMount } from 'vue';

const nameRef: Ref = ref(null)
const idRef: Ref = ref(null)
const showVotingInfoRef: Ref = ref(false)
const votingInfoRef: Ref = ref("aún no")
const emojiVotingInfoRef: Ref = ref("❌")
const subjectCode: Ref = ref(null)

const isLoading: Ref = ref(true)
const errorMessage: Ref = ref("")
const error: Ref = ref(false)

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    showVotingInfo: {
        type: Boolean,
        required: true
    },
    votingInfo: {
        type: Boolean,
        required: true
    },
    subjectCode: {
        type: Number,
        required: true
    },
    proposalState: {
        type: Number,
        required: true
    }
})

onBeforeMount(() => {

    try {
        const id = Number(props.id).valueOf()
        idRef.value = id

        const name = String(props.name).valueOf()
        nameRef.value = name

        const showVotingInfo = Boolean(props.showVotingInfo).valueOf()
        showVotingInfoRef.value = showVotingInfo


        const votingInfo = Boolean(props.votingInfo).valueOf()

        let value = "no "
        let emoji = "❌"

        if (votingInfo) {
            value = ""
            emoji = "✅"
        }

        const subject_code = Number(props.subjectCode).valueOf()
        subjectCode.value = subject_code

        votingInfoRef.value = value
        emojiVotingInfoRef.value = emoji

        isLoading.value = false;

    } catch {

        errorMessage.value = "No se ha podido recuperar la información de las propuestas pendientes"
        isLoading.value = false;
        error.value = true;

    }

})

</script>

<style lang="scss">
.btn-primary {
    background-color: $primary !important;
    border: $primary !important;
}

#loading {
    h3 {
        color: $complementary;
    }

    text-align:center;
}

#votingInfo {
    color: $primary-light;
}
</style>
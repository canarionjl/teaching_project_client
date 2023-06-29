<template>
    <div id="buttons" v-if="userHasVoted == false">

        <div class="d-flex flex-row justify-content-center align-items-center">

            <button class="btn btn-primary btn-lg m-5 p-3" @click="onVoteButtonClicked(true)">VOTAR A FAVOR ✅</button>
            <button class="btn btn-primary btn-lg m-5 p-3" @click="onVoteButtonClicked(false)">VOTAR EN CONTRA ❌</button>

        </div>

    </div>

    <div v-if="userHasVoted == true" class="m-5">

        <SuccessMessageComponent msg="¡Genial! Ya has votado por esta propuesta 😀" />

    </div>
</template>

<script lang="ts" setup>

import { Ref, ref, onBeforeMount, onMounted, defineEmits } from 'vue'
import { useAuthStore } from '@/store/authCodeStore'
import { useProposalStore } from '@/store/proposalStore'
import ProposalService from '@/services/ProposalService';
import { getReturn, getUserInfo } from '@/composables/useAuxFunctions';
import { userHasVotedTheProposal } from '@/composables/useProposalFunctions';
import SuccessMessageComponent from '@/components/success/SuccessMessageComponent.vue';

let userHasVoted: Ref = ref(null)
let proposal: Ref = ref(null)
let subject: Ref = ref(null)


const emit = defineEmits(['resultInfoEmit'])


onBeforeMount(async () => {

    const proposalStore = useProposalStore()
    proposal.value = proposalStore.proposal
    subject.value = proposalStore.subject

})

onMounted(async () => {

    try {

        userHasVoted.value = userHasVotedTheProposal(await getUserInfo(), proposal.value)


    } catch {

        userHasVoted.value = null

    }

})

async function voteProposal(vote: boolean): Promise<string> {

    let tx = "";

    const authCodeStore = useAuthStore()
    const hashedAuthCode = authCodeStore.hashedAuthCode

    if (hashedAuthCode.toString() == "edee29f882543b956620b26d0ee0e7e950399b1c4222f5de05e06425b4c995e9") {

        tx = await new ProposalService().voteProposalByProfessor(
            proposal.value.id,
            subject.value.id,
            proposal.value.associatedProfessorProposalId,
            vote,
            subject.value.code
        )

    }
    else if (hashedAuthCode.toString() == "318aee3fed8c9d040d35a7fc1fa776fb31303833aa2de885354ddf3d44d8fb69") {

        tx = await new ProposalService().voteProposalByStudent(
            proposal.value.id, subject.value.id,
            proposal.value.associatedProfessorProposalId,
            vote,
            subject.value.code
        )

    }

    return tx
}

async function onVoteButtonClicked(vote: boolean) {

    let data
    const tx = await voteProposal(vote)

    if (tx != "") {

        const log = await getReturn(true, false, tx)

        if (log == true) {

            userHasVoted.value = true
            data = { isOk: true, resultMessage: "Se ha registrado su voto correctamente." }

        }

    }

    else {

        data = { isOk: false, resultMessage: "No se ha podido registrar su voto. Inténtelo de nuevo más tarde." }

    }

    emit('resultInfoEmit', data)

}

</script>

<style lang="scss"></style>
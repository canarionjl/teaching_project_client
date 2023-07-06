<template>
    <div id="buttons">

        <div class="d-flex flex-row justify-content-center align-items-center">

            <button class="btn btn-primary btn-lg mb-5 mx-3 p-3" @click="onDeleteButtonClicked">ELIMINAR PROPUESTA RECHAZADA
                ❌</button>

        </div>

    </div>
</template>

<script lang="ts" setup>

import { Ref, ref, onBeforeMount, defineEmits } from 'vue'
import { useProposalStore } from '@/store/proposalStore'
import { getReturn } from '@/composables/useAuxFunctions';
import ProposalService from '@/services/ProposalService';

let proposal: Ref = ref(null)
let subject: Ref = ref(null)
let associatedProfessorProposal: Ref = ref(null)

const emit = defineEmits(['resultInfoEmit'])

onBeforeMount(async () => {

    const proposalStore = useProposalStore()
    proposal.value = proposalStore.proposal
    subject.value = proposalStore.subject
    associatedProfessorProposal.value = proposalStore.professorProposal

})

async function onDeleteButtonClicked() {

    let isOk
    let resultMessage

    const tx = await new ProposalService().deleteRejectedProposalByHighRank(
        proposal.value.id,
        subject.value.id,
        associatedProfessorProposal.value.id,
        subject.value.code
    )

    if (tx != "") {

        const log = await getReturn(true, false, tx)

        if (log == true) {

            let data = { isOk: isOk, resultMessage: resultMessage }
            emit('resultInfoEmit', data)

        }

    }
}


</script>


<style lang="scss">
#teachingProjectLink:hover {
    cursor: pointer;
}

#teachingProjectLink {

    text-align: center;
    font-weight: bold;
    text-decoration: underline;

}

#pdfIcon {

    color: red;
    font-size: 30px;

}
</style>
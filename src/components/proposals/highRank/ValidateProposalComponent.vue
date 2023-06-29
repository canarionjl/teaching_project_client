<template>
    <div id="buttons">

        <div class="d-flex flex-row justify-content-center align-items-center m-5">

            <i class="bi bi-file-earmark-pdf mb-2" id="pdfIcon"></i>
            <h4 id="teachingProjectLink" class="px-2" @click="onWatchTeachingProject">Ver proyecto docente propuesto</h4>

        </div>
        <div class="d-flex flex-row justify-content-center align-items-center">

            <button class="btn btn-primary btn-lg mb-5 mx-3 p-3" @click="onValidateButtonClicked(true)">ACEPTAR PROYECTO
                DOCENTE
                ✅</button>
            <button class="btn btn-primary btn-lg mb-5 mx-3 p-3" @click="onValidateButtonClicked(false)">RECHAZAR PROYECTO
                DOCENTE
                ❌</button>

        </div>

    </div>
</template>

<script lang="ts" setup>

import { Ref, ref, onBeforeMount, defineEmits } from 'vue'
import { useProposalStore } from '@/store/proposalStore'
import { compareValueOfObjects, getReturn } from '@/composables/useAuxFunctions';
import ProposalService from '@/services/ProposalService';
import { useAuthStore } from '@/store/authCodeStore';
import IpfsService from '@/services/IpfsService';

let proposal: Ref = ref(null)
let subject: Ref = ref(null)
let associatedProfessorProposal: Ref = ref(null)

const emit = defineEmits(['resultInfoEmit'])

const authCodeStore = useAuthStore()

onBeforeMount(async () => {

    const proposalStore = useProposalStore()
    proposal.value = proposalStore.proposal
    subject.value = proposalStore.subject
    associatedProfessorProposal.value = proposalStore.professorProposal

})

async function onValidateButtonClicked(vote: boolean) {

    let isOk
    let resultMessage

    const tx = await new ProposalService().updateProposalByHighRank(
        proposal.value.id,
        proposal.value.associatedProfessorProposalId,
        subject.value.code,
        subject.value.id,
        vote
    )

    if (tx != "") {

        const log = await getReturn(true, false, tx)

        if (log == true) {

            if (vote) {

                let creditTx = ""

                if (compareValueOfObjects(proposal.value.userType, { professor: {} })) {
                    creditTx = await new ProposalService().giveCreditToProfessor(
                        proposal.value.id,
                        proposal.value.creatorPublicKey,
                        authCodeStore.authCode,
                        subject.value.code
                    )
                }
                else if (compareValueOfObjects(proposal.value.userType, { student: {} })) {
                    creditTx = await new ProposalService().giveCreditToStudent(
                        proposal.value.id,
                        proposal.value.creatorPublicKey,
                        authCodeStore.authCode,
                        subject.value.code
                    )
                }

                const creditLog = await getReturn(true, false, creditTx)

                if (creditLog == true) {
                    isOk = true
                    resultMessage = "Se ha aprobado correctamente la propuesta y los tokens se han entregado al creador"
                } else {
                    isOk = false
                    resultMessage = "Se ha aprobado la propuesta pero los tokens no han podido ser entregados"
                }
            }

        } else {
            isOk = false
            resultMessage = "No se ha podido aprobar el proyecto docente. Inténtelo de nuevo más tarde."
        }

    } else {
        isOk = false
        resultMessage = "No se ha podido aprobar el proyecto docente. Inténtelo de nuevo más tarde."
    }

    let data = { isOk: isOk, resultMessage: resultMessage }
    emit('resultInfoEmit', data)

}

function onWatchTeachingProject() {
    new IpfsService().watchTeachingProject(associatedProfessorProposal.value.teachingProjectReference)
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
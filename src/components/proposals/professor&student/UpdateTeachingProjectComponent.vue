<template>
    <div class="d-flex flex-column justify-content-center align-items-center">
        <div class="form-group col-6">
            <div class="mt-4">
                <label for="inputFile" id="inputLabel" class="form-label mx-2">Incluya el proyecto docente actualizado con
                    la
                    nueva propuesta</label>
                <input class="form-control" type="file" id="inputFile" accept="application/pdf" ref="fileRef">
                <small v-if="fileIsValidRef == false" class="mx-2"> {{ fileInputErrorMessageRef }}</small>
            </div>

            <div class="text-center">
                <button type="submit" class="btn btn-primary btn-lg m-5 p-3" @click="onUpdateProjectClicked()">Actualizar
                    proyecto docente</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { getReturn, validateInputFile, validateIpfsReference } from '@/composables/useAuxFunctions';
import IpfsService from '@/services/IpfsService';
import ProposalService from '@/services/ProposalService';
import { useProposalStore } from '@/store/proposalStore';
import { ref, Ref, defineEmits, onBeforeMount } from 'vue'

let fileIsValidRef: Ref = ref(null)
let fileInputErrorMessageRef: Ref = ref("")
let fileRef: Ref = ref(null)

let proposal: Ref = ref(null)
let subject: Ref = ref(null)

const emit = defineEmits(['resultInfoEmit'])

onBeforeMount(() => {

    const proposalStore = useProposalStore()
    proposal.value = proposalStore.proposal
    subject.value = proposalStore.subject

})


async function onUpdateProjectClicked() {

    const file = fileRef.value.files[0]

    const [fileIsValid, fileErrorMessage] = validateInputFile(file)
    fileIsValidRef.value = fileIsValid
    fileInputErrorMessageRef.value = fileErrorMessage

    if (!fileIsValid) return

    const data = await updateProposalByTeacher(file)
    emit('resultInfoEmit', data)

}

async function updateProposalByTeacher(file: File) {

    const reference = await new IpfsService().uploadFileToIPFS(file)
    const referenceIsValid = validateIpfsReference(reference)

    let isOk = false
    let resultMessage

    if (!referenceIsValid) {

        isOk = false
        resultMessage = "Ha habido un problema subiendo el archivo a IPFS. Inténtelo de nuevo."

    } else {

        const tx = await new ProposalService().updateProposalByProfessor(
            proposal.value.id,
            proposal.value.associatedProfessorProposalId,
            subject.value.code,
            subject.value.id,
            reference
        )
        const log = await getReturn(true, false, tx)

        if (log == true) {
            resultMessage = "Operación realizada satisfactoriamente"
            isOk = true
        } else {
            resultMessage = "No se ha podido actualizar el proyecto docente. Inténtelo de nuevo más tarde."
            isOk = false
        }

    }

    return { isOk: isOk, resultMessage: resultMessage }

}


</script>

<style lang="scss">
small {
    color: red;
    font-weight: bold;
}

.btn-primary {
    background-color: $primary !important;
    border: $primary !important;
}
</style>
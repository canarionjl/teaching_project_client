<template>
    <div v-if="isLoading" id="loading" class="mt-5">

        <h3>Cargando...</h3>

    </div>

    <div v-if="!isLoading">

        <div v-if="!error" class="proposalForm">

            <div class="d-flex flex-row justify-content-center align-items-center">

                <div class="form-group col-9">

                    <div id="title" class=" mb-2 mt-2 mx-5">

                        <h2>{{ subject.name }}</h2>

                    </div>

                    <input id="facultyNameInput" class="form-control mt-5"
                        placeholder="Introduzca el título de la propuesta..." v-model="proposalTitle" maxlength=50>

                    <small v-if="titleIsValidRef == false"> {{ titleErrorMessageRef }}</small>

                    <textarea class="form-control mt-5" rows="3" maxlength=200
                        placeholder="Desarrolle el contenido de la propuesta..." v-model="proposalContent"></textarea>

                    <small v-if="contentIsValidRef == false"> {{ contentErrorMessageRef }}</small>

                </div>

            </div>

            <div class="text-center">
                <button type="submit" class="btn btn-primary btn-lg m-5 p-3" @click="onCreateProposalClicked">Crear
                    propuesta</button>
            </div>

            <div v-if="proposalAdded == true" id="returnMessage">
                <SuccessMessageComponent msg="Operación realizada satisfactoriamente" />
            </div>

        </div>

        <div id="error" v-if="error">

            <ErrorMessageComponent :errorMessage="errorMessage" />

        </div>

    </div>
</template>

<script lang="ts" setup>

import { ref, Ref } from 'vue'
import { validateInputText } from '@/composables/useAuxFunctions'
import ProposalService from '@/services/ProposalService'
import SubjectService from '@/services/SubjectService'
import { useAuthStore } from '@/store/authCodeStore';
import { getReturn } from '@/composables/useAuxFunctions';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ErrorMessageComponent from '@/components/error/ErrorMessageComponent.vue';
import SuccessMessageComponent from '@/components/success/SuccessMessageComponent.vue';

let proposalTitle: Ref = ref(null)
let proposalContent: Ref = ref(null)

let titleErrorMessageRef: Ref = ref("")
let contentErrorMessageRef: Ref = ref("")

let titleIsValidRef: Ref = ref(true)
let contentIsValidRef: Ref = ref(true)

let error: Ref = ref(false)
let errorMessage: Ref = ref(null)

let proposalAdded: Ref = ref(false)
let isLoading: Ref = ref(true)

let subject: Ref = ref(false)


onMounted(async () => {

    const route = useRoute()

    try {
        const id = Number(route.params.subject_id).valueOf()
        subject.value = await new SubjectService().fetchSubjectAccountWithId(id)
        isLoading.value = false;
    } catch {
        errorMessage.value = "No se ha podido recuperar la información de la asignatura"
        isLoading.value = false;
        error.value = true;
    }

})

const onCreateProposalClicked = async () => {

    const [titleIsValid, titleErrorMessage] = validateInputText(50, proposalTitle.value)
    const [contentIsValid, contentErrorMessage] = validateInputText(200, proposalContent.value)

    const store = useAuthStore()
    const hashedAuthCode = store.hashedAuthCode

    let tx = "";

    if (titleIsValid && contentIsValid) {

        if (hashedAuthCode.toString() == "edee29f882543b956620b26d0ee0e7e950399b1c4222f5de05e06425b4c995e9") {
            tx = await new ProposalService().createProposalByProfessor(proposalTitle.value, proposalContent.value, subject.value.id)
        }
        else if (hashedAuthCode.toString() == "318aee3fed8c9d040d35a7fc1fa776fb31303833aa2de885354ddf3d44d8fb69") {
            tx = await new ProposalService().createProposalByStudent(proposalTitle.value, proposalContent.value, subject.value.id)
        }
        else {
            error.value = true
            errorMessage.value = "Para registrar una nueva propuesta debe estar registrado como profesor o estudiante"
        }

        if (tx != "") {
            const log = await getReturn(true, false, tx)
            if (log == true) {
                proposalAdded.value = true
            }
        }


    } else {

        titleIsValidRef.value = titleIsValid
        titleErrorMessageRef.value = titleErrorMessage

        contentIsValidRef.value = contentIsValid
        contentErrorMessageRef.value = contentErrorMessage

    }

};

</script>

<style lang="scss" scoped>
.btn-primary {
    background-color: $primary !important;
    border: $primary !important;
}

small {
    padding-left: 3px;
    color: red;
    font-weight: bold;
}

#title {
    text-align: center;
    color: black;
    background-color: $complementary-light;
    border-radius: 15px;
    padding: 20px;
    margin-inline: 15px;
}

#loading {

    h3 {
        color: $complementary;
        font-weight: bold;
    }

    text-align:center;


}
</style>
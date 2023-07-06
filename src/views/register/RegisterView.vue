<template>
    <div id="component">

        <div class="d-flex flex-column justify-content-center align-items-center flex-wrap">

            <div class="form-check mt-5 mb-3">

                <div class="mb-4">
                    <input class="form-check-input" type="radio" id="highRankRadioButton" value="highRank"
                        v-model="profileSelectedRef" />
                    <label class="form-check-label pt-2" for="highRankRadioButton">Alto Cargo</label>
                </div>

                <div class="mb-4">
                    <input class="form-check-input" type="radio" id="professorRadioButton" value="professor"
                        v-model="profileSelectedRef" />
                    <label class="form-check-label pt-2" for="professorRadioButton">Profesor</label>
                </div>

                <div class="mb-4">
                    <input class="form-check-input" type="radio" id="studentRadioButton" value="student"
                        v-model="profileSelectedRef" />
                    <label class="form-check-label pt-2" for="studentRadioButton">Estudiante</label>
                </div>

            </div>

            <div class="form-group col-9" v-if="profileSelectedRef == 'student' || profileSelectedRef == 'professor'">
                <input id="facultyNameInput" class="form-control m-2"
                    placeholder="Introduzca el código de las asignaturas matriculadas separadas por una coma (sin espacios)..."
                    v-model="subjectsRef" @click="onInputClicked">
                <small class="px-3" v-if="!subjectsAreValidRef"> {{ errorMessage }}</small>
            </div>

            <div class="m-3">
                <button class="btn btn-primary p-3" @click="onRegisterButtonClicked">Registrarse</button>
            </div>

            <div class="m-3 d-flex flex-row justify-content-center flex-wrap">

                <h4 id="nota"><a class="p-1">NOTA: </a> Se asociará la clave pública seleccionada con el perfil escogido.
                    Esta acción es irreversible.
                </h4>

            </div>

            <div class="m-4" v-if="error">

                <ErrorMessageComponent :errorMessage="errorMessage" />

            </div>

            <div class="m-4" v-if="profileInitializedProperly">

                <SuccessMessageComponent msg="Se ha registrado correctamente" />

            </div>

        </div>

    </div>
</template>

<script lang="ts" setup>

import { Ref, ref } from 'vue'
import ErrorMessageComponent from '@/components/error/ErrorMessageComponent.vue';
import SuccessMessageComponent from '@/components/success/SuccessMessageComponent.vue';
import { useWorkspace } from "@/composables/useWallet";
import UserService from "@/services/UserService"
import { getReturn } from '@/composables/useAuxFunctions';

let profileSelectedRef: Ref = ref("")
let subjectsRef: Ref = ref("")

let error: Ref = ref(false)
let errorMessage: Ref = ref("")
let subjectsAreValidRef: Ref = ref(true)
let profileInitializedProperly: Ref = ref(false)

async function onRegisterButtonClicked() {

    subjectsAreValidRef.value = true

    const { anchorWallet } = useWorkspace()

    if (!anchorWallet.value || anchorWallet.value == null) {

        error.value = true;
        errorMessage.value = "Seleccione una cuenta en su Wallet de Solflare para poder registrarse"

    }

    const subjects = getSubjects()

    if (subjects == null) return

    let result_log = ""

    switch (profileSelectedRef.value) {

        case "highRank":
 
            result_log = await new UserService().initializeHighRank()
            break

        case "professor":

            result_log = await new UserService().initializeProfessor(subjects)
            break

        case "student":
            result_log = await new UserService().initializeStudent(subjects)

            break

        default:
            break
    }

    const log = await getReturn(true, false, result_log)
    if (log == true) {
        profileInitializedProperly.value = true
    }
}

function getSubjects(): Array<number> | null {

    const subjects_string = subjectsRef.value.split(',')
    let subject_number: number[] = []
    let error = false

    subjects_string.every((subject: string) => {

        const subject_code = Number(subject)

        if (subject_code < 0 || Number.isNaN(subject_code)) {
            error = true;
            return false;
        } else {
            subject_number.push(subject_code)
            return true;
        }

    });

    if (error) {
        setError("Los códigos de asignaturas que se han introducido son incorrectos", true)
        return null
    }

    return subject_number

}

function setError(msg: string, isForSubjectValid: boolean) {

    errorMessage.value = msg

    if (isForSubjectValid) {
        subjectsAreValidRef.value = false
    } else {
        error.value = true
    }

}

function onInputClicked() {

    if (subjectsAreValidRef.value == false) subjectsAreValidRef.value = true
}

</script>

<style lang="scss" scoped>
#component {
    font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
}

.form-check-input {
    font-size: 25px !important;
}

.form-check-label {
    font-size: 25px !important;
    font-weight: bold;
    text-align: center;
}

.btn-primary {
    background-color: $primary !important;
    border: $primary !important;
    font-size: 20px;
}

a {
    color: $complementary;
    font-weight: bold;
}

small {
    padding-left: 3px;
    color: red;
    font-weight: bold;
}
</style>
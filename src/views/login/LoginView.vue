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

            <div class="m-3">
                <button class="btn btn-primary p-3" @click="onRegisterButtonClicked">Iniciar Sesión</button>
            </div>


            <div class="m-4" v-if="error">

                <ErrorMessageComponent :errorMessage="errorMessage" />

            </div>

            <div class="m-4" v-if="profileInitializedProperly">

                <SuccessMessageComponent msg="Se ha iniciado sesión correctamente" />

            </div>

        </div>

    </div>
</template>

<script lang="ts" setup>

import { Ref, ref} from 'vue'
import ErrorMessageComponent from '@/components/error/ErrorMessageComponent.vue';
import SuccessMessageComponent from '@/components/success/SuccessMessageComponent.vue';
import { useWorkspace } from "@/composables/useWallet";
import UserService from "@/services/UserService"
import { useAuthStore } from '@/store/authCodeStore'

let profileSelectedRef: Ref = ref("")

let error: Ref = ref(false)
let errorMessage: Ref = ref("")
let profileInitializedProperly: Ref = ref(false)

async function onRegisterButtonClicked() {

    const { anchorWallet } = useWorkspace()

    if (!anchorWallet.value || anchorWallet.value == null) {

        error.value = true;
        errorMessage.value = "Seleccione una cuenta en su Wallet de Solflare para poder iniciar sesión"
        return
    }

    let code = "0000"
    const profileSelected = profileSelectedRef.value.valueOf()

    if (profileSelected == "") {
        error.value = true;
        errorMessage.value = "Seleccione un perfil de usuario para poder iniciar sesión"
        return
    }

    const userExists = await new UserService().walletUserExistsWithProfile(profileSelected)

    if (userExists) {

        switch (profileSelected) {

            case "highRank":
                code = "1111"
                break

            case "professor":
                code = "2222"
                break

            case "student":
                code = "3333"
                break

            default:
                break
        }

        error.value = false
        errorMessage.value = ""
        profileInitializedProperly.value = true
       
    } else {
        setError("No existe un cuenta del tipo de perfil marcado para la clave pública seleccionada")
    }

    const store = useAuthStore()
    store.setAuthCode(code)

}


function setError(msg: string) {

    profileInitializedProperly.value = false
    errorMessage.value = msg
    error.value = true

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
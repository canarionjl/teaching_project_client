<template>
    <div class="d-flex flex-row justify-content-center align-items-center">

        <div class="form-group col-9">
            <input id="facultyNameInput" class="form-control mt-3" placeholder="Introduzca el nombre de la facultad..."
                v-model="facultyName" maxlength=50>
            <small v-if="isValidRef == false"> {{ errorMessageRef }}</small>
        </div>
    </div>
    <div>

    </div>
    <div class="text-center">
        <button type="submit" class="btn btn-primary btn-lg m-5 p-3" @click="onCreateFacultyClicked">Añadir
            facultad</button>
    </div>
</template>

<script lang="ts" setup>

import { ref, Ref } from 'vue'
import { validateInputText } from '@/composables/useAuxFunctions'
import FacultyService from '@/services/FacultyService'

let facultyName: Ref = ref(null)
let errorMessageRef: Ref = ref("")
let isValidRef: Ref = ref(true)

const onCreateFacultyClicked = async () => {
    const [isValid, errorMessage] = validateInputText(50, facultyName.value)
    if (isValid) {
        new FacultyService().createFaculty(facultyName.value)
    } else {
        isValidRef.value = isValid
        errorMessageRef.value = errorMessage
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
</style>
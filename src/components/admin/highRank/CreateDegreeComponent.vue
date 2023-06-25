<template>
    <div class="d-flex flex-column justify-content-center align-items-center">

        <div class="form-group col-6">
            <input class="form-control mt-3" placeholder="Introduzca el nombre del grado..." v-model="degreeName"
                maxlength=50>
            <small v-if="nameIsValidRef == false"> {{ nameErrorMessageRef }}</small>

            <select class="form-select col-6 mt-2" v-model="selectedFacultyId">
                <option disabled selected class="defaultOption" value="0">Seleccionar Facultad para el Grado</option>
                <option v-for="faculty in faculty_list" :value="faculty.id" :key=faculty.id> {{ faculty.name }} </option>
            </select>
            <small v-if="facultyIdIsValidRef == false"> {{ facultyIdErrorMessageRef }}</small>

            <div class="text-center">
                <button type="submit" class="btn btn-primary btn-lg m-5 p-3" @click="onCreateDegreeClicked">Añadir
                    Grado</button>
            </div>
        </div>

        <div v-if="degreeAdded == true" id="returnMessage">
            <SuccessMessageComponent msg="Operación realizada satisfactoriamente"/>
        </div>

    </div>
    <div>

    </div>
</template>

<script lang="ts" setup>

import { ref, Ref, onMounted } from 'vue'
import { validateInputText, validateIdSelect, getReturn } from '@/composables/useAuxFunctions'
import DegreeService from '@/services/DegreeService'
import FacultyService from '@/services/FacultyService';
import SuccessMessageComponent from "@/components/success/SuccessMessageComponent.vue"

let degreeName: Ref = ref(null)

let nameErrorMessageRef: Ref = ref("")
let facultyIdErrorMessageRef: Ref = ref("")

let nameIsValidRef: Ref = ref(true)
let facultyIdIsValidRef: Ref = ref(true)

let faculty_list: Ref = ref(null)
let selectedFacultyId: Ref = ref(0)

let degreeAdded: Ref = ref(false)

onMounted(async () => {
    faculty_list.value = await new FacultyService().getAllFaculties()
})

const onCreateDegreeClicked = async () => {

    const [nameIsValid, nameErrorMessage] = validateInputText(50, degreeName.value)
    const [facultyIdIsValid, facultyIdErrorMessage] = validateIdSelect(selectedFacultyId.value)


    if (nameIsValid && facultyIdIsValid) {

        const tx = await new DegreeService().createDegree(degreeName.value, selectedFacultyId.value)
        const log = await getReturn(true, false, tx)
        if(log == true) {
            degreeAdded.value = true
        }

    } else {

        nameIsValidRef.value = nameIsValid
        nameErrorMessageRef.value = nameErrorMessage

        facultyIdIsValidRef.value = facultyIdIsValid
        facultyIdErrorMessageRef.value = facultyIdErrorMessage
    }

};

</script>
D
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

.defaultOption {
    display: none;
}

</style>
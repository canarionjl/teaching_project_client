<template>
    <div class="d-flex flex-column justify-content-center align-items-center">

        <div class="form-group col-6">
            <input class="form-control mt-3" placeholder="Introduzca el nombre de la especialidad..."
                v-model="specialtyName" maxlength=50>
            <small v-if="nameIsValidRef == false"> {{ nameErrorMessageRef }}</small>

            <select class="form-select col-6 mt-3" v-model="selectedFacultyId" @change="onFacultyChanged">
                <option disabled selected class="defaultOption" value="0">Seleccionar Facultad </option>
                <option v-for="faculty in faculty_list" :value="faculty.id" :key=faculty.id> {{ faculty.name }} </option>
            </select>
            <small v-if="facultyIdIsValidRef == false"> {{ facultyIdErrorMessageRef }}</small>

            <select class="form-select mt-3" v-model="selectedDegreeId">
                <option disabled selected class="defaultOption" value="0">Seleccionar Grado</option>
                <option v-for="degree in degree_list" :value="degree.id" :key=degree.id> {{ degree.name }}
                </option>
            </select>
            <small v-if="degreeIdIsValidRef == false"> {{ degreeIdErrorMessageRef }}</small>

            <div class="text-center">
                <button type="submit" class="btn btn-primary btn-lg m-5 p-3" @click="onCreateSpecialtyClicked">Añadir
                    Especialidad</button>
            </div>
        </div>

        <div v-if="specialtyAdded == true" id="returnMessage">
            <SuccessMessageComponent msg="Operación realizada satisfactoriamente" />
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
import SpecialtyService from '@/services/SpecialtyService';

let specialtyName: Ref = ref(null)

let nameErrorMessageRef: Ref = ref("")
let facultyIdErrorMessageRef: Ref = ref("")
let degreeIdErrorMessageRef: Ref = ref("")

let nameIsValidRef: Ref = ref(true)
let facultyIdIsValidRef: Ref = ref(true)
let degreeIdIsValidRef: Ref = ref(true)


let faculty_list: Ref = ref(null)
let selectedFacultyId: Ref = ref(0)

let degree_list: Ref = ref(null)
let selectedDegreeId: Ref = ref(0)

let specialtyAdded: Ref = ref(false)

onMounted(async () => {
    faculty_list.value = await new FacultyService().getAllFaculties()
})

const onFacultyChanged = (async () => {
    degree_list.value = await new DegreeService().getAllDegreesForFaculty(selectedFacultyId.value)
});

const onCreateSpecialtyClicked = async () => {

    const [nameIsValid, nameErrorMessage] = validateInputText(50, specialtyName.value)
    const [facultyIdIsValid, facultyIdErrorMessage] = validateIdSelect(selectedFacultyId.value)
    const [degreeIdIsValid, degreeIdErrorMessage] = validateIdSelect(selectedDegreeId.value)


    if (nameIsValid && facultyIdIsValid && degreeIdIsValid) {

        const tx = await new SpecialtyService().createSpecialty(specialtyName.value, selectedDegreeId.value)
        const log = await getReturn(true, false, tx)

        if (log == true) {
            specialtyAdded.value = true
        }

    } else {

        nameIsValidRef.value = nameIsValid
        nameErrorMessageRef.value = nameErrorMessage

        facultyIdIsValidRef.value = facultyIdIsValid
        facultyIdErrorMessageRef.value = facultyIdErrorMessage

        degreeIdIsValidRef.value = degreeIdIsValid
        degreeIdErrorMessageRef.value = degreeIdErrorMessage
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
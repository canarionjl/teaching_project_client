<template>

    <div id="component">

        <div class="d-flex flex-column justify-content-center align-items-center">

            <div class="form-group col-6">
                <input class="form-control mt-3" placeholder="Introduzca el nombre de la asignatura..."
                    v-model="subjectName" maxlength=50>
                <small v-if="nameIsValidRef == false"> {{ nameErrorMessageRef }}</small>

                <input class="form-control mt-3"
                    placeholder="Introduzca el código... (¡Debe coincidir con el institucional!)" v-model="subjectCode"
                    maxlength=50>
                <small v-if="codeIsValidRef == false"> {{ codeErrorMessageRef }}</small>

                <select class="form-select col-6 mt-3" v-model="selectedFacultyId" @change="onFacultyChanged">
                    <option disabled selected class="defaultOption" value="0">Seleccionar Facultad </option>
                    <option v-for="faculty in faculty_list" :value="faculty.id" :key=faculty.id> {{ faculty.name }}
                    </option>
                </select>
                <small v-if="facultyIdIsValidRef == false"> {{ facultyIdErrorMessageRef }}</small>

                <select class="form-select mt-3" v-model="selectedDegreeId" @change="onDegreeChanged">
                    <option disabled selected class="defaultOption" value="0">Seleccionar Grado</option>
                    <option v-for="degree in degree_list" :value="degree.id" :key=degree.id> {{ degree.name
                    }}
                    </option>
                </select>
                <small v-if="degreeIdIsValidRef == false"> {{ degreeIdErrorMessageRef }}</small>

                <select class="form-select mt-3" v-model="selectedSpecialtyId">
                    <option disabled selected class="defaultOption" value="0">Seleccionar Especialidad
                    </option>
                    <option v-for="specialty in specialty_list" :value="specialty.id" :key=specialty.id> {{
                        specialty.name }}
                    </option>
                </select>
                <small v-if="specialtyIdIsValidRef == false"> {{ specialtyIdErrorMessageRef }}</small>

                <select class="form-select mt-3" v-model="selectedCourseId">
                    <option disabled selected class="defaultOption" value="0">Seleccionar Curso</option>
                    <option v-for="(course, index) in course_list" :value=index :key=index> {{ course }}
                    </option>
                </select>

                <div class="mt-4">
                    <label for="inputFile" id="inputLabel" accept="application/pdf" class="form-label mx-2">Incluya el proyecto docente actual de la
                        asignatura</label>
                    <input class="form-control" type="file" id="inputFile" ref="fileRef">
                    <small v-if="fileIsValidRef == false"> {{ fileInputErrorMessageRef }}</small>
                </div>

                <div class="text-center">
                    <button type="submit" class="btn btn-primary btn-lg m-5 p-3" @click="onCreateSubjectClicked">Añadir
                        Asignatura</button>
                </div>
            </div>

            <div v-if="subjectAdded == true" id="returnMessage">
                <SuccessMessageComponent msg="Operación realizada satisfactoriamente" />
            </div>

            <div v-if="subjectAdded == false">
                <ErrorMessageComponent :errorMessage="errorAddingSubject" />
            </div>

        </div>

    </div>

</template>

<script lang="ts" setup>

import { ref, Ref, onMounted } from 'vue'
import { validateInputText, validateIdSelect, getReturn, courseList, validateSubjectCode, validateInputFile, validateIpfsReference, getCourse } from '@/composables/useAuxFunctions'
import DegreeService from '@/services/DegreeService'
import FacultyService from '@/services/FacultyService';
import SuccessMessageComponent from "@/components/success/SuccessMessageComponent.vue"
import ErrorMessageComponent from "@/components/error/ErrorMessageComponent.vue"
import SpecialtyService from '@/services/SpecialtyService';
import SubjectService from '@/services/SubjectService';
import IpfsService from '@/services/IpfsService';

let subjectName: Ref = ref(null)
let subjectCode: Ref = ref(null)

let nameErrorMessageRef: Ref = ref("")
let facultyIdErrorMessageRef: Ref = ref("")
let degreeIdErrorMessageRef: Ref = ref("")
let specialtyIdErrorMessageRef: Ref = ref("")
let codeErrorMessageRef: Ref = ref("")
let fileInputErrorMessageRef: Ref = ref("")

let nameIsValidRef: Ref = ref(true)
let facultyIdIsValidRef: Ref = ref(true)
let degreeIdIsValidRef: Ref = ref(true)
let specialtyIdIsValidRef: Ref = ref(true)
let codeIsValidRef: Ref = ref(true)
let fileIsValidRef: Ref = ref(true)


let faculty_list: Ref = ref(null)
let selectedFacultyId: Ref = ref(0)

let degree_list: Ref = ref(null)
let selectedDegreeId: Ref = ref(0)

let specialty_list: Ref = ref(null)
let selectedSpecialtyId: Ref = ref(0)

let course_list: Ref = ref(null)
let selectedCourseId: Ref = ref(0)

let fileRef: Ref = ref(null)

let subjectAdded: Ref = ref(null)
let errorAddingSubject: Ref = ref(null)

onMounted(async () => {
    faculty_list.value = await new FacultyService().getAllFaculties()
    course_list.value = courseList
})

const onFacultyChanged = (async () => {
    degree_list.value = await new DegreeService().getAllDegreesForFaculty(selectedFacultyId.value)
});

const onDegreeChanged = (async () => {
    specialty_list.value = await new SpecialtyService().getAllSpecialtysForDegree(selectedDegreeId.value)
});

const onCreateSubjectClicked = async () => {

    const file = fileRef.value.files[0]

    const [nameIsValid, nameErrorMessage] = validateInputText(50, subjectName.value)
    const [facultyIdIsValid, facultyIdErrorMessage] = validateIdSelect(selectedFacultyId.value)
    const [degreeIdIsValid, degreeIdErrorMessage] = validateIdSelect(selectedDegreeId.value)
    const [specialtyIdIsValid, specialtyIdErrorMessage] = validateIdSelect(selectedSpecialtyId.value)
    const [codeIsValid, codeErrorMessage] = validateSubjectCode(subjectCode.value)
    const [fileIsValid, fileErrorMessage] = validateInputFile(fileRef.value.files[0])

    if (nameIsValid && facultyIdIsValid && degreeIdIsValid && specialtyIdIsValid && codeIsValid && fileIsValid) {

        const course = await getCourse(selectedCourseId.value)
        const reference = await new IpfsService().uploadFileToIPFS(file)

        const referenceIsValid = validateIpfsReference(reference)

        if (!referenceIsValid) {

            subjectAdded.value = false
            errorAddingSubject.value = "Ha habido un problema subiendo el archivo a IPFS. Inténtelo de nuevo."

        } else {

            const tx = await new SubjectService().createSubject(subjectName.value, selectedDegreeId.value, selectedSpecialtyId.value, course, subjectCode.value, reference)
            const log = await getReturn(true, false, tx)

            if (log == true) {
                subjectAdded.value = true
            }

        }


    } else {

        nameIsValidRef.value = nameIsValid
        nameErrorMessageRef.value = nameErrorMessage

        facultyIdIsValidRef.value = facultyIdIsValid
        facultyIdErrorMessageRef.value = facultyIdErrorMessage

        degreeIdIsValidRef.value = degreeIdIsValid
        degreeIdErrorMessageRef.value = degreeIdErrorMessage

        specialtyIdIsValidRef.value = specialtyIdIsValid
        specialtyIdErrorMessageRef.value = specialtyIdErrorMessage

        codeIsValidRef.value = codeIsValid
        codeErrorMessageRef.value = codeErrorMessage

        fileIsValidRef.value = fileIsValid
        fileInputErrorMessageRef.value = fileErrorMessage
    }

};

</script>
D
<style lang="scss" scoped>

#component {
    font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

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
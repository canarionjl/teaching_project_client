<template>
    <div class="container-fluid">

        <div id="title" class="d-flex flex-column justify-content-center">

            <h1>¡Bienvenido al sistema de proyectos docentes interactivos de la Universidad de Las Palmas de Gran Canaria!
            </h1>

        </div>

    </div>


    <div class="container-fluid">

        <div class="d-flex flex-column align-items-center justify-content-center">

            <div class="container-fluid">

                <div class="d-flex flex-row justify-content-lg-around flex-wrap">


                    <div>
                        <div class="d-flex flex-row justify-content-start align-items-center">
                            <i>
                                <h5 class="m-3 selectHint"> Facultad: </h5>
                            </i>
                            <select class="form-select m-2" v-model="selectedFacultyId" @change="onFacultyChanged">
                                <option disabled selected class="defaultOption" value="0">Seleccionar Facultad</option>
                                <option v-for="faculty in faculty_list" :value="faculty.id" :key=faculty.id> {{
                                    faculty.name
                                }} </option>
                            </select>

                        </div>
                    </div>

                    <div>
                        <div class="d-flex flex-row justify-content-start align-items-center">
                            <i>
                                <h5 class="m-3 selectHint"> Grado: </h5>
                            </i>
                            <select class="form-select m-2" v-model="selectedDegreeId" @change="onDegreeChanged">
                                <option disabled selected class="defaultOption" value="0">Seleccionar Grado</option>
                                <option v-for="degree in degree_list" :value="degree.id" :key=degree.id> {{ degree.name
                                }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div class="d-flex flex-row justify-content-start align-items-center">
                            <i>
                                <h5 class="m-3 selectHint"> Especialidad: </h5>
                            </i>
                            <select class="form-select m-2" v-model="selectedSpecialtyId" @change="onSpecialtyChanged">
                                <option disabled selected class="defaultOption" value="0">Seleccionar Especialidad
                                </option>
                                <option v-for="specialty in specialty_list" :value="specialty.id" :key=specialty.id> {{
                                    specialty.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div class="d-flex flex-row justify-content-start align-items-center">
                            <i>
                                <h5 class="m-3 selectHint"> Curso: </h5>
                            </i>
                            <select class="form-select m-2" v-model="selectedCourseId">
                                <option disabled selected class="defaultOption" value="0">Seleccionar Curso</option>
                                <option v-for="(course, index) in course_list" :value=index :key=index> {{ course }}
                                </option>
                            </select>
                        </div>

                    </div>

                </div>

            </div>

            <div>

                <router-link
                    :to="{ name: 'subjectList', params: { specialty_id: selectedSpecialtyId, course: selectedCourseId } }">
                    <button type="submit" class="btn btn-primary btn-lg m-5 p-3">Buscar asignaturas</button>
                </router-link>
                <router-view />
                <button type="submit" class="btn btn-primary btn-lg m-5 p-3" @click="onClick">Generar HighRank</button>

            </div>

            <div v-show="error">
                <ErrorMessageComponent
                    errorMessage="Error: no existen datos o estos no han podido ser recuperados en este momento" />
            </div>

        </div>

        <hr class="hr" />

        <div id="admin">

            <h2>MI GESTIÓN</h2>
            <AdminMenuComponent :authCode="authCode" />

        </div>

    </div>
</template>
  
  
  
<script lang="ts" setup>

import { onBeforeMount, onMounted, Ref, ref } from "vue";
import FacultyService from "@/services/FacultyService"
import DegreeService from "@/services/DegreeService"
import { initDummyData } from "@/composables/useDummyData";
import AdminMenuComponent from "@/components/admin/menu/AdminMenuComponent.vue"
import SpecialtyService from "@/services/SpecialtyService";
import { courseList } from "@/composables/useAuxFunctions"
import ErrorMessageComponent from "@/components/error/ErrorMessageComponent.vue";
import { useAuthStore } from "@/store/authCodeStore";

const faculty_list: Ref = ref(null);
const degree_list: Ref = ref(null);
const specialty_list: Ref = ref(null);
const course_list: Ref = ref(null);

let selectedFacultyId: Ref = ref(0)
let selectedDegreeId: Ref = ref(0)
let selectedSpecialtyId: Ref = ref(0)
let selectedCourseId: Ref = ref(0)

let error: Ref = ref(false)

const {authCode} = useAuthStore()
let authCodeRef: Ref = ref(authCode)

onMounted(async () => {

    try {
        faculty_list.value = await new FacultyService().getAllFaculties()
    } catch {
        // setError(true)
    }

});

const onFacultyChanged = async () => {

    resetSelectValues(false, true, true, true)
    try {
        degree_list.value = await new DegreeService().getAllDegreesForFaculty(selectedFacultyId.value)
    } catch {
        // setError(true)
    }

};

const onDegreeChanged = async () => {

    resetSelectValues(false, false, true, true)
    try {
        specialty_list.value = await new SpecialtyService().getAllSpecialtysForDegree(selectedDegreeId.value)
    } catch {
        // setError(true)
    }

};

const onSpecialtyChanged = async () => {

    resetSelectValues(false, false, false, true)
    course_list.value = courseList
};



const onClick = () => {

    
    initDummyData()

}

function resetSelectValues(faculty_ac: boolean, degree_ac: boolean, specialty_ac: boolean, course_ac: boolean) {

    if (faculty_ac) {
        selectedFacultyId.value = 0
    }
    if (degree_ac) {
        selectedDegreeId.value = 0
    }
    if (specialty_ac) {
        selectedSpecialtyId.value = 0
    }
    if (course_ac) {
        selectedCourseId.value = 0
    }

}

function setError(value: boolean) {
    error.value = value
}

</script>
  
  
  
<style lang="scss" scoped>
#title {
    background-color: $primary;
    border-radius: 30px;
    padding: 20px;
    margin-bottom: 30px;
    border-bottom: 15px solid $complementary;

    h1 {
        font-size: 40px;
        color: white;
        font-style: italic;
        font-weight: bold;
        padding: 15px;
        text-align: center;
    }

}


#admin {
    background-color: $primary;
    border-radius: 30px;
    border-bottom: 10px solid $complementary;
    margin-top: 30px;

    h2 {
        font-size: 40px;
        font-weight: bold;
        font-style: italic;
        color: white;
        padding-top: 20px;
        text-align: center;
        margin-bottom: 30px;
    }

}

.defaultOption {
    display: none;
}

.selectHint {
    font-size: 16px;
    font-weight: bold;
}

.form-select {
    max-width: 250px !important;
}


// Overriding Bootstrap classes

.btn-primary {
    background-color: $primary !important;
    border: $primary !important;
}
</style>
  
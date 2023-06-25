<template>
    <div v-if="isLoading" id="loading">

        <h3>Cargando...</h3>

    </div>

    <div v-if="!isLoading">

        <div v-if="!error">

            <div v-for="(subject, index) in subjectList" :key=index>

                <SubjectListComponent :name="subject.name" :code="subject.code" :course="getCourseIndex(subject.course)"
                    :pendingProposals="getArrayLength(subject.pendingProposals)" :id="subject.id" />

            </div>

        </div>

        <div id="error" v-if="error">

            <ErrorMessageComponent :errorMessage="errorMessage" />

        </div>

    </div>
</template>

<script lang="ts" setup>

import SubjectListComponent from "@/components/subjects/SubjectListComponent.vue"
import { getArrayLength, getCourseIndex } from "@/composables/useAuxFunctions";
import SubjectService from "@/services/SubjectService";
import { onMounted, Ref, ref } from "vue";
import { useRoute } from "vue-router";

import ErrorMessageComponent from '@/components/error/ErrorMessageComponent.vue'



let specialty_id = 0;
let course = 0;
let subjectList: Ref = ref(null);
let error: Ref = ref(false);
let errorMessage: Ref = ref("")
let isLoading: Ref = ref(true)

onMounted(async () => {

    const route = useRoute()

    try {
        specialty_id = Number(route.params.specialty_id).valueOf()
        course = Number(route.params.course).valueOf()
        subjectList.value = await new SubjectService().getSubjectsWith(specialty_id, course)
        isLoading.value = false;
    } catch {
        isLoading.value = false;
        error.value = true;
        errorMessage.value = "No se ha podido recuperar la lista de asignaturas"
    }

    if (!error.value && subjectList.value.length == 0) {
        error.value = true;
        errorMessage.value = "No se encuentra ninguna asignatura que cumpla con los requisitos indicados"
    }

})

</script>

<style lang="scss" scoped>
#error {

    h1 {
        color: #ff0000;
        text-align: center;
        font-size: xxx-large;
        margin-top: 5%;
    }

    width: 100%;

}

#loading {
    h3 {
        color: $complementary;
        text-align: center;
        font-weight: bold;
        padding: 30px;
    }
}
</style>
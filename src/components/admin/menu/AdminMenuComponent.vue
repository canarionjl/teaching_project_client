<template>
    <div id="component">

        <div v-if="registeredUser == true">

            <div class="d-flex flex-row justify-content-around align-items-center flex-wrap">

                <div class="col-3 text-center" v-for="(adminOption, index) in optionList" :key="index">

                    <router-link
                        :to="{ name: [userType] + 'Admin', params: { dataType: index, systemInitialized: systemIsInitializedRef } }">
                        <button class="btn btn-primary btn-lg mb-4 p-3">
                            <i :class="cssClassForButtons[index]"> </i> {{ adminOption }}
                        </button>
                    </router-link>

                </div>

            </div>

            <div v-if="!systemIsInitializedRef" class="p-3">

                <h5 id="warningInfo">⚠️ El sistema debe ser inicializado por un alto cargo antes de acceder a sus
                    funcionalidades. ¡Hazlo
                    ahora! ⚠️ </h5>

            </div>

        </div>

        <div v-else class="m-5">

            <h4>¿Eres profesional de algún sector y te gustaría contribuir con la Universidad de Las Palmas de Gran Canaria?
            </h4>

            <h4>Contacta a través de <i id="emailContact">proyectosdocentes@ulpgc.es</i> y date de alta en el servicio<i
                    id="emailContact">MiULPGC</i> para poder participar.</h4>

        </div>

    </div>
</template>

<script lang="ts" setup>

import { ref, Ref, onBeforeMount, defineProps } from 'vue'
import SystemService from '@/services/SystemService'

let optionList: Ref = ref(null)
let cssClassForButtons: Ref = ref(null)
let registeredUser: Ref = ref(false)
let userType: Ref = ref("")
let systemIsInitializedRef: Ref = ref(null)

const props = defineProps({
    authCode: {
        type: String,
        required: true
    },
})

onBeforeMount(async () => {

    const systemIsInitialized = await new SystemService().systemIsInitialized()
    systemIsInitializedRef.value = systemIsInitialized

    switch (props.authCode) {

        case "1111":
            if (systemIsInitialized) {
                optionList.value = ["Añadir facultad", "Añadir grado", "Añadir especialidad", "Añadir asignatura", "Validar propuestas pendientes", "Borrar propuestas rechazadas"]
                cssClassForButtons.value = ["bi bi-buildings-fill", "bi bi-map", "bi bi-card-checklist", "bi bi-envelope-plus", "bi bi-bookmark-check", "bi bi-trash3-fill"]
            } else {
                optionList.value = ["Inicializar Sistema"]
                cssClassForButtons.value = ["bi bi-exclamation-triangle-fill"]
            }
            userType.value = "highRank"
            registeredUser.value = true
            break;

        case "2222":
            if (systemIsInitialized) {
                optionList.value = ["Mis asignaturas", "Mis propuestas pendientes", "Mis proyectos docentes pendientes", "Ver mis datos de participación"]
                cssClassForButtons.value = ["bi bi-envelope", "bi bi-patch-question", "bi bi-info-square", "bi bi-file-earmark-person"]
            }
            userType.value = "professor"
            registeredUser.value = true
            break;

        case "3333":
            if (systemIsInitialized) {
                optionList.value = ["Mis asignaturas", "Mis propuestas pendientes",  "Ver mis datos de participación"]
                cssClassForButtons.value = ["bi bi-envelope", "bi bi-file-earmark-person"]
                userType.value = "student"
            }
            registeredUser.value = true
            break;

        default:
            break;
    }
});

</script>

<style lang="scss" scoped>
#component {
    font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

#warningInfo {
    font-weight: bold;
    color: white;
    text-align: center;
}

.btn-primary {

    background-color: $complementary !important;
    border: $complementary !important;
    font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
    font-size: 17px !important;
    font-weight: 600 !important;
}

i {
    padding-inline: 5px;

    #emailContact {
        font-weight: bold;
    }
}

h4 {
    padding-inline: 40px;
    color: white;
    text-align: center;
}
</style>
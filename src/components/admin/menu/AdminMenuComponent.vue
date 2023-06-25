<template id="adminComponentTemplate">
    <div class="d-flex flex-row justify-content-around align-items-center flex-wrap" v-if="registeredUser == true">

        <div class="col-3 text-center" v-for="(adminOption, index) in optionList" :key="index">
            <router-link :to="{ name: [userType] + 'Admin', params:{dataType: index} }">
                <button class="btn btn-primary btn-lg mb-4 p-3">
                    <i :class="cssClassForButtons[index]"> </i> {{ adminOption }}
                </button>
            </router-link>
        </div>

    </div>

    <div v-else class="m-5">
        <h4>¿Eres profesional de algún sector y te gustaría contribuir con la Universidad de Las Palmas de Gran Canaria?</h4>
           <h4>Contacta a través de <i id="emailContact">proyectosdocentes@ulpgc.es</i> y date de alta en el servicio<i id="emailContact">MiULPGC</i> para poder participar.</h4>
    </div>
</template>

<script lang="ts" setup>


import { ref, Ref, onBeforeMount, defineProps } from 'vue'

let optionList: Ref = ref(null)
let cssClassForButtons: Ref = ref(null)
let registeredUser: Ref = ref(false)
let userType: Ref = ref("")

const props = defineProps({
    authCode: {
        type: String,
        required: true
    },
})

onBeforeMount(async () => {

    
    switch (props.authCode) {
        
        case "1111":
            optionList.value = ["Añadir facultad", "Añadir grado", "Añadir especialidad", "Añadir asignatura"]
            cssClassForButtons.value = ["bi bi-buildings-fill", "bi bi-map", "bi bi-card-checklist", "bi bi-envelope-plus"]
            userType.value = "highRank"
            registeredUser.value = true
            break;

        case "2222":
            optionList.value = ["Mis asignaturas", "Mis propuestas pendientes", "Mis proyectos docentes pendientes"]
            cssClassForButtons.value = ["bi bi-envelope", "bi bi-patch-question", "bi bi-info-square"]
            userType.value = "professor"
            registeredUser.value = true
            break;

        case "3333":
            optionList.value = ["Mis asignaturas", "Mis propuestas pendientes"]
            cssClassForButtons.value = ["bi bi-envelope", "bi bi-patch-question"]
            userType.value = "student"
            registeredUser.value = true
            break;

        default:
            break;
    }
});

</script>

<style lang="scss" scoped>
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

h4{
    padding-inline:40px;
    color:white;
    text-align: center;
}
</style>
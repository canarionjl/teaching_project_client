<template>
    <div v-if="!errorRef" class="m-5">

        <h5>Actualmente tienes <i :class="getClass()">{{ numberOfPenalties }}</i> penalización(es) por incumplimiento de
            fechas en la actualización de
            los
            proyectos docentes</h5>

    </div>

    <div v-if="errorRef">

        <ErrorMessageComponent error-message="No se puede mostrar la información relativa a las penalizaciones" />

    </div>
</template>


<script lang="ts" setup>

import ErrorMessageComponent from '@/components/error/ErrorMessageComponent.vue';
import { getUserInfo } from '@/composables/useAuxFunctions';
import { Ref, ref, onBeforeMount } from 'vue'

let numberOfPenalties: Ref = ref("[Cargando...]")
let errorRef: Ref = ref(false)

onBeforeMount(async () => {

    try {
        let userInfo = await getUserInfo()
        console.log(userInfo[1])
        numberOfPenalties.value = userInfo[1].punishments
    } catch {
        errorRef.value == true
    }

})

function getClass() {
    if (numberOfPenalties.value == 0) return "green"
    else return "red"
}

</script>



<style lang="scss" scoped>
.red {

    color: red;
    font-weight: bold;
    font-size: 30px;
    padding-inline: 5px;

}

.green {

    color: rgb(19, 195, 19);
    font-weight: bold;
    font-size: 22px;
    padding-inline: 3px;

}

h5 {

    text-align: center;
    font-weight: bold;

}
</style>
<template>
    <div v-if="!errorRef" class="m-5">

        <div v-if="isProfessor == true">
            <h5>Actualmente tienes
                <i :class="getClass()" v-if="numberOfPenalties != null">{{ numberOfPenalties }}</i>
                <i class="loading" v-else> [ cargando... ] </i>
                penalización(es) por incumplimiento de
                fechas en la actualización de
                los
                proyectos docentes
            </h5>
        </div>

        <div v-if="isProfessor != null">

            <h5>
                Actualmente tienes
                <i class="token">{{ numberOfTokens }}</i> tokens
                <a v-if="isProfessor == false">
                    (equivalentes a <i class="token">{{ numberOfTokens }}</i>
                    créditos universitarios)
                </a>
                <a v-if="isProfessor == true">
                    (equivalentes a 
                    un incremento de salario de <i class="token">{{ numberOfTokens * 350 }} </i> €)
                </a>

            </h5>

        </div>

    </div>

    <div v-if="errorRef">

        <ErrorMessageComponent error-message="No se puede mostrar la información relativa a las penalizaciones" />

    </div>
</template>


<script lang="ts" setup>

import ErrorMessageComponent from '@/components/error/ErrorMessageComponent.vue';
import { getUserInfo } from '@/composables/useAuxFunctions';
import TokenService from '@/services/TokenService';
import { Ref, ref, onBeforeMount, defineProps } from 'vue'

let numberOfPenalties: Ref = ref(null)
let numberOfTokens: Ref = ref(0)
let errorRef: Ref = ref(false)
let isProfessor: Ref = ref(null)

const props = defineProps({

    isProfessor: {
        type: Boolean,
        required: true
    }

})


onBeforeMount(async () => {

    try {
        let userInfo = await getUserInfo()
        console.log(userInfo[1])
        numberOfPenalties.value = userInfo[1].punishments
    } catch {
        errorRef.value == true
    }
    console.log(props.isProfessor)
    isProfessor.value = props.isProfessor
    console.log(isProfessor.value)

    try {
        numberOfTokens.value = await new TokenService().getTokensBalance()
    } catch {
        numberOfTokens.value = " [error...] "
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

.token {

    color: $complementary;
    font-weight: bold;
    font-size: 22px;
    padding-inline: 3px;

}

h5 {

    text-align: center;
    font-weight: bold;

}

.loading {
    color: red;
    font-style: normal;
}
</style>
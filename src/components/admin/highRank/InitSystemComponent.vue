<template >
    <div id="component">
        <div class="d-flex flex-column justify-content-center align-items-center">

            <div id="info" class="px-5 py-3 m-4">
                <h4 id="title" class="pb-4">¿Qué implica inicializar el sistema?</h4>
                <h5 class="pb-4" id="content">
                    La inicialización del sistema es un procedimiento necesario para indicar a la red Blokchain que el
                    sistema se <i>pone en marcha</i>.
                    Esto permite, entre otras cosas, reservar almacenamiento en la red de Solana para la información del
                    sistema o crear el token que equivale
                    a una cierta cantidad de créditos de la entidad universitaria.
                </h5>
                <h4 id="nota" class="pb-4"><a>NOTA: </a> Este procedimiento solo se debe realizar una única vez y por
                    parte de un Alto Cargo </h4>
            </div>

            <div class="text-center">
                <button type="submit" class="btn btn-primary btn-lg m-5 p-3" @click="onInitSystemClicked">Inicializar
                    Sistema</button>
            </div>

        </div>

        <div v-if="successRef" class="m-3">

            <SuccessMessageComponent :msg=messageRef />

        </div>
        <div v-if="!successRef" class="m-3">

            <ErrorMessageComponent :errorMessage=messageRef />

        </div>
    </div>
</template>

<script lang="ts" setup>

import { ref, Ref } from 'vue'
import { getReturn} from '@/composables/useAuxFunctions'
import SystemService from '@/services/SystemService';
import SuccessMessageComponent from '@/components/success/SuccessMessageComponent.vue';
import ErrorMessageComponent from '@/components/error/ErrorMessageComponent.vue';

let messageRef: Ref = ref("")
let successRef: Ref = ref(null)

const onInitSystemClicked = async () => {

    let result = ""
    let log;

    try {
        result = await new SystemService().initializeSystem()
    } catch { }

    if (result != "") {
        log = await getReturn(true, false, result)
    } else {
        log = false
    }

    if (log == true) {
        successRef.value = true
        messageRef.value = "El sistema se ha inicializado correctamente."

    } else {
        successRef.value = false
        messageRef.value = "No se ha podido inicializar el sistema. Inténtelo de nuevo más tarde."
    }

};

</script>

<style lang="scss" scoped>
#component {
    font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

#info {
    text-align: center;
    border-radius: 30px;
    background-color: $complementary-light;

    #title {

        text-decoration: underline;
        font-weight: bold;

    }

    #nota {

        a {
            color: red;
        }

        font-weight: bold;
    }

    #content {
        line-height: 30px;
    }
}

.btn-primary {
    background-color: $primary !important;
    border: $primary !important;
}

small {
    padding-left: 3px;
    color: red;
    font-weight: bold;
}</style>
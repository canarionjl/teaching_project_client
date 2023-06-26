<template>
    <div id="subjectCard">

        <div class="d-flex flex-row justify-content-between align-items-center">

            <div class="d-flex flex-column justify-content-betwenn align-content-baseline">

                <h2>{{ props.name }}</h2>
                <h4> Course: <i> {{ props.course }}º </i></h4>

            </div>

            <div class="d-flex flex-column justify-content-between align-content-baseline ">

                <h2>Código: <i>{{ props.code }}</i></h2>
                <h4>Propuestas pendientes: <i>{{ props.pendingProposals }}</i></h4>

            </div>

            <div class="col-2">
                <div>
                    <router-link :to="{ name: 'subjectDetail', params: { id: props.id, readingMode: props.readingMode.toString() } }">
                        <button type="button" id="subjectDetailButton" class="btn btn-primary px-3 py-2"> Ver asignatura </button>
                    </router-link>
                </div>

            </div>

        </div>

    </div>
</template>

<script lang="ts" setup>

import { defineProps } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    pendingProposals: {
        type: Number,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    readingMode: {
        type: Boolean,
        required: true
    }
})

</script>

<style lang="scss" scoped>
#subjectCard {
    background-color: $complementary-light;
    padding: 2%;
    margin-inline: 5%;
    margin-block: 15px;
    border-radius: 10px;

    h2 {
        font-weight: bold;
        font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        padding-bottom: 10px;
    }

    h4 {
        font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    i {
        color: $primary;
        font-weight: bold;
    }
}

#subjectDetailButton {
    background-color: $primary !important;
    border: $primary !important;
    font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
    font-size: 17px;
    font-weight: 600;
}
</style>
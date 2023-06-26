<template>

    <div class="m-2">

        <h3>{{ props.errorMessage }}</h3>

    </div>
    
</template>

<script lang="ts" setup>

import { defineProps } from 'vue';

const props = defineProps({
    errorMessage: {
        type: String,
        required: true
    }
})

</script>

<style lang="scss" scoped>

h3 {
    color: red;
    font-weight: bold;
    text-align: center;
}

</style>
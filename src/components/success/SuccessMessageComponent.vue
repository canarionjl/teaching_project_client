<template>
    
    <div class="m-2">

        <h4>{{ props.msg }}</h4>

    </div>

</template>

<script lang="ts" setup>

import { defineProps } from 'vue';

const props = defineProps({
    msg: {
        type: String,
        required: true
    }
})

</script>

<style lang="scss" scoped>

h4 {
    color: green;
    font-weight: bold;
    text-align: center;
}

</style>
<template>
    <div v-if="page == 0">
        <CreateFacultyComponent />
    </div>
    <div v-else-if="page == 1">
        <CreateDegreeComponent />
    </div>
    <div v-else-if="page == 2">
        <CreateSpecialtyComponent />
    </div>

    <div v-else-if="page == 3">
        <CreateSubjectComponent />
    </div>
</template>

<script lang="ts" setup>

import CreateFacultyComponent from "@/components/admin/highRank/CreateFacultyComponent.vue"
import CreateDegreeComponent from "@/components/admin/highRank/CreateDegreeComponent.vue"
import CreateSpecialtyComponent from "@/components/admin/highRank/CreateSpecialtyComponent.vue"
import CreateSubjectComponent from "@/components/admin/highRank/CreateSubjectComponent.vue"
import { useRoute } from "vue-router";
import { ref, Ref, onMounted } from 'vue'

let page: Ref = ref(null)

onMounted(() => {
    const route = useRoute()
    page.value = route.params.dataType
})


</script>

<style lang="scss" scoped></style>
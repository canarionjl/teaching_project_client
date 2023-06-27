<template>
    
    <div v-if="page == 0">
        <WatchProfessorSubjects/>
    </div>

    <div v-if="page == 1">
        <ProposalMasterComponent/>
    </div>

    <div v-if="page == 2">
        <ProposalMasterComponent/>
    </div>

    
</template>

<script lang="ts" setup>

import WatchProfessorSubjects from "@/components/admin/professor/WatchProfessorSubjects.vue"
import ProposalMasterComponent from "@/components/admin/professor/ProposalMasterComponent.vue";

import { useRoute } from "vue-router";
import { ref, Ref, onMounted } from 'vue'

let page: Ref = ref(null)

onMounted( () => {
    const route = useRoute()
    page.value = route.params.dataType
})


</script>

<style lang="scss" scoped></style>
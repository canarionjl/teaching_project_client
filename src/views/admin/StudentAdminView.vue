<template>
    
    <div v-if="page == 0">
        <WatchProfessorSubjects :isProfessor="false"/>
    </div>

    <div v-if="page == 1">
        <ProposalMasterComponent :proposalState="0"/>
    </div>

    <div v-if="page == 2">
        <InfoComponent  :is-professor="false"/>
    </div>
    
</template>

<script lang="ts" setup>

import WatchProfessorSubjects from "@/components/admin/professor/WatchProfessorSubjects.vue"
import ProposalMasterComponent from "@/components/admin/professor/ProposalMasterComponent.vue";
import InfoComponent  from "@/components/admin/professor/InfoComponent.vue";

import { useRoute } from "vue-router";
import { ref, Ref, onMounted } from 'vue'

let page: Ref = ref(null)

onMounted( () => {
    const route = useRoute()
    page.value = route.params.dataType
})


</script>

<style lang="scss" scoped></style>
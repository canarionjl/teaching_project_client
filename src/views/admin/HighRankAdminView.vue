<template>
    <div v-if="systemIsInitializedRef">

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

        <div v-else-if="page == 4">
            <HighRankProposalMasterComponent :proposalState=2 />
        </div>

    </div>

    <div v-if="!systemIsInitializedRef">

        <div v-if="page == 0">
            <InitSystemComponent />
        </div>

    </div>

</template>

<script lang="ts" setup>

import CreateFacultyComponent from "@/components/admin/highRank/CreateFacultyComponent.vue"
import CreateDegreeComponent from "@/components/admin/highRank/CreateDegreeComponent.vue"
import CreateSpecialtyComponent from "@/components/admin/highRank/CreateSpecialtyComponent.vue"
import CreateSubjectComponent from "@/components/admin/highRank/CreateSubjectComponent.vue"
import InitSystemComponent from "@/components/admin/highRank/InitSystemComponent.vue"
import HighRankProposalMasterComponent from "@/components/admin/highRank/HighRankProposalMasterComponent.vue"
import { useRoute } from "vue-router";
import { ref, Ref, onBeforeMount } from 'vue'


let page: Ref = ref(null)
let systemIsInitializedRef: Ref = ref(false)

onBeforeMount( () => {
    const route = useRoute()
    page.value = route.params.dataType
    systemIsInitializedRef.value = route.params.systemInitialized == 'true'
})


</script>

<style lang="scss" scoped></style>
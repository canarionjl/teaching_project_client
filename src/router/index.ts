import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MenuView from '@/views/menu/MenuView.vue'
import SubjectMasterView from '@/views/subjects/SubjectMasterView.vue'
import HighRankAdminView from '@/views/admin/HighRankAdminView.vue'
import ProfessorAdminView from '@/views/admin/ProfessorAdminView.vue'
import SubjectDetailView from '@/views/subjects/SubjectDetailView.vue'
import CreateProposalView from '@/views/proposals/CreateProposalView.vue'
import ProposalDetailView from '@/views/proposals/ProposalDetailView.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: MenuView
    },

    {
        path: '/subjectList/:specialty_id/:course',
        name: 'subjectList',
        component: SubjectMasterView
    },
    {
        path: '/highRankAdmin/:dataType',
        name: 'highRankAdmin',
        component: HighRankAdminView
    },
    {
        path: '/professorAdmin/:dataType',
        name: 'professorAdmin',
        component: ProfessorAdminView
    },

    {
        path: '/subjectDetail/:id',
        name: 'subjectDetail',
        component: SubjectDetailView
    },

    {
        path: '/createProposal/:subject_id',
        name: 'createProposal',
        component: CreateProposalView
    },

    {
        path: '/proposalDetail/:proposal_id/:subject_code',
        name: 'proposalDetail',
        component: ProposalDetailView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
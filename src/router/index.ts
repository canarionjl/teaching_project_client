import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MenuView from '@/views/menu/MenuView.vue'
import SubjectMasterView from '@/views/subjects/SubjectMasterView.vue'
import HighRankAdminView from '@/views/admin/HighRankAdminView.vue'
import ProfessorAdminView from '@/views/admin/ProfessorAdminView.vue'
import SubjectDetailView from '@/views/subjects/SubjectDetailView.vue'
import CreateProposalView from '@/views/proposals/CreateProposalView.vue'
import ProposalDetailView from '@/views/proposals/ProposalDetailView.vue'
import RegisterView from '@/views/register/RegisterView.vue'
import LoginView from '@/views/login/LoginView.vue'

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
        path: '/highRankAdmin/:dataType/:systemInitialized',
        name: 'highRankAdmin',
        component: HighRankAdminView
    },
    {
        path: '/professorAdmin/:dataType',
        name: 'professorAdmin',
        component: ProfessorAdminView
    },

    {
        path: '/subjectDetail/:id/:readingMode',
        name: 'subjectDetail',
        component: SubjectDetailView
    },

    {
        path: '/createProposal/:subject_id',
        name: 'createProposal',
        component: CreateProposalView
    },

    {
        path: '/proposalDetail/:proposal_id/:subject_code/:readingMode/:proposalState',
        name: 'proposalDetail',
        component: ProposalDetailView
    },

    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },

    {
        path: '/login',
        name: 'login',
        component: LoginView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
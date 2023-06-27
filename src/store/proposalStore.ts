import { defineStore } from 'pinia';

export const useProposalStore = defineStore('proposalStore', {

    state: () => {

        return {
            proposal: null,
            subject:null
        }

    },

    actions: {

        setProposal(proposal: any) {
            this.proposal = proposal
        },

        setSubject (subject: any) {
            this.subject = subject
        }

    }
})

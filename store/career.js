import { defineStore } from 'pinia'

export const useCareerStore = defineStore('careerStore',
    {
        persist: true,
        state: () => ({
            currentCareersPage: 1,
            currentWebsiteCareersPage: 1,
            selectedCareer: null,
            selectedWebsiteCareer: null,
        }),
        actions: {
            setCurrentCareersPage(pageNumber) {
                this.currentCareersPage = pageNumber
            },
            setCurrentWebsiteCareersPage(pageNumber) {
                this.currentWebsiteCareersPage = pageNumber
            },
            setSelectedCareer(data) {
                this.selectedCareer = data
            },
            setSelectedWebsiteCareer(data) {
                this.selectedWebsiteCareer = data
            },
            resetCurrentCareersPage() {
                this.currentCareersPage = 1
            },
            resetCurrentWebsiteCareersPage() {
                this.currentWebsiteCareersPage = 1
            },
            resetSelectedCareer() {
                this.selectedCareer = null
            },
            resetSelectedWebsiteCareer() {
                this.selectedWebsiteCareer = null
            },
        },
        getters: {
            getCurrentCareersPage: (state) => state.currentCareersPage,
            getCurrentWebsiteCareersPage: (state) => state.currentWebsiteCareersPage,
            getSelectedCareer: (state) => state.selectedCareer,
            getSelectedWebsiteBlog: (state) => state.selectedWebsiteCareer,
        },
    },
)

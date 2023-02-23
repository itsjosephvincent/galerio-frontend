import { defineStore } from 'pinia'

export const useTrainingStore = defineStore('trainingStore',
    {
        persist: true,
        state: () => ({
            currentTrainingsPage: 1,
            currentWebsiteTrainingsPage: 1,
            currentWebsiteTrainingTraineesPage: 1,
            selectedTraining: null,
            selectedWebsiteTraining: null,
        }),
        actions: {
            setCurrentTrainingsPage(pageNumber) {
                this.currentTrainingsPage = pageNumber
            },
            setCurrentWebsiteTrainingsPage(pageNumber) {
                this.currentWebsiteTrainingsPage = pageNumber
            },
            setCurrentWebsiteTrainingTraineesPage(pageNumber) {
                this.currentWebsiteTrainingTraineesPage = pageNumber
            },
            setSelectedTraining(data) {
                this.selectedTraining = data
            },
            setSelectedWebsiteTraining(data) {
                this.selectedWebsiteTraining = data
            },
            resetCurrentTrainingsPage() {
                this.currentTrainingsPage = 1
            },
            resetCurrentWebsiteTrainingsPage() {
                this.currentWebsiteTrainingsPage = 1
            },
            resetCurrentWebsiteTrainingTraineesPage() {
                this.currentWebsiteTrainingTraineesPage = 1
            },
            resetSelectedTraining() {
                this.selectedTraining = null
            },
            resetSelectedWebsiteTraining() {
                this.selectedWebsiteTraining = null
            },
        },
        getters: {
            getCurrentTrainingsPage: (state) => state.currentTrainingsPage,
            getCurrentWebsiteTrainingsPage: (state) => state.currentWebsiteTrainingsPage,
            getCurrentWebsiteTrainingTraineesPage: (state) => state.currentWebsiteTrainingTraineesPage,
            getSelectedTraining: (state) => state.selectedTraining,
            getSelectedWebsiteTraining: (state) => state.selectedWebsiteTraining,
        },
    },
)

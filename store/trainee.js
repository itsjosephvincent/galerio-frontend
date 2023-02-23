import { defineStore } from 'pinia'

export const useTraineeStore = defineStore('traineeStore',
    {
        persist: true,
        state: () => ({
            currentTraineesPage: 1,
            selectedTrainee: null,
        }),
        actions: {
            setCurrentTraineesPage(pageNumber) {
                this.currentTraineesPage = pageNumber
            },
            setSelectedTrainee(data) {
                this.selectedTrainee = data
            },
            resetCurrentTraineesPage() {
                this.currentTraineesPage = 1
            },
            resetSelectedTrainee() {
                this.selectedTrainee = null
            },
        },
        getters: {
            getCurrentTraineesPage: (state) => state.currentTraineesPage,
            getSelectedTrainee: (state) => state.selectedTrainee,
        },
    },
)

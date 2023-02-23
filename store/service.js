import { defineStore } from 'pinia'

export const useServiceStore = defineStore('serviceStore',
    {
        persist: true,
        state: () => ({
            currentServicesPage: 1,
            selectedService: null,
        }),
        actions: {
            setCurrentServicesPage(pageNumber) {
                this.currentServicesPage = pageNumber
            },
            setSelectedService(data) {
                this.selectedService = data
            },
            resetCurrentServicesPage() {
                this.currentServicesPage = 1
            },
            resetSelectedService(data) {
                this.selectedService = data
            },
        },
        getters: {
            getCurrentServicesPage: (state) => state.currentServicesPage,
            getSelectedService: (state) => state.selectedService,
        },
    },
)

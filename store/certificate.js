import { defineStore } from 'pinia'

export const useCertificateStore = defineStore('certificateStore',
    {
        persist: true,
        state: () => ({
            currentCertificatesPage: 1,
            selectedCertificate: null,
        }),
        actions: {
            setCurrentCertificatesPage(pageNumber) {
                this.currentCertificatesPage = pageNumber
            },
            setSelectedCertificate(data) {
                this.selectedCertificate = data
            },
            resetCurrentCertificatesPage() {
                this.currentCertificatesPage = 1
            },
            resetSelectedCertificate() {
                this.selectedCertificate = null
            },
        },
        getters: {
            getCurrentCertificatesPage: (state) => state.currentCertificatesPage,
            getSelectedCertificate: (state) => state.selectedCertificate,
        },
    },
)

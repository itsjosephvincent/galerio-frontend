import { defineStore } from 'pinia'

export const useImageResourceStore = defineStore('imageResourceStore',
    {
        persist: true,
        state: () => ({
            currentImageResourcePage: 1,
            selectedImageResource: null,
        }),
        actions: {
            setCurrentImageResourcesPage(pageNumber) {
                this.currentImageResourcePage = pageNumber
            },
            setSelectedImageResource(data) {
                this.selectedImageResource = data
            },
            resetCurrentImageResourcesPage() {
                this.currentImageResourcePage = 1
            },
            resetSelectedImageResource() {
                this.selectedImageResource = null
            },
        },
        getters: {
            getCurrentImageResourcesPage: (state) => state.currentImageResourcePage,
            getSelectedImageResource: (state) => state.selectedImageResource,
        },
    },
)

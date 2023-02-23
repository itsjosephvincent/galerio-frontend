import { defineStore } from 'pinia'

export const useLandingStore = defineStore('landingStore',
    {
        persist: true,
        state: () => ({
            currentFeatureImagesPage: 1,
            selectedFeatureImage: null,
        }),
        actions: {
            setCurrentFeaturedImagesPage(pageNumber) {
                this.currentFeatureImagesPage = pageNumber
            },
            setSelectedFeaturedImage(data) {
                this.selectedFeatureImage = data
            },
            resetCurrentFeaturedImagesPage() {
                this.currentFeatureImagesPage = 1
            },
            resetSelectedFeaturedImage() {
                this.selectedFeatureImage = null
            },
        },
        getters: {
            getCurrentFeaturedImagesPage: (state) => state.currentFeatureImagesPage,
            getSelectedFeaturedImage: (state) => state.selectedFeatureImage,
        },
    },
)

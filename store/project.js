import { defineStore } from 'pinia'

export const useProjectStore = defineStore('projectStore',
    {
        persist: true,
        state: () => ({
            currentProjectsPage: 1,
            selectedProject: null,
            currentWebsiteCompletedProjectsPage: 1,
            currentWebsiteOngoingProjectsPage: 1,
            selectedWebsiteProject: null,
        }),
        actions: {
            setCurrentProjectsPage(pageNumber) {
                this.currentProjectsPage = pageNumber
            },
            setSelectedProject(data) {
                this.selectedProject = data
            },
            setCurrentWebsiteCompletedProjectsPage(pageNumber) {
                this.currentWebsiteCompletedProjectsPage = pageNumber
            },
            setCurrentWebsiteOngoingProjectsPage(pageNumber) {
                this.currentWebsiteOngoingProjectsPage = pageNumber
            },
            setSelectedWebsiteProject(data) {
                this.selectedWebsiteProject = data
            },
            resetCurrentProjectsPage() {
                this.currentProjectsPage = 1
            },
            resetSelectedProject() {
                this.selectedProject = null
            },
            resetCurrentWebsiteCompletedProjectsPage() {
                this.currentWebsiteCompletedProjectsPage = 1
            },
            resetCurrentWebsiteOngoingProjectsPage() {
                this.currentWebsiteOngoingProjectsPage = 1
            },
            resetSelectedWebsiteProject() {
                this.selectedWebsiteProject = null
            },
        },
        getters: {
            getCurrentProjectsPage: (state) => state.currentProjectsPage,
            getSelectedProject: (state) => state.selectedProject,
            getCurrentWebsiteCompletedProjectsPage: (state) => state.currentWebsiteCompletedProjectsPage,
            getCurrentWebsiteOngoingProjectsPage: (state) => state.currentWebsiteOngoingProjectsPage,
            getSelectedWebsiteProject: (state) => state.selectedWebsiteProject,
        },
    },
)

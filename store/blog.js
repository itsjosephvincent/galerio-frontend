import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blogStore',
    {
        persist: true,
        state: () => ({
            currentBlogsPage: 1,
            currentWebsiteBlogsPage: 1,
            selectedBlog: null,
            selectedWebsiteBlog: null,
        }),
        actions: {
            setCurrentBlogsPage(pageNumber) {
                this.currentBlogsPage = pageNumber
            },
            setCurrentWebsiteBlogsPage(pageNumber) {
                this.currentWebsiteBlogsPage = pageNumber
            },
            setSelectedBlog(data) {
                this.selectedBlog = data
            },
            setSelectedWebsiteBlog(data) {
                this.selectedWebsiteBlog = data
            },
            resetCurrentBlogsPage() {
                this.currentBlogsPage = 1
            },
            resetCurrentWebsiteBlogsPage() {
                this.currentWebsiteBlogsPage = 1
            },
            resetSelectedBlog() {
                this.selectedBlog = null
            },
            resetSelectedWebsiteBlog() {
                this.selectedWebsiteBlog = null
            },
        },
        getters: {
            getCurrentBlogsPage: (state) => state.currentBlogsPage,
            getCurrentWebsiteBlogsPage: (state) => state.currentWebsiteBlogsPage,
            getSelectedBlog: (state) => state.selectedBlog,
            getSelectedWebsiteBlog: (state) => state.selectedWebsiteBlog,
        },
    },
)

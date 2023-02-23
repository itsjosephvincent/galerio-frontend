import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore',
    {
        persist: true,
        state: () => ({
            user: null,
            currentUsersPage: 1,
            selectedUser: null,
        }),
        actions: {
            setUser(user) {
                this.user = user
            },
            setCurrentUsersPage(pageNumber) {
                this.currentUsersPage = pageNumber
            },
            setSelectedUser(data) {
                this.selectedUser = data
            },
            resetUser() {
                this.user = null
            },
            resetCurrentUsersPage() {
                this.currentUsersPage = 1
            },
            resetSelectedUser() {
                this.selectedUser = null
            },
        },
        getters: {
            getUser: (state) => state.user,
            getCurrentUsersPage: (state) => state.currentUsersPage,
            getSelectedUser: (state) => state.selectedUser,
        },
    },
)

import { defineStore } from 'pinia'

export const useLogsStore = defineStore('logsStore',
    {
        persist: true,
        state: () => ({
            currentLogsPage: 1,
        }),
        actions: {
            setCurrentLogsPage(pageNumber) {
                this.currentLogsPage = pageNumber
            },
        },
        getters: {
            getCurrentLogsPage: (state) => state.currentLogsPage,
        },
    },
)

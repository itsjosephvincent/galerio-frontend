import { defineStore } from 'pinia'

export const useContactStore = defineStore('contactStore',
    {
        persist: true,
        state: () => ({
            websiteContact: null,
        }),
        actions: {
            setWebsiteContact(data) {
                this.websiteContact = data
            },
            resetWebsiteContact() {
                this.websiteContact = null
            },
        },
        getters: {
            getWebsiteContact: (state) => state.websiteContact,
        },
    },
)

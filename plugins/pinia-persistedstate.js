import { createNuxtPersistedState } from 'pinia-plugin-persistedstate'
import { defineNuxtPlugin, useCookie } from '#app'

const options = {
    storage: sessionStorage,
    beforeRestore: () => { },
    afterRestore: () => { },
    serializer: {
        serialize: JSON.stringify,
        deserialize: JSON.parse,
    }
}

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.$pinia.use(createNuxtPersistedState(useCookie, options))
})
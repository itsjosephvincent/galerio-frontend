import { defineNuxtConfig } from 'nuxt'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    ssr: false,
    build: {
        transpile: [
            "@heroicons/vue"
        ]
    },
    buildModules: [
        '@pinia/nuxt'
    ],
    modules: [
        '@nuxtjs/tailwindcss',
    ],
    plugins: [
        '@/plugins/pinia-persistedstate.js',
        '@/plugins/swal.js',
    ],
    publicRuntimeConfig: {
        appName: process.env.APP_NAME,
        apiBaseURL: process.env.API_BASE_URL,
    },
    tailwindcss: {
        cssPath: '~/assets/css/main.css',
        configPath: 'tailwind.config.js',
    },
    vite: {
        plugins: [
            VueI18nVitePlugin({
                include: [
                    resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json')
                ]
            })
        ]
    }
})

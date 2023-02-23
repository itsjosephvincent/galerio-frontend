<template>
    <NuxtLayout name="website">

        <Head>
            <Title>Service - {{ state.service.title }} | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <HeaderBanner :image_url="state.banner.image_url"
            :title="state.service && state.service.title ? state.service.title : 'Service'"
            :description="state.banner.description" />
        <section class="max-w-8xl mx-auto py-16 space-y-4">
            <div id="content" v-html="state.service && state.service.content"></div>
        </section>
    </NuxtLayout>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { serviceService } from '@/components/api/ServiceService'

const route = useRoute()
const selectedServiceSlug = route.params.slug

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    banner: {
        image_url: '/assets/img/banner/services.png',
        title: 'Services',
    },
    error: null,
    isPageLoading: false,
    service: []
})

onMounted(() => {
    fetchService()
})

async function fetchService() {
    state.isPageLoading = true
    try {
        const response = await serviceService.getWebsiteServiceBySlug(selectedServiceSlug)
        if (response.data) {
            state.service = response.data
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

function backtoServices() {
    navigateTo('/services')
}
</script>
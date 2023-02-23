<template>
    <NuxtLayout name="website">

        <Head>
            <Title>Services | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <HeaderBanner :image_url="state.banner.image_url" :title="state.banner.title" />
        <section class="max-w-8xl mx-auto py-20">
            <div class="space-y-8">
                <h3 class="text-center text-2xl font-medium text-primary-800">Services Offered</h3>
                <div class="grid grid-cols-5 gap-y-8 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
                    <div class="col-span-1 text-center space-y-2 p-4 cursor-pointer hover:bg-gray-100 hover:rounded-md"
                        v-for="(service, key) in state.services" :key="key" @click="viewService(service)">
                        <div class="flex justify-center">
                            <img :src="service.icon_url" :alt="service.title" class="w-36">
                        </div>
                        <h5 class="text-lg font-medium">{{ service.title }}</h5>
                        <p class="text-sm text-gray-600 mt-2">
                            {{ service.description }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </NuxtLayout>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { serviceService } from '@/components/api/ServiceService'

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    banner: {
        image_url: '/assets/img/banner/services.png',
        title: 'Services',
    },
    isPageLoading: false,
    services: []
})


onMounted(() => {
    fetchServices()
})

async function fetchServices() {
    state.isPageLoading = true
    try {
        const response = await serviceService.getWebsiteServices()
        if (response.data) {
            state.services = response.data
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

function viewService(service) {
    navigateTo('/services/' + service.slug)
}
</script>
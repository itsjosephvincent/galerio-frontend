<template>
    <NuxtLayout name="website">

        <Head>
            <Title>Careers | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <HeaderBanner :image_url="state.banner.image_url" :title="state.banner.title" />
        <section class="max-w-8xl mx-auto py-10">
            <div class="flex flex-col gap-y-8">
                <ContainerCareer v-for="(career, index) in state.careers.data" :key="index" :data="career" />
                <Pagination :data="state.careers" @previous="previous" @next="next" />
            </div>
        </section>
    </NuxtLayout>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { useCareerStore } from '@/store/career'
import { careerService } from '@/components/api/CareerService'

const careerStore = useCareerStore()
let currentTablePage = careerStore.getCurrentCareersPage

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    banner: {
        image_url: '/assets/img/banner/careers.png',
        title: 'Careers',
    },
    careers: [],
    isPageLoading: false,
})

onMounted(() => {
    fetchCareers()
})

async function fetchCareers() {
    state.isPageLoading = true
    try {
        const params = {
            page: currentTablePage,
        }
        const response = await careerService.getWebsiteCareers(params)
        if (response) {
            state.careers = response
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}
function previous() {
    currentTablePage--
    careerStore.setCurrentWebsiteCareersPage(currentTablePage)
    fetchCareers()
}

function next() {
    currentTablePage++
    careerStore.setCurrentWebsiteCareersPage(currentTablePage)
    fetchCareers()
}
</script>
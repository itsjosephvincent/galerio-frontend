<template>
    <NuxtLayout name="website">

        <Head>
            <Title>Trainings | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <HeaderBanner :image_url="state.banner.image_url" :title="state.banner.title" />
        <section class="max-w-8xl mx-auto py-10">
            <!-- <div class="ml-4 py-5 lg:max-w-lg">
                <FormSearch placeholder="Search Training" />
            </div> -->
            <div class="flex flex-col gap-y-4">
                <div class="lg:grid lg:grid-cols-2">
                    <ContainerTraining v-for="(training, index) in state.trainings.data" :key="index" :data="training"
                        @click="viewTraining(training)" />
                </div>
                <div class="text-center py-10" v-if="state.trainings.data && state.trainings.data.length < 1">
                    <h3>No Data Found</h3>
                </div>
                <Pagination :data="state.trainings" @previous="previous" @next="next" class="mt-5" />
            </div>
        </section>
    </NuxtLayout>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { useTrainingStore } from '@/store/training'
import { trainingService } from '@/components/api/TrainingService'

const trainingStore = useTrainingStore()
let currentTablePage = trainingStore.getCurrentWebsiteTrainingsPage

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    banner: {
        image_url: '/assets/img/banner/projects.png',
        title: 'Trainings',
    },
    error: null,
    isPageLoading: false,
    trainings: []
})

onMounted(() => {
    fetchTrainings()
})

async function fetchTrainings() {
    state.isPageLoading = true
    try {
        const params = {
            page: currentTablePage,
        }
        const response = await trainingService.getWebsiteTrainings(params)
        if (response) {
            state.trainings = response
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

function previous() {
    currentTablePage--
    trainingStore.setCurrentWebsiteTrainingsPage(currentTablePage)
    fetchTrainings()
}

function next() {
    currentTablePage++
    trainingStore.setCurrentWebsiteTrainingsPage(currentTablePage)
    fetchTrainings()
}

function viewTraining(training) {
    trainingStore.setSelectedWebsiteTraining(training)
    navigateTo('/trainings/' + training.slug)
}
</script>
<template>
    <NuxtLayout name="website">

        <Head>
            <Title>Training - {{ state.training.title }} | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <HeaderBanner :image_url="state.banner.image_url"
            :title="state.training && state.training.title ? state.training.title : 'Training'"
            :description="state.banner.description" />
        <section class="max-w-8xl mx-auto py-16 space-y-4">
            <FormButton class="px-0 hover:text-primary-700" @click="backtoTrainings()">
                <template #icon-left>
                    <ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
                </template>
                Back to Trainings
            </FormButton>
            <h3 class="text-gray-800 text-xl font-medium">Trainees</h3>
            <div class="table-responsive">
                <Table :columnHeaders="state.columnHeaders" :data="state.trainees" :isLoading="state.isTableLoading"
                    :sortData="state.sortData" @sort="sort">
                    <template #body
                        v-if="!(state.isTableLoading || (state.trainees.data && state.trainees.data.length === 0))">
                        <tr v-for="(trainee, index) in state.trainees.data" :key="index">
                            <td>
                                <p>{{ trainee.name }}</p>
                            </td>
                            <td>
                                <p>{{ trainee.certificate_no }}</p>
                            </td>
                            <td>
                                <p>
                                    {{ formatDateToReadable(trainee.training_date_from) }} -
                                    {{ formatDateToReadable(trainee.training_date_to) }}
                                </p>
                            </td>
                        </tr>
                    </template>
                </Table>
            </div>
            <Pagination :data="state.trainees" @previous="previous" @next="next" />
        </section>
    </NuxtLayout>
</template>

<script setup>
import moment from 'moment'
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { ArrowLeftIcon } from '@heroicons/vue/outline'
import { useTrainingStore } from '@/store/training'
import { trainingService } from '@/components/api/TrainingService'

const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const selectedTrainingSlug = route.params.slug
const trainingStore = useTrainingStore()
let currentTablePage = trainingStore.getCurrentWebsiteTrainingTraineesPage

const state = reactive({
    banner: {
        image_url: '/assets/img/banner/projects.png',
        title: 'Trainings & Updates',
    },
    columnHeaders: [
        { name: 'Name', sorter: true, key: 'name' },
        { name: 'Certificate No', sorter: true, key: 'certificate_no' },
        { name: 'Date' },
    ],
    error: null,
    isPageLoading: false,
    isTableLoading: false,
    sortData: {
        sortField: null,
        sortOrder: null,
    },
    trainees: [],
    training: [],
})

onMounted(() => {
    fetchTraining()
    fetchTrainees()
})

async function fetchTraining() {
    state.isPageLoading = true
    try {
        const response = await trainingService.getWebsiteTrainingBySlug(selectedTrainingSlug)
        if (response.data) {
            state.training = response.data
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function fetchTrainees() {
    state.isTableLoading = true
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
        }
        const response = await trainingService.getWebsiteTrainingTrainees(selectedTrainingSlug, params)
        if (response) {
            state.trainees = response
        }
    } catch (error) {
        state.error = error
    }
    state.isTableLoading = false
}

function previous() {
    currentTablePage--
    trainingStore.setCurrentWebsiteTrainingTraineesPage(currentTablePage)
    fetchTrainees()
}

function next() {
    currentTablePage++
    trainingStore.setCurrentWebsiteTrainingTraineesPage(currentTablePage)
    fetchTrainees()
}

function sort(sortingData) {
    currentTablePage = 1
    trainingStore.setCurrentWebsiteTrainingTraineesPage(currentTablePage)
    state.sortData = {
        sortField: sortingData.column,
        sortOrder: sortingData.sort,
    }
    fetchTrainees()
}

function backtoTrainings() {
    navigateTo('/trainings')
}

function formatDateToReadable(date) {
    return moment(date).format('LL')
}
</script>
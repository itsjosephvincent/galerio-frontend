<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Trainings | {{ runtimeConfig.appName }}</Title>
        </Head>

        <template #header>Trainings</template>
        <div class="flex justify-end">
            <FormButton type="button" buttonStyle="primary" class="rounded-md" @click="navigateToAddNewTraining()">
                Add New Training
            </FormButton>
        </div>
        <div class="mt-5">
            <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
            <TableSearch :columnFilter="state.columnFilter" :dataFilter="state.dataFilter"
                @handleFilter="handleFilter" />
            <div class="table-responsive">
                <Table :columnHeaders="state.columnHeaders" :data="state.trainings" :isLoading="state.isTableLoading"
                    :sortData="state.sortData" @sort="sort">
                    <template #body
                        v-if="!(state.isTableLoading || (state.trainings.data && state.trainings.data.length === 0))">
                        <tr v-for="(training, index) in state.trainings.data" :key="index">
                            <td>
                                <div class="flex items-center gap-2">
                                    <img :src="training.thumbnail_url" alt="Image failed to load." class="w-12" />
                                    <p>
                                        {{ training.title }}
                                    </p>
                                </div>
                            </td>
                            <td>
                                <p class="line-clamp-2">
                                    {{ training.description }}
                                </p>
                            </td>
                            <td>
                                <p>
                                    {{ formatDateToReadable(training.date_from) }}
                                </p>
                            </td>
                            <td>
                                <p>
                                    {{ formatDateToReadable(training.date_to) }}
                                </p>
                            </td>
                            <td>
                                <p class="line-clamp-2">
                                    {{ training.location }}
                                </p>
                            </td>
                            <td>
                                <Menu as="div" class="ml-3 relative">
                                    <div>
                                        <MenuButton class="hover:text-primary-700">
                                            <DotsVerticalIcon class="h-7 w-7" aria-hidden="true" />
                                        </MenuButton>
                                    </div>
                                    <transition enter-active-class="transition ease-out duration-100"
                                        enter-from-class="transform opacity-0 scale-95"
                                        enter-to-class="transform opacity-100 scale-100"
                                        leave-active-class="transition ease-in duration-75"
                                        leave-from-class="transform opacity-100 scale-100"
                                        leave-to-class="transform opacity-0 scale-95" class="z-10">
                                        <MenuItems
                                            class="profile-menu-items origin-top-right absolute w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none lg:right-16 md:right-3 sm:right-5 xs:right-5">
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="viewCertificates(training)">
                                                <EyeIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                                View Certificates
                                            </a>
                                            </MenuItem>
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="edit(training)">
                                                <PencilIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                                Edit
                                            </a>
                                            </MenuItem>
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="deleteTrainingConfirmation(training)">
                                                <TrashIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                                Delete
                                            </a>
                                            </MenuItem>
                                        </MenuItems>
                                    </transition>
                                </Menu>
                            </td>
                        </tr>
                    </template>
                </Table>
            </div>
            <Pagination :data="state.trainings" @previous="previous" @next="next" />
        </div>
    </NuxtLayout>
</template>

<script setup>
import moment from 'moment'
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/vue'
import {
    EyeIcon,
    DotsVerticalIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/vue/outline'
import { useTrainingStore } from '@/store/training'
import { trainingService } from '@/components/api/TrainingService'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const trainingStore = useTrainingStore()
let currentTablePage = trainingStore.getCurrentTrainingsPage

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    columnFilter: [
        { column: 'title' },
        { column: 'location' },
    ],
    columnHeaders: [
        { name: 'Title', sorter: true, key: 'title' },
        { name: 'Description', sorter: true, key: 'description' },
        { name: 'Date From', sorter: true, key: 'date_from' },
        { name: 'Date To', sorter: true, key: 'date_to' },
        { name: 'Location', sorter: true, key: 'location' },
        { name: '' },
    ],
    error: null,
    isTableLoading: false,
    trainings: [],
    sortData: {
        sortField: null,
        sortOrder: null,
    },
})

onMounted(() => {
    fetchTrainings()
})

async function fetchTrainings() {
    state.isTableLoading = true
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
            ...state.dataFilter
        }
        const response = await trainingService.getTrainings(params)
        if (response) {
            state.trainings = response
        }
    } catch (error) {
        state.error = error
    }
    state.isTableLoading = false
}

function previous() {
    currentTablePage--
    trainingStore.setCurrentTrainingsPage(currentTablePage)
    fetchTrainings()
}

function next() {
    currentTablePage++
    trainingStore.setCurrentTrainingsPage(currentTablePage)
    fetchTrainings()
}

function sort(sortingData) {
    currentTablePage = 1
    trainingStore.setCurrentTrainingsPage(currentTablePage)
    state.sortData = {
        sortField: sortingData.column,
        sortOrder: sortingData.sort,
    }
    fetchTrainings()
}

function handleFilter(value) {
    currentTablePage = 1
    trainingStore.setCurrentTrainingsPage(currentTablePage)
    state.dataFilter = value
    fetchTrainings()
}

function formatDateToReadable(datetime) {
    return moment(datetime).format('LL')
}

function navigateToAddNewTraining() {
    navigateTo('/cms/trainings/new')
}

function edit(training) {
    trainingStore.setSelectedTraining(training)
    navigateTo('/cms/trainings/edit')
}

function viewCertificates(training) {
    trainingStore.setSelectedTraining(training)
    navigateTo('/cms/trainings/certificates')
}

function deleteTrainingConfirmation(training) {
    Swal.fire({
        title: 'Confirmation',
        text: 'Do you want to delete the selected training?',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        icon: 'warning',
        confirmButtonColor: '#095C37',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteTraining(training)
        }
    })
}

async function deleteTraining(training) {
    state.isTableLoading = true
    try {
        const selectedTrainingId = training.id
        await trainingService.deleteTraining(selectedTrainingId)
        fetchTrainings()
        successAlert('Success!', t('deleteTraining'))
    } catch (error) {
        state.error = error
    }
    state.isTableLoading = false
}

function successAlert(title, message) {
    Swal.fire({
        icon: 'success',
        title: title,
        text: message,
        confirmButtonColor: '#095C37',
    })
}
</script>
<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Trainees | {{ runtimeConfig.appName }}</Title>
        </Head>

        <template #header>Trainees</template>
        <FormButton class="px-0 hover:text-primary-700" @click="backToCertificatesPage()">
            <template #icon-left>
                <ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
            </template>
            Back
        </FormButton>
        <div class="flex justify-end">
            <FormButton type="button" buttonStyle="primary" class="rounded-md" @click="navigateToAddNewTrainee()">
                Add New Trainee
            </FormButton>
        </div>
        <div class="mt-5">
            <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
            <TableSearch :columnFilter="state.columnFilter" :dataFilter="state.dataFilter"
                @handleFilter="handleFilter" />
            <div class="table-responsive">
                <Table :columnHeaders="state.columnHeaders" :data="state.trainees" :isLoading="state.isTableLoading"
                    :sortData="state.sortData" @sort="sort">
                    <template #body
                        v-if="!(state.isTableLoading || (state.trainees.data && state.trainees.data.length === 0))">
                        <tr v-for="(trainee, index) in state.trainees.data" :key="index">
                            <td>
                                <p>
                                    {{ trainee.name }}
                                </p>
                            </td>
                            <td>
                                <p>
                                    {{ trainee.certificate_no }}
                                </p>
                            </td>
                            <td class="text-center">
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
                                            class="profile-menu-items origin-top-right absolute w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none lg:right-36 md:right-3 sm:right-5 xs:right-5">
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="edit(trainee)">
                                                <PencilIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                                Edit
                                            </a>
                                            </MenuItem>
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="deleteTraineeConfirmation(trainee)">
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
            <Pagination :data="state.trainees" @previous="previous" @next="next" />
        </div>
    </NuxtLayout>
</template>

<script setup>
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/vue'
import {
    ArrowLeftIcon,
    DotsVerticalIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/vue/outline'
import { useCertificateStore } from '@/store/certificate'
import { useTraineeStore } from '@/store/trainee'
import { traineeService } from '@/components/api/TraineeService'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const certificateStore = useCertificateStore()
const selectedCertificate = certificateStore.getSelectedCertificate
const selectedCertificateId = selectedCertificate.id
const traineeStore = useTraineeStore()
let currentTablePage = traineeStore.getCurrentTraineesPage

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    columnFilter: [
        { column: 'name' },
        { column: 'certificate_no' },
    ],
    columnHeaders: [
        { name: 'Name', sorter: true, key: 'name' },
        { name: 'Certificate No', sorter: true, key: 'certificate_no' },
        { name: '' },
    ],
    error: null,
    isTableLoading: false,
    trainees: [],
    sortData: {
        sortField: null,
        sortOrder: null,
    },
})

onMounted(() => {
    fetchTrainees()
})

async function fetchTrainees() {
    state.isTableLoading = true
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
            ...state.dataFilter,
            certificate_id: selectedCertificateId
        }
        const response = await traineeService.getTrainees(params)
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
    traineeStore.setCurrentTraineesPage(currentTablePage)
    fetchTrainees()
}

function next() {
    currentTablePage++
    traineeStore.setCurrentTraineesPage(currentTablePage)
    fetchTrainees()
}

function sort(sortingData) {
    currentTablePage = 1
    traineeStore.setCurrentTraineesPage(currentTablePage)
    state.sortData = {
        sortField: sortingData.column,
        sortOrder: sortingData.sort,
    }
    fetchTrainees()
}

function handleFilter(value) {
    currentTablePage = 1
    traineeStore.setCurrentTraineesPage(currentTablePage)
    state.dataFilter = value
    fetchTrainees()
}

function backToCertificatesPage() {
    navigateTo('/cms/trainings/certificates')
}

function navigateToAddNewTrainee() {
    navigateTo('/cms/trainings/certificates/trainees/new')
}

function edit(trainee) {
    traineeStore.setSelectedTrainee(trainee)
    navigateTo('/cms/trainings/certificates/trainees/edit')
}

function deleteTraineeConfirmation(trainee) {
    Swal.fire({
        title: 'Confirmation',
        text: 'Do you want to delete the selected trainee?',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        icon: 'warning',
        confirmButtonColor: '#095C37',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteTrainee(trainee)
        }
    })
}

async function deleteTrainee(trainee) {
    state.isTableLoading = true
    try {
        const selectedTraineeId = trainee.id
        await traineeService.deleteTrainee(selectedTraineeId)
        fetchTrainees()
        successAlert('Success!', t('deleteTrainee'))
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
<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Certificates | {{ runtimeConfig.appName }}</Title>
        </Head>

        <template #header>Certificates</template>
        <FormButton class="px-0 hover:text-primary-700" @click="backToTrainingsPage()">
            <template #icon-left>
                <ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
            </template>
            Back
        </FormButton>
        <div class="flex justify-end">
            <FormButton type="button" buttonStyle="primary" class="rounded-md" @click="navigateToAddNewCertificate()">
                Add New Certificate
            </FormButton>
        </div>
        <div class="mt-5">
            <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
            <TableSearch :columnFilter="state.columnFilter" :dataFilter="state.dataFilter"
                @handleFilter="handleFilter" />
            <div class="table-responsive">
                <Table :columnHeaders="state.columnHeaders" :data="state.certificates" :isLoading="state.isTableLoading"
                    :sortData="state.sortData" @sort="sort">
                    <template #body
                        v-if="!(state.isTableLoading || (state.certificates.data && state.certificates.data.length === 0))">
                        <tr v-for="(certificate, index) in state.certificates.data" :key="index">
                            <td>
                                <p>
                                    {{ certificate.name }}
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
                                            class="profile-menu-items origin-top-right absolute w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none lg:right-64 md:right-3 sm:right-5 xs:right-5">
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="viewTrainees(certificate)">
                                                <EyeIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                                View Trainees
                                            </a>
                                            </MenuItem>
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="edit(certificate)">
                                                <PencilIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                                Edit
                                            </a>
                                            </MenuItem>
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="deleteCertificateConfirmation(certificate)">
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
            <Pagination :data="state.certificates" @previous="previous" @next="next" />
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
    EyeIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/vue/outline'
import { useCertificateStore } from '@/store/certificate'
import { useTrainingStore } from '@/store/training'
import { certificateService } from '@/components/api/CertificateService'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const certificateStore = useCertificateStore()
const trainingStore = useTrainingStore()
let currentTablePage = certificateStore.getCurrentCertificatesPage
const selectedTraining = trainingStore.getSelectedTraining
const selectedTrainingId = selectedTraining.id

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    columnFilter: [
        { column: 'name' },
    ],
    columnHeaders: [
        { name: 'Name', sorter: true, key: 'name' },
        { name: '' },
    ],
    error: null,
    isTableLoading: false,
    certificates: [],
    sortData: {
        sortField: null,
        sortOrder: null,
    },
})

onMounted(() => {
    fetchCertificates()
})

async function fetchCertificates() {
    state.isTableLoading = true
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
            ...state.dataFilter,
            training_id: selectedTrainingId
        }
        const response = await certificateService.getCertificates(params)
        if (response) {
            state.certificates = response
        }
    } catch (error) {
        state.error = error
    }
    state.isTableLoading = false
}

function previous() {
    currentTablePage--
    certificateStore.setCurrentCertificatesPage(currentTablePage)
    fetchCertificates()
}

function next() {
    currentTablePage++
    certificateStore.setCurrentCertificatesPage(currentTablePage)
    fetchCertificates()
}

function sort(sortingData) {
    currentTablePage = 1
    certificateStore.setCurrentCertificatesPage(currentTablePage)
    state.sortData = {
        sortField: sortingData.column,
        sortOrder: sortingData.sort,
    }
    fetchCertificates()
}

function handleFilter(value) {
    currentTablePage = 1
    certificateStore.setCurrentCertificatesPage(currentTablePage)
    state.dataFilter = value
    fetchCertificates()
}

function backToTrainingsPage() {
    navigateTo('/cms/trainings')
}

function navigateToAddNewCertificate() {
    navigateTo('/cms/trainings/certificates/new')
}

function edit(certificate) {
    certificateStore.setSelectedCertificate(certificate)
    navigateTo('/cms/trainings/certificates/edit')
}

function viewTrainees(certificate) {
    certificateStore.setSelectedCertificate(certificate)
    navigateTo('/cms/trainings/certificates/trainees')
}

function deleteCertificateConfirmation(certificate) {
    Swal.fire({
        title: 'Confirmation',
        text: 'Do you want to delete the selected certificate?',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        icon: 'warning',
        confirmButtonColor: '#095C37',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteCertificate(certificate)
        }
    })
}

async function deleteCertificate(certificate) {
    state.isTableLoading = true
    try {
        const selectedCertificateId = certificate.id
        await certificateService.deleteCertificate(selectedCertificateId)
        fetchCertificates()
        successAlert('Success!', t('deleteCertificate'))
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
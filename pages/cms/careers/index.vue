<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Careers | {{ runtimeConfig.appName }}</Title>
        </Head>

        <template #header>Careers</template>
        <div class="flex justify-end">
            <FormButton type="button" buttonStyle="primary" class="rounded-md" @click="navigateToAddNewCareer()">
                Add New Career
            </FormButton>
        </div>
        <div class="mt-5">
            <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
            <TableSearch :columnFilter="state.columnFilter" :dataFilter="state.dataFilter"
                @handleFilter="handleFilter" />
            <div class="table-responsive">
                <Table :columnHeaders="state.columnHeaders" :data="state.careers" :isLoading="state.isTableLoading"
                    :sortData="state.sortData" @sort="sort">
                    <template #body
                        v-if="!(state.isTableLoading || (state.careers.data && state.careers.data.length === 0))">
                        <tr v-for="(career, index) in state.careers.data" :key="index">
                            <td>
                                <p>
                                    {{ career.title }}
                                </p>
                            </td>
                            <td>
                                <p class="line-clamp-2">
                                    {{ career.content }}
                                </p>
                            </td>
                            <td>
                                <p>
                                    {{ formatDateToReadable(career.published_date) }}
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
                                            class="profile-menu-items origin-top-right absolute w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none lg:right-16 md:right-3 sm:right-5 xs:right-5">
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="edit(career)">
                                                <PencilIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                                Edit
                                            </a>
                                            </MenuItem>
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="deleteCareerConfirmation(career)">
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
            <Pagination :data="state.careers" @previous="previous" @next="next" />
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
    DotsVerticalIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/vue/outline'
import { useCareerStore } from '@/store/career'
import { careerService } from '@/components/api/CareerService'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const careerStore = useCareerStore()
let currentTablePage = careerStore.getCurrentCareersPage

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    columnFilter: [
        { column: 'title' },
    ],
    columnHeaders: [
        { name: 'Title', sorter: true, key: 'title' },
        { name: 'Description', sorter: true, key: 'Content' },
        { name: 'Published Date', sorter: true, key: 'published_date' },
        { name: '' },
    ],
    error: null,
    isTableLoading: false,
    careers: [],
    sortData: {
        sortField: null,
        sortOrder: null,
    },
})

onMounted(() => {
    fetchCareers()
})

async function fetchCareers() {
    state.isTableLoading = true
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
            ...state.dataFilter
        }
        const response = await careerService.getCareers(params)
        if (response) {
            state.careers = response
        }
    } catch (error) {
        state.error = error
    }
    state.isTableLoading = false
}

function previous() {
    currentTablePage--
    careerStore.setCurrentCareersPage(currentTablePage)
    fetchCareers()
}

function next() {
    currentTablePage++
    careerStore.setCurrentCareersPage(currentTablePage)
    fetchCareers()
}

function sort(sortingData) {
    currentTablePage = 1
    careerStore.setCurrentCareersPage(currentTablePage)
    state.sortData = {
        sortField: sortingData.column,
        sortOrder: sortingData.sort,
    }
    fetchCareers()
}

function handleFilter(value) {
    currentTablePage = 1
    careerStore.setCurrentCareersPage(currentTablePage)
    state.dataFilter = value
    fetchCareers()
}

function formatDateToReadable(datetime) {
    return moment(datetime).format('LL')
}

function navigateToAddNewCareer() {
    navigateTo('/cms/careers/new')
}

function edit(career) {
    careerStore.setSelectedCareer(career)
    navigateTo('/cms/careers/edit')
}

function deleteCareerConfirmation(career) {
    Swal.fire({
        title: 'Confirmation',
        text: 'Do you want to delete the selected career?',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        icon: 'warning',
        confirmButtonColor: '#095C37',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteCareer(career)
        }
    })
}

async function deleteCareer(career) {
    state.isTableLoading = true
    try {
        const selectedCareerId = career.id
        await careerService.deleteCareer(selectedCareerId)
        fetchCareers()
        successAlert('Success!', t('deleteCareer'))
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
<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Services | {{ runtimeConfig.appName }}</Title>
        </Head>

        <template #header>Services</template>
        <div>
            <div class="flex justify-end items-center mb-5">
                <FormButton buttonStyle="primary" class="rounded-lg" @click="navigateToAddNewService()">
                    Add New Service
                    <template #icon-left>
                        <PlusIcon class="h-4 w-4" aria-hidden="true" />
                    </template>
                </FormButton>
            </div>
            <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
            <TableSearch :columnFilter="state.columnFilter" :dataFilter="state.dataFilter"
                @handleFilter="handleFilter" />
            <div class="table-responsive">
                <Table :columnHeaders="state.columnHeaders" :data="state.services" :isLoading="state.isTableLoading"
                    :sortData="state.sortData" @sort="sort">
                    <template #body
                        v-if="!(state.isTableLoading || (state.services.data && state.services.data.length === 0))">
                        <tr v-for="(service, index) in state.services.data" :key="index">
                            <td>
                                <div class="flex items-center gap-2">
                                    <div>
                                        <img :src="service.icon_url" alt="Image failed to load." class="w-11"
                                            v-if="service.icon_url" />
                                        <img :src="`https://ui-avatars.com/api/?name=${service.title}&size=50&background=095C37&color=FFFFFF&rounded=true&font-size=0.30`"
                                            alt="Image failed to load." v-else>
                                    </div>
                                    <p>
                                        {{ service.title }}
                                    </p>
                                </div>
                            </td>
                            <td>
                                <p class="line-clamp-2" v-html="service.content"></p>
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
                                            class="profile-menu-items origin-top-right absolute w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none lg:right-28 md:right-3 sm:right-5 xs:right-5">
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="edit(service)">
                                                <PencilIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                                Edit
                                            </a>
                                            </MenuItem>
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="deleteServiceConfirmation(service)">
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
            <Pagination :data="state.services" @previous="previous" @next="next" />
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
    DotsVerticalIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/vue/outline'
import { useServiceStore } from '@/store/service'
import { serviceService } from '@/components/api/ServiceService'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const serviceStore = useServiceStore()
let currentTablePage = serviceStore.getCurrentServicesPage

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    columnFilter: [
        { column: 'title' },
    ],
    columnHeaders: [
        { name: 'Title', sorter: true, key: 'title' },
        { name: 'Content' },
        { name: '' },
    ],
    error: null,
    isTableLoading: false,
    services: [],
    sortData: {
        sortField: null,
        sortOrder: null,
    },
})

function navigateToAddNewService() {
    navigateTo('/cms/services/new')
}
onMounted(() => {
    fetchServices()
})

async function fetchServices() {
    state.isTableLoading = true
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
            ...state.dataFilter
        }
        const response = await serviceService.getServices(params)
        if (response) {
            state.services = response
        }
    } catch (error) {
        state.error = error
    }
    state.isTableLoading = false
}

function previous() {
    currentTablePage--
    serviceStore.setCurrentServicesPage(currentTablePage)
    fetchServices()
}

function next() {
    currentTablePage++
    serviceStore.setCurrentServicesPage(currentTablePage)
    fetchServices()
}

function sort(sortingData) {
    currentTablePage = 1
    serviceStore.setCurrentServicesPage(currentTablePage)
    state.sortData = {
        sortField: sortingData.column,
        sortOrder: sortingData.sort,
    }
    fetchServices()
}

function handleFilter(value) {
    currentTablePage = 1
    serviceStore.setCurrentServicesPage(currentTablePage)
    state.dataFilter = value
    fetchServices()
}

function edit(service) {
    serviceStore.setSelectedService(service)
    navigateTo('/cms/services/edit')
}

function deleteServiceConfirmation(service) {
    Swal.fire({
        title: 'Confirmation',
        text: 'Do you want to delete the selected service?',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        icon: 'warning',
        confirmButtonColor: '#095C37',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteService(service)
        }
    })
}

async function deleteService(service) {
    state.isTableLoading = true
    try {
        const selectedServiceId = service.id
        await serviceService.deleteService(selectedServiceId)
        fetchServices()
        successAlert('Success!', t('deleteService'))
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
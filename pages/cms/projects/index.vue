<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Projects | {{ runtimeConfig.appName }}</Title>
        </Head>

        <template #header>Projects</template>
        <div class="flex justify-end">
            <FormButton type="button" buttonStyle="primary" class="rounded-md" @click="navigateToAddNewProject()">
                Add New Project
            </FormButton>
        </div>
        <div class="mt-5">
            <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
            <TableSearch :columnFilter="state.columnFilter" :dataFilter="state.dataFilter"
                @handleFilter="handleFilter" />
            <div class="table-responsive">
                <Table :columnHeaders="state.columnHeaders" :data="state.projects" :isLoading="state.isTableLoading"
                    :sortData="state.sortData" @sort="sort">
                    <template #body
                        v-if="!(state.isTableLoading || (state.projects.data && state.projects.data.length === 0))">
                        <tr v-for="(project, index) in state.projects.data" :key="index">
                            <td>
                                <div>
                                    <img :src="project.thumbnail_url" alt="Image failed to load." class="w-28">
                                </div>
                            </td>
                            <td>
                                <p>
                                    {{ project.title }}
                                </p>
                            </td>
                            <td>
                                <p class="line-clamp-2">
                                    {{ project.description }}
                                </p>
                            </td>
                            <td>
                                <p class="line-clamp-2">
                                    {{ project.location }}
                                </p>
                            </td>
                            <td>
                                <p>
                                    {{ formatDateTimeToReadable(project.published_date) }}
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
                                                @click="edit(project)">
                                                <PencilIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                                Edit
                                            </a>
                                            </MenuItem>
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="deleteProjectConfirmation(project)">
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
            <Pagination :data="state.projects" @previous="previous" @next="next" />
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
import { useProjectStore } from '@/store/project'
import { projectService } from '@/components/api/ProjectService'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const projectStore = useProjectStore()
let currentTablePage = projectStore.getCurrentProjectsPage

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    columnFilter: [
        { column: 'title' },
        { column: 'location' },
    ],
    columnHeaders: [
        { name: 'Thumbnail' },
        { name: 'Title', sorter: true, key: 'title' },
        { name: 'Description', sorter: true, key: 'description' },
        { name: 'Location', sorter: true, key: 'location' },
        { name: 'Published Date', sorter: true, key: 'published_date' },
        { name: '' },
    ],
    error: null,
    isTableLoading: false,
    projects: [],
    sortData: {
        sortField: null,
        sortOrder: null,
    },
})

onMounted(() => {
    fetchProjects()
})

async function fetchProjects() {
    state.isTableLoading = true
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
            ...state.dataFilter
        }
        const response = await projectService.getProjects(params)
        if (response) {
            state.projects = response
        }
    } catch (error) {
        state.error = error
    }
    state.isTableLoading = false
}

function previous() {
    currentTablePage--
    projectStore.setCurrentProjectsPage(currentTablePage)
    fetchProjects()
}

function next() {
    currentTablePage++
    projectStore.setCurrentProjectsPage(currentTablePage)
    fetchProjects()
}

function sort(sortingData) {
    currentTablePage = 1
    projectStore.setCurrentProjectsPage(currentTablePage)
    state.sortData = {
        sortField: sortingData.column,
        sortOrder: sortingData.sort,
    }
    fetchProjects()
}

function handleFilter(value) {
    currentTablePage = 1
    projectStore.setCurrentProjectsPage(currentTablePage)
    state.dataFilter = value
    fetchProjects()
}

function formatDateTimeToReadable(datetime) {
    return moment(datetime).format('LLL')
}

function navigateToAddNewProject() {
    navigateTo('/cms/projects/new')
}

function edit(project) {
    projectStore.setSelectedProject(project)
    navigateTo('/cms/projects/edit')
}

function deleteProjectConfirmation(project) {
    Swal.fire({
        title: 'Confirmation',
        text: 'Do you want to delete the selected project?',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        icon: 'warning',
        confirmButtonColor: '#095C37',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteProject(project)
        }
    })
}

async function deleteProject(project) {
    state.isTableLoading = true
    try {
        const selectedProjectId = project.id
        await projectService.deleteProject(selectedProjectId)
        fetchProjects()
        successAlert('Success!', t('deleteProject'))
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
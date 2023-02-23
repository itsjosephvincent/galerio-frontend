<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Users | {{ runtimeConfig.appName }}</Title>
        </Head>

        <template #header>Users</template>
        <div class="flex justify-end">
            <FormButton type="button" buttonStyle="primary" class="rounded-md" @click="navigateToAddNewUser()">
                Add New User
            </FormButton>
        </div>
        <div class="mt-5">
            <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
            <TableSearch :columnFilter="state.columnFilter" :dataFilter="state.dataFilter"
                @handleFilter="handleFilter" />
            <div class="table-responsive">
                <Table :columnHeaders="state.columnHeaders" :data="state.users" :isLoading="state.isTableLoading"
                    :sortData="state.sortData" @sort="sort">
                    <template #body
                        v-if="!(state.isTableLoading || (state.users.data && state.users.data.length === 0))">
                        <tr v-for="(user, index) in state.users.data" :key="index">
                            <td>
                                <div class="flex items-center gap-2">
                                    <div>
                                        <img :src="user.img_url" alt="Image failed to load." class="w-11"
                                            v-if="user.img_url" />
                                        <img :src="`https://ui-avatars.com/api/?name=${user.first_name + ' ' + user.last_name}&size=50&background=095C37&color=FFFFFF&rounded=true&font-size=0.30`"
                                            alt="Image failed to load." v-else>
                                    </div>
                                    <p>
                                        {{ user.first_name + ' ' + user.last_name }}
                                    </p>
                                </div>
                            </td>
                            <td>
                                <p>
                                    {{ user.email }}
                                </p>
                            </td>
                            <td>
                                <p>
                                    {{ user.is_active ? 'Active' : 'Inactive' }}
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
                                                @click="edit(user)">
                                                <PencilIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                                Edit
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
            <Pagination :data="state.users" @previous="previous" @next="next" />
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
    PencilIcon,
} from '@heroicons/vue/outline'
import { useUserStore } from '@/store/user'
import { userService } from '@/components/api/UserService'

definePageMeta({
    middleware: ["authenticated"]
})

const userStore = useUserStore()
let currentTablePage = userStore.getCurrentUsersPage

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    columnFilter: [
        { column: 'name' },
        { column: 'email' },
    ],
    columnHeaders: [
        { name: 'Name', sorter: true, key: 'name' },
        { name: 'Email', sorter: true, key: 'email' },
        { name: 'Status', sorter: true, key: 'is_active' },
        { name: '' },
    ],
    error: null,
    isTableLoading: false,
    users: [],
    sortData: {
        sortField: null,
        sortOrder: null,
    },
})

onMounted(() => {
    fetchUsers()
})

async function fetchUsers() {
    state.isTableLoading = true
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
            ...state.dataFilter
        }
        const response = await userService.getUsers(params)
        if (response) {
            state.users = response
        }
    } catch (error) {
        state.error = error
    }
    state.isTableLoading = false
}

function previous() {
    currentTablePage--
    userStore.setCurrentUsersPage(currentTablePage)
    fetchUsers()
}

function next() {
    currentTablePage++
    userStore.setCurrentUsersPage(currentTablePage)
    fetchUsers()
}

function sort(sortingData) {
    currentTablePage = 1
    userStore.setCurrentUsersPage(currentTablePage)
    state.sortData = {
        sortField: sortingData.column,
        sortOrder: sortingData.sort,
    }
    fetchUsers()
}

function handleFilter(value) {
    currentTablePage = 1
    userStore.setCurrentUsersPage(currentTablePage)
    state.dataFilter = value
    fetchUsers()
}

function navigateToAddNewUser() {
    navigateTo('/cms/users/new')
}

function edit(user) {
    userStore.setSelectedUser(user)
    navigateTo('/cms/users/edit')
}
</script>
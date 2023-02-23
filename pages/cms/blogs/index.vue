<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Blogs | {{ runtimeConfig.appName }}</Title>
        </Head>

        <template #header>Blogs</template>
        <div class="flex justify-end">
            <FormButton type="button" buttonStyle="primary" class="rounded-md" @click="navigateToAddNewBlog()">
                Add New Blog
            </FormButton>
        </div>
        <div class="mt-5">
            <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
            <TableSearch :columnFilter="state.columnFilter" :dataFilter="state.dataFilter"
                @handleFilter="handleFilter" />
            <div class="table-responsive">
                <Table :columnHeaders="state.columnHeaders" :data="state.blogs" :isLoading="state.isTableLoading"
                    :sortData="state.sortData" @sort="sort">
                    <template #body
                        v-if="!(state.isTableLoading || (state.blogs.data && state.blogs.data.length === 0))">
                        <tr v-for="(blog, index) in state.blogs.data" :key="index">
                            <td>
                                <div class="flex items-center gap-2">
                                    <div>
                                        <img :src="blog.thumbnail_url" alt="Image failed to load." class="w-11"
                                            v-if="blog.thumbnail_url" />
                                        <img :src="`https://ui-avatars.com/api/?name=${blog.title}&size=50&background=095C37&color=FFFFFF&rounded=true&font-size=0.30`"
                                            alt="Image failed to load." v-else>
                                    </div>
                                    <p>
                                        {{ blog.title }}
                                    </p>
                                </div>
                            </td>
                            <td>
                                <p class="line-clamp-2" v-html="blog.description"></p>
                            </td>
                            <td>
                                <p>
                                    {{ formatDateTimeToReadable(blog.published_date) }}
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
                                            class="profile-menu-items origin-top-right absolute w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none lg:right-20 md:right-3 sm:right-5 xs:right-5">
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="edit(blog)">
                                                <PencilIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                                Edit
                                            </a>
                                            </MenuItem>
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="deleteBlogConfirmation(blog)">
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
            <Pagination :data="state.blogs" @previous="previous" @next="next" />
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
import { useBlogStore } from '@/store/blog'
import { blogService } from '@/components/api/BlogService'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const blogStore = useBlogStore()
let currentTablePage = blogStore.getCurrentBlogsPage

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    columnFilter: [
        { column: 'title' },
    ],
    columnHeaders: [
        { name: 'Title', sorter: true, key: 'title' },
        { name: 'Description' },
        { name: 'Published Date', sorter: true, key: 'published_date' },
        { name: '' },
    ],
    error: null,
    isTableLoading: false,
    blogs: [],
    sortData: {
        sortField: null,
        sortOrder: null,
    },
})

onMounted(() => {
    fetchBlogs()
})

async function fetchBlogs() {
    state.isTableLoading = true
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
            ...state.dataFilter
        }
        const response = await blogService.getBlogs(params)
        if (response) {
            state.blogs = response
        }
    } catch (error) {
        state.error = error
    }
    state.isTableLoading = false
}

function previous() {
    currentTablePage--
    blogStore.setCurrentBlogsPage(currentTablePage)
    fetchBlogs()
}

function next() {
    currentTablePage++
    blogStore.setCurrentBlogsPage(currentTablePage)
    fetchBlogs()
}

function sort(sortingData) {
    currentTablePage = 1
    blogStore.setCurrentBlogsPage(currentTablePage)
    state.sortData = {
        sortField: sortingData.column,
        sortOrder: sortingData.sort,
    }
    fetchBlogs()
}

function handleFilter(value) {
    currentTablePage = 1
    blogStore.setCurrentBlogsPage(currentTablePage)
    state.dataFilter = value
    fetchBlogs()
}

function formatDateTimeToReadable(datetime) {
    return moment(datetime).format('LLL')
}

function navigateToAddNewBlog() {
    navigateTo('/cms/blogs/new')
}

function edit(blog) {
    blogStore.setSelectedBlog(blog)
    navigateTo('/cms/blogs/edit')
}

function deleteBlogConfirmation(blog) {
    Swal.fire({
        title: 'Confirmation',
        text: 'Do you want to delete the selected blog?',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        icon: 'warning',
        confirmButtonColor: '#095C37',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteBlog(blog)
        }
    })
}

async function deleteBlog(blog) {
    state.isTableLoading = true
    try {
        const selectedBlogId = blog.id
        await blogService.deleteBlog(selectedBlogId)
        fetchBlogs()
        successAlert('Success!', t('deleteBlog'))
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
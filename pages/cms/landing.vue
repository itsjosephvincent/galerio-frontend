<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Landing | {{ runtimeConfig.appName }}</Title>
        </Head>

        <template #header>Landing Page</template>
        <VueLoading :active="state.isPageLoading" />
        <form @submit.prevent="updateLanding()">
            <div>
                <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" class="lg:w-1/2" />
                <div class="mt-6 max-w-xl space-y-3">
                    <div class="space-y-1">
                        <FormLabel for="header_text" label="Header Text" />
                        <FormTextField name="header_text" placeholder="Header Text"
                            v-model="state.formLanding.header_text" />
                        <FormError
                            :error="v$.formLanding.header_text && v$.formLanding.header_text.$errors && v$.formLanding.header_text.$errors.length > 0 ? v$.formLanding.header_text.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.header_text && state.error.errors.header_text[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel for="video_url" label="Youtube Embeded Video URL" />
                        <FormTextField name="video_url" placeholder="Video URL (Youtube)"
                            v-model="state.formLanding.video_url" />
                        <FormError
                            :error="v$.formLanding.video_url && v$.formLanding.video_url.$errors && v$.formLanding.video_url.$errors.length > 0 ? v$.formLanding.video_url.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.video_url && state.error.errors.video_url[0]" />
                    </div>
                </div>
                <div class="mt-6 max-w-xl">
                    <FormButton type="submit" buttonStyle="primary" class="w-full rounded-md">
                        Update
                    </FormButton>
                </div>
            </div>
        </form>
        <div class="mt-10">
            <h1 class="text-xl font-medium text-gray-600">Featured Images</h1>
            <div class="flex justify-end">
                <FormButton buttonStyle="primary" @click="openAddMediaModal">
                    <template #icon-left>
                        <PlusIcon class="h-4 w-4" aria-hidden="true" />
                        Add Media
                    </template>
                </FormButton>
            </div>
            <div class="mt-5 table-responsive">
                <Table :columnHeaders="state.columnHeaders" :data="state.featured_images"
                    :isLoading="state.isTableLoading" :sortData="state.sortData" @sort="sort">
                    <template #body
                        v-if="!(state.isTableLoading || (state.featured_images.data && state.featured_images.data.length === 0))">
                        <tr v-for="(featured_image, index) in state.featured_images.data" :key="index">
                            <td>
                                <div>
                                    <img :src="featured_image.image_url" alt="Image failed to load." class="w-16">
                                </div>
                            </td>
                            <td>
                                <p>
                                    {{ featured_image.name }}
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
                                            class="profile-menu-items origin-top-right absolute w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none lg:right-72 md:right-3 sm:right-5 xs:right-5">
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="editLandingFeaturedImage(featured_image)">
                                                <PencilIcon class="h-5 w-5 mr-3" aria-hidden="true" />
                                                Edit
                                            </a>
                                            </MenuItem>
                                            <MenuItem class="mt-1">
                                            <a class="flex items-center px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-primary-700 hover:text-white"
                                                @click="deleteLandingFeaturedImageConfirmation(featured_image)">
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
            <Pagination :data="state.featured_images" @previous="previous" @next="next" />
        </div>
        <Modal size="md" title="Add New Media" :show="state.isModalAddMediaOpen"
            @close="state.isModalAddMediaOpen = false">
            <template #modal-body>
                <form class="space-y-6" method="POST" @submit.prevent="handleSaveLandingFeaturedImage">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div>
                        <div class="space-y-1">
                            <FormLabel for="name" label="Name" />
                            <FormTextField name="text" placeholder="Name" v-model="state.formAddMedia.name" />
                            <FormError
                                :error="vAdd$.formAddMedia.name && vAdd$.formAddMedia.name.$errors && vAdd$.formAddMedia.name.$errors.length > 0 ? vAdd$.formAddMedia.name.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.name && state.error.errors.name[0]" />
                        </div>
                    </div>
                    <div>
                        <div class="space-y-1">
                            <FormLabel for="file" label="Image" />
                            <div>
                                <input type="file" accept="image/*" @change="onChangeOfMediaAdd">
                                <div class="text-sm text-red-500" v-if="state.addImageError !== null">
                                    {{ state.addImageError }}
                                </div>
                            </div>
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.image_url && state.error.errors.image_url[0]" />
                        </div>
                    </div>
                    <div class="mt-5 flex gap-x-3 flex-row-reverse">
                        <FormButton buttonStyle="danger" @click="state.isModalAddMediaOpen = false" class="rounded-md">
                            Cancel
                        </FormButton>
                        <FormButton type="submit" buttonStyle="success" class="rounded-md">
                            Submit
                        </FormButton>
                    </div>
                </form>
            </template>
        </Modal>
        <Modal size="md" title="Upload New Media" :show="state.isModalEditMediaOpen"
            @close="state.isModalEditMediaOpen = false">
            <template #modal-body>
                <form class="space-y-6" method="POST" @submit.prevent="handleUpdateMedia">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div>
                        <div class="space-y-1">
                            <FormLabel for="name" label="Name" />
                            <FormTextField name="text" placeholder="Name" v-model="state.formEditMedia.name" />
                            <FormError
                                :error="vEdit$.formEditMedia.name && vEdit$.formEditMedia.name.$errors && vEdit$.formEditMedia.name.$errors.length > 0 ? vEdit$.formEditMedia.name.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.name && state.error.errors.name[0]" />
                        </div>
                    </div>
                    <div>
                        <div class="space-y-1">
                            <FormLabel for="file" label="Image" />
                            <div>
                                <input type="file" accept="image/*" @change="onChangeOfMediaUpdate">
                            </div>
                        </div>
                    </div>
                    <div class="mt-5 flex gap-x-3 flex-row-reverse">
                        <FormButton buttonStyle="danger" @click="state.isModalEditMediaOpen = false" class="rounded-md">
                            Cancel
                        </FormButton>
                        <FormButton type="submit" buttonStyle="success" class="rounded-md">
                            Update
                        </FormButton>
                    </div>
                </form>
            </template>
        </Modal>
    </NuxtLayout>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import {
    DotsVerticalIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon
} from '@heroicons/vue/outline'
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/vue'
import { useVuelidate } from "@vuelidate/core"
import { useI18n } from 'vue-i18n'
import { required, helpers } from '@vuelidate/validators'
import { useLandingStore } from '@/store/landing'
import { landingService } from '@/components/api/LandingService'
import { landingFeaturedImagesService } from '@/components/api/LandingFeaturedImagesService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const landingStore = useLandingStore()
let currentTablePage = landingStore.getCurrentFeaturedImagesPage

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    addImageError: null,
    columnHeaders: [
        { name: 'Image' },
        { name: 'Name', sorter: true, key: 'name' },
        { name: '' },
    ],
    error: null,
    featured_images: [],
    formAddMedia: {
        name: '',
        is_featured: false,
        image: null,
    },
    formEditMedia: {
        name: '',
        is_featured: false,
        image: null,
    },
    formLanding: {
        header_text: null,
        video_url: null,
    },
    isModalAddMediaOpen: false,
    isModalEditMediaOpen: false,
    isPageLoading: false,
    isTableLoading: false,
    sortData: {
        sortField: null,
        sortOrder: null,
    },
})

const rules = computed(() => {
    return {
        formLanding: {
            header_text: {
                required: helpers.withMessage('This field is required.', required),
            },
            video_url: {
                required: helpers.withMessage('This field is required.', required),
            },
        }
    }
})
const v$ = useVuelidate(rules, state)

const rulesAddMedia = computed(() => {
    return {
        formAddMedia: {
            name: {
                required: helpers.withMessage('This field is required.', required),
            },
        },
    }
})
const vAdd$ = useVuelidate(rulesAddMedia, state)

const rulesEditMedia = computed(() => {
    return {
        formEditMedia: {
            name: {
                required: helpers.withMessage('This field is required.', required),
            },
        }
    }
})
const vEdit$ = useVuelidate(rulesEditMedia, state)

onMounted(() => {
    fetchLanding()
    fetchLandingFeaturedImages()
})

async function fetchLanding() {
    state.isPageLoading = true
    try {
        const response = await landingService.getLanding()
        if (response.data) {
            state.formLanding = {
                header_text: response.data[0].header_text,
                video_url: response.data[0].video_url,
            }
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function fetchLandingFeaturedImages() {
    state.isTableLoading = true
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
            ...state.dataFilter
        }
        const response = await landingFeaturedImagesService.getLandingFeaturedImages(params)
        if (response) {
            state.featured_images = response
        }
    } catch (error) {
        state.error = error
    }
    state.isTableLoading = false
}

async function updateLanding() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                header_text: state.formLanding.header_text,
                video_url: state.formLanding.video_url,
            }
            const response = await landingService.updateLanding(1, params)
            if (response.data) {
                successAlert('Success!', t('updateLandingData'))
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function sort(sortingData) {
    currentTablePage = 1
    landingStore.setCurrentFeaturedImagesPage(currentTablePage)
    state.sortData = {
        sortField: sortingData.column,
        sortOrder: sortingData.sort,
    }
    fetchLandingFeaturedImages()
}

function previous() {
    currentTablePage--
    landingStore.setCurrentFeaturedImagesPage(currentTablePage)
    fetchLandingFeaturedImages()
}

function next() {
    currentTablePage++
    landingStore.setCurrentFeaturedImagesPage(currentTablePage)
    fetchLandingFeaturedImages()
}

function openAddMediaModal() {
    state.isModalAddMediaOpen = true
    state.error = null
}

function onChangeOfMediaAdd(event) {
    state.formAddMedia.image = event
}

async function handleSaveLandingFeaturedImage() {
    state.error = null
    state.addImageError = null
    vAdd$.value.$validate()
    if (state.formAddMedia.image === null) {
        state.addImageError = 'Please upload an image.'
    }
    else if (!vAdd$.value.$error) {
        state.isPageLoading = true
        try {
            let formData = new FormData()
            formData.append('name', state.formAddMedia.name)
            if (state.formAddMedia.image) {
                formData.append('image_url', state.formAddMedia.image.target.files[0])
            }
            const response = await landingFeaturedImagesService.saveLandingFeaturedImage(formData)
            if (response.data) {
                fetchLandingFeaturedImages()
                successAlert('Success!', t('saveLandingFeaturedImage'))
                state.isModalAddMediaOpen = false
                state.formAddMedia.name = null
                state.formAddMedia.image = null
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function editLandingFeaturedImage(featured_image) {
    landingStore.setSelectedFeaturedImage(featured_image)
    state.isModalEditMediaOpen = true
    state.error = null
    state.formEditMedia.name = landingStore.getSelectedFeaturedImage.name
}

function onChangeOfMediaUpdate(event) {
    state.formEditMedia.image = event
}

async function handleUpdateMedia() {
    state.error = null
    vEdit$.value.$validate()
    if (!vEdit$.value.$error) {
        state.isPageLoading = true
        try {
            let formData = new FormData()
            formData.append('name', state.formEditMedia.name)
            if (state.formEditMedia.image) {
                formData.append('image_url', state.formEditMedia.image.target.files[0])
            }
            const selectedMediaId = landingStore.getSelectedFeaturedImage.id
            const response = await landingFeaturedImagesService.updateLandingFeaturedImage(selectedMediaId, formData)
            if (response.data) {
                fetchLandingFeaturedImages()
                successAlert('Success!', t('updateLandingFeaturedImage'))
                state.isModalEditMediaOpen = false
                state.formEditMedia.name = null
                state.formEditMedia.image = null
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function deleteLandingFeaturedImageConfirmation(featured_image) {
    landingStore.setSelectedFeaturedImage(featured_image)
    Swal.fire({
        title: 'Confirmation',
        text: 'Do you want to delete the selected featured image?',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        icon: 'warning',
        confirmButtonColor: '#095C37',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteLandingFeaturedImage(featured_image)
        }
    })
}

async function deleteLandingFeaturedImage(featured_image) {
    state.isPageLoading = true
    try {
        const selectedMediaId = landingStore.getSelectedFeaturedImage.id
        await landingFeaturedImagesService.deleteLandingFeaturedImage(selectedMediaId)
        fetchLandingFeaturedImages()
        successAlert('Success!', t('deleteLandingFeaturedImage'))
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
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
<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Edit Project | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <div>
            <FormButton class="px-0 hover:text-primary-700" @click="backToProjectsPage()">
                <template #icon-left>
                    <ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
                </template>
                Back
            </FormButton>
            <div class="py-4">
                <h3 class="text-2xl text-gray-500">Edit Project</h3>
            </div>
            <div class="mt-6 space-y-4">
                <div>
                    {{}}
                    <div v-if="state.formProject.thumbnail_url !== null">
                        <img :src="state.formProject.thumbnail_url" alt="Image failed to load" class="w-36">
                    </div>
                    <div v-else>
                        <img :src="`https://ui-avatars.com/api/?name=${state.formProject.title}&size=100&background=087443&color=FFFFFF&rounded=true&font-size=0.30`"
                            alt="Image failed to load.">
                    </div>
                </div>

                <input type="file" accept="image/*" ref="templateImage" class="hidden"
                    @change="changeProjectThumbailImage">
                <FormButton type="button" buttonStyle="primary" class="rounded-lg" @click="$refs.templateImage.click()">
                    Change Thumbnail
                </FormButton>
            </div>
            <form @submit.prevent="updateProject()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
                        <div class="space-y-1">
                            <FormLabel for="title" label="Title" />
                            <FormTextField name="title" placeholder="Title" v-model="state.formProject.title" />
                            <FormError
                                :error="v$.formProject.title && v$.formProject.title.$errors && v$.formProject.title.$errors.length > 0 ? v$.formProject.title.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.title && state.error.errors.title[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="description" label="Description" />
                            <FormTextArea name="description" placeholder="Description"
                                v-model="state.formProject.description" />
                            <FormError
                                :error="v$.formProject.description && v$.formProject.description.$errors && v$.formProject.description.$errors.length > 0 ? v$.formProject.description.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.description && state.error.errors.description[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="location" label="Location" />
                            <FormTextField name="location" placeholder="Location"
                                v-model="state.formProject.location" />
                            <FormError
                                :error="v$.formProject.location && v$.formProject.location.$errors && v$.formProject.location.$errors.length > 0 ? v$.formProject.location.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.location && state.error.errors.location[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="published_date" label="Published Date" />
                            <FormDateField name="published_date" placeholder="Published Date"
                                v-model="state.formProject.published_date" />
                            <FormError
                                :error="v$.formProject.published_date && v$.formProject.published_date.$errors && v$.formProject.published_date.$errors.length > 0 ? v$.formProject.published_date.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.published_date && state.error.errors.published_date[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="completed_date" label="Completed Date" />
                            <FormDateField name="completed_date" placeholder="Completed Date"
                                v-model="state.formProject.completed_date" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.completed_date && state.error.errors.completed_date[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="content" label="Content" />
                            <FormEditor name="content" height="50vh" v-model="state.formProject.content"
                                v-if="componentKey > 0" />
                            <FormError
                                :error="v$.formProject.content && v$.formProject.content.$errors && v$.formProject.content.$errors.length > 0 ? v$.formProject.content.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.content && state.error.errors.content[0]" />
                        </div>
                    </div>
                </div>
                <div class="mt-6">
                    <FormButton type="submit" buttonStyle="primary" class="rounded-md">
                        Update
                    </FormButton>
                </div>
            </form>
        </div>
    </NuxtLayout>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { ArrowLeftIcon } from '@heroicons/vue/outline'
import { useVuelidate } from "@vuelidate/core"
import { required, helpers } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/store/project'
import { projectService } from '@/components/api/ProjectService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const projectStore = useProjectStore()
const selectedProject = projectStore.getSelectedProject
const selectedProjectId = selectedProject.id
const componentKey = ref(0)

const forceRerender = () => {
    componentKey.value += 1
}

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    error: null,
    formProject: {
        thumbnail_url: null,
        title: null,
        description: null,
        location: null,
        published_date: null,
        content: null,
        completed_date: null,
    },
    thumbnail: null,
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formProject: {
            title: {
                title: helpers.withMessage('This field is required.', required),
            },
            description: {
                title: helpers.withMessage('This field is required.', required),
            },
            location: {
                title: helpers.withMessage('This field is required.', required),
            },
            published_date: {
                title: helpers.withMessage('This field is required.', required),
            },
            content: {
                title: helpers.withMessage('This field is required.', required),
            },
        },
    }
})

const v$ = useVuelidate(rules, state)

onMounted(() => {
    fetchProject()
})

async function fetchProject() {
    state.isPageLoading = true
    try {
        const selectedProjectId = selectedProject.id
        const response = await projectService.getProjectById(selectedProjectId)
        if (response) {
            state.formProject = {
                thumbnail_url: response.data.thumbnail_url,
                title: response.data.title,
                description: response.data.description,
                location: response.data.location,
                published_date: response.data.published_date,
                content: response.data.content,
                completed_date: response.data.completed_date
            }
            forceRerender()
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function changeProjectThumbailImage(event) {
    const image = event.target.files[0]
    state.isPageLoading = true
    try {
        let params = new FormData()
        params.append('thumbnail_url', image)
        const response = await projectService.updateProjectThumbnailImage(selectedProjectId, params)
        if (response.data) {
            successAlert('Success!', t('updateProjectThumbnailImage'))
            projectStore.setSelectedProject(response.data)
            state.formProject = response.data
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function updateProject() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                title: state.formProject.title,
                description: state.formProject.description,
                location: state.formProject.location,
                published_date: state.formProject.published_date,
                content: state.formProject.content,
                completed_date: state.formProject.completed_date
            }
            const response = await projectService.updateProject(selectedProjectId, params)
            if (response.data) {
                successAlert('Success!', t('updateProjectData'))
                projectStore.setSelectedProject(response.data)
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function backToProjectsPage() {
    navigateTo('/cms/projects')
}

function successAlert(title, message) {
    Swal.fire({
        icon: 'success',
        title: title,
        text: message,
        confirmButtonColor: '#087443',
    })
}
</script>
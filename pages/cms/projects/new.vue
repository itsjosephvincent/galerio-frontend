<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - New Project | {{ runtimeConfig.appName }}</Title>
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
                <h3 class="text-2xl text-gray-500">New Project</h3>
            </div>
            <form @submit.prevent="saveProject()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
                        <div class="space-y-1">
                            <FormLabel for="thumbnail_url" label="Thumbnail Image" />
                            <div>
                                <input type="file" accept="image/*" @change="changeThumbnailImage" />
                            </div>
                            <FormError
                                :error="v$.formProject.thumbnail_url && v$.formProject.thumbnail_url.$errors && v$.formProject.thumbnail_url.$errors.length > 0 ? v$.formProject.thumbnail_url.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.thumbnail_url && state.error.errors.thumbnail_url[0]" />
                        </div>
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
                        Save
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
import { landingService } from '@/components/api/LandingService'
import { projectService } from '@/components/api/ProjectService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
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
    },
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formProject: {
            thumbnail_url: {
                title: helpers.withMessage('This field is required.', required),
            },
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
    fetchLandingForTriggeringOfComponent()
})

async function fetchLandingForTriggeringOfComponent() {
    state.isPageLoading = true
    try {
        const response = await landingService.getLanding()
        if (response.data) {
            forceRerender()
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

function changeThumbnailImage(event) {
    const image = event.target.files[0]
    state.formProject.thumbnail_url = image
}

async function saveProject() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            let params = new FormData()
            params.append('thumbnail_url', state.formProject.thumbnail_url)
            params.append('title', state.formProject.title)
            params.append('description', state.formProject.description)
            params.append('location', state.formProject.location)
            params.append('published_date', state.formProject.published_date)
            params.append('content', state.formProject.content)
            const response = await projectService.saveProject(params)
            if (response.data) {
                successAlert('Success!', t('saveProjectData'))
                backToProjectsPage()
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
        confirmButtonColor: '#095C37',
    })
}
</script>
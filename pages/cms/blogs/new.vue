<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - New Blog | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <div>
            <FormButton class="px-0 hover:text-primary-700" @click="backToBlogsPage()">
                <template #icon-left>
                    <ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
                </template>
                Back
            </FormButton>
            <div class="py-4">
                <h3 class="text-2xl text-gray-500">New Blog</h3>
            </div>
            <form @submit.prevent="saveBlog()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
                        <div class="space-y-1">
                            <FormLabel for="thumbnail_url" label="Thumbnail Image" />
                            <div>
                                <input type="file" accept="image/*" @change="changeThumbnailImage" />
                            </div>
                            <FormError
                                :error="v$.formBlog.thumbnail_url && v$.formBlog.thumbnail_url.$errors && v$.formBlog.thumbnail_url.$errors.length > 0 ? v$.formBlog.thumbnail_url.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.thumbnail_url && state.error.errors.thumbnail_url[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="title" label="Title" />
                            <FormTextField name="title" placeholder="Title" v-model="state.formBlog.title" />
                            <FormError
                                :error="v$.formBlog.title && v$.formBlog.title.$errors && v$.formBlog.title.$errors.length > 0 ? v$.formBlog.title.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.title && state.error.errors.title[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="description" label="Description" />
                            <FormTextField name="description" placeholder="Description"
                                v-model="state.formBlog.description" />
                            <FormError
                                :error="v$.formBlog.description && v$.formBlog.description.$errors && v$.formBlog.description.$errors.length > 0 ? v$.formBlog.description.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.description && state.error.errors.description[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="content" label="Content" />
                            <FormEditor name="content" height="50vh" v-model="state.formBlog.content"
                                v-if="componentKey > 0" />
                            <FormError
                                :error="v$.formBlog.content && v$.formBlog.content.$errors && v$.formBlog.content.$errors.length > 0 ? v$.formBlog.content.$errors[0].$message : null" />
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
import { blogService } from '@/components/api/BlogService'
import { landingService } from '@/components/api/LandingService'
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
    formBlog: {
        thumbnail_url: null,
        title: null,
        description: null,
        content: null,
    },
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formBlog: {
            thumbnail_url: {
                title: helpers.withMessage('This field is required.', required),
            },
            title: {
                title: helpers.withMessage('This field is required.', required),
            },
            description: {
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
    state.formBlog.thumbnail_url = image
}

async function saveBlog() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            let params = new FormData()
            params.append('thumbnail_url', state.formBlog.thumbnail_url)
            params.append('title', state.formBlog.title)
            params.append('description', state.formBlog.description)
            params.append('content', state.formBlog.content)
            const response = await blogService.saveBlog(params)
            if (response.data) {
                successAlert('Success!', t('saveBlogData'))
                backToBlogsPage()
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function backToBlogsPage() {
    navigateTo('/cms/blogs')
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
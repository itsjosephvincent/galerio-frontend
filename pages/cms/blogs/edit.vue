<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Edit Blog | {{ runtimeConfig.appName }}</Title>
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
                <h3 class="text-2xl text-gray-500">Edit Blog</h3>
            </div>
            <div class="mt-6 space-y-4">
                <div>
                    {{}}
                    <div v-if="state.formBlog.thumbnail_url !== null">
                        <img :src="state.formBlog.thumbnail_url" alt="Image failed to load" class="w-36">
                    </div>
                    <div v-else>
                        <img :src="`https://ui-avatars.com/api/?name=${state.formBlog.title}&size=100&background=087443&color=FFFFFF&rounded=true&font-size=0.30`"
                            alt="Image failed to load.">
                    </div>
                </div>

                <input type="file" accept="image/*" ref="templateImage" class="hidden"
                    @change="changeBlogThumbailImage">
                <FormButton type="button" buttonStyle="primary" class="rounded-lg" @click="$refs.templateImage.click()">
                    Change Thumbnail
                </FormButton>
            </div>
            <form @submit.prevent="updateBlog()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
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
import { useBlogStore } from '@/store/blog'
import { blogService } from '@/components/api/BlogService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const blogStore = useBlogStore()
const selectedBlog = blogStore.getSelectedBlog
const selectedBlogId = selectedBlog.id
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
    thumbnail: null,
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formBlog: {
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
    fetchBlog()
})

async function fetchBlog() {
    state.isPageLoading = true
    try {
        const selectedBlogId = selectedBlog.id
        const response = await blogService.getBlogById(selectedBlogId)
        if (response) {
            state.formBlog = {
                thumbnail_url: response.data.thumbnail_url,
                title: response.data.title,
                description: response.data.description,
                content: response.data.content,
            }
            forceRerender()
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function changeBlogThumbailImage(event) {
    const image = event.target.files[0]
    state.isPageLoading = true
    try {
        let params = new FormData()
        params.append('thumbnail_url', image)
        const response = await blogService.updateBlogThumbnailImage(selectedBlogId, params)
        if (response.data) {
            successAlert('Success!', t('updateBlogThumbnailImage'))
            blogStore.setSelectedBlog(response.data)
            state.formBlog = response.data
            state.thumbnail = response.data.thumbnail_url
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function updateBlog() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                title: state.formBlog.title,
                description: state.formBlog.description,
                content: state.formBlog.content,
            }
            const response = await blogService.updateBlog(selectedBlogId, params)
            if (response.data) {
                successAlert('Success!', t('updateBlogData'))
                blogStore.setSelectedBlog(response.data)
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
        confirmButtonColor: '#087443',
    })
}
</script>
<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - New Service | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <div>
            <FormButton class="px-0 hover:text-primary-700" @click="backToServicesPage()">
                <template #icon-left>
                    <ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
                </template>
                Back
            </FormButton>
            <div class="py-4">
                <h3 class="text-2xl text-gray-500">New Service</h3>
            </div>
            <form @submit.prevent="saveService()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
                        <div class="space-y-1">
                            <FormLabel for="title" label="Icon" />
                            <div>
                                <input type="file" accept="image/*" @change="changeServiceIconImage" />
                            </div>
                            <FormError
                                :error="v$.formService.icon && v$.formService.icon.$errors && v$.formService.icon.$errors.length > 0 ? v$.formService.icon.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.icon_url && state.error.errors.icon_url[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="title" label="Title" />
                            <FormTextField name="title" placeholder="Title" v-model="state.formService.title" />
                            <FormError
                                :error="v$.formService.title && v$.formService.title.$errors && v$.formService.title.$errors.length > 0 ? v$.formService.title.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.title && state.error.errors.title[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="description" label="Description" />
                            <FormTextField name="description" placeholder="Description"
                                v-model="state.formService.description" />
                            <FormError
                                :error="v$.formService.description && v$.formService.description.$errors && v$.formService.description.$errors.length > 0 ? v$.formService.description.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.description && state.error.errors.description[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="content" label="Content" />
                            <FormEditor name="content" height="50vh" v-model="state.formService.content"
                                v-if="componentKey > 0" />
                            <FormError
                                :error="v$.formService.content && v$.formService.content.$errors && v$.formService.content.$errors.length > 0 ? v$.formService.content.$errors[0].$message : null" />
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
import { serviceService } from '@/components/api/ServiceService'
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
    formService: {
        icon: null,
        title: null,
        description: null,
        content: null,
    },
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formService: {
            icon: {
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

function changeServiceIconImage(event) {
    const image = event.target.files[0]
    state.formService.icon = image
}

async function saveService() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            let params = new FormData()
            params.append('icon_url', state.formService.icon)
            params.append('title', state.formService.title)
            params.append('description', state.formService.description)
            params.append('content', state.formService.content)
            const response = await serviceService.saveService(params)
            if (response.data) {
                successAlert('Success!', t('saveServiceData'))
                backToServicesPage()
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function backToServicesPage() {
    navigateTo('/cms/services')
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
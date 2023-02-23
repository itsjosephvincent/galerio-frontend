<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Edit Service | {{ runtimeConfig.appName }}</Title>
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
                <h3 class="text-2xl text-gray-500">Edit Service</h3>
            </div>
            <div class="mt-6 space-y-4">
                <div>
                    <div v-if="state.formService.icon_url !== null">
                        <img :src="state.formService.icon_url" alt="Image failed to load" class="w-36">
                    </div>
                    <div v-else>
                        <img :src="`https://ui-avatars.com/api/?name=${state.formService.title}&size=100&background=087443&color=FFFFFF&rounded=true&font-size=0.30`"
                            alt="Image failed to load.">
                    </div>
                </div>

                <input type="file" accept="image/*" ref="templateImage" class="hidden" @change="changeServiceIconImage">
                <FormButton type="button" buttonStyle="primary" class="rounded-lg" @click="$refs.templateImage.click()">
                    Change Icon Image
                </FormButton>
            </div>
            <form @submit.prevent="updateService()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
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
import { useServiceStore } from '@/store/service'
import { serviceService } from '@/components/api/ServiceService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const serviceStore = useServiceStore()
const selectedService = serviceStore.getSelectedService
const selectedServiceId = selectedService.id
const componentKey = ref(0)

const forceRerender = () => {
    componentKey.value += 1
}

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    error: null,
    formService: {
        icon_url: null,
        title: null,
        description: null,
        content: null,
    },
    icon: null,
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formService: {
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
    ferchService()
})

async function ferchService() {
    state.isPageLoading = true
    try {
        const response = await serviceService.getServiceById(selectedServiceId)
        if (response) {
            state.formService = {
                icon_url: response.data.icon_url,
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

async function changeServiceIconImage(event) {
    const image = event.target.files[0]
    state.isPageLoading = true
    try {
        let params = new FormData()
        params.append('icon_url', image)
        const response = await serviceService.updateServiceThumbnailImage(selectedServiceId, params)
        if (response.data) {
            successAlert('Success!', t('updateServiceIconImage'))
            serviceStore.setSelectedService(response.data)
            state.formService = response.data
            state.icon = response.data.icon_url
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function updateService() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                title: state.formService.title,
                description: state.formService.description,
                location: state.formService.location,
                published_date: state.formService.published_date,
                content: state.formService.content,
            }
            const response = await serviceService.updateService(selectedServiceId, params)
            if (response.data) {
                successAlert('Success!', t('updateServiceData'))
                serviceStore.setSelectedService(response.data)
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
        confirmButtonColor: '#087443',
    })
}
</script>
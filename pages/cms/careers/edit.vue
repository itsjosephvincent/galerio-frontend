<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Edit Career | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <div>
            <FormButton class="px-0 hover:text-primary-700" @click="backToCareersPage()">
                <template #icon-left>
                    <ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
                </template>
                Back
            </FormButton>
            <div class="py-4">
                <h3 class="text-2xl text-gray-500">Edit Career</h3>
            </div>
            <form @submit.prevent="updateCareer()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
                        <div class="space-y-1">
                            <FormLabel for="title" label="Title" />
                            <FormTextField name="title" placeholder="Title" v-model="state.formCareer.title" />
                            <FormError
                                :error="v$.formCareer.title && v$.formCareer.title.$errors && v$.formCareer.title.$errors.length > 0 ? v$.formCareer.title.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.title && state.error.errors.title[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="content" label="Content" />
                            <FormTextArea name="content" placeholder="Content" v-model="state.formCareer.content" />
                            <FormError
                                :error="v$.formCareer.content && v$.formCareer.content.$errors && v$.formCareer.content.$errors.length > 0 ? v$.formCareer.content.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.content && state.error.errors.content[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="published_date" label="Published Date" />
                            <FormDateField name="published_date" placeholder="Published Date"
                                v-model="state.formCareer.published_date" />
                            <FormError
                                :error="v$.formCareer.published_date && v$.formCareer.published_date.$errors && v$.formCareer.published_date.$errors.length > 0 ? v$.formCareer.published_date.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.published_date && state.error.errors.published_date[0]" />
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
import { useCareerStore } from '@/store/career'
import { careerService } from '@/components/api/CareerService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const careerStore = useCareerStore()
const selectedCareer = careerStore.getSelectedCareer
const selectedCareerId = selectedCareer.id

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    error: null,
    formCareer: {
        title: null,
        content: null,
        published_date: null,
    },
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formCareer: {
            title: {
                title: helpers.withMessage('This field is required.', required),
            },
            content: {
                title: helpers.withMessage('This field is required.', required),
            },
            published_date: {
                title: helpers.withMessage('This field is required.', required),
            },
        },
    }
})

const v$ = useVuelidate(rules, state)

onMounted(() => {
    fetchCareer()
})

async function fetchCareer() {
    state.isPageLoading = true
    try {
        const selectedCareerId = selectedCareer.id
        const response = await careerService.getCareerById(selectedCareerId)
        if (response) {
            state.formCareer = {
                title: response.data.title,
                content: response.data.content,
                published_date: response.data.published_date,
            }
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function updateCareer() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                title: state.formCareer.title,
                content: state.formCareer.content,
                published_date: state.formCareer.published_date,
            }
            const response = await careerService.updateCareer(selectedCareerId, params)
            if (response.data) {
                successAlert('Success!', t('updateCareerData'))
                careerStore.setSelectedCareer(response.data)
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function backToCareersPage() {
    navigateTo('/cms/careers')
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
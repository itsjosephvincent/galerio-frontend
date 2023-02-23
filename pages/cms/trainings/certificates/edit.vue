<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Edit Certificate | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <div>
            <FormButton class="px-0 hover:text-primary-700" @click="backToCertificatesPage()">
                <template #icon-left>
                    <ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
                </template>
                Back
            </FormButton>
            <div class="py-4">
                <h3 class="text-2xl text-gray-500">Edit Certificate</h3>
            </div>
            <form @submit.prevent="updateCertificate()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
                        <div class="space-y-1">
                            <FormLabel for="name" label="Name" />
                            <FormTextField name="name" placeholder="Name" v-model="state.formCertificate.name" />
                            <FormError
                                :error="v$.formCertificate.name && v$.formCertificate.name.$errors && v$.formCertificate.name.$errors.length > 0 ? v$.formCertificate.name.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.name && state.error.errors.name[0]" />
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
import { useCertificateStore } from '@/store/certificate'
import { certificateService } from '@/components/api/CertificateService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const certificateStore = useCertificateStore()
const selectedCertificate = certificateStore.getSelectedCertificate
const selectedCertificateId = selectedCertificate.id
const componentKey = ref(0)

const forceRerender = () => {
    componentKey.value += 1
}

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    error: null,
    formCertificate: {
        name: null,
    },
    thumbnail: null,
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formCertificate: {
            name: {
                name: helpers.withMessage('This field is required.', required),
            },
        },
    }
})

const v$ = useVuelidate(rules, state)

onMounted(() => {
    fetchCertificate()
})

async function fetchCertificate() {
    state.isPageLoading = true
    try {
        const response = await certificateService.getCertificateById(selectedCertificateId)
        if (response) {
            state.formCertificate = {
                name: response.data.name,
            }
            forceRerender()
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function updateCertificate() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                name: state.formCertificate.name,
            }
            const response = await certificateService.updateCertificate(selectedCertificateId, params)
            if (response.data) {
                successAlert('Success!', t('updateCertificateData'))
                certificateStore.setSelectedCertificate(response.data)
                backToCertificatesPage()
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function backToCertificatesPage() {
    navigateTo('/cms/trainings/certificates')
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
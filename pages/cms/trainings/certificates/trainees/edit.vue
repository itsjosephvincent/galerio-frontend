<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Edit Trainee | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <div>
            <FormButton class="px-0 hover:text-primary-700" @click="backToTraineesPage()">
                <template #icon-left>
                    <ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
                </template>
                Back
            </FormButton>
            <div class="py-4">
                <h3 class="text-2xl text-gray-500">Edit Trainee</h3>
            </div>
            <form @submit.prevent="updateTrainee()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
                        <div class="space-y-1">
                            <FormLabel for="name" label="Name" />
                            <FormTextField name="name" placeholder="Name" v-model="state.formTrainee.name" />
                            <FormError
                                :error="v$.formTrainee.name && v$.formTrainee.name.$errors && v$.formTrainee.name.$errors.length > 0 ? v$.formTrainee.name.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.name && state.error.errors.name[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="certificate_no" label="Certificate No" />
                            <FormTextField name="certificate_no" placeholder="Certificate No"
                                v-model="state.formTrainee.certificate_no" />
                            <FormError
                                :error="v$.formTrainee.certificate_no && v$.formTrainee.certificate_no.$errors && v$.formTrainee.certificate_no.$errors.length > 0 ? v$.formTrainee.certificate_no.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.certificate_no && state.error.errors.certificate_no[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="training_date_from" label="Date From" />
                            <FormDateField name="training_date_from" placeholder="Date From"
                                v-model="state.formTrainee.training_date_from" />
                            <FormError
                                :error="v$.formTrainee.training_date_from && v$.formTrainee.training_date_from.$errors && v$.formTrainee.training_date_from.$errors.length > 0 ? v$.formTrainee.training_date_from.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.training_date_from && state.error.errors.training_date_from[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="training_date_to" label="Date To" />
                            <FormDateField name="training_date_to" placeholder="Date To"
                                v-model="state.formTrainee.training_date_to" />
                            <FormError
                                :error="v$.formTrainee.training_date_to && v$.formTrainee.training_date_to.$errors && v$.formTrainee.training_date_to.$errors.length > 0 ? v$.formTrainee.training_date_to.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.training_date_to && state.error.errors.training_date_to[0]" />
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
import { useTraineeStore } from '@/store/trainee'
import { traineeService } from '@/components/api/TraineeService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const traineeStore = useTraineeStore()
const selectedTrainee = traineeStore.getSelectedTrainee
const selectedTraineeId = selectedTrainee.id

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    error: null,
    formTrainee: {
        name: null,
        certificate_no: null,
        training_date_from: null,
        training_date_to: null,
    },
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formTrainee: {
            name: {
                name: helpers.withMessage('This field is required.', required),
            },
            certificate_no: {
                name: helpers.withMessage('This field is required.', required),
            },
            training_date_from: {
                name: helpers.withMessage('This field is required.', required),
            },
            training_date_to: {
                name: helpers.withMessage('This field is required.', required),
            },
        },
    }
})

const v$ = useVuelidate(rules, state)

onMounted(() => {
    fetchTrainee()
})

async function fetchTrainee() {
    state.isPageLoading = true
    try {
        const response = await traineeService.getTraineeById(selectedTraineeId)
        if (response) {
            state.formTrainee = {
                name: response.data.name,
                certificate_no: response.data.certificate_no,
                training_date_from: response.data.training_date_from,
                training_date_to: response.data.training_date_to,
            }
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function updateTrainee() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                name: state.formTrainee.name,
                certificate_no: state.formTrainee.certificate_no,
                training_date_from: state.formTrainee.training_date_from,
                training_date_to: state.formTrainee.training_date_to,
            }
            const response = await traineeService.updateTrainee(selectedTraineeId, params)
            if (response.data) {
                successAlert('Success!', t('updateTraineeData'))
                traineeStore.setSelectedTrainee(response.data)
                backToTraineesPage()
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function backToTraineesPage() {
    navigateTo('/cms/trainings/certificates/trainees')
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
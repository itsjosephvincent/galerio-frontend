<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - New Training | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <div>
            <FormButton class="px-0 hover:text-primary-700" @click="backToTrainingsPage()">
                <template #icon-left>
                    <ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
                </template>
                Back
            </FormButton>
            <div class="py-4">
                <h3 class="text-2xl text-gray-500">New Training</h3>
            </div>
            <form @submit.prevent="saveTraining()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
                        <div class="space-y-1">
                            <FormLabel for="thumbnail_url" label="Thumbnail Image" />
                            <div>
                                <input type="file" accept="image/*" @change="changeThumbnailImage" />
                            </div>
                            <FormError
                                :error="v$.formTraining.thumbnail_url && v$.formTraining.thumbnail_url.$errors && v$.formTraining.thumbnail_url.$errors.length > 0 ? v$.formTraining.thumbnail_url.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.thumbnail_url && state.error.errors.thumbnail_url[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="title" label="Title" />
                            <FormTextField name="title" placeholder="Title" v-model="state.formTraining.title" />
                            <FormError
                                :error="v$.formTraining.title && v$.formTraining.title.$errors && v$.formTraining.title.$errors.length > 0 ? v$.formTraining.title.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.title && state.error.errors.title[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="description" label="Description" />
                            <FormTextArea name="description" placeholder="Description"
                                v-model="state.formTraining.description" />
                            <FormError
                                :error="v$.formTraining.description && v$.formTraining.description.$errors && v$.formTraining.description.$errors.length > 0 ? v$.formTraining.description.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.description && state.error.errors.description[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="date_from" label="Date From" />
                            <FormDateField name="date_from" placeholder="Date From"
                                v-model="state.formTraining.date_from" />
                            <FormError
                                :error="v$.formTraining.date_from && v$.formTraining.date_from.$errors && v$.formTraining.date_from.$errors.length > 0 ? v$.formTraining.date_from.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.date_from && state.error.errors.date_from[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="date_to" label="Date To" />
                            <FormDateField name="date_to" placeholder="Date To" v-model="state.formTraining.date_to" />
                            <FormError
                                :error="v$.formTraining.date_to && v$.formTraining.date_to.$errors && v$.formTraining.date_to.$errors.length > 0 ? v$.formTraining.date_to.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.date_to && state.error.errors.date_to[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="location" label="Location" />
                            <FormTextField name="location" placeholder="Location"
                                v-model="state.formTraining.location" />
                            <FormError
                                :error="v$.formTraining.location && v$.formTraining.location.$errors && v$.formTraining.location.$errors.length > 0 ? v$.formTraining.location.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.location && state.error.errors.location[0]" />
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
import { trainingService } from '@/components/api/TrainingService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    error: null,
    formTraining: {
        thumbnail_url: null,
        title: null,
        description: null,
        date_from: null,
        date_to: null,
        location: null,
    },
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formTraining: {
            thumbnail_url: {
                title: helpers.withMessage('This field is required.', required),
            },
            title: {
                title: helpers.withMessage('This field is required.', required),
            },
            description: {
                title: helpers.withMessage('This field is required.', required),
            },
            date_from: {
                title: helpers.withMessage('This field is required.', required),
            },
            date_to: {
                title: helpers.withMessage('This field is required.', required),
            },
            location: {
                title: helpers.withMessage('This field is required.', required),
            },
        },
    }
})

const v$ = useVuelidate(rules, state)

function changeThumbnailImage(event) {
    const image = event.target.files[0]
    state.formTraining.thumbnail_url = image
}

async function saveTraining() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            let params = new FormData()
            params.append('thumbnail_url', state.formTraining.thumbnail_url)
            params.append('title', state.formTraining.title)
            params.append('description', state.formTraining.description)
            params.append('date_from', state.formTraining.date_from)
            params.append('date_to', state.formTraining.date_to)
            params.append('location', state.formTraining.location)
            const response = await trainingService.saveTraining(params)
            if (response.data) {
                successAlert('Success!', t('saveTrainingData'))
                backToTrainingsPage()
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function backToTrainingsPage() {
    navigateTo('/cms/trainings')
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
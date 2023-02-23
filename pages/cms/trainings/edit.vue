<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Edit Training | {{ runtimeConfig.appName }}</Title>
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
                <h3 class="text-2xl text-gray-500">Edit Training</h3>
            </div>
            <div class="mt-6 space-y-4">
                <div>
                    {{ }}
                    <div v-if="state.formTraining.thumbnail_url !== null">
                        <img :src="state.formTraining.thumbnail_url" alt="Image failed to load" class="w-36">
                    </div>
                    <div v-else>
                        <img :src="`https://ui-avatars.com/api/?name=${state.formTraining.title}&size=100&background=087443&color=FFFFFF&rounded=true&font-size=0.30`"
                            alt="Image failed to load.">
                    </div>
                </div>

                <input type="file" accept="image/*" ref="templateImage" class="hidden"
                    @change="changeTrainingThumbailImage">
                <FormButton type="button" buttonStyle="primary" class="rounded-lg" @click="$refs.templateImage.click()">
                    Change Thumbnail
                </FormButton>
            </div>
            <form @submit.prevent="updateTraining()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
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
import { useTrainingStore } from '@/store/training'
import { trainingService } from '@/components/api/TrainingService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const trainingStore = useTrainingStore()
const selectedTraining = trainingStore.getSelectedTraining
const selectedTrainingId = selectedTraining.id
const componentKey = ref(0)

const forceRerender = () => {
    componentKey.value += 1
}

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
    thumbnail: null,
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formTraining: {
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

onMounted(() => {
    fetchTraining()
})

async function fetchTraining() {
    state.isPageLoading = true
    try {
        const selectedTrainingId = selectedTraining.id
        const response = await trainingService.getTrainingById(selectedTrainingId)
        if (response) {
            state.formTraining = {
                thumbnail_url: response.data.thumbnail_url,
                title: response.data.title,
                description: response.data.description,
                date_from: response.data.date_from,
                date_to: response.data.date_to,
                location: response.data.location,
            }
            forceRerender()
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function changeTrainingThumbailImage(event) {
    const image = event.target.files[0]
    state.isPageLoading = true
    try {
        let params = new FormData()
        params.append('thumbnail_url', image)
        const response = await trainingService.updateTrainingThumbnailImage(selectedTrainingId, params)
        if (response.data) {
            successAlert('Success!', t('updateTrainingThumbnailImage'))
            trainingStore.setSelectedTraining(response.data)
            state.formTraining = response.data
            state.thumbnail = response.data.thumbnail_url
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function updateTraining() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                title: state.formTraining.title,
                description: state.formTraining.description,
                date_from: state.formTraining.date_from,
                date_to: state.formTraining.date_to,
                location: state.formTraining.location,
            }
            const response = await trainingService.updateTraining(selectedTrainingId, params)
            if (response.data) {
                successAlert('Success!', t('updateTrainingData'))
                trainingStore.setSelectedTraining(response.data)
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
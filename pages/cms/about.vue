<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - About | {{ runtimeConfig.appName }}</Title>
        </Head>

        <template #header>About Us</template>
        <VueLoading :active="state.isPageLoading" />
        <form @submit.prevent="updateAboutUs()">
            <div>
                <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" class="lg:w-1/2" />
                <div class="mt-6 space-y-3">
                    <div class="space-y-1">
                        <FormLabel for="mission" label="Mission" />
                        <FormTextField name="mission" placeholder="Mission" v-model="state.formAboutUs.mission" />
                        <FormError
                            :error="v$.formAboutUs.mission && v$.formAboutUs.mission.$errors && v$.formAboutUs.mission.$errors.length > 0 ? v$.formAboutUs.mission.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.mission && state.error.errors.mission[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel for="vision" label="Vision" />
                        <FormTextField name="vision" placeholder="Vision" v-model="state.formAboutUs.vision" />
                        <FormError
                            :error="v$.formAboutUs.vision && v$.formAboutUs.vision.$errors && v$.formAboutUs.vision.$errors.length > 0 ? v$.formAboutUs.vision.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.vision && state.error.errors.vision[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel for="content" label="Content" />
                        <FormEditor name="vision" :height="'50vh'" v-model="state.formAboutUs.content"
                            v-if="componentKey > 0" />
                        <FormError
                            :error="v$.formAboutUs.content && v$.formAboutUs.content.$errors && v$.formAboutUs.content.$errors.length > 0 ? v$.formAboutUs.content.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.content && state.error.errors.content[0]" />
                    </div>
                </div>
                <div class="mt-6 max-w-xl">
                    <FormButton type="submit" buttonStyle="primary" class="w-full rounded-md">
                        Update
                    </FormButton>
                </div>
            </div>
        </form>
    </NuxtLayout>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { useVuelidate } from "@vuelidate/core"
import { useI18n } from 'vue-i18n'
import { required, helpers } from '@vuelidate/validators'
import { aboutUsService } from '@/components/api/AboutUsService'
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
    featured_images: [],
    formAboutUs: {
        id: null,
        mission: null,
        vision: null,
        content: null,
    },
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formAboutUs: {
            mission: {
                required: helpers.withMessage('This field is required.', required),
            },
            vision: {
                required: helpers.withMessage('This field is required.', required),
            },
        }
    }
})
const v$ = useVuelidate(rules, state)

onMounted(() => {
    getAbout()
})

async function getAbout() {
    state.isPageLoading = true
    try {
        const response = await aboutUsService.getAboutUs()
        if (response.data) {
            state.formAboutUs = {
                id: response.data[0].id,
                mission: response.data[0].mission,
                vision: response.data[0].vision,
                content: response.data[0].content,
            }
            forceRerender()
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function updateAboutUs() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                mission: state.formAboutUs.mission,
                vision: state.formAboutUs.vision,
                content: state.formAboutUs.content,
            }
            const response = await aboutUsService.updateAboutUs(state.formAboutUs.id, params)
            if (response.data) {
                successAlert('Success!', t('updateAboutUsData'))
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
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
<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - New User | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <div>
            <FormButton class="px-0 hover:text-primary-700" @click="backToUsersPage()">
                <template #icon-left>
                    <ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
                </template>
                Back
            </FormButton>
            <div class="py-4">
                <h3 class="text-2xl text-gray-500">New User</h3>
            </div>
            <form @submit.prevent="saveUser()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
                        <div class="space-y-1">
                            <FormLabel for="img_url" label="User Image" />
                            <div>
                                <input type="file" accept="image/*" @change="changeUserImage" />
                            </div>
                            <FormError
                                :error="v$.formUser.img_url && v$.formUser.img_url.$errors && v$.formUser.img_url.$errors.length > 0 ? v$.formUser.img_url.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.img_url && state.error.errors.img_url[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="first_name" label="First Name" />
                            <FormTextField name="first_name" placeholder="First Name"
                                v-model="state.formUser.first_name" />
                            <FormError
                                :error="v$.formUser.first_name && v$.formUser.first_name.$errors && v$.formUser.first_name.$errors.length > 0 ? v$.formUser.first_name.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.first_name && state.error.errors.first_name[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="last_name" label="Last Name" />
                            <FormTextField name="last_name" placeholder="Last Name"
                                v-model="state.formUser.last_name" />
                            <FormError
                                :error="v$.formUser.last_name && v$.formUser.last_name.$errors && v$.formUser.last_name.$errors.length > 0 ? v$.formUser.last_name.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.last_name && state.error.errors.last_name[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="email" label="Email Address" />
                            <FormTextField name="email" placeholder="Email Address" v-model="state.formUser.email" />
                            <FormError
                                :error="v$.formUser.email && v$.formUser.email.$errors && v$.formUser.email.$errors.length > 0 ? v$.formUser.email.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.email && state.error.errors.email[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="password" label="Password" />
                            <FormTextField name="password" placeholder="Password" v-model="state.formUser.password" />
                            <FormError
                                :error="v$.formUser.password && v$.formUser.password.$errors && v$.formUser.password.$errors.length > 0 ? v$.formUser.password.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.password && state.error.errors.password[0]" />
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
import { userService } from '@/components/api/UserService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    error: null,
    formUser: {
        img_url: null,
        first_name: null,
        last_name: null,
        email: null,
        password: null,
    },
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formUser: {
            img_url: {
                title: helpers.withMessage('This field is required.', required),
            },
            first_name: {
                title: helpers.withMessage('This field is required.', required),
            },
            last_name: {
                title: helpers.withMessage('This field is required.', required),
            },
            email: {
                title: helpers.withMessage('This field is required.', required),
            },
            password: {
                title: helpers.withMessage('This field is required.', required),
            },
        },
    }
})

const v$ = useVuelidate(rules, state)

function changeUserImage(event) {
    const image = event.target.files[0]
    state.formUser.img_url = image
}

async function saveUser() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            let params = new FormData()
            params.append('img_url', state.formUser.img_url)
            params.append('first_name', state.formUser.first_name)
            params.append('last_name', state.formUser.last_name)
            params.append('email', state.formUser.email)
            params.append('password', state.formUser.password)
            const response = await userService.saveUser(params)
            if (response.data) {
                successAlert('Success!', t('saveUserData'))
                backToUsersPage()
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function backToUsersPage() {
    navigateTo('/cms/users')
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
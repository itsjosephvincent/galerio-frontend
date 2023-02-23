<template>
    <div>

        <Head>
            <Title>CMS - Login | {{ runtimeConfig.appName }}</Title>
        </Head>


        <VueLoading :active="state.isPageLoading" />
        <div class="min-h-screen flex">
            <div class="hidden relative w-0 flex-1 basis-1/2 lg:block md:block ">
                <img class="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2372&q=80"
                    alt="Image failed to load." />
            </div>
            <div class="flex-1 flex flex-col justify-center py-12 px-4 basis-1/2 lg:px-28 md:px-8 sm:px-6 xs:px-6">
                <div class="text-center">
                    <div class="flex items-center justify-center">
                        <img src="/assets/img/logo.png" class="w-24 cursor-pointer" alt="Logo"
                            @click="navigateTo('/')" />
                    </div>
                    <h1 class="text-3xl font-extrabold text-gray-900">GEC CMS</h1>
                    <p class="font-normal text-primary mt-3">
                        Sign in to your account
                        <br>
                    </p>
                </div>
                <form class="mt-8 space-y-6" method="POST" @submit.prevent="login">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="space-y-4">
                        <div class="space-y-1">
                            <FormLabel for="email" label="Email Address" />
                            <FormTextField name="email" placeholder="Email Address" v-model="state.email" />
                            <FormError
                                :error="v$.email && v$.email.$errors && v$.email.$errors.length > 0 ? v$.email.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.email && state.error.errors.email[0]" />
                        </div>
                        <div class="space-y-1">
                            <FormLabel for="password" label="Password" />
                            <FormPasswordField name="password" placeholder="Password" v-model="state.password" />
                            <FormError
                                :error="v$.password && v$.password.$errors && v$.password.$errors.length > 0 ? v$.password.$errors[0].$message : null" />
                            <FormError
                                :error="state.error && state.error.errors && state.error.errors.password && state.error.errors.password[0]" />
                        </div>
                    </div>

                    <div>
                        <button type="submit"
                            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-normal rounded-md text-white bg-primary-800 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                <LockClosedIcon class="h-5 w-5 text-gray-200" aria-hidden="true" />
                            </span>
                            Sign in
                        </button>
                    </div>

                    <div class="text-sm grow flex justify-center lg:justify-end md:justify-end">
                        <a class="cursor-pointer font-normal text-primary hover:text-primary-light"
                            @click="navigateToForgotPassword()"> Forgot your password?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { LockClosedIcon } from '@heroicons/vue/solid'
import { useVuelidate } from "@vuelidate/core"
import { required, email, helpers } from '@vuelidate/validators'
import { useUserStore } from '@/store/user'
import { authService } from '@/components/api/AuthService'

definePageMeta({
    middleware: ["authenticated"]
})

const userStore = useUserStore()

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    email: null,
    error: null,
    isPageLoading: false,
    password: null,
})

const rules = computed(() => {
    return {
        email: {
            required: helpers.withMessage('This field is required.', required),
            email: helpers.withMessage('Please enter a valid email address.', email),
        },
        password: {
            required: helpers.withMessage('This field is required.', required),
        },
    }
})
const v$ = useVuelidate(rules, state)

async function login() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                email: state.email,
                password: state.password,
            }
            const response = await authService.login(params)

            if (response.data) {
                localStorage.setItem("_token", response.data.token)
                userStore.setUser(response.data.admin)
                navigateTo('/cms/landing')
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function navigateToForgotPassword() {
    navigateTo('/forgot-password')
}
</script>
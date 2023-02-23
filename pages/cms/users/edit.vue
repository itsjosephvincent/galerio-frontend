<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Edit User | {{ runtimeConfig.appName }}</Title>
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
                <h3 class="text-2xl text-gray-500">Edit User</h3>
            </div>
            <div class="mt-6 space-y-4">
                <div>
                    {{ }}
                    <div v-if="userStore.getSelectedUser.img_url !== null">
                        <img :src="userStore.getSelectedUser.img_url" alt="Image failed to load" class="w-28">
                    </div>
                    <div v-else>
                        <img :src="`https://ui-avatars.com/api/?name=${userStore.getSelectedUser.first_name + ' ' + userStore.getSelectedUser.last_name}&size=100&background=087443&color=FFFFFF&rounded=true&font-size=0.30`"
                            alt="Image failed to load.">
                    </div>
                </div>

                <input type="file" accept="image/*" ref="templateImage" class="hidden"
                    @change="changeUserThumbailImage">
                <FormButton type="button" buttonStyle="primary" class="rounded-lg" @click="$refs.templateImage.click()">
                    Change Thumbnail
                </FormButton>
            </div>
            <form @submit.prevent="updateUser()">
                <div class="mt-10">
                    <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
                    <div class="mt-6 space-y-6">
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
                        <div>
                            <FormLabel for="is_active" label="Is Active?" />
                            <FormSwitch :value="state.formUser.is_active"
                                @toggleSwitch="state.formUser.is_active = !state.formUser.is_active" />
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
import { useUserStore } from '@/store/user'
import { userService } from '@/components/api/UserService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()
const userStore = useUserStore()
const selectedUser = userStore.getSelectedUser
const selectedUserId = selectedUser.id
const componentKey = ref(0)

const forceRerender = () => {
    componentKey.value += 1
}

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    error: null,
    formUser: {
        img_url: null,
        first_name: null,
        last_name: null,
        email: null,
        is_active: false,
    },
    isPageLoading: false,
})

const rules = computed(() => {
    return {
        formUser: {
            first_name: {
                first_name: helpers.withMessage('This field is required.', required),
            },
            last_name: {
                first_name: helpers.withMessage('This field is required.', required),
            },
            email: {
                first_name: helpers.withMessage('This field is required.', required),
            },
        },
    }
})

const v$ = useVuelidate(rules, state)

onMounted(() => {
    fetchUser()
})

async function fetchUser() {
    state.isPageLoading = true
    try {
        const selectedUserId = selectedUser.id
        const response = await userService.getUserById(selectedUserId)
        if (response) {
            state.formUser = {
                img_url: response.data.img_url,
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                email: response.data.email,
                is_active: response.data.is_active
            }
            forceRerender()
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function changeUserThumbailImage(event) {
    state.error = null
    const image = event.target.files[0]
    if (image !== undefined) {
        state.isPageLoading = true
        try {
            let params = new FormData()
            params.append('img_url', image)
            const response = await userService.updateUserImage(selectedUserId, params)
            if (response.data) {
                successAlert('Success!', t('updateUserProfileImage'))
                userStore.setSelectedUser(response.data)
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

async function updateUser() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                first_name: state.formUser.first_name,
                last_name: state.formUser.last_name,
                email: state.formUser.email,
                is_active: state.formUser.is_active,
            }
            const response = await userService.updateUser(selectedUserId, params)
            if (response.data) {
                successAlert('Success!', t('updateUserData'))
                userStore.setSelectedUser(response.data)
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
        confirmButtonColor: '#087443',
    })
}
</script>
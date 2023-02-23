<template>
    <NuxtLayout name="cms">

        <Head>
            <Title>CMS - Contacts | {{ runtimeConfig.appName }}</Title>
        </Head>

        <template #header>Contacts</template>
        <VueLoading :active="state.isPageLoading" />
        <div class="space-y-5">
            <form @submit.prevent="updateContacts()">
                <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" class="lg:w-1/2" />
                <div class="max-w-xl space-y-3">
                    <div class="space-y-1">
                        <FormLabel for="emails" label="Email Addresses" />
                        <FormTextArea :rows="2" name="emails" placeholder="Email Addresses"
                            v-model="state.formContact.emails" />
                        <FormError
                            :error="v$.formContact.emails && v$.formContact.emails.$errors && v$.formContact.emails.$errors.length > 0 ? v$.formContact.emails.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.emails && state.error.errors.emails[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel for="phones" label="Phones" />
                        <FormTextArea :rows="2" name="phones" placeholder="Phones" v-model="state.formContact.phones" />
                        <FormError
                            :error="v$.formContact.phones && v$.formContact.phones.$errors && v$.formContact.phones.$errors.length > 0 ? v$.formContact.phones.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.phones && state.error.errors.phones[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel for="offices" label="Offices" />
                        <FormTextArea :rows="4" name="offices" placeholder="Offices"
                            v-model="state.formContact.offices" />
                        <FormError
                            :error="v$.formContact.offices && v$.formContact.offices.$errors && v$.formContact.offices.$errors.length > 0 ? v$.formContact.offices.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.offices && state.error.errors.offices[0]" />
                    </div>
                </div>
                <div class="mt-6 max-w-xl">
                    <FormButton type="submit" buttonStyle="primary" class="w-full rounded-md">
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
import { useVuelidate } from "@vuelidate/core"
import { required, helpers } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import { contactService } from '@/components/api/ContactService'
import Swal from 'sweetalert2'

definePageMeta({
    middleware: ["authenticated"]
})

const { t } = useI18n()

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    error: null,
    formContact: {
        id: null,
        emails: null,
        phones: null,
        offices: null,
    },
    isPageLoading: false,
})

onMounted(() => {
    getContacts()
})

const rules = computed(() => {
    return {
        formContact: {
            emails: {
                required: helpers.withMessage('This field is required.', required),
            },
            phones: {
                required: helpers.withMessage('This field is required.', required),
            },
            offices: {
                required: helpers.withMessage('This field is required.', required),
            },
        },
    }
})

const v$ = useVuelidate(rules, state)

async function getContacts() {
    state.isPageLoading = true
    try {
        const response = await contactService.getContact()
        if (response.data) {
            state.formContact = {
                id: response.data[0].id,
                emails: response.data[0].emails,
                phones: response.data[0].phones,
                offices: response.data[0].offices,
            }
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function updateContacts() {
    state.error = null
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                emails: state.formContact.emails,
                phones: state.formContact.phones,
                offices: state.formContact.offices
            }
            const response = await contactService.updateContact(state.formContact.id, params)
            if (response.data) {
                successAlert('Success!', t('updateContactData'))
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
        confirmButtonColor: '#087443',
    })
}
</script>
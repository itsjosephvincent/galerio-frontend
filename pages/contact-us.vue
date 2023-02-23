<template>
    <NuxtLayout name="website">

        <Head>
            <Title>Contact Us | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <HeaderBanner :image_url="state.banner.image_url" :title="state.banner.title" />
        <section class="max-w-8xl mx-auto py-16 sm:py-10 xs:py-10">
            <div class="grid grid-cols-3 gap-x-10 gap-y-8 md:gap-6 sm:grid-cols-1 xs:grid-cols-1">
                <div class="space-y-3">
                    <div class="flex gap-x-2 items-center text-gray-800">
                        <MailIcon class="h-5 w-5" aria-hidden="true" />
                        <p class="text-xl">Connect with us</p>
                    </div>
                    <div class="space-y-4 text-sm">
                        <p class="whitespace-pre-wrap">
                            {{ contactStore.getWebsiteContact && contactStore.getWebsiteContact.emails }}
                        </p>
                    </div>
                </div>
                <div class="space-y-3">
                    <div class="flex gap-x-2 items-center text-gray-800">
                        <PhoneIcon class="h-5 w-5" aria-hidden="true" />
                        <p class="text-xl">Phones</p>
                    </div>
                    <div class="space-y-4 text-sm">
                        <p class="whitespace-pre-wrap">
                            {{ contactStore.getWebsiteContact && contactStore.getWebsiteContact.phones }}
                        </p>
                    </div>
                </div>
                <div class="space-y-3">
                    <div class="flex gap-x-2 items-center text-gray-800">
                        <OfficeBuildingIcon class="h-5 w-5" aria-hidden="true" />
                        <p class="text-xl">Offices</p>
                    </div>
                    <div class="space-y-4 text-sm">
                        <p class="whitespace-pre-wrap">
                            {{ contactStore.getWebsiteContact && contactStore.getWebsiteContact.offices }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <section class="max-w-8xl mx-auto py-2">
            <div class="divider"></div>
        </section>
        <section class="max-w-8xl mx-auto py-16 sm:py-10 xs:py-10">
            <div class="grid grid-cols-2 gap-x-20 gap-y-8 md:gap-6 sm:grid-cols-1 xs:grid-cols-1">
                <form class="space-y-5" @submit.prevent="handleSubmitMessage()">
                    <div class="space-y-2">
                        <h3 class="text-2xl text-primary-800">Feel free to drop us a message</h3>
                        <p class="text-sm">
                            We'd love to hear from you. Send us a question or comment with the form below and
                            we'll be in touch in you as soon as possible.
                        </p>
                    </div>
                    <div class="space-y-1">
                        <FormLabel label="Name" />
                        <FormTextField name="name" placeholder="Name" v-model="state.contactForm.name" />
                        <FormError
                            :error="vContactUs$.contactForm.name && vContactUs$.contactForm.name.$errors && vContactUs$.contactForm.name.$errors.length > 0 ? vContactUs$.contactForm.name.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.name && state.error.errors.name[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel label="Company" />
                        <FormTextField name="company" placeholder="Company" v-model="state.contactForm.company" />
                        <FormError
                            :error="vContactUs$.contactForm.company && vContactUs$.contactForm.company.$errors && vContactUs$.contactForm.company.$errors.length > 0 ? vContactUs$.contactForm.company.$errors[0].$company : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.company && state.error.errors.company[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel label="Email Address" />
                        <FormTextField name="email" placeholder="Email Address" v-model="state.contactForm.email" />
                        <FormError
                            :error="vContactUs$.contactForm.email && vContactUs$.contactForm.email.$errors && vContactUs$.contactForm.email.$errors.length > 0 ? vContactUs$.contactForm.email.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.email && state.error.errors.email[0]" />
                    </div>
                    <div class="text-red-600 flex items-center gap-x-2"
                        @click="state.contactForm.contact_via_phone = !state.contactForm.contact_via_phone">
                        <FormCheckbox name="contact_via_phone" :value="state.contactForm.contact_via_phone" />
                        <FormLabel label="I would like to be contacted via phone" for="contact_via_phone"
                            class="cursor-pointer" />
                    </div>
                    <div class="space-y-1" v-if="state.contactForm.contact_via_phone">
                        <FormLabel label="Phone Number" />
                        <FormTextField name="phone_number" placeholder="Phone Number"
                            v-model="state.contactForm.phone_number" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel label="Message or Project Objectives" />
                        <FormTextArea name="message" placeholder="Message or Project Objectives"
                            v-model="state.contactForm.message" />
                        <FormError
                            :error="vContactUs$.contactForm.message && vContactUs$.contactForm.message.$errors && vContactUs$.contactForm.message.$errors.length > 0 ? vContactUs$.contactForm.message.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.message && state.error.errors.message[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormButton type="submit" buttonStyle="primary" class="rounded-md w-full">
                            Send Message
                        </FormButton>
                    </div>
                </form>
                <form class="space-y-5" @submit.prevent="handleSubmitSolarInquiry()">
                    <div class="space-y-2">
                        <h3 class="text-2xl text-primary-800">Solar Inquiry</h3>
                        <p class="text-sm">
                            Start with our free quote for your project
                        </p>
                    </div>
                    <div class="space-y-1">
                        <FormLabel label="Name" />
                        <FormTextField name="name" placeholder="Name" v-model="state.solarInquiryForm.name" />
                        <FormError
                            :error="vSolarInquiry$.solarInquiryForm.name && vSolarInquiry$.solarInquiryForm.name.$errors && vSolarInquiry$.solarInquiryForm.name.$errors.length > 0 ? vSolarInquiry$.solarInquiryForm.name.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.name && state.error.errors.name[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel label="Email Address" />
                        <FormTextField name="email" placeholder="Email Address" v-model="state.solarInquiryForm.email" />
                        <FormError
                            :error="vSolarInquiry$.solarInquiryForm.email && vSolarInquiry$.solarInquiryForm.email.$errors && vSolarInquiry$.solarInquiryForm.email.$errors.length > 0 ? vSolarInquiry$.solarInquiryForm.email.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.email && state.error.errors.email[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel label="Phone Number" />
                        <FormTextField name="phone_number" placeholder="Phone Number"
                            v-model="state.solarInquiryForm.phone_number" />
                        <FormError
                            :error="vSolarInquiry$.solarInquiryForm.phone_number && vSolarInquiry$.solarInquiryForm.phone_number.$errors && vSolarInquiry$.solarInquiryForm.phone_number.$errors.length > 0 ? vSolarInquiry$.solarInquiryForm.phone_number.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.phone_number && state.error.errors.phone_number[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel label="Average Monthly Bill" />
                        <FormTextField name="average_monthly_bill" placeholder="Average Monthly Bill"
                            v-model="state.solarInquiryForm.average_monthly_bill" />
                        <FormError
                            :error="vSolarInquiry$.solarInquiryForm.average_monthly_bill && vSolarInquiry$.solarInquiryForm.average_monthly_bill.$errors && vSolarInquiry$.solarInquiryForm.average_monthly_bill.$errors.length > 0 ? vSolarInquiry$.solarInquiryForm.average_monthly_bill.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.average_monthly_bill && state.error.errors.average_monthly_bill[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel label="Address" />
                        <FormTextArea name="address" placeholder="Address" v-model="state.solarInquiryForm.address" />
                        <FormError
                            :error="vSolarInquiry$.solarInquiryForm.address && vSolarInquiry$.solarInquiryForm.address.$errors && vSolarInquiry$.solarInquiryForm.address.$errors.length > 0 ? vSolarInquiry$.solarInquiryForm.address.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.address && state.error.errors.address[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormLabel label="Customer Requirement" />
                        <FormTextArea name="customer_requirement" placeholder="Customer Requirement"
                            v-model="state.solarInquiryForm.customer_requirement" />
                        <FormError
                            :error="vSolarInquiry$.solarInquiryForm.customer_requirement && vSolarInquiry$.solarInquiryForm.customer_requirement.$errors && vSolarInquiry$.solarInquiryForm.customer_requirement.$errors.length > 0 ? vSolarInquiry$.solarInquiryForm.customer_requirement.$errors[0].$message : null" />
                        <FormError
                            :error="state.error && state.error.errors && state.error.errors.customer_requirement && state.error.errors.customer_requirement[0]" />
                    </div>
                    <div class="space-y-1">
                        <FormButton type="submit" buttonStyle="primary" class="rounded-md w-full">
                            Send Inquiry
                        </FormButton>
                    </div>
                </form>
            </div>
        </section>
        <section class="max-w-8xl mx-auto py-2">
            <div class="divider"></div>
        </section>
        <section class="max-w-8xl mx-auto pt-16 pb-20 sm:py-10 xs:py-10">
            <div class="space-y-3">
                <h3 class="text-center text-2xl text-primary-800">Come Visit Us</h3>
                <p class="text-center text-sm">
                    <iframe class="w-full h-96"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7919.104332245982!2d125.59132399999999!3d7.061787!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x8a61671c72b79476!2sGalerio%20Environmental%20Consultancy%20Inc.%2C%20Philippines!5e0!3m2!1sen!2sph!4v1665386597921!5m2!1sen!2sph"
                        style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"></iframe>
                </p>
            </div>
        </section>
</NuxtLayout>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import {
    OfficeBuildingIcon,
    MailIcon,
    PhoneIcon,
} from '@heroicons/vue/outline'
import { useVuelidate } from "@vuelidate/core"
import { required, helpers } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import { useContactStore } from '@/store/contact'
import { contactService } from '@/components/api/ContactService'
import Swal from 'sweetalert2'

const contactStore = useContactStore()

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const state = reactive({
    banner: {
        image_url: '/assets/img/banner/contact.png',
        title: 'Contact Us',
    },
    contactForm: {
        name: null,
        company: null,
        email: null,
        contact_via_phone: false,
        phone_number: null,
        message: null,
    },
    error: [],
    solarInquiryForm: {
        name: null,
        email: null,
        phone_number: null,
        average_monthly_bill: null,
        address: null,
        customer_requirement: null,
    },
})

const rulesContactUs = computed(() => {
    return {
        contactForm: {
            name: {
                required: helpers.withMessage('This field is required.', required),
            },
            company: {
                required: helpers.withMessage('This field is required.', required),
            },
            email: {
                required: helpers.withMessage('This field is required.', required),
            },
            message: {
                required: helpers.withMessage('This field is required.', required),
            },
        },
    }
})
const vContactUs$ = useVuelidate(rulesContactUs, state)

const rulesSolarInquiry = computed(() => {
    return {
        solarInquiryForm: {
            name: {
                required: helpers.withMessage('This field is required.', required),
            },
            email: {
                required: helpers.withMessage('This field is required.', required),
            },
            phone_number: {
                required: helpers.withMessage('This field is required.', required),
            },
            average_monthly_bill: {
                required: helpers.withMessage('This field is required.', required),
            },
            address: {
                required: helpers.withMessage('This field is required.', required),
            },
            customer_requirement: {
                required: helpers.withMessage('This field is required.', required),
            },
        }
    }
})
const vSolarInquiry$ = useVuelidate(rulesSolarInquiry, state)

async function handleSubmitMessage() {
    state.error = null
    vContactUs$.value.$validate()
    if (!vContactUs$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                full_name: state.contactForm.name,
                company: state.contactForm.company,
                email: state.contactForm.email,
                contact_via_phone: state.contactForm.contact_via_phone,
                phone_number: state.contactForm.phone_number,
                message: state.contactForm.message,
            }
            const response = await contactService.sendContactUs(params)
            if (response) {
                successAlert('Success!', t('sendContactUs'))
                state.contactForm = {
                    name: null,
                    company: null,
                    email: null,
                    contact_via_phone: false,
                    phone_number: null,
                    message: null,
                }
                vContactUs$.value.$reset()
            }
        } catch (error) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

async function handleSubmitSolarInquiry() {
    state.error = null
    vSolarInquiry$.value.$validate()
    if (!vSolarInquiry$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                full_name: state.solarInquiryForm.name,
                email: state.solarInquiryForm.email,
                phone_number: state.solarInquiryForm.phone_number,
                monthly_bill: state.solarInquiryForm.average_monthly_bill,
                address: state.solarInquiryForm.address,
                requirement: state.solarInquiryForm.customer_requirement,
            }
            const response = await contactService.sendSolarInquiry(params)
            if (response) {
                successAlert('Success!', t('sendSolarInquiry'))
                state.solarInquiryForm = {
                    name: null,
                    email: null,
                    phone_number: null,
                    average_monthly_bill: null,
                    address: null,
                    customer_requirement: null,
                }
                vSolarInquiry$.value.$reset()
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
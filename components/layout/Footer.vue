<template>
    <footer class="bg-primary-800 text-white py-14">
        <VueLoading :active="state.isPageLoading" />
        <div class="mx-auto container max-w-8xl">
            <div class="grid grid-cols-1 gap-x-10 gap-y-10 flex-wrap lg:grid-cols-4 md:grid-cols-2 md:gap-x-16">
                <div>
                    <div class="flex flex-col justify-center gap-x-4 gap-y-2 sm:items-center xs:items-center">
                        <div class="flex items-center">
                            <img src="/assets/img/logo.png" class="w-24" alt="Logo" />
                        </div>
                        <p class="text-white tracking-wide">
                            Galerio Environmental <br class="hidden lg:block md:block" /> Consultancy Inc.
                        </p>
                        <a href="https://acrobat.adobe.com/link/track?uri=urn%3Aaaid%3Ascds%3AUS%3A15f4323e-aad2-31ff-9565-acd4a52fe33a&viewer%21megaVerb=group-discover"
                            class="mt-4" target="blank">
                            <img src="/assets/img/duns-registered.png" class="w-24" alt="D-U-N-S Registered" />
                        </a>
                    </div>
                </div>
                <div>
                    <h3 class="mb-3 text-lg">Quick Links</h3>
                    <div class="flex gap-x-10">
                        <div class="grow flex flex-col gap-y-3 text-sm">
                            <a v-for="(link, index) in links1" :key="index"
                                class="cursor-pointer hover:text-primary-100" @click="navigateToPage(link.href)">
                                {{ link.text }}
                            </a>
                        </div>
                        <div class="grow flex flex-col gap-y-3 text-sm">
                            <a v-for="(link, index) in links2" :key="index"
                                class="cursor-pointer hover:text-primary-100" @click="navigateToPage(link.href)">
                                {{ link.text }}
                            </a>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 class="mb-3 text-lg">Recent Projects</h3>
                    <div class="grow flex flex-col gap-y-5">
                        <div v-for="(project, index) in state.recentProjects.slice(0, 3)" :key="index"
                            @click="viewProject(project)" class="cursor-pointer hover:text-primary-100">
                            <div>
                                <p>{{ project.title }}</p>
                                <p class="my-1 text-xs line-clamp-2">{{ project.description }}</p>
                                <p class="text-xs mt-1">{{ formatDateToReadable(project.published_date) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="grow flex flex-col gap-y-6 text-sm">
                        <div class="flex gap-x-3 gap-y-6">
                            <div class="w-5">
                                <LocationMarkerIcon class="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div class="flex flex-col gap-y-4">
                                <p class="whitespace-pre-wrap">
                                    {{ state.contact && state.contact.offices }}
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-x-3 gap-y-6">
                            <div class="w-5">
                                <MailIcon class="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div class="flex flex-col gap-y-4">
                                <p class="whitespace-pre-wrap">
                                    {{ state.contact && state.contact.emails }}
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-x-3 gap-y-6">
                            <div class="w-5">
                                <PhoneIcon class="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div class="flex flex-col gap-y-4">
                                <p class="whitespace-pre-wrap">
                                    {{ state.contact && state.contact.phones }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import moment from 'moment'
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { useProjectStore } from '@/store/project'
import { useContactStore } from '@/store/contact'
import { contactService } from '@/components/api/ContactService'
import { projectService } from '@/components/api/ProjectService'
import {
    LocationMarkerIcon,
    MailIcon,
    PhoneIcon,
} from '@heroicons/vue/outline'

const projectStore = useProjectStore()
const contactStore = useContactStore()

const links1 = [
    { text: 'Home', href: '/' },
    { text: 'About Us', href: '/about-us' },
    { text: 'Projects', href: '/projects' },
    { text: 'Services', href: '/services' },
    { text: 'Training', href: '/trainings' },
]

const links2 = [
    { text: 'Blogs', href: '/blogs' },
    { text: 'Career', href: '/career' },
    { text: 'Contact Us', href: '/contact-us' },
]

const state = reactive({
    error: null,
    isPageLoading: false,
    contact: null,
    recentProjects: []
})

onMounted(() => {
    fetchContact()
    fetchRecentProjects()
})

async function fetchContact() {
    state.isPageLoading = true
    try {
        const response = await contactService.getWebsiteContact()
        if (response) {
            state.contact = response.data[0]
            contactStore.setWebsiteContact(response.data[0])
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

async function fetchRecentProjects() {
    state.isPageLoading = true
    try {
        const response = await projectService.getWebsiteOngoingProjects()
        if (response.data) {
            state.recentProjects = response.data
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

function navigateToPage(link) {
    navigateTo(link)
}

function viewProject(project) {
    projectStore.setSelectedWebsiteProject(project)
    navigateTo('/projects/' + project.slug)
}

function formatDateToReadable(date) {
    return moment(date).format('LL')
}
</script>
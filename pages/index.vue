<template>
    <NuxtLayout name="website">

        <Head>
            <Title>{{ runtimeConfig.appName }}</Title>
            <Meta name="description" :content="strippedHtml(state.aboutUs && state.aboutUs.content)" />
        </Head>

        <div v-if="state.landingFeaturedImages.length > 0">
            <Carousel :settings='settings'>
                <Slide v-for="(item, index) in state.landingFeaturedImages" :key="index">
                    <div class="h-full flex items-center justify-center">
                        <img :src="item.image_url" alt="Image failed to load" class="w-full h-full object-cover">
                    </div>
                </Slide>
            </Carousel>
        </div>
        <section class="max-w-8xl mx-auto py-16">
            <div class="space-y-8">
                <p class="text-center text-3xl font-medium text-primary-800">
                    {{ state.landing.header_text }}
                </p>
                <p class="text-center max-w-5xl mx-auto text-primary-800 " v-html="state.aboutUs.content"></p>
                <div class="flex justify-center">
                    <FormButton buttonStyle="primary" class="rounded-md" @click="navigateTo('/about-us')">
                        Find out more
                        <template #icon-right>
                            <ArrowRightIcon class="h-4 w-4" aria-hidden="true" />
                        </template>
                    </FormButton>
                </div>
            </div>
        </section>
        <section class="max-w-8xl mx-auto py-2">
            <div class="divider"></div>
        </section>
        <section class="max-w-8xl mx-auto py-16">
            <div class="space-y-8">
                <h3 class="text-center text-2xl font-medium text-primary-800">Services Offered</h3>
                <div class="grid grid-cols-5 gap-y-8 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
                    <div class="col-span-1 text-center space-y-2 p-4 cursor-pointer hover:bg-gray-100 hover:rounded-md"
                        v-for="(service, key) in state.services" :key="key" @click="viewService(service)">
                        <div class="flex justify-center">
                            <img :src="service.icon_url" :alt="service.title" class="w-36">
                        </div>
                        <h5 class="text-lg font-medium">{{ service.title }}</h5>
                        <p class="text-sm text-gray-600 mt-2">
                            {{ service.description }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <section class="max-w-8xl mx-auto py-2">
            <div class="divider"></div>
        </section>
        <section class="max-w-8xl mx-auto py-16">
            <div class="space-y-8">
                <h3 class="text-center text-2xl font-medium text-primary-800">Recent Projects</h3>
                <div class="grid grid-cols-3 gap-x-10 gap-y-8 md:grid-cols-2 md:gap-6 sm:grid-cols-1 xs:grid-cols-1">
                    <ContainerProject v-for="(project, index) in state.recentProjects" :key="index" :data="project"
                        @click="viewProject(project)" />
                </div>
                <div class="text-center py-10" v-if="state.recentProjects && state.recentProjects.length < 1">
                    <h3>No Data Found</h3>
                </div>
                <div class="flex justify-center">
                    <FormButton buttonStyle="primary" class="rounded-md" @click="navigateTo('/projects')">
                        See more projects
                        <template #icon-right>
                            <ArrowRightIcon class="h-4 w-4" aria-hidden="true" />
                        </template>
                    </FormButton>
                </div>
            </div>
        </section>
        <section class="max-w-8xl mx-auto py-2">
            <div class="divider"></div>
        </section>
        <div class="lg:mb-10">
            <div id="video-player" class="py-10 lg:py-20 md:px-12 sm:px-6 xs:px-6">
                <div class="max-w-5xl mx-auto">
                    <iframe class="w-full rounded-xl" height="500" :src="state.landing.video_url" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                </div>
            </div>
        </div>
</NuxtLayout>
</template>

<script setup>
import { aboutUsService } from '@/components/api/AboutUsService'
import { landingService } from '@/components/api/LandingService'
import { landingFeaturedImagesService } from '@/components/api/LandingFeaturedImagesService'
import { projectService } from '@/components/api/ProjectService'
import { serviceService } from '@/components/api/ServiceService'
import {
    ArrowRightIcon,
} from '@heroicons/vue/outline'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const runtimeConfig = useRuntimeConfig()
const settings = {
    autoplay: 3000,
    wrapAround: true,
}

const state = reactive({
    aboutUs: [],
    error: null,
    isPageLoading: false,
    landing: [],
    landingFeaturedImages: [],
    recentProjects: [],
    services: [],
})

onMounted(() => {
    state.isPageLoading = true
    fetchLandingFeaturedImages()
    fetchLanding()
    fetchAboutUs()
    fetchServices()
    fetchRecentProjects()
    state.isPageLoading = false
})

async function fetchLandingFeaturedImages() {
    try {
        const response = await landingFeaturedImagesService.getWebsiteLandingFeaturedImages()
        if (response.data) {
            state.landingFeaturedImages = response.data
        }
    } catch (error) {
        state.error = error
    }
}

async function fetchLanding() {
    try {
        const response = await landingService.getWebsiteLanding()
        if (response.data) {
            state.landing = response.data[0]
        }
    } catch (error) {
        state.error = error
    }
}

async function fetchAboutUs() {
    try {
        const response = await aboutUsService.getWebsiteAboutUs()
        if (response.data) {
            state.aboutUs = response.data[0]
        }
    } catch (error) {
        state.error = error
    }
}

async function fetchServices() {
    try {
        const response = await serviceService.getWebsiteServices()
        if (response.data) {
            state.services = response.data
        }
    } catch (error) {
        state.error = error
    }
}

async function fetchRecentProjects() {
    try {
        const response = await projectService.getWebsiteOngoingProjects()
        if (response.data) {
            state.recentProjects = response.data.slice(0, 6)
        }
    } catch (error) {
        state.error = error
    }
}

function viewService(service) {
    navigateTo('/services/' + service.slug)
}

function viewProject(project) {
    navigateTo('/projects/' + project.slug)
}

function strippedHtml(content) {
    let regex = /(<([^>]+)>)/ig;
    if (content) {
        return content.replace(regex, "");
    }
}
</script>
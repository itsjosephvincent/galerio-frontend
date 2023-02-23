<template>
    <NuxtLayout name="website">

        <Head>
            <Title>Projects | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <HeaderBanner :image_url="state.banner.image_url" :title="state.banner.title"
            :description="state.banner.description" />
        <section class="max-w-8xl mx-auto py-10">
            <div class="flex flex-col gap-y-8">
                <h3 class="text-2xl font-medium text-primary-800">Ongoing Projects</h3>
                <div class="grid grid-cols-3 gap-x-10 gap-y-8 md:grid-cols-2 md:gap-6 sm:grid-cols-1 xs:grid-cols-1">
                    <ContainerProject v-for="(project, index) in state.recentProjects.data" :key="index" :data="project"
                        @click="viewProject(project)" />
                </div>
                <div class="text-center py-10" v-if="state.recentProjects.data && state.recentProjects.data.length < 1">
                    <h3>No Data Found</h3>
                </div>
                <Pagination :data="state.recentProjects" @previous="previousRecentProjects"
                    @next="nextCompletedProjects" class="mt-5" />
            </div>
        </section>
        <section class="max-w-8xl mx-auto py-2">
            <div class="divider"></div>
        </section>
        <section class="max-w-8xl mx-auto py-10">
            <div class="flex flex-col gap-y-8">
                <h3 class="text-2xl font-medium text-primary-800">Completed Projects</h3>
                <div class="grid grid-cols-3 gap-x-4 gap-y-8 md:grid-cols-2 md:gap-6 sm:grid-cols-1 xs:grid-cols-1">
                    <ContainerProject v-for="(project, index) in state.completedProjects.data" :key="index"
                        :data="project" @click="viewProject(project)" />
                </div>
                <div class="text-center py-10"
                    v-if="state.completedProjects.data && state.completedProjects.data.length < 1">
                    <h3>No Data Found</h3>
                </div>
                <Pagination :data="state.recentProjects" @previous="previousCompletedProjects"
                    @next="nextCompletedProject" class="mt-5" />
            </div>
        </section>
    </NuxtLayout>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { projectService } from '@/components/api/ProjectService'
import { useProjectStore } from '@/store/project'

const projectStore = useProjectStore()
const currentOngoingProjectsTablePage = projectStore.getCurrentWebsiteOngoingProjectsPage
const currentCompletedProjectsTablePage = projectStore.getCurrentWebsiteCompletedProjectsPage

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    banner: {
        image_url: '/assets/img/banner/projects.png',
        title: 'Our Projects',
        description: 'Listed below are the projects and experiences of the GEC Environmental Consultancy through the projects and experiences of its consultants',
    },
    carouselImages: [
        { image_url: 'https://galerioenvi.com/img/homepage/1.jpg' },
        { image_url: 'https://galerioenvi.com/img/davaosamalconnector/Samal1.jpg' },
        { image_url: 'https://galerioenvi.com/img/homepage/caraga1.jpg' },
    ],
    completedProjects: [],
    error: null,
    isPageLoading: false,
    recentProjects: []
})

onMounted(() => {
    fetchRecentProjects()
    fetchCompletedProjects()
})

async function fetchRecentProjects() {
    state.isPageLoading = true
    try {
        const params = {
            page: currentOngoingProjectsTablePage,
        }
        const response = await projectService.getWebsiteOngoingProjects(params)
        if (response) {
            state.recentProjects = response
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

function previousRecentProjects() {
    currentTablePage--
    projectStore.setCurrentWebsiteOngoingProjectsPage(currentOngoingProjectsTablePage)
    fetchRecentProjects()
}

function nextCompletedProjects() {
    currentTablePage++
    projectStore.setCurrentWebsiteOngoingProjectsPage(currentOngoingProjectsTablePage)
    fetchRecentProjects()
}

async function fetchCompletedProjects() {
    state.isPageLoading = true
    try {
        const params = {
            page: currentCompletedProjectsTablePage,
        }
        const response = await projectService.getWebsiteCompletedProjects(params)
        if (response) {
            state.completedProjects = response
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

function previousCompletedProjects() {
    currentTablePage--
    projectStore.setCurrentWebsiteCompletedProjectsPage(currentCompletedProjectsTablePage)
    fetchCompletedProjects()
}

function nextCompletedProject() {
    currentTablePage++
    projectStore.setCurrentWebsiteCompletedProjectsPage(currentCompletedProjectsTablePage)
    fetchCompletedProjects()
}

function viewProject(project) {
    projectStore.setSelectedWebsiteProject(project)
    navigateTo('/projects/' + project.slug)
}
</script>
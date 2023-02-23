<template>
    <NuxtLayout name="website">

        <Head>
            <Title>Project - {{ state.project && state.project.title }} | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <HeaderBanner :image_url="state.banner.image_url"
            :title="state.project && state.project.title ? state.project.title : 'Project'"
            :description="state.banner.description" />
        <section class="max-w-8xl mx-auto py-16 space-y-4">
            <div id="content" v-html="state.project && state.project.content"></div>
        </section>
    </NuxtLayout>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { projectService } from '@/components/api/ProjectService'

const route = useRoute()
const selectedProjectSlug = route.params.slug

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    banner: {
        image_url: '/assets/img/banner/projects.png',
        title: '',
    },
    error: null,
    isPageLoading: false,
    project: []
})

onMounted(() => {
    fetchProject()
})

async function fetchProject() {
    state.isPageLoading = true
    try {
        const response = await projectService.getWebsiteProjectBySlug(selectedProjectSlug)
        if (response.data) {
            state.project = response.data
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

function backtoProjects() {
    navigateTo('/projects')
}
</script>
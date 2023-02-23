<template>
    <NuxtLayout name="website">

        <Head>
            <Title>Blog - {{ state.blog.title }} | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <HeaderBanner :image_url="state.banner.image_url"
            :title="state.blog && state.blog.title ? state.blog.title : 'Blog'"
            :description="state.banner.description" />
        <section class="max-w-8xl mx-auto py-16 space-y-4">
            <div id="content" v-html="state.blog && state.blog.content"></div>
        </section>
    </NuxtLayout>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { blogService } from '@/components/api/BlogService'

const route = useRoute()
const selectedBlogSlug = route.params.slug

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    banner: {
        image_url: '/assets/img/banner/blogs.png',
        title: 'Blogs & Updates',
    },
    error: null,
    isPageLoading: false,
    blog: []
})

onMounted(() => {
    fetchBlog()
})

async function fetchBlog() {
    state.isPageLoading = true
    try {
        const response = await blogService.getWebsiteBlogBySlug(selectedBlogSlug)
        if (response.data) {
            state.blog = response.data
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

function backtoBlogs() {
    navigateTo('/blogs')
}
</script>
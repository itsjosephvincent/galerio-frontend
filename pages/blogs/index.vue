<template>
    <NuxtLayout name="website">

        <Head>
            <Title>Blogs | {{ runtimeConfig.appName }}</Title>
        </Head>

        <VueLoading :active="state.isPageLoading" />
        <HeaderBanner :image_url="state.banner.image_url" :title="state.banner.title"
            :description="state.banner.description" />
        <section class="max-w-8xl mx-auto py-10">
            <div class="flex flex-col gap-y-8">
                <div class="grid grid-cols-3 gap-x-10 gap-y-8 md:grid-cols-2 md:gap-6 sm:grid-cols-1 xs:grid-cols-1">
                    <ContainerBlog v-for="(blog, index) in state.blogs.data" :key="index" :data="blog"
                        @click="viewBlog(blog)" />
                </div>
                <div class="text-center py-10" v-if="state.blogs.data && state.blogs.data.length < 1">
                    <h3>No Data Found</h3>
                </div>
                <Pagination :data="state.blogs" @previous="previous" @next="next" class="mt-5" />
            </div>
        </section>
    </NuxtLayout>
</template>

<script setup>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { useBlogStore } from '@/store/blog'
import { blogService } from '@/components/api/BlogService'

const blogStore = useBlogStore()
let currentTablePage = blogStore.getCurrentWebsiteBlogsPage

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    banner: {
        image_url: '/assets/img/banner/blogs.png',
        title: 'Blogs & Updates',
    },
    carouselImages: [
        { image_url: 'https://galerioenvi.com/img/homepage/1.jpg' },
        { image_url: 'https://galerioenvi.com/img/davaosamalconnector/Samal1.jpg' },
        { image_url: 'https://galerioenvi.com/img/homepage/caraga1.jpg' },
    ],
    error: null,
    isPageLoading: false,
    blogs: []
})

onMounted(() => {
    fetchBlogs()
})

async function fetchBlogs() {
    state.isPageLoading = true
    try {
        const params = {
            page: currentTablePage,
        }
        const response = await blogService.getWebsiteBlogs(params)
        if (response) {
            state.blogs = response
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

function previous() {
    currentTablePage--
    blogStore.setCurrentWebsiteBlogsPage(currentTablePage)
    fetchBlogs()
}

function next() {
    currentTablePage++
    blogStore.setCurrentWebsiteBlogsPage(currentTablePage)
    fetchBlogs()
}

function viewBlog(blog) {
    blogStore.setSelectedWebsiteBlog(blog)
    navigateTo('/blogs/' + blog.slug)
}
</script>
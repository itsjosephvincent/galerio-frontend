<template>
    <NuxtLayout name="website">

        <Head>
            <Title>About Us | {{ runtimeConfig.appName }}</Title>
            <Meta name="description" :content="strippedHtml(state.aboutUs && state.aboutUs.content)" />
        </Head>

        <HeaderBanner :image_url="state.banner.image_url" :title="state.banner.title" />
        <!-- <section class="max-w-8xl mx-auto pt-16 pb-10">
            <div class="md:px-2 sm:px-2 xs:px-2">
                <div class="max-w-7xl mx-auto">
                    <iframe class="w-full rounded-xl h-[550px] md:h-96 sm:h-52 xs:h-52"
                        src="https://www.youtube.com/embed/rKCH4BuR0cU"
                        title="Smooth Piano Jazz Music in 4K Cozy Bedroom in Los Angeles - Background Instrumental to Relax, Study"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                </div>
            </div>
        </section> -->
        <section class="max-w-8xl mx-auto py-5 pt-16">
            <div class="flex flex-col gap-y-8">
                <p id="content" v-html="state.aboutUs && state.aboutUs.content"></p>
            </div>
        </section>
        <section class="max-w-8xl mx-auto py-5">
            <div class="flex flex-col gap-y-8">
                <h3 class="text-2xl font-medium text-primary-800">Mission</h3>
                <p>
                    {{ state.aboutUs && state.aboutUs.mission }}
                </p>
            </div>
        </section>
        <section class="max-w-8xl mx-auto pt-5 pb-16">
            <div class="flex flex-col gap-y-8">
                <h3 class="text-2xl font-medium text-primary-800">Vision</h3>
                <p>
                    {{ state.aboutUs && state.aboutUs.vision }}
                </p>
            </div>
        </section>
    </NuxtLayout>
</template>

<script setup>
import { aboutUsService } from '@/components/api/AboutUsService'

const runtimeConfig = useRuntimeConfig()
const state = reactive({
    banner: {
        image_url: '/assets/img/banner/about.png',
        title: 'About Us',
    },
    aboutUs: null
})

onMounted(() => {
    fetchAboutUs()
})

async function fetchAboutUs() {
    state.isPageLoading = true
    try {
        const response = await aboutUsService.getWebsiteAboutUs()
        if (response.data) {
            state.aboutUs = response.data[0]
        }
    } catch (error) {
        state.error = error
    }
    state.isPageLoading = false
}

function strippedHtml(content) {
    let regex = /(<([^>]+)>)/ig;
    if (content) {
        return content.replace(regex, "");
    }
}
</script>
<template>
    <div class="bg-no-repeat bg-cover" :style="`background-image: url('${props.image_url}')`">
        <div class="max-w-6xl mx-auto md:px-10 sm:px-6 xs:px-6">
            <div class="h-80 flex flex-col items-center justify-center gap-y-4 md:h-48 sm:h-36 xs:h-36">
                <h2 class="text-3xl font-medium text-center text-white sm:text-xl xs:text-xl">{{ props.title }}</h2>
                <p class="text-white text-center sm:text-xs xs:text-xs" v-if="props.description">
                    {{ props.description }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    image_url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    }
})
</script>
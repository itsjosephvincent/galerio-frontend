<template>
    <div class="relative gap-y-4 cursor-pointer px-5 py-6 hover:bg-gray-50">
        <div class="relative mb-6">
            <div class="relative">
                <div class="relative lg:h-72 md:h-56 sm:h-52 xs:h-52">
                    <img :src="props.data.thumbnail_url" alt="Image failed to load"
                        class="w-full h-full object-cover" />
                </div>
                <div class="absolute w-full bg-gray-400/50 backdrop-blur-sm bottom-0 px-6 py-3">
                    <div class="flex gap-x-1 text-white">
                        <div class="w-4">
                            <LocationMarkerIcon class="h-4 w-4" aria-hidden="true" />
                        </div>
                        <p class="text-sm">{{ props.data.location }}</p>
                    </div>
                    <p class="text-xs text-white mt-1">{{ props.data.date_posted }}</p>
                </div>
            </div>
            <div class="mt-6">
                <h3 class="text-gray-800 text-xl font-medium">{{ props.data.title }}</h3>
                <p class="text-gray-600 text-sm mt-3 line-clamp-3">{{ props.data.description }}</p>
            </div>
        </div>
        <div class="absolute bottom-4">
            <button class="flex gap-x-1 text-primary-800 hover:text-primary-600">
                <span class="text-sm">Read more</span>
                <ArrowRightIcon class="h-4 w-4 -rotate-45" aria-hidden="true" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    LocationMarkerIcon,
    ArrowRightIcon,
} from '@heroicons/vue/outline'

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})
</script>
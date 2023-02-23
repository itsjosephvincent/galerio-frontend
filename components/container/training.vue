<template>
    <div class="flex items-center gap-x-6 gap-y-6 cursor-pointer px-10 py-6 hover:bg-gray-50 sm:flex-col xs:flex-col">
        <div>
            <div class="flex justify-center w-96 h-56 md:w-64 md:h-auto sm:w-full xs:w-full">
                <img :src="props.data && props.data.thumbnail_url" alt="Image failed to load"
                    class="object-contain h-full">
            </div>
        </div>
        <div class="grow flex flex-col justify-center gap-y-3">
            <p class="text-primary-800 text-sm font-medium">
                {{ formatDateToReadable(props.data && props.data.date_from) }}
            </p>
            <h4 class="font-medium text-xl">
                {{ props.data && props.data.title }}
            </h4>
            <p class="font-gray-500 line-clamp-3" v-html="props.data && props.data.description"></p>
        </div>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment'

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})

function formatDateToReadable(date) {
    return moment(date).format('LL')
}
</script>
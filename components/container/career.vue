<template>
    <div class="px-4 py-6 bg-whtite shadow-md border-l-4 border-primary-800">
        <p class="text-sm">
            Posted: <span v-if="props.data && props.data.published_date">
                {{ formatDateTimeToReadable(props.data.published_date) }}
            </span>
        </p>
        <h5 class="text-lg font-medium py-2">
            {{ props.data.title }}
        </h5>
        <p class="py-1 text-sm" :class="!state.isShowMoreOpen && 'line-clamp-1'" v-html="props.data && props.data.content">
        </p>
        <button class="text-primary-800 hover:text-primary-600 text-sm"
            @click="state.isShowMoreOpen = !state.isShowMoreOpen">
            {{ state.isShowMoreOpen ? 'Show less...' : 'Show more...' }}
        </button>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment'

const state = reactive({
    isShowMoreOpen: false,
})

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})

function formatDateTimeToReadable(datetime) {
    return moment(datetime).format('LL')
}
</script>
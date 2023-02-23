<template>
    <div class="w-full flex my-3 gap-y-3 sm:flex-col sm:items-center xs:flex-col xs:items-center"
        v-if="props.data && props.data.links">
        <div class="grow">
            <button class="w-28 px-4 py-2"
                :class="props.data.links && props.data.links.prev === null ? 'rounded-md border border-primary-600 text-primary-600 cursor-not-allowed' : 'rounded-md border border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white'"
                @click="!(props.data.links && props.data.links.prev === null) && $emit('previous')">Previous</button>
        </div>
        <div class="text-sm">
            Showing page {{ props.data.meta.current_page }} of {{ props.data.meta.last_page }}
        </div>
        <div class="grow flex flex-row justify-end">
            <button class="w-28 px-4 py-2"
                :class="props.data.links && props.data.links.next === null ? 'rounded-md border border-primary-600 text-primary-600 cursor-not-allowed' : 'rounded-md border border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white'"
                @click="!(props.data.links && props.data.links.next === null) && $emit('next')">Next</button>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})
</script>
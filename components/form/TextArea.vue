<template>
    <textarea type="text" :name="props.name" :autocomplete="props.name"
        class="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-800 focus:border-primary-800 focus:z-10 sm:text-sm"
        :placeholder="props.placeholder" :value="props.modelValue" :rows="props.rows"
        @input="updateValue($event)"></textarea>
</template>

<script setup lang="ts">
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    modelValue: String,
    placeholder: {
        type: String,
        required: true,
    },
    rows: {
        type: Number,
        required: false,
        default: 4,
    },
})

const emit = defineEmits(['update:modelValue'])

function updateValue(event: any) {
    emit('update:modelValue', event.target.value)
}
</script>
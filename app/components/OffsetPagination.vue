<script setup lang="ts">
    defineProps<{
        offset: number
        limit: number
        hasNext: boolean
    }>()

    const emit = defineEmits<{
        prev: []
        next: []
    }>()
</script>

<template>
    <div class="flex justify-end items-center gap-2">
        <p class="mb-0 dark:text-gray-500">Showing from {{ offset + 1 }}</p>
        <UButton
            icon="i-lucide-chevron-left"
            color="neutral"
            variant="outline"
            :disabled="offset <= 0"
            @click="emit('prev')"
        />
        <UButton
            icon="i-lucide-chevron-right"
            color="neutral"
            variant="outline"
            :disabled="!hasNext"
            @click="emit('next')"
        />
    </div>
</template>

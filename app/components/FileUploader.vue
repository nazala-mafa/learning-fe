<script setup lang="ts">
    const { path, preview = true } = defineProps<{ path: string, preview?: boolean }>()
    const fileUrl = defineModel<string>()
    const value = ref(null)

    const { $api } = useNuxtApp()

    async function onUpload(file: File) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('path', path)
        const uploaded = await $api('/uploads/', {
            method: 'POST',
            body: formData,
        }) as {
            url: string
        }
        fileUrl.value = uploaded.url
    }
</script>

<template>
    <div v-if="value === null && !!fileUrl" class="relative overflow-hidden">
        <UButton icon="i-lucide-x" size="xs" color="neutral" class="rounded-full absolute -top-2 -right-2 cursor-pointer z-10" @click="fileUrl = undefined" />
        <img v-if="preview" :src="fileUrl" class="h-48 w-full object-cover rounded" />
        <div v-else class="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-700 rounded">
            <UIcon name="i-lucide-file" class="size-5 shrink-0" />
            <span class="truncate text-sm">{{ fileUrl }}</span>
        </div>
    </div>
    <UFileUpload
        v-else
        v-model="value"
        v-on:update:model-value="(e) => {
            if (e) {
                onUpload(e);
            }
        }"
        class="min-h-48"
    />
</template>

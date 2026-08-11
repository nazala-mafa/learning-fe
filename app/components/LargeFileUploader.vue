<script setup lang="ts">
    const { path, preview = false, type } = defineProps<{ path: string, preview?: boolean, type?: string }>()
    const fileUrl = defineModel<string>()
    const value = ref(null)
    const uploading = ref(false)
    const progress = ref(0)

    const { $api } = useNuxtApp()
    const { chunkSizeBytes } = useUploadConfig()

    const accept = computed(() => type === 'tiff' ? '.tif,.tiff,image/tiff' : undefined)

    async function onUpload(file: File) {
        uploading.value = true
        progress.value = 0
        try {
            fileUrl.value = await uploadInChunks(file)
        } finally {
            uploading.value = false
        }
    }

    async function uploadInChunks(file: File): Promise<string> {
        const totalChunks = Math.max(1, Math.ceil(file.size / chunkSizeBytes))
        const uploadId = crypto.randomUUID()
        let uploadedUrl = ''

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * chunkSizeBytes
            const chunk = file.slice(start, start + chunkSizeBytes)

            const formData = new FormData()
            formData.append('file', chunk, file.name)
            formData.append('path', path)
            formData.append('filename', file.name)
            formData.append('upload_id', uploadId)
            formData.append('chunk_index', String(chunkIndex))
            formData.append('total_chunks', String(totalChunks))

            const res = await $api('/uploads/chunk/', {
                method: 'POST',
                body: formData,
            }) as { done: boolean, url?: string }

            progress.value = Math.round(((chunkIndex + 1) / totalChunks) * 100)

            if (res.done && res.url) {
                uploadedUrl = res.url
            }
        }

        return uploadedUrl
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
    <div v-else class="space-y-2">
        <UFileUpload
            v-model="value"
            :accept="accept"
            :disabled="uploading"
            v-on:update:model-value="(e) => {
                if (e) {
                    onUpload(e);
                }
            }"
            class="min-h-48"
        />
        <div v-if="uploading" class="space-y-1">
            <UProgress :model-value="progress" />
            <p class="text-xs text-gray-500">Uploading... {{ progress }}%</p>
        </div>
    </div>
</template>

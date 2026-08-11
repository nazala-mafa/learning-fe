export function useUploadConfig() {
    const config = useRuntimeConfig()
    const chunkSizeMb = Number(config.public.uploadChunkSizeMb) || 5

    return {
        chunkSizeMb,
        chunkSizeBytes: chunkSizeMb * 1024 * 1024,
    }
}

<script setup lang="ts">
    import L from 'leaflet';
    import parseGeoraster from 'georaster';
    import GeoRasterLayer from 'georaster-layer-for-leaflet';

    const { url } = defineProps<{ url: string }>()

    const mapContainer = ref<HTMLElement | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)
    let map: L.Map | null = null

    onMounted(async () => {
        if (!mapContainer.value) return

        map = L.map(mapContainer.value).setView([0, 0], 2)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 22,
        }).addTo(map)

        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error('Failed to fetch GeoTIFF file')
            const arrayBuffer = await response.arrayBuffer()
            const georaster = await parseGeoraster(arrayBuffer)

            const layer = new GeoRasterLayer({
                georaster,
                opacity: 0.85,
                resolution: 256,
            })
            layer.addTo(map)
            map.fitBounds(layer.getBounds())
        } catch (e) {
            console.error(e)
            error.value = 'Failed to parse GeoTIFF file'
        } finally {
            loading.value = false
        }
    })

    onBeforeUnmount(() => {
        map?.remove()
        map = null
    })
</script>

<template>
    <div class="relative">
        <div ref="mapContainer" class="h-96 w-full rounded overflow-hidden border border-gray-200 dark:border-gray-800" />
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70">
            <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin" />
        </div>
        <p v-if="error" class="text-sm text-error mt-2">{{ error }}</p>
    </div>
</template>

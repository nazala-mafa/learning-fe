<script setup lang="ts">
    import type { Product } from '~/types/product';
    import type { ProductCategory } from '~/types/productCategory';
    import GeoTiffMap from '~/components/product/GeoTiffMap.vue';

    definePageMeta({
        layout: 'dashboard',
        title: 'Preview Product',
    })

    const id = useRoute().params.id

    const { $api } = useNuxtApp();

    const product = await $api(`/master-data/products/${id}`) as Product

    const category = product.product_category_id
        ? await $api(`/master-data/product/categories/${product.product_category_id}`) as ProductCategory
        : null

    function filenameFromUrl(url?: string | null) {
        if (!url) return ''
        return url.split('/').pop() ?? url
    }
</script>

<template>
    <div class="flex gap-5 items-start">
        <div class="flex-1 space-y-5">
            <UCard>
                <template #header>
                    <h2 class="mb-0">Product Preview</h2>
                </template>

                <div class="space-y-4">
                    <img v-if="product.image_url" :src="product.image_url" class="h-64 w-full object-cover rounded" />

                    <dl class="grid grid-cols-3 gap-y-2 text-sm">
                        <dt class="text-gray-500">ID</dt>
                        <dd class="col-span-2">{{ product.id }}</dd>

                        <dt class="text-gray-500">Name</dt>
                        <dd class="col-span-2">{{ product.nama }}</dd>

                        <dt class="text-gray-500">Description</dt>
                        <dd class="col-span-2 whitespace-pre-wrap">{{ product.desc || '-' }}</dd>

                        <dt class="text-gray-500">Category</dt>
                        <dd class="col-span-2">{{ category?.name || '-' }}</dd>
                    </dl>
                </div>
            </UCard>

            <UCard>
                <template #header>
                    <h2 class="mb-0">GeoTIFF</h2>
                </template>

                <div v-if="product.geotiff_url" class="space-y-2">
                    <p class="text-sm text-gray-500 truncate">{{ filenameFromUrl(product.geotiff_url) }}</p>
                    <GeoTiffMap :url="product.geotiff_url" />
                </div>
                <p v-else class="text-sm text-gray-400">No GeoTIFF uploaded</p>
            </UCard>
        </div>

        <UCard class="w-75">
            <template #header>
                <h2 class="mb-0">Action</h2>
            </template>
            <div class="flex gap-5">
                <UButton href="/product" color="neutral" class="flex-1 justify-center">Back</UButton>
                <UButton :href="`/product/${id}/edit`" class="flex-1 justify-center">Edit</UButton>
            </div>
        </UCard>
    </div>
</template>

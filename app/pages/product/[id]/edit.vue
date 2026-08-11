<script setup lang="ts">
    import { useQueryClient } from '@tanstack/vue-query';
    import ProductForm, { type Schema } from '~/components/product/ProductForm.vue';
    import type { Product } from '~/types/product';

    definePageMeta({
        layout: 'dashboard',
        title: 'Edit Product',
    })

    const id = useRoute().params.id

    const { $api } = useNuxtApp();

    const product = await $api(`/master-data/products/${id}`) as Product

    const queryClient = useQueryClient();

    async function onSubmit(data: Schema) {
        await $api(`/master-data/products/${id}`, {
            method: 'PATCH',
            body: data,
        })

        useToast().add({
            title: 'Update Product',
            description: 'Product updated successfully'
        })

        navigateTo('/product');

        queryClient.invalidateQueries({ queryKey: ['products'] });
    }
</script>

<template>
    <div class="flex gap-5 items-start">
        <UCard class="max-w-xl flex-1">
            <template #header>
                <h2 class="mb-0">Product Form</h2>
            </template>
            <ProductForm v-on:submit="onSubmit" :default-product="product" />
        </UCard>
        <UCard class="w-75">
            <template #header>
                <h2 class="mb-0">Action</h2>
            </template>
            <div class="flex gap-5">
                <UButton href="/product" color="neutral" class="flex-1 justify-center">Back</UButton>
                <UButton type="submit" class="flex-1 justify-center" form="product-form">Save</UButton>
            </div>
        </UCard>
    </div>

</template>

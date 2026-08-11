<script setup lang="ts">
    import { useQueryClient } from '@tanstack/vue-query';
    import ProductCategoryForm, { type Schema } from '~/components/product-category/ProductCategoryForm.vue';
    import type { ProductCategory } from '~/types/productCategory';

    definePageMeta({
        layout: 'dashboard',
        title: 'Edit Product Category',
    })

    const id = useRoute().params.id

    const { $api } = useNuxtApp();

    const category = await $api(`/master-data/product/categories/${id}`) as ProductCategory

    const queryClient = useQueryClient();

    async function onSubmit(data: Schema) {
        await $api(`/master-data/product/categories/${id}`, {
            method: 'PATCH',
            body: data,
        })

        useToast().add({
            title: 'Update Product Category',
            description: 'Product category updated successfully'
        })

        navigateTo('/product-category');

        queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    }
</script>

<template>
    <div class="flex gap-5 items-start">
        <UCard class="max-w-xl flex-1">
            <template #header>
                <h2 class="mb-0">Product Category Form</h2>
            </template>
            <ProductCategoryForm v-on:submit="onSubmit" :default-product-category="category" />
        </UCard>
        <UCard class="w-75">
            <template #header>
                <h2 class="mb-0">Action</h2>
            </template>
            <div class="flex gap-5">
                <UButton href="/product-category" color="neutral" class="flex-1 justify-center">Back</UButton>
                <UButton type="submit" class="flex-1 justify-center" form="product-category-form">Save</UButton>
            </div>
        </UCard>
    </div>

</template>

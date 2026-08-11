<script setup lang="ts">
    import { useQueryClient } from '@tanstack/vue-query';
    import ProductCategoryForm, { type Schema } from '~/components/product-category/ProductCategoryForm.vue';

    definePageMeta({
        layout: 'dashboard',
        title: 'Create Product Category',
    })

    const { $api } = useNuxtApp()

    const queryClient = useQueryClient();

    async function onSubmit(data: Schema) {
        await $api('/master-data/product/categories/', {
            method: 'POST',
            body: data,
        })

        useToast().add({
            title: 'Create Product Category',
            description: 'Product category created successfully'
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
            <ProductCategoryForm v-on:submit="onSubmit" />
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

<script setup lang="ts">
    import { useQueryClient } from '@tanstack/vue-query';
    import HeroForm, { type Schema } from '~/components/hero/HeroForm.vue';
    import type { Hero } from '~/types/hero';

    definePageMeta({
        layout: 'dashboard',
        title: 'Edit Hero',
    })

    const id = useRoute().params.id

    const { $api } = useNuxtApp();

    const hero = await $api(`/heroes/${id}`) as Hero

    const queryClient = useQueryClient();

    async function onSubmit(data: Schema) {
        await $api(`/heroes/${id}`, {
            method: 'PATCH',
            body: data,
        })

        useToast().add({
            title: 'Update Hero',
            description: 'Hero updated successfully'
        })

        navigateTo('/hero');

        queryClient.invalidateQueries({ queryKey: ['heroes'] });
    }
</script>

<template>
    <div class="flex gap-5 items-start">
        <UCard class="max-w-xl flex-1">
            <template #header>
                <h2 class="mb-0">Hero Form</h2>
            </template>
            <HeroForm v-on:submit="onSubmit" :default-hero="hero" />
        </UCard>
        <UCard class="w-75">
            <template #header>
                <h2 class="mb-0">Action</h2>
            </template>
            <div class="flex gap-5">
                <UButton href="/hero" color="neutral" class="flex-1 justify-center">Back</UButton>
                <UButton type="submit" class="flex-1 justify-center" form="hero-form">Save</UButton>
            </div>
        </UCard>
    </div>

</template>

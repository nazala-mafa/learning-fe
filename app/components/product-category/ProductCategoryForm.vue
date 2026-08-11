<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui';
    import type { ProductCategory } from '~/types/productCategory';
    import z from 'zod';

    const schema = z.object({
        name: z.string().min(1).max(255),
        description: z.string().max(1000).nullable().optional(),
    })

    export type Schema = z.output<typeof schema>

    const { onSubmit, defaultProductCategory } = defineProps<{
        onSubmit: (data: Schema) => void,
        defaultProductCategory?: ProductCategory
    }>()

    const state = reactive({
        name: defaultProductCategory?.name,
        description: defaultProductCategory?.description,
    })

    async function _onSubmit(event: FormSubmitEvent<Schema>) {
        onSubmit(event.data)
    }
</script>

<template>
    <UForm :schema="schema" :state="state" @submit="_onSubmit" class="space-y-5" id="product-category-form" v-on:error="(err) => console.log(err)">
        <UFormField label="Name" name="name">
            <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField label="Description" name="description">
            <UTextarea v-model="state.description" class="w-full" />
        </UFormField>
    </UForm>
</template>

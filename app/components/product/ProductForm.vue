<script setup lang="ts">
    import { useQuery } from '@tanstack/vue-query';
    import type { FormSubmitEvent } from '@nuxt/ui';
    import type { Product } from '~/types/product';
    import type { ProductCategory } from '~/types/productCategory';
    import z from 'zod';
    import FileUploader from '../FileUploader.vue';

    const schema = z.object({
        nama: z.string().min(1).max(255),
        desc: z.string().max(1000).nullable().optional(),
        image_url: z.string().nullable().optional(),
        user_id: z.number(),
        product_category_id: z.number().nullable().optional(),
    })

    export type Schema = z.output<typeof schema>

    const { onSubmit, defaultProduct } = defineProps<{
        onSubmit: (data: Schema) => void,
        defaultProduct?: Product
    }>()

    const auth = useAuth()
    const { $api } = useNuxtApp()

    const { data: categories } = useQuery({
        queryKey: ['product-categories-all'],
        queryFn: async () => await $api('/master-data/product/categories/', { query: { limit: 100 } }) as ProductCategory[],
    })

    const state = reactive({
        nama: defaultProduct?.nama,
        desc: defaultProduct?.desc,
        image_url: defaultProduct?.image_url,
        user_id: defaultProduct?.user_id ?? auth.user?.id,
        product_category_id: defaultProduct?.product_category_id ?? null,
    })

    async function _onSubmit(event: FormSubmitEvent<Schema>) {
        onSubmit(event.data)
    }
</script>

<template>
    <UForm :schema="schema" :state="state" @submit="_onSubmit" class="space-y-5" id="product-form" v-on:error="(err) => console.log(err)">
        <UFormField label="Owner">
            <UInput :model-value="auth.user?.full_name || auth.user?.username" disabled class="w-full" />
        </UFormField>

        <UFormField label="Name" name="nama">
            <UInput v-model="state.nama" class="w-full" />
        </UFormField>

        <UFormField label="Description" name="desc">
            <UTextarea v-model="state.desc" class="w-full" />
        </UFormField>

        <UFormField label="Category" name="product_category_id">
            <USelectMenu
                v-model="state.product_category_id"
                :items="categories ?? []"
                label-key="name"
                value-key="id"
                placeholder="Select Category"
                class="w-full"
            />
        </UFormField>

        <UFormField label="Image" name="image_url">
            <FileUploader v-model="state.image_url" path="product" :preview="true" />
        </UFormField>
    </UForm>
</template>

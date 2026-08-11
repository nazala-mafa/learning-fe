<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui';
    import type { Hero } from '~/types/hero';
    import z from 'zod';

    const schema = z.object({
        name: z.string().min(1).max(255),
        age: z.number().int().nullable(),
        secret_name: z.string().min(1).max(255),
    })

    export type Schema = z.output<typeof schema>

    const { onSubmit, defaultHero } = defineProps<{
        onSubmit: (data: Schema) => void,
        defaultHero?: Hero
    }>()

    const state = reactive({
        name: defaultHero?.name ?? 'Spiderman',
        age: defaultHero ? (defaultHero.age ?? null) : 21,
        secret_name: defaultHero?.secret_name ?? 'Peter Parker',
    })

    async function _onSubmit(event: FormSubmitEvent<Schema>) {
        onSubmit(event.data)
    }
</script>

<template>
    <UForm :schema="schema" :state="state" @submit="_onSubmit" class="space-y-5" id="hero-form" v-on:error="(err) => console.log(err)">
        <UFormField label="Name" name="name">
            <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField label="Secret Name" name="secret_name">
            <UInput v-model="state.secret_name" class="w-full" />
        </UFormField>

        <UFormField label="Age" name="age">
            <UInput type="number" v-model="state.age" class="w-full" />
        </UFormField>
    </UForm>
</template>

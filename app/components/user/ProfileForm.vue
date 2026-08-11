<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui';
    import type { User } from '~/types/user';
    import z from 'zod';
    import FileUploader from '../FileUploader.vue';

    const { onSubmit, defaultUser } = defineProps<{
        onSubmit: (data: Schema) => void,
        defaultUser?: User
    }>()

    const schema = z.object({
        username: z.string().min(1).max(255),
        email: z.email().max(255),
        full_name: z.string().max(255).nullable().optional(),
        job_title: z.string().max(255).nullable().optional(),
        avatar_url: z.string().nullable().optional(),
        password: z.string().max(255).nullable().optional(),
        password_confirmation: z.string().max(255).nullable().optional(),
    }).superRefine(({ password, password_confirmation }, ctx) => {
        if (password && password.length > 0 && password.length < 4) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Password must be at least 4 characters',
                path: ['password'],
            });
        }
        if (password && password !== password_confirmation) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Passwords don't match`,
                path: ['password_confirmation'],
            });
        }
    })

    export type Schema = z.output<typeof schema>

    const state = reactive({
        username: defaultUser?.username,
        email: defaultUser?.email,
        full_name: defaultUser?.full_name,
        job_title: defaultUser?.job_title,
        avatar_url: defaultUser?.avatar_url,
        password: undefined as string | undefined,
        password_confirmation: undefined as string | undefined,
    })

    async function _onSubmit(event: FormSubmitEvent<Schema>) {
        const data = { ...event.data }
        if (!data.password) {
            delete data.password
        }
        delete data.password_confirmation
        onSubmit(data)
    }
</script>

<template>
    <UForm
        :schema="schema"
        :state="state"
        @submit="_onSubmit"
        class="space-y-5"
        id="profile-form"
        v-on:error="(err) => console.log(err)"
    >
        <UFormField label="Avatar" name="avatar_url">
            <FileUploader v-model="state.avatar_url" path="user/avatar" :preview="true" />
        </UFormField>

        <UFormField label="Username" name="username">
            <UInput v-model="state.username" class="w-full" />
        </UFormField>

        <UFormField label="Email" name="email">
            <UInput type="email" v-model="state.email" class="w-full" />
        </UFormField>

        <UFormField label="Full Name" name="full_name">
            <UInput v-model="state.full_name" class="w-full" />
        </UFormField>

        <UFormField label="Job Title" name="job_title">
            <UInput v-model="state.job_title" class="w-full" />
        </UFormField>

        <UFormField
            label="New Password"
            name="password"
            hint="Leave blank to keep current password"
        >
            <UInput type="password" v-model="state.password" class="w-full" />
        </UFormField>

        <UFormField label="Confirm New Password" name="password_confirmation">
            <UInput type="password" v-model="state.password_confirmation" class="w-full" />
        </UFormField>
    </UForm>
</template>

<script setup lang="ts">
    definePageMeta({
        layout: 'guest'
    })

    import * as z from 'zod';
    import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

    import type { User } from '~/types/user';
    import { useAuth } from '~/stores/auth';

    const toast = useToast()

    const fields: AuthFormField[] = [{
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        required: true,
        defaultValue: 'johndoe@example.com',
    }, {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        required: true,
        defaultValue: 'secret'
    }]

    z.config(z.locales.id())

    const schema = z.object({
        email: z.email(),
        password: z.string().min(4),
    })

    type Schema = z.output<typeof schema>

    const { $api } = useNuxtApp()
    const auth = useAuth()

    async function onSubmit(payload: FormSubmitEvent<Schema>) {
        try {
            const { access_token } = await $api('/login', {
                method: 'POST',
                body: payload.data,
            }) as {
                access_token: string,
                token_type: string,
            }

            auth.setToken(access_token)

            const user = await $api('/users/me') as User

            auth.setUser(user)

            navigateTo('/');
        } catch (error: unknown) {
            auth.logout()
            toast.add({
                title: 'Sign in failed',
                description: 'Incorrect email or password'
            })
        }
    }
</script>

<template>
    <title>Boilerplate | Login Page</title>

    <div class="flex flex-col items-center justify-center gap-4 p-4">
        <UPageCard class="w-full max-w-md">
            <UAuthForm
                :schema="schema"
                :fields="fields"
                title="Welcome Back!"
                icon="i-lucide-lock"
                @submit="onSubmit"
                :submit="{
                    label: 'Sign in',
                }"
            >
                <template #description>
                    Don't have an account? <ULink to="/sign-up" class="text-primary font-medium">Sign up</ULink>.
                </template>
            </UAuthForm>
        </UPageCard>
    </div>
</template>

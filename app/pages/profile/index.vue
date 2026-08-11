<script setup lang="ts">
    import ProfileForm, { type Schema } from '~/components/user/ProfileForm.vue';
    import type { User } from '~/types/user';
    import { useAuth } from '~/stores/auth';

    definePageMeta({
        layout: 'dashboard',
        title: 'My Profile',
    })

    const { $api } = useNuxtApp()
    const auth = useAuth()

    async function onSubmit(data: Schema) {
        const user = await $api('/users/me', {
            method: 'PATCH',
            body: data,
        }) as User

        auth.setUser(user)

        useToast().add({
            title: 'Update Profile',
            description: 'Your profile has been updated successfully'
        })
    }
</script>

<template>
    <div class="flex gap-5 items-start">
        <UCard class="max-w-xl flex-1">
            <template #header>
                <h2 class="mb-0">Edit Profile</h2>
            </template>
            <ProfileForm v-on:submit="onSubmit" :default-user="auth.user ?? undefined" />
        </UCard>
        <UCard class="w-75">
            <template #header>
                <h2 class="mb-0">Action</h2>
            </template>
            <div class="flex gap-5">
                <UButton href="/" color="neutral" class="flex-1 justify-center">Back</UButton>
                <UButton type="submit" class="flex-1 justify-center" form="profile-form">Save</UButton>
            </div>
        </UCard>
    </div>
</template>

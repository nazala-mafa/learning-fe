<script setup lang="ts">
    import type { DropdownMenuItem } from '@nuxt/ui';

    const auth = useAuth()
    const { $api } = useNuxtApp()

    const avatarSrc = computed(() => auth.user?.avatar_url || gravatarUrl(auth.user?.email ?? ''))

    const items = computed<DropdownMenuItem[][]>(() => [
        [
            {
                label: auth.user?.full_name || auth.user?.username || '',
                avatar: {
                    src: avatarSrc.value
                },
                to: '/profile'
            },
            {
                label: 'Logout',
                icon: 'i-lucide-log-out',
                onSelect: async (e: Event) => {
                    e.preventDefault();

                    try {
                        await $api('/logout', { method: 'POST' });
                    } catch {
                        // ignore errors, still clear local session below
                    }

                    auth.logout();

                    useToast().add({
                        title: 'Authentication',
                        description: 'Logged out successfully'
                    });

                    return navigateTo('/login');
                }
            },
        ]
    ])
</script>

<template>
    <UDropdownMenu :items="items" size="xl">
        <UAvatar size="xl" :src="avatarSrc" />
    </UDropdownMenu>
</template>

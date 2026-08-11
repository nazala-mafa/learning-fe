<script setup lang="ts">
    import type { DropdownMenuItem } from '@nuxt/ui';

    const auth = useAuth()

    const items = computed<DropdownMenuItem[][]>(() => [
        [
            {
                label: auth.user?.full_name || auth.user?.username || '',
                avatar: {
                    src: gravatarUrl(auth.user?.email ?? '')
                },
                to: '/profile'
            },
            {
                label: 'Logout',
                icon: 'i-lucide-log-out',
                onSelect: (e: Event) => {
                    e.preventDefault();

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
        <UAvatar size="xl" :src="gravatarUrl(auth.user?.email ?? '')" />
    </UDropdownMenu>
</template>

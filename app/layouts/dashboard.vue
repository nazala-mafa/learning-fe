<script setup lang="ts">
    const route = useRoute()
    const title = computed(() => route.meta.title as string);

    import type { NavigationMenuItem } from '@nuxt/ui';
    import DropdownProfileMenu from '~/components/layouts/DropdownProfileMenu.vue';

    const items = computed<NavigationMenuItem[]>(() => [{
        label: 'Home',
        icon: 'i-lucide-house',
        href: '/'
    }, {
        label: 'Heroes',
        icon: 'i-lucide-shield',
        href: '/hero',
        active: /^\/hero/.test(route.path)
    }, {
        label: 'Products',
        icon: 'i-lucide-box',
        href: '/product',
        active: /^\/product(?!-category)/.test(route.path)
    }, {
        label: 'Product Categories',
        icon: 'i-lucide-tags',
        href: '/product-category',
        active: /^\/product-category/.test(route.path)
    }])
</script>

<template>
    <title>{{ title || 'Boilerplate' }}</title>
    <UDashboardGroup>
        <UDashboardSidebar
            toggle-side="right"
            resizable
        >
            <template #header>
                <h1>Boilerplate</h1>
            </template>

            <UNavigationMenu
                :items="items"
                orientation="vertical"
            />
        </UDashboardSidebar>

        <UDashboardPanel>
            <template #header>
                <UDashboardNavbar :title="title || 'Boilerplate'">
                    <template #right>
                        <DropdownProfileMenu />
                    </template>
                </UDashboardNavbar>
            </template>
            <template #body>
                <NuxtPage />
            </template>
        </UDashboardPanel>
    </UDashboardGroup>
</template>
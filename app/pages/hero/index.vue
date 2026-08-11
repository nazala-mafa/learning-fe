<script setup lang="ts">
    import { useQuery } from '@tanstack/vue-query';
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
    import { useConfirmDialog } from '~/composeable/useCofirmDialog';
    import type { Hero } from '~/types/hero';

    definePageMeta({
        layout: 'dashboard',
        title: 'Heroes',
    })

    const LIMIT = 10

    const route = useRoute()
    const router = useRouter()

    const offset = computed(() => Number(route.query.offset ?? 0))

    const { $api } = useNuxtApp();

    const { data: heroes, refetch } = useQuery({
        queryKey: computed(() => ['heroes', offset.value]),
        queryFn: async () => await $api('/heroes/', { query: { offset: offset.value, limit: LIMIT } }) as Hero[],
    })

    const columns: TableColumn<Hero>[] = [
        {
            accessorKey: 'num',
            header: '#',
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'secret_name',
            header: 'Secret Name',
        },
        {
            accessorKey: 'age',
            header: 'Age',
        },
        {
            id: 'action'
        }
    ]

    const confirm = useConfirmDialog()
    const toast = useToast()

    function getDropdownActions(hero: Hero): DropdownMenuItem[][] {
        return [
            [
                {
                    label: 'Edit',
                    icon: 'i-lucide-edit',
                    href: `/hero/${hero.id}/edit`
                },
                {
                    label: 'Delete',
                    icon: 'i-lucide-trash',
                    color: 'error',
                    onSelect: async () => {
                        if (await confirm({
                            title: 'Delete confirmation',
                            description: 'Are you sure to delete this item? This item will deleted permanently.'
                        })) {
                            await $api(`/heroes/${hero.id}`, {
                                method: 'DELETE',
                            });
                            await refetch();
                            toast.add({
                                title: 'Delete success',
                                description: 'That item deleted successfully'
                            })
                        }
                    }
                }
            ]
        ]
    }

    const hasNext = computed(() => (heroes.value?.length ?? 0) === LIMIT)

    function goPrev() {
        router.push({ query: { ...route.query, offset: Math.max(0, offset.value - LIMIT) } })
    }
    function goNext() {
        router.push({ query: { ...route.query, offset: offset.value + LIMIT } })
    }
</script>

<template>
    <UMain>
        <UCard class="mb-6">
            <NuxtLink href="/hero/create">
                <UButton>Create Hero</UButton>
            </NuxtLink>
        </UCard>

        <UCard
            :ui="{
                body: 'sm:p-0'
            }"
        >
            <UTable :data="heroes" :columns="columns" empty="Hero is empty">
                <template #num-cell="{ row }">
                    <span>{{ row.index + offset + 1 }}</span>
                </template>
                <template #action-cell="{ row }">
                    <UDropdownMenu :items="getDropdownActions(row.original)">
                        <UButton
                            icon="i-lucide-ellipsis-vertical"
                            color="neutral"
                            variant="ghost"
                            aria-label="Actions"
                        />
                    </UDropdownMenu>
                </template>
            </UTable>

            <template #footer>
                <OffsetPagination :offset="offset" :limit="LIMIT" :has-next="hasNext" @prev="goPrev" @next="goNext" />
            </template>
        </UCard>
    </UMain>
</template>

<script setup lang="ts">
    import { useQuery } from '@tanstack/vue-query';
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
    import { useConfirmDialog } from '~/composeable/useCofirmDialog';
    import type { User } from '~/types/user';

    definePageMeta({
        layout: 'dashboard',
        title: 'Users',
    })

    const LIMIT = 10

    const route = useRoute()
    const router = useRouter()

    const offset = computed(() => Number(route.query.offset ?? 0))
    const search = ref<string>(String(route.query.search ?? ''));

    const { $api } = useNuxtApp();

    const { data: users, refetch } = useQuery({
        queryKey: computed(() => ['users', offset.value, route.query.search]),
        queryFn: async () => await $api('/master-data/users/', {
            query: { offset: offset.value, limit: LIMIT, search: route.query.search }
        }) as User[],
    })

    const columns: TableColumn<User>[] = [
        {
            accessorKey: 'num',
            header: '#',
        },
        {
            accessorKey: 'username',
            header: 'Username',
        },
        {
            accessorKey: 'full_name',
            header: 'Full Name',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'job_title',
            header: 'Job Title',
        },
        {
            id: 'action'
        }
    ]

    const confirm = useConfirmDialog()
    const toast = useToast()

    function getDropdownActions(user: User): DropdownMenuItem[][] {
        return [
            [
                {
                    label: 'Edit',
                    icon: 'i-lucide-edit',
                    href: `/user/${user.id}/edit`
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
                            await $api(`/master-data/users/${user.id}`, {
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

    const onSearch = () => {
        router.push({ query: { search: search.value, offset: 0 } });
    }

    const onReset = () => {
        search.value = '';
        router.push({ query: {} });
    }

    const hasQueryParams = computed(() => Object.keys(route.query).length > 0);

    const hasNext = computed(() => (users.value?.length ?? 0) === LIMIT)

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
            <NuxtLink href="/user/create">
                <UButton>Create User</UButton>
            </NuxtLink>
        </UCard>

        <UCard class="mb-6">
            <div class="flex justify-between items-center">
                <div class="flex justify-end items-center gap-2">
                    <UInput
                        type="search"
                        placeholder="Username, Email, Name ..."
                        v-model="search"
                    />
                    <UButton icon="i-lucide-filter" @click="onSearch" />
                    <UButton v-if="hasQueryParams" icon="i-lucide-redo" @click="onReset" />
                </div>
            </div>
        </UCard>

        <UCard
            :ui="{
                body: 'sm:p-0'
            }"
        >
            <UTable :data="users" :columns="columns" empty="User is empty">
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

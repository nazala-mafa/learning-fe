<script setup lang="ts">
    import { useQuery } from '@tanstack/vue-query';
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
    import { useConfirmDialog } from '~/composeable/useCofirmDialog';
    import type { Product } from '~/types/product';
    import type { ProductCategory } from '~/types/productCategory';

    definePageMeta({
        layout: 'dashboard',
        title: 'Products',
    })

    const LIMIT = 10

    const route = useRoute()
    const router = useRouter()

    const { $api } = useNuxtApp();

    const offset = computed(() => Number(route.query.offset ?? 0))
    const categoryFilter = ref<number | null>(route.query.product_category_id ? Number(route.query.product_category_id) : null)

    const { data: categories } = useQuery({
        queryKey: ['product-categories-all'],
        queryFn: async () => await $api('/master-data/product/categories/', { query: { limit: 100 } }) as ProductCategory[],
    })

    const categoryNameById = computed(() => Object.fromEntries((categories.value ?? []).map(c => [c.id, c.name])))

    const { data: products, refetch } = useQuery({
        queryKey: computed(() => ['products', offset.value, route.query.product_category_id]),
        queryFn: async () => await $api('/master-data/products/', {
            query: {
                offset: offset.value,
                limit: LIMIT,
                product_category_id: route.query.product_category_id || undefined,
            }
        }) as Product[],
    })

    const columns: TableColumn<Product>[] = [
        {
            accessorKey: 'num',
            header: '#',
        },
        {
            accessorKey: 'nama',
            header: 'Name',
        },
        {
            id: 'category',
            header: 'Category'
        },
        {
            id: 'action'
        }
    ]

    const confirm = useConfirmDialog()
    const toast = useToast()

    function getDropdownActions(product: Product): DropdownMenuItem[][] {
        return [
            [
                {
                    label: 'Preview',
                    icon: 'i-lucide-eye',
                    href: `/product/${product.id}/preview`
                },
                {
                    label: 'Edit',
                    icon: 'i-lucide-edit',
                    href: `/product/${product.id}/edit`
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
                            await $api(`/master-data/products/${product.id}`, {
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

    function onFilter() {
        router.push({ query: { product_category_id: categoryFilter.value ?? undefined, offset: 0 } });
    }

    function onReset() {
        categoryFilter.value = null;
        router.push({ query: {} });
    }

    const hasQueryParams = computed(() => Object.keys(route.query).length > 0);
    const hasNext = computed(() => (products.value?.length ?? 0) === LIMIT)

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
            <NuxtLink href="/product/create">
                <UButton>Create Product</UButton>
            </NuxtLink>
        </UCard>

        <UCard class="mb-6">
            <div class="flex justify-between items-center">
                <div class="flex justify-end items-center gap-2 w-full">
                    <USelectMenu
                        v-model="categoryFilter"
                        :items="categories ?? []"
                        label-key="name"
                        value-key="id"
                        placeholder="Filter by Category"
                        class="w-64"
                    />
                    <UButton icon="i-lucide-filter" @click="onFilter" />
                    <UButton v-if="hasQueryParams" icon="i-lucide-redo" @click="onReset"/>
                </div>
            </div>
        </UCard>

        <UCard
            :ui="{
                body: 'sm:p-0'
            }"
        >
            <UTable :data="products" :columns="columns" empty="Product is empty">
                <template #num-cell="{ row }">
                    <span>{{ row.index + offset + 1 }}</span>
                </template>
                <template #category-cell="{ row }">
                    {{ categoryNameById[row.original.product_category_id ?? -1] ?? '-' }}
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

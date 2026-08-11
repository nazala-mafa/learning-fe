import type { PaginatedCursorData, PaginatedData } from "./paginatedData"

export interface Product {
    id?: number
    nama?: string
    desc?: string | null
    image_url?: string | null
    user_id?: number
    product_category_id?: number | null
    [key: string]: any
}

export interface ProductForm {
    data: Product,
    errors: any
}

export interface ProductPaginatedData extends PaginatedData <Product> {}

export interface ProductPaginatedCursorData extends PaginatedCursorData <Product> {}

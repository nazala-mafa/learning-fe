import type { PaginatedCursorData, PaginatedData } from "./paginatedData"

export interface User {
    id: number
    username: string
    email: string
    full_name?: string | null
    disabled?: boolean | null
    job_title?: string | null
    avatar_url?: string | null
}

export interface UserPaginatedData extends PaginatedData <User> {}

export interface UserPaginatedCursorData extends PaginatedCursorData <User> {}

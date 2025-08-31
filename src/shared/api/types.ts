import type { AxiosResponse } from 'axios'

/** Unique identifier for resources */
export type Identifier = string | number

/** Standard list query params used across endpoints */
export type ListQueryParams = Readonly<
    {
        page?: number
        limit?: number
        q?: string
    } & Record<string, unknown>
>

/** Pagination metadata contract */
export interface Pagination {
    page: number
    limit: number
    total: number
    total_pages?: number
    has_next?: boolean
    has_previous?: boolean
}

/** Normalized list result returned by CRUD factory */
export interface ListResult<TItem> {
    items: TItem[]
    pagination?: Pagination
}

/** Envelope for list responses: { data: TItem[], meta: { pagination } } */
export type ApiEnvelopeList<TItem> = Readonly<{
    data: TItem[]
    meta?: { pagination?: Pagination; [key: string]: unknown }
}>

/** Envelope for single item responses: { data: TItem } */
export type ApiEnvelopeItem<TItem> = Readonly<{
    data: TItem
    meta?: Record<string, unknown>
}>

/** Axios typed response shortcut */
export type AxiosResp<T> = AxiosResponse<T>

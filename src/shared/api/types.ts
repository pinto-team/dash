import type { AxiosResponse } from 'axios'

export type Identifier = string | number

export type ListQueryParams = Readonly<
    {
        page?: number
        limit?: number
        q?: string
    } & Record<string, unknown>
>

export interface Pagination {
    page: number
    limit: number
    total: number
    total_pages?: number
    has_next?: boolean
    has_previous?: boolean
}

export interface ListResult<TItem> {
    items: TItem[]
    pagination?: Pagination
}

export type ApiEnvelopeList<TItem> = Readonly<{
    data: TItem[]
    meta?: { pagination?: Pagination; [key: string]: unknown }
}>

export type ApiEnvelopeItem<TItem> = Readonly<{
    data: TItem
    meta?: Record<string, unknown>
}>

export type AxiosResp<T> = AxiosResponse<T>

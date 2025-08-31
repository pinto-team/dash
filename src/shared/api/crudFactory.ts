import type { AxiosInstance, AxiosRequestConfig } from 'axios'

import type {
    ApiEnvelopeItem,
    ApiEnvelopeList,
    Identifier,
    ListQueryParams,
    ListResult,
} from './types'

/** Options for creating a CRUD API facade for a resource */
export type CrudFactoryOptions = Readonly<{
    client: AxiosInstance
    basePath: string
    // Set to true if API returns items under { data: T } envelope
    enveloped?: boolean
}>

/** Concrete endpoints used by the CRUD facade */
export type CrudEndpoints = Readonly<{
    list: string
    create: string
    detail: (id: Identifier) => string
    update: (id: Identifier) => string
    remove: (id: Identifier) => string
}>

/**
 * Create a strongly-typed CRUD client for a given resource.
 *
 * The factory normalizes list/single responses regardless of whether the API
 * returns plain arrays/items or uses an envelope `{ data, meta }`.
 */
export function createCrudFactory<TEntity, TCreate, TUpdate = Partial<TCreate>>(
    options: CrudFactoryOptions,
) {
    const { client, basePath, enveloped = true } = options

    const endpoints: CrudEndpoints = {
        list: basePath,
        create: basePath,
        detail: (identifier) => `${basePath}/${identifier}`,
        update: (identifier) => `${basePath}/${identifier}`,
        remove: (identifier) => `${basePath}/${identifier}`,
    }

    /** List items with optional query params, returns normalized result */
    async function list(
        params?: ListQueryParams,
        cfg?: AxiosRequestConfig,
    ): Promise<ListResult<TEntity>> {
        const { data } = await client.get<ApiEnvelopeList<TEntity> | TEntity[]>(endpoints.list, {
            params,
            ...cfg,
        })

        if (enveloped) {
            const env = data as ApiEnvelopeList<TEntity>
            return { items: env.data ?? [], pagination: env.meta?.pagination }
        }

        return { items: (data as TEntity[]) ?? [] }
    }

    /** Fetch a single item by id */
    async function get(id: Identifier, cfg?: AxiosRequestConfig): Promise<TEntity> {
        const { data } = await client.get<ApiEnvelopeItem<TEntity> | TEntity>(
            endpoints.detail(id),
            cfg,
        )
        return (enveloped ? (data as ApiEnvelopeItem<TEntity>).data : (data as TEntity)) as TEntity
    }

    /** Create a new item */
    async function create(payload: TCreate, cfg?: AxiosRequestConfig): Promise<TEntity> {
        const { data } = await client.post<ApiEnvelopeItem<TEntity> | TEntity>(
            endpoints.create,
            payload,
            cfg,
        )
        return (enveloped ? (data as ApiEnvelopeItem<TEntity>).data : (data as TEntity)) as TEntity
    }

    /** Update an existing item */
    async function update(
        id: Identifier,
        payload: TUpdate,
        cfg?: AxiosRequestConfig,
    ): Promise<TEntity> {
        const { data } = await client.put<ApiEnvelopeItem<TEntity> | TEntity>(
            endpoints.update(id),
            payload,
            cfg,
        )
        return (enveloped ? (data as ApiEnvelopeItem<TEntity>).data : (data as TEntity)) as TEntity
    }

    /** Delete an item by id */
    async function remove(id: Identifier, cfg?: AxiosRequestConfig): Promise<void> {
        await client.delete<void>(endpoints.remove(id), cfg)
    }

    return Object.freeze({ endpoints, list, get, create, update, remove })
}

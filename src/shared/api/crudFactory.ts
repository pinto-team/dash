import type { AxiosInstance, AxiosRequestConfig } from 'axios'

import type {
    ApiEnvelopeItem,
    ApiEnvelopeList,
    Identifier,
    ListQueryParams,
    ListResult,
} from './types'

export type CrudFactoryOptions = Readonly<{
    client: AxiosInstance
    basePath: string
    // Set to true if API returns items under { data: T } envelope
    enveloped?: boolean
}>

export type CrudEndpoints = Readonly<{
    list: string
    create: string
    detail: (id: Identifier) => string
    update: (id: Identifier) => string
    remove: (id: Identifier) => string
}>

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

    async function get(id: Identifier, cfg?: AxiosRequestConfig): Promise<TEntity> {
        const { data } = await client.get<ApiEnvelopeItem<TEntity> | TEntity>(
            endpoints.detail(id),
            cfg,
        )
        return (enveloped ? (data as ApiEnvelopeItem<TEntity>).data : (data as TEntity)) as TEntity
    }

    async function create(payload: TCreate, cfg?: AxiosRequestConfig): Promise<TEntity> {
        const { data } = await client.post<ApiEnvelopeItem<TEntity> | TEntity>(
            endpoints.create,
            payload,
            cfg,
        )
        return (enveloped ? (data as ApiEnvelopeItem<TEntity>).data : (data as TEntity)) as TEntity
    }

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

    async function remove(id: Identifier, cfg?: AxiosRequestConfig): Promise<void> {
        await client.delete<void>(endpoints.remove(id), cfg)
    }

    return Object.freeze({ endpoints, list, get, create, update, remove })
}

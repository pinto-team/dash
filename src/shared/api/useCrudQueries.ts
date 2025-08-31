import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function createCrudHooks<TData, TCreate, TUpdate>(
    key: string,
    api: ReturnType<typeof import('./crudFactory').createCrudApi<TData, TCreate, TUpdate>>,
) {
    return {
        useList: (params?: unknown) =>
            useQuery({
                queryKey: [key, 'list', params],
                queryFn: () => api.list(params),
            }),

        useDetail: (id: string | number) =>
            useQuery({
                queryKey: [key, 'detail', id],
                queryFn: () => api.detail(id),
                enabled: !!id,
            }),

        useCreate: () => {
            const qc = useQueryClient()
            return useMutation({
                mutationFn: api.create,
                onSuccess: () => qc.invalidateQueries({ queryKey: [key, 'list'] }),
            })
        },

        useUpdate: () => {
            const qc = useQueryClient()
            return useMutation({
                mutationFn: ({ id, payload }: { id: string | number; payload: TUpdate }) =>
                    api.update(id, payload),
                onSuccess: () => qc.invalidateQueries({ queryKey: [key, 'list'] }),
            })
        },

        useDelete: () => {
            const qc = useQueryClient()
            return useMutation({
                mutationFn: api.remove,
                onSuccess: () => qc.invalidateQueries({ queryKey: [key, 'list'] }),
            })
        },
    }
}

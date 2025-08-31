/* eslint-disable */
import { apiClient } from '@/lib/axios'

import { createCrudApi } from '../crudFactory'
import { createCrudHooks } from '../useCrudQueries'
import type { Pet } from './models/Pet'
import type { User } from './models/User'

const petApi = createCrudApi<Pet, Pet, Partial<Pet>>(apiClient, '/pet')
export const {
    useList: usePetList,
    useDetail: usePetDetail,
    useCreate: usePetCreate,
    useUpdate: usePetUpdate,
    useDelete: usePetDelete,
} = createCrudHooks<Pet, Pet, Partial<Pet>>('pet', petApi)

const userApi = createCrudApi<User, User, Partial<User>>(apiClient, '/user')
export const {
    useList: useUserList,
    useDetail: useUserDetail,
    useCreate: useUserCreate,
    useUpdate: useUserUpdate,
    useDelete: useUserDelete,
} = createCrudHooks<User, User, Partial<User>>('user', userApi)

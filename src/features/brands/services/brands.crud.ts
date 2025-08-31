import { catalogClient } from '@/lib/axios'
import { createCrudFactory } from '@/shared/api/crudFactory'
import { API_ROUTES } from '@/shared/constants/apiRoutes'

import type { Brand, CreateBrandRequest, UpdateBrandRequest } from './brands.api'

export const brandsCrud = createCrudFactory<Brand, CreateBrandRequest, UpdateBrandRequest>({
    client: catalogClient,
    basePath: API_ROUTES.BRANDS.LIST,
    enveloped: true,
})

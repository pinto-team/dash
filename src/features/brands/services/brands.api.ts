// features/brands/services/brands.api.ts
import axios from "axios"
import { catalogClient } from "@/lib/axios"
import { API_ROUTES } from "@/shared/constants/apiRoutes"
import { handleAsyncError } from "@/shared/lib/errors"
import { defaultLogger } from "@/shared/lib/logger"

export interface Brand {
    id: string
    name: string
    description?: string | null
    country?: string | null
    website?: string | null
    logo_url?: string | null
    created_at: string
    updated_at: string
}

export interface CreateBrandRequest {
    name: string
    description?: string
    country?: string
    website?: string
    logo_url?: string
}

export type UpdateBrandRequest = Partial<CreateBrandRequest>

export interface Pagination {
    page: number
    limit: number
    total: number
    total_pages?: number
    has_next?: boolean
    has_previous?: boolean
}

export interface BrandListResponse {
    items: Brand[]
    pagination: Pagination
}

interface UploadFilesResponse {
    files: Array<{ id: string; url: string; filename: string; content_type: string; size: number; created_at: string }>
}

type BrandListParams = Readonly<{ limit: number; page: number; q?: string }>

interface BrandListSuccessResponse {
    data: Brand[]
    meta: {
        message: string
        status: "success"
        code: string
        pagination: { page: number; limit: number; total: number; total_pages: number; has_next: boolean; has_previous: boolean }
    }
}

interface BrandSuccessResponse {
    data: Brand
    meta: {
        message: string
        status: "success"
        code: string
        pagination: undefined
    }
}

function isCanceled(err: unknown): boolean {
    const e = err as { code?: string; name?: string; message?: string }
    return (
        axios.isCancel?.(err) ||
        e?.code === "ERR_CANCELED" ||
        e?.name === "CanceledError" ||
        e?.message === "canceled"
    )
}

// List
export async function fetchBrands(limit: number, page: number, q?: string, signal?: AbortSignal): Promise<BrandListResponse> {
    const logger = defaultLogger.withContext({ component: "brands.api", action: "fetchBrands", limit, page, q })
    logger.info("Fetching brands list")

    const params: BrandListParams = {
        limit: Math.max(1, limit),
        page: Math.max(1, page),
        ...(q && q.trim() ? { q } : {}),
    }

    try {
        const { data } = await catalogClient.get<BrandListSuccessResponse>(API_ROUTES.BRANDS.LIST, { params, signal, timeout: 10000 })
        const items = data?.data ?? []
        const p = data?.meta?.pagination
        return {
            items,
            pagination: {
                page: p?.page ?? params.page,
                limit: p?.limit ?? params.limit,
                total: p?.total ?? items.length,
                total_pages: p?.total_pages,
                has_next: p?.has_next,
                has_previous: p?.has_previous,
            },
        }
    } catch (err) {
        if (isCanceled(err)) {
            logger.info("Request canceled", { url: API_ROUTES.BRANDS.LIST })
            throw err // Pass cancellation errors through
        }
        return handleAsyncError(Promise.reject(err), "Failed to fetch brands")
    }
}

// Detail
export async function fetchBrand(id: string, signal?: AbortSignal): Promise<Brand> {
    const logger = defaultLogger.withContext({ component: "brands.api", action: "fetchBrand", id })
    logger.info("Fetching brand details")
    try {
        const { data } = await catalogClient.get<BrandSuccessResponse>(API_ROUTES.BRANDS.DETAILS(id), { signal })
        return data.data
    } catch (err) {
        if (isCanceled(err)) {
            logger.info("Request canceled", { url: API_ROUTES.BRANDS.DETAILS(id) })
            throw err // Pass cancellation errors through
        }
        return handleAsyncError(Promise.reject(err), "Failed to fetch brand")
    }
}

// Create
export async function createBrand(payload: CreateBrandRequest, signal?: AbortSignal): Promise<Brand> {
    const logger = defaultLogger.withContext({ component: "brands.api", action: "createBrand", name: payload.name })
    logger.info("Creating brand")
    try {
        const { data } = await catalogClient.post<BrandSuccessResponse>(API_ROUTES.BRANDS.CREATE, payload, { signal })
        return data.data
    } catch (err) {
        if (isCanceled(err)) {
            logger.info("Request canceled", { url: API_ROUTES.BRANDS.CREATE })
            throw err
        }
        return handleAsyncError(Promise.reject(err), "Failed to create brand")
    }
}

// Update
export async function updateBrand(id: string, payload: UpdateBrandRequest, signal?: AbortSignal): Promise<Brand> {
    const logger = defaultLogger.withContext({ component: "brands.api", action: "updateBrand", id })
    logger.info("Updating brand")
    try {
        const { data } = await catalogClient.put<Brand>(API_ROUTES.BRANDS.UPDATE(id), payload, { signal })
        return data
    } catch (err) {
        if (isCanceled(err)) {
            logger.info("Request canceled", { url: API_ROUTES.BRANDS.UPDATE(id) })
            throw err
        }
        return handleAsyncError(Promise.reject(err), "Failed to update brand")
    }
}

// Delete
export async function deleteBrand(id: string, signal?: AbortSignal): Promise<void> {
    const logger = defaultLogger.withContext({ component: "brands.api", action: "deleteBrand", id })
    logger.info("Deleting brand")
    try {
        await catalogClient.delete<void>(API_ROUTES.BRANDS.DELETE(id), { signal })
        logger.info("Brand deleted", { id })
    } catch (err) {
        if (isCanceled(err)) {
            logger.info("Request canceled", { url: API_ROUTES.BRANDS.DELETE(id) })
            throw err
        }
        return handleAsyncError(Promise.reject(err), "Failed to delete brand") as unknown as void
    }
}

// Upload
export async function uploadSingleImage(file: File, signal?: AbortSignal): Promise<string> {
    const logger = defaultLogger.withContext({ component: "brands.api", action: "uploadSingleImage", file: file.name, size: file.size, type: file.type })
    logger.info("Uploading file")
    try {
        const form = new FormData()
        form.append("files", file)
        const { data } = await catalogClient.post<UploadFilesResponse>(API_ROUTES.FILES.UPLOAD, form, {
            headers: { "Content-Type": "multipart/form-data" },
            signal,
        })
        const url = data?.files?.[0]?.url
        if (!url) throw new Error("Upload response missing files[0].url")
        logger.info("File uploaded", { url })
        return url
    } catch (err) {
        if (isCanceled(err)) {
            logger.info("Request canceled", { url: API_ROUTES.FILES.UPLOAD })
            throw err
        }
        return handleAsyncError(Promise.reject(err), "Failed to upload file")
    }
}
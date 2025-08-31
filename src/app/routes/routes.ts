export const ROUTES = {
    ROOT: '/',
    LOGIN: '/login',

    DASHBOARD: '/dashboard',

    // Brands
    BRANDS: '/brands',
    BRAND_NEW: '/brands/new',
    BRAND_EDIT: (id = ':id') => `/brands/${id}`,
} as const

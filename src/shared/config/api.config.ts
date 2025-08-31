// shared/config/api.config.ts

export const API_CONFIG = {
  // Main API URL (fallback for backward compatibility)
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Feature-specific API URLs
  AUTH: {
    BASE_URL: import.meta.env.VITE_AUTH_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000',
  },
  
  CATALOG: {
    BASE_URL: import.meta.env.VITE_CATALOG_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000',
  },
  
  // MSW configuration
  MSW: {
    ENABLED: import.meta.env.VITE_ENABLE_MSW === 'true',
  },
  
  // Development settings
  DEV: {
    LOG_REQUESTS: import.meta.env.NODE_ENV === 'development',
    LOG_RESPONSES: import.meta.env.NODE_ENV === 'development',
  },
} as const

export type ApiConfig = typeof API_CONFIG
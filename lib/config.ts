/**
 * Simple configuration for BCNS Website
 * 
 * Architecture: Frontend → /api routes → Live Backend
 * - Frontend calls NEXT_PUBLIC_API_URL (/api)
 * - API routes call BACKEND_API_URL (https://api.tanvirmern.com)
 */

/**
 * Environment configuration for BCNS Website
 * Loads and validates environment variables
 */

export const config = {
  // Backend API URL (for server-side API routes to call live backend)
  backendUrl: process.env.BACKEND_API_URL || "https://api.tanvirmern.com",

  // Frontend API base (frontend calls these Next.js API routes)
  apiBase: process.env.NEXT_PUBLIC_API_URL || "/api",

  // App URL
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Feature flags
  features: {
    enableTwoFactor: process.env.NEXT_PUBLIC_ENABLE_2FA === 'true',
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
    enableFileUploads: process.env.NEXT_PUBLIC_ENABLE_FILE_UPLOADS !== 'false',
    enableErrorReporting: process.env.NODE_ENV === 'production',
  },

  // API configuration
  api: {
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
    retries: parseInt(process.env.NEXT_PUBLIC_API_RETRIES || '3', 10),
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api", // Frontend calls /api routes
  },

  // Authentication configuration
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    userDataKey: 'user_data',
    tokenExpiryKey: 'token_expires_at',
    defaultTokenExpiry: 60 * 60 * 1000, // 1 hour
  },

  // File upload configuration
  uploads: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },

  // UI configuration
  ui: {
    defaultPageSize: 10,
    maxPageSize: 100,
    debounceDelay: 300,
    toastDuration: 5000,
  },
} as const;

/**
 * Type-safe configuration access
 */

// Type-safe configuration access
export type Config = typeof config;

export default config;
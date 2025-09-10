/**
 * Configuration for BCNS Website
 */

export const config = {
  backendUrl: process.env.BACKEND_API_URL || "https://api.tanvirmern.com",
  apiBase: process.env.NEXT_PUBLIC_API_URL || "/api",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  features: {
    enableTwoFactor: process.env.NEXT_PUBLIC_ENABLE_2FA === 'true',
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
    enableFileUploads: process.env.NEXT_PUBLIC_ENABLE_FILE_UPLOADS !== 'false',
    enableErrorReporting: process.env.NODE_ENV === 'production',
  },

  api: {
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
    retries: parseInt(process.env.NEXT_PUBLIC_API_RETRIES || '3', 10),
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  },

  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    userDataKey: 'user_data',
    tokenExpiryKey: 'token_expires_at',
    defaultTokenExpiry: 60 * 60 * 1000,
  },

  uploads: {
    maxFileSize: 5 * 1024 * 1024,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },

  ui: {
    defaultPageSize: 10,
    maxPageSize: 100,
    debounceDelay: 300,
    toastDuration: 5000,
  },
} as const;

export type Config = typeof config;

export default config;
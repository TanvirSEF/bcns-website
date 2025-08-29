// Centralized configuration for API endpoints
export const config = {
  // Backend API URL - gets from environment variable or falls back to localhost for development
  backendUrl:
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "http://localhost:5000",

  // Frontend API base (for internal API routes)
  apiBase: process.env.NEXT_PUBLIC_API_URL || "/api",
} as const;

// Validate configuration in development
if (process.env.NODE_ENV === "development") {
  console.log("API Configuration:", {
    backendUrl: config.backendUrl,
    apiBase: config.apiBase,
  });
}

export default config;

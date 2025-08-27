/**
 * Server-side utilities for API proxy routes
 */

const BACKEND_API_URL = process.env.BACKEND_API_URL;

// Types are imported for potential future use in error handling
// import type { ApiResponse, ApiError } from "./types";

/**
 * Centralized fetch function for API proxy routes
 */
export async function fetchFromBackend<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BACKEND_API_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers: defaultHeaders,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.message ||
        data.error ||
        data.details ||
        `HTTP error! status: ${response.status}`;

      console.error("Backend API Error:", {
        status: response.status,
        statusText: response.statusText,
        url,
        data,
      });

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Backend API Request Failed:", {
      url,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        throw new Error("Request timed out. Please try again.");
      }
      if (
        error.message.includes("connect") ||
        error.message.includes("fetch")
      ) {
        throw new Error(
          "Unable to connect to backend service. Please check your internet connection."
        );
      }
    }

    throw error;
  }
}

/**
 * Helper function to handle multipart form data requests
 */
export async function fetchMultipartFromBackend<T = unknown>(
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BACKEND_API_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    method: "POST",
    body: formData,
    // Don't set Content-Type for FormData, let the browser set it with boundary
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.message ||
        data.error ||
        data.details ||
        `HTTP error! status: ${response.status}`;

      console.error("Backend API Multipart Error:", {
        status: response.status,
        statusText: response.statusText,
        url,
        data,
      });

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Backend API Multipart Request Failed:", {
      url,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    throw error;
  }
}

/**
 * Helper function to extract authorization header from request
 */
export function getAuthHeader(request: Request): string | undefined {
  const authHeader = request.headers.get("authorization");
  return authHeader || undefined;
}

/**
 * Helper function to forward cookies from request to backend
 */
export function getCookieHeader(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  return cookieHeader || undefined;
}

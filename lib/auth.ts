/**
 * Authentication service functions
 */

import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "./types";

const API_BASE_URL = "/api/auth";

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    // Handle different error response formats
    const errorMessage =
      data.message ||
      data.error ||
      data.details ||
      `HTTP error! status: ${response.status}`;

    // Log detailed error information for debugging
    console.error("API Error Response:", {
      status: response.status,
      statusText: response.statusText,
      data,
      url: response.url,
    });

    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Login API call
 */
export async function loginUser(
  credentials: LoginRequest
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    return await handleApiResponse<AuthResponse>(response);
  } catch (error) {
    console.error("Login API error:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        throw new Error("Login request timed out. Please try again.");
      }
      if (error.message.includes("connect")) {
        throw new Error(
          "Unable to connect to authentication service. Please check your internet connection."
        );
      }
    }

    throw error;
  }
}

/**
 * Register API call
 */
export async function registerUser(
  userData: RegisterRequest
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const raw = await handleApiResponse<unknown>(response);

    // Normalize differing API shapes
    const obj = raw as Record<string, unknown>;
    const token =
      (obj.token as string) ||
      (obj.access_token as string) ||
      (obj.accessToken as string);
    const userFromObj = obj.user as Partial<User> | undefined;
    const fallbackUser =
      obj.id || obj.name || obj.email
        ? {
            id: (obj.id as string) || "unknown",
            name: (obj.name as string) || "",
            email: (obj.email as string) || "",
          }
        : undefined;
    const user: User | undefined =
      (userFromObj as User) || (fallbackUser as User | undefined);
    const success =
      obj.success !== undefined ? Boolean(obj.success) : Boolean(token || user);
    return { ...(obj as object), success, token, user } as AuthResponse;
  } catch (error) {
    console.error("Register API error:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        throw new Error("Registration request timed out. Please try again.");
      }
      if (error.message.includes("connect")) {
        throw new Error(
          "Unable to connect to authentication service. Please check your internet connection."
        );
      }
      if (error.message.includes("External API error")) {
        throw new Error(
          "Authentication service is currently unavailable. Please try again later."
        );
      }
    }

    throw error;
  }
}

/**
 * Get user profile API call
 */
export async function getUserProfile(
  token?: string
): Promise<{ success: boolean; user: User }> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    });

    return await handleApiResponse<{ success: boolean; user: User }>(response);
  } catch (error) {
    console.error("Profile API error:", error);
    throw error;
  }
}

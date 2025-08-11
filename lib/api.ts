// API service functions for authentication
const API_BASE_URL = "/api/auth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  user?: User;
  // Handle different possible response formats
  access_token?: string;
  accessToken?: string;
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  phone?: string;
  address?: string;
  bio?: string;
  profilePictureUrl?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    // Handle different error response formats
    const errorMessage =
      data.message || data.error || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

// Login API call
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
    throw error;
  }
}

// Register API call
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

    return await handleApiResponse<AuthResponse>(response);
  } catch (error) {
    console.error("Register API error:", error);
    throw error;
  }
}

// Get user profile API call
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

// Users API (via proxy)
export async function getMe(token?: string): Promise<User> {
  const response = await fetch(`/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export type UpdateMeRequest = Partial<
  Pick<User, "name" | "phone" | "address" | "bio" | "profilePictureUrl">
>;

export async function updateMe(
  payload: UpdateMeRequest,
  token?: string
): Promise<User> {
  const response = await fetch(`/api/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || `HTTP ${response.status}`);
  }
  // Unwrap common shapes: { user: {...} } or {...}
  if (data && typeof data === "object") {
    if (data.user) return data.user as User;
    if (data.data?.user) return data.data.user as User;
  }
  return data as User;
}

export async function uploadProfileImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`/api/users/me`, {
    method: "POST",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data?.message || `Image upload failed (HTTP ${res.status})`
    );
  }
  // Handle multiple possible response shapes from your backend
  const url: string | undefined =
    (data && (data.url as string)) ||
    (data && (data.profilePictureUrl as string)) ||
    (data?.user && (data.user.profilePictureUrl as string));
  if (!url) {
    throw new Error("Image URL missing in response");
  }
  return { url };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function changeMyPassword(
  payload: ChangePasswordRequest,
  token?: string
): Promise<{ message: string }> {
  const response = await fetch(`/api/users/me/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }
  return data;
}

// Token storage helpers
export const tokenStorage = {
  get: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  },

  set: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  },

  remove: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },
};

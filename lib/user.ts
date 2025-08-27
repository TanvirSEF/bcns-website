/**
 * User service functions
 */

import type {
  User,
  UpdateMeRequest,
  ChangePasswordRequest,
  MembersResponse,
} from "./types";

/**
 * Get current user profile
 */
export async function getMe(): Promise<User> {
  const response = await fetch(`/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Update current user profile
 */
export async function updateMe(payload: UpdateMeRequest): Promise<User> {
  const response = await fetch(`/api/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
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

/**
 * Upload profile image
 */
export async function uploadProfileImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file); // Frontend uses 'file', proxy converts to 'profilePicture'

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

/**
 * Change user password
 */
export async function changeMyPassword(
  payload: ChangePasswordRequest
): Promise<{ message: string }> {
  const response = await fetch(`/api/users/me/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

/**
 * Fetch all members (members only, no admins for security)
 */
export async function getAllMembers(): Promise<MembersResponse> {
  const url = new URL("/api/members", window.location.origin);
  // Always fetch only members for security
  url.searchParams.append("role", "member");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Centralized type definitions for the BCNS application
 */

// User-related types
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

// Authentication types
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

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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
  details?: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Profile update types
export type UpdateMeRequest = Partial<
  Pick<User, "name" | "phone" | "address" | "bio" | "profilePictureUrl">
>;

// Members response types
export interface MembersResponse {
  success: boolean;
  members: User[];
  total: number;
}

// Backend API types (for server-side)
export interface BackendUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  address?: string;
  mailingAddress?: string;
  bio?: string;
  profilePictureUrl?: string;
  createdAt?: string;
}

export interface BackendResponse {
  success: boolean;
  users?: BackendUser[];
  data?: BackendUser[];
  message?: string;
  total?: number;
}

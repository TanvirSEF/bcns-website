// API Configuration - Use environment variables for security
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

// Simple Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  phone?: string;
  address?: string;
  bio?: string;
  profilePictureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Flexible response type for backend APIs with varying structures
interface FlexibleLoginResponse {
  user?: User;
  token?: string;
  data?: {
    user?: User;
    token?: string;
  };
  accessToken?: string;
  access_token?: string;
}

// API Function - Use relative URLs to avoid CORS issues
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'API Error');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth Functions
export const loginUser = async (email: string, password: string) => {
  const response = await apiCall<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  // Store token immediately if login is successful
  if (response.success && response.data) {
    // Try different possible token locations
    const responseData = response.data as FlexibleLoginResponse;
    const token = responseData.token || responseData.data?.token || responseData.accessToken || responseData.access_token;
    
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }
  
  return response;
};

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await apiCall<{ user: User; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  
  // Store token immediately if registration is successful
  if (response.success && response.data) {
    // Try different possible token locations
    const responseData = response.data as FlexibleLoginResponse;
    const token = responseData.token || responseData.data?.token || responseData.accessToken || responseData.access_token;
    
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }
  
  return response;
};

export const logoutUser = async () => {
  try {
    await apiCall('/auth/logout', { method: 'POST' });
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
};

export const getProfile = async () => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) {
      return { success: false, message: 'No authentication token' };
    }
    
    const response = await apiCall<User>('/users/me');
    return response;
  } catch (error) {
    console.error('Profile fetch failed:', error);
    // Remove invalid token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    throw error;
  }
};

export const updateProfile = (data: Partial<User>) => 
  apiCall<User>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const changePassword = (currentPassword: string, newPassword: string) =>
  apiCall('/users/me/change-password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

export const getAllMembers = () => apiCall<User[]>('/members');

export const uploadProfileImage = async (file: File) => {
  const token = localStorage.getItem('auth_token');
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE}/upload-image`, {
    method: 'POST',
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    await getProfile();
    return true;
  } catch {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    return false;
  }
};

// Backward compatibility aliases
export const changeMyPassword = changePassword;
export const updateMe = updateProfile;
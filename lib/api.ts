/**
 * Professional API Layer for BCNS Website
 * 
 * This file provides a clean, type-safe interface to all backend API endpoints.
 * It uses the ApiClient class for consistent error handling, token management,
 * and automatic retries.
 */

import apiClient from './api-client';
import {
  User,
  Event,
  Document,
  Album,
  Photo,
  Poll,
  Publication,
  ZoomMeeting,
  ActivityLog,
  LoginResponse,
  RegisterResponse,
  OperationResponse,
  FileUploadResponse,
  UserUpdateInput,
  PasswordChangeInput,
  LoginInput,
  RegisterInput,
} from '@/types/api';

/**
 * Handle API response and extract data
 */
function handleApiResponse<T>(response: unknown): T {
  if (typeof response !== 'object' || response === null) {
    throw new Error('Invalid API response');
  }
  
  const apiResponse = response as Record<string, unknown>;
  
  // Check if it's a wrapped API response with success field
  if ('success' in apiResponse) {
    if (apiResponse.success === false) {
      const errorMessage = (apiResponse.message as string) || 'API request failed';
      throw new Error(errorMessage);
    }
    
    if (apiResponse.success === true && 'data' in apiResponse) {
      return apiResponse.data as T;
    }
  }
  
  // Return response as-is if not wrapped
  return response as T;
}

/**
 * Authentication API endpoints with strict typing and validation
 */
export const authApi = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials,
      { skipAuth: true }
    );
    
    return handleApiResponse<LoginResponse>(response);
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterInput): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      '/auth/register',
      userData,
      { skipAuth: true }
    );
    
    return handleApiResponse<RegisterResponse>(response);
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    apiClient.logout(); // Clear local token
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me');
    return handleApiResponse<User>(response);
  },
};

/**
 * User management API endpoints with strict typing and validation
 */
export const userApi = {
  /**
   * Update user profile
   */
  updateProfile: async (data: UserUpdateInput): Promise<User> => {
    const response = await apiClient.put<User>('/users/me', data);
    return handleApiResponse<User>(response);
  },

  /**
   * Change user password
   */
  changePassword: async (passwordData: PasswordChangeInput): Promise<OperationResponse> => {
    const response = await apiClient.put<OperationResponse>(
      '/users/me/change-password',
      passwordData
    );
    
    return handleApiResponse<OperationResponse>(response);
  },

  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<FileUploadResponse> => {
    const response = await apiClient.uploadFile<FileUploadResponse>(
      '/users/me/profile-picture',
      file,
      undefined,
      onProgress
    );
    
    return handleApiResponse<FileUploadResponse>(response);
  },

  /**
   * Delete profile picture
   */
  deleteProfilePicture: async (): Promise<OperationResponse> => {
    const response = await apiClient.patch<OperationResponse>(
      '/users/me/profile-picture/delete'
    );
    
    return handleApiResponse<OperationResponse>(response);
  },

  /**
   * Get all members (admin only)
   */
  getMembers: async (): Promise<readonly User[]> => {
    const response = await apiClient.get<readonly User[]>('/members');
    
    return handleApiResponse<readonly User[]>(response);
  },
};

/**
 * Main API object that combines all endpoints
 */
export const api = {
  auth: authApi,
  users: userApi,
};

// Backward compatibility exports with strict typing (for existing code)
export const loginUser = (email: string, password: string): Promise<LoginResponse> => 
  authApi.login({ email, password });

export const registerUser = (name: string, email: string, password: string): Promise<RegisterResponse> => 
  authApi.register({ name, email, password });

export const logoutUser = authApi.logout;
export const getProfile = authApi.getProfile;

export const updateProfile = (data: UserUpdateInput): Promise<User> => 
  userApi.updateProfile(data);

export const changePassword = (currentPassword: string, newPassword: string): Promise<OperationResponse> => 
  userApi.changePassword({ currentPassword, newPassword });

export const getAllMembers = userApi.getMembers;
export const uploadProfileImage = userApi.uploadProfilePicture;
export const deleteProfileImage = userApi.deleteProfilePicture;

// Strictly typed placeholder exports for other APIs (to be implemented)
export const getEvents = (): Promise<readonly Event[]> => Promise.resolve([]);
export const createEvent = (): Promise<Event> => Promise.reject(new Error('Not implemented'));
export const getEvent = (): Promise<Event> => Promise.reject(new Error('Not implemented'));
export const registerForEvent = (): Promise<OperationResponse> => 
  Promise.resolve({ success: true, message: 'Success' });

export const getMyDocuments = (): Promise<readonly Document[]> => Promise.resolve([]);
export const getAllDocuments = (): Promise<readonly Document[]> => Promise.resolve([]);
export const updateDocumentStatus = (): Promise<OperationResponse> => 
  Promise.resolve({ success: true, message: 'Success' });

export const getAlbums = (): Promise<readonly Album[]> => Promise.resolve([]);
export const createAlbum = (): Promise<Album> => Promise.reject(new Error('Not implemented'));
export const getAlbumPhotos = (): Promise<readonly Photo[]> => Promise.resolve([]);

export const getPolls = (): Promise<readonly Poll[]> => Promise.resolve([]);
export const createPoll = (): Promise<Poll> => Promise.reject(new Error('Not implemented'));
export const getPoll = (): Promise<Poll> => Promise.reject(new Error('Not implemented'));
export const voteInPoll = (): Promise<OperationResponse> => 
  Promise.resolve({ success: true, message: 'Success' });
export const getPollResults = (): Promise<Poll> => Promise.reject(new Error('Not implemented'));

export const getPublications = (): Promise<readonly Publication[]> => Promise.resolve([]);
export const createPublication = (): Promise<Publication> => Promise.reject(new Error('Not implemented'));
export const getPublication = (): Promise<Publication> => Promise.reject(new Error('Not implemented'));

export const globalSearch = (): Promise<readonly unknown[]> => Promise.resolve([]);

export const subscribeToNotifications = (): Promise<OperationResponse> => 
  Promise.resolve({ success: true, message: 'Success' });
export const unsubscribeFromNotifications = (): Promise<OperationResponse> => 
  Promise.resolve({ success: true, message: 'Success' });

export const generate2FA = (): Promise<{ qrCode: string; secret: string }> => 
  Promise.resolve({ qrCode: '', secret: '' });
export const turnOn2FA = (): Promise<OperationResponse> => 
  Promise.resolve({ success: true, message: 'Success' });
export const turnOff2FA = (): Promise<OperationResponse> => 
  Promise.resolve({ success: true, message: 'Success' });
export const authenticate2FA = (): Promise<OperationResponse> => 
  Promise.resolve({ success: true, message: 'Success' });

export const createZoomMeeting = (): Promise<ZoomMeeting> => Promise.reject(new Error('Not implemented'));
export const getActivityLogs = (): Promise<readonly ActivityLog[]> => Promise.resolve([]);

// Export the API client instance for direct access if needed
export { apiClient };

export default api;

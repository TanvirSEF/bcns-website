/**
 * API Layer for BCNS Website
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
  LoginInput,
  RegisterInput,
  SendOTPInput,
  VerifyOTPInput,
  ResendOTPInput,
  SendOTPResponse,
  VerifyOTPResponse,
  EventCreateInput,
} from '@/types/api';

function handleApiResponse<T>(response: unknown): T {
  if (typeof response !== 'object' || response === null) {
    throw new Error('Invalid API response');
  }
  
  const apiResponse = response as Record<string, unknown>;
  
  if ('success' in apiResponse) {
    if (apiResponse.success === false) {
      const errorMessage = (apiResponse.message as string) || 'API request failed';
      throw new Error(errorMessage);
    }
    
    if (apiResponse.success === true && 'data' in apiResponse) {
      return apiResponse.data as T;
    }
    
    if (apiResponse.success === true && !('data' in apiResponse)) {
      // If success is true but no data field, extract all fields except 'success' and 'message'
      // This ensures we return the actual data, not the response wrapper
      const { success, message, ...data } = apiResponse;
      return data as T;
    }
  }
  
  // If response doesn't have success field, assume it's the data directly
  return response as T;
}

export const authApi = {
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials,
      { skipAuth: true }
    );
    
    return handleApiResponse<LoginResponse>(response);
  },

  // DEPRECATED: Use OTP flow instead
  register: async (_userData: RegisterInput): Promise<RegisterResponse> => {
    throw new Error('Direct registration is no longer supported. Please use OTP verification flow.');
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    apiClient.logout(); // Clear local token
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me');
    return handleApiResponse<User>(response);
  },

  sendRegistrationOTP: async (userData: SendOTPInput): Promise<SendOTPResponse> => {
    // Backend only expects email for send-otp
    const response = await apiClient.post<SendOTPResponse>(
      '/auth/send-otp',
      { email: userData.email },
      { skipAuth: true }
    );
    
    return handleApiResponse<SendOTPResponse>(response);
  },

  verifyOTP: async (email: string, otp: string): Promise<{ success: boolean; message: string; data: { email: string; otpValid: boolean } }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: { email: string; otpValid: boolean } }>(
      '/auth/verify-otp',
      { email, otp },
      { skipAuth: true }
    );
    
    // For verifyOTP, we need the full response, not just the data
    return response as { success: boolean; message: string; data: { email: string; otpValid: boolean } };
  },

  verifyRegistrationOTP: async (verificationData: VerifyOTPInput): Promise<VerifyOTPResponse> => {
    const response = await apiClient.post<VerifyOTPResponse>(
      '/auth/verify-registration',
      verificationData,
      { skipAuth: true }
    );
    
    return handleApiResponse<VerifyOTPResponse>(response);
  },

  resendRegistrationOTP: async (resendData: ResendOTPInput): Promise<SendOTPResponse> => {
    const response = await apiClient.post<SendOTPResponse>(
      '/auth/resend-otp',
      resendData,
      { skipAuth: true }
    );
    
    return handleApiResponse<SendOTPResponse>(response);
  },
};

export const userApi = {
  updateProfile: async (data: UserUpdateInput): Promise<User> => {
    const response = await apiClient.patch<User>('/users/me', data);
    return handleApiResponse<User>(response);
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string }): Promise<OperationResponse> => {
    const response = await apiClient.patch<OperationResponse>(
      '/users/me/change-password',
      passwordData
    );
    
    return handleApiResponse<OperationResponse>(response);
  },

  uploadProfilePicture: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<FileUploadResponse> => {
    const response = await apiClient.uploadFile<FileUploadResponse>(
      '/users/me/profile-picture',
      file,
      undefined,
      onProgress,
      'profilePicture' // Backend expects this field name
    );
    
    return handleApiResponse<FileUploadResponse>(response);
  },

  deleteProfilePicture: async (): Promise<OperationResponse> => {
    const response = await apiClient.patch<OperationResponse>(
      '/users/me/profile-picture/delete'
    );
    
    return handleApiResponse<OperationResponse>(response);
  },

  getMembers: async (): Promise<readonly User[]> => {
    const response = await apiClient.get<readonly User[]>('/members');
    
    return handleApiResponse<readonly User[]>(response);
  },
};

export interface ApprovalStats {
  readonly pending: number;
  readonly approved: number;
  readonly total: number;
}

export interface PendingUser extends User {
  readonly status: string;
}

export const adminApi = {
  getPendingUsers: async (): Promise<readonly PendingUser[]> => {
    const response = await apiClient.get<readonly PendingUser[]>('/users/admin/pending');
    return handleApiResponse<readonly PendingUser[]>(response);
  },

  getApprovalStats: async (): Promise<ApprovalStats> => {
    const response = await apiClient.get<ApprovalStats>('/users/admin/approval-stats');
    return handleApiResponse<ApprovalStats>(response);
  },

  getAllUsers: async (role?: string): Promise<readonly User[]> => {
    const url = role ? `/users?role=${encodeURIComponent(role)}` : '/users';
    const response = await apiClient.get<readonly User[]>(url);
    return handleApiResponse<readonly User[]>(response);
  },

  approveUser: async (userId: string): Promise<OperationResponse> => {
    const response = await apiClient.patch<OperationResponse>(`/users/admin/${userId}/approve`);
    return handleApiResponse<OperationResponse>(response);
  },

  deleteUser: async (userId: string): Promise<OperationResponse> => {
    const response = await apiClient.delete<OperationResponse>(`/users/admin/${userId}/delete`);
    return handleApiResponse<OperationResponse>(response);
  },
};

// Event API
export const eventApi = {
  getEvents: async (category?: string): Promise<readonly Event[]> => {
    const url = category ? `/events?category=${encodeURIComponent(category)}` : '/events';
    const response = await apiClient.get<readonly Event[]>(url);
    return handleApiResponse<readonly Event[]>(response);
  },

  getEvent: async (eventId: string): Promise<Event> => {
    const response = await apiClient.get<Event>(`/events/${eventId}`);
    return handleApiResponse<Event>(response);
  },

  createEvent: async (eventData: EventCreateInput & { eventImage?: File }): Promise<Event> => {
    const formData = new FormData();
    formData.append('title', eventData.title);
    if (eventData.description) formData.append('description', eventData.description);
    formData.append('date', eventData.date);
    if (eventData.time) formData.append('time', eventData.time);
    formData.append('category', eventData.category);
    if (eventData.location) formData.append('location', eventData.location);
    if (eventData.eventImage) {
      formData.append('eventImage', eventData.eventImage);
    }

    // Use post method with FormData - apiClient handles it correctly
    const response = await apiClient.post<Event>('/events', formData, {
      skipAuth: false,
    });
    return handleApiResponse<Event>(response);
  },
};

export const api = {
  auth: authApi,
  users: userApi,
  admin: adminApi,
  events: eventApi,
};

// Backward compatibility exports
export const loginUser = (email: string, password: string): Promise<LoginResponse> => 
  authApi.login({ email, password });

// DEPRECATED: Use OTP flow instead
export const registerUser = (_name: string, _email: string, _password: string): Promise<RegisterResponse> => {
  throw new Error('Direct registration is deprecated. Use sendRegistrationOTP() and verifyRegistrationOTP() instead.');
};

// OTP functions
export const sendRegistrationOTP = (name: string, email: string, password: string): Promise<SendOTPResponse> =>
  authApi.sendRegistrationOTP({ name, email, password });

export const verifyOTP = (email: string, otp: string): Promise<{ success: boolean; message: string; data: { email: string; otpValid: boolean } }> =>
  authApi.verifyOTP(email, otp);

export const verifyRegistrationOTP = (name: string, email: string, password: string, otp: string): Promise<VerifyOTPResponse> =>
  authApi.verifyRegistrationOTP({ name, email, password, otp });

export const resendRegistrationOTP = (email: string): Promise<SendOTPResponse> =>
  authApi.resendRegistrationOTP({ email });

export const logoutUser = authApi.logout;
export const getProfile = authApi.getProfile;

export const updateProfile = (data: UserUpdateInput): Promise<User> => 
  userApi.updateProfile(data);

export const changePassword = (currentPassword: string, newPassword: string): Promise<OperationResponse> => 
  userApi.changePassword({ currentPassword, newPassword });

export const getAllMembers = userApi.getMembers;
export const uploadProfileImage = userApi.uploadProfilePicture;
export const deleteProfileImage = userApi.deleteProfilePicture;

// Event backward compatibility exports
export const getEvents = (category?: string): Promise<readonly Event[]> => 
  eventApi.getEvents(category);
export const getEvent = (eventId: string): Promise<Event> => 
  eventApi.getEvent(eventId);
export const createEvent = (eventData: EventCreateInput & { eventImage?: File }): Promise<Event> => 
  eventApi.createEvent(eventData);
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

export { apiClient };

export default api;

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
      // Return apiResponse without the success wrapper field to maintain type contract
      const { success, ...dataWithoutWrapper } = apiResponse;
      return dataWithoutWrapper as T;
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

// Gallery API
export const galleryApi = {
  getAlbums: async (): Promise<readonly Album[]> => {
    const response = await apiClient.get<readonly Album[]>('/gallery/albums');
    return handleApiResponse<readonly Album[]>(response);
  },

  createAlbum: async (albumData: { title: string; description?: string; coverPhoto?: string }): Promise<Album> => {
    const response = await apiClient.post<Album>('/gallery/albums', albumData);
    return handleApiResponse<Album>(response);
  },

  getAlbumPhotos: async (albumId: string): Promise<readonly Photo[]> => {
    const response = await apiClient.get<readonly Photo[]>(`/gallery/albums/${albumId}/photos`);
    return handleApiResponse<readonly Photo[]>(response);
  },

  uploadPhoto: async (
    albumId: string, 
    photoData: { 
      caption?: string; 
      imageUrl?: string;
      photo?: File;
    }
  ): Promise<Photo> => {
    // If photo file is provided, use FormData upload
    if (photoData.photo) {
      const formData = new FormData();
      formData.append("photo", photoData.photo);
      if (photoData.caption) formData.append("caption", photoData.caption);
      
      const response = await apiClient.post<Photo>(
        `/gallery/albums/${albumId}/photos`,
        formData
      );
      return handleApiResponse<Photo>(response);
    }
    
    // Otherwise, use FormData with imageUrl (backend expects FormData)
    const formData = new FormData();
    if (photoData.imageUrl) formData.append("imageUrl", photoData.imageUrl);
    if (photoData.caption) formData.append("caption", photoData.caption);
    
    const response = await apiClient.post<Photo>(
      `/gallery/albums/${albumId}/photos`,
      formData
    );
    return handleApiResponse<Photo>(response);
  },
};

// Publication API
export const publicationApi = {
  getPublications: async (): Promise<readonly Publication[]> => {
    const response = await apiClient.get<readonly Publication[]>('/publications');
    return handleApiResponse<readonly Publication[]>(response);
  },

  createPublication: async (publicationData: {
    title: string;
    description: string;
    category: string;
    file: File;
  }): Promise<Publication> => {
    const formData = new FormData();
    formData.append('title', publicationData.title);
    formData.append('description', publicationData.description);
    formData.append('category', publicationData.category);
    formData.append('file', publicationData.file);

    const response = await apiClient.post<Publication>(
      '/publications',
      formData
    );
    return handleApiResponse<Publication>(response);
  },

  getPublication: async (publicationId: string): Promise<Publication> => {
    const response = await apiClient.get<Publication>(`/publications/${publicationId}`);
    return handleApiResponse<Publication>(response);
  },
};

// Poll API
export interface PollCreateInput {
  title: string;
  description: string;
  options: Array<{ name: string }>;
  startDate: string;
  endDate: string;
}

export interface PollResults extends Poll {
  totalVotes: number;
  options: Array<{
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }>;
}

export const pollApi = {
  getPolls: async (): Promise<readonly Poll[]> => {
    const response = await apiClient.get<readonly Poll[]>('/polls');
    return handleApiResponse<readonly Poll[]>(response);
  },

  getPoll: async (pollId: string): Promise<Poll> => {
    const response = await apiClient.get<Poll>(`/polls/${pollId}`);
    return handleApiResponse<Poll>(response);
  },

  createPoll: async (pollData: PollCreateInput): Promise<Poll> => {
    const response = await apiClient.post<Poll>('/polls', pollData);
    return handleApiResponse<Poll>(response);
  },

  voteInPoll: async (pollId: string, optionId: string): Promise<OperationResponse> => {
    const response = await apiClient.post<OperationResponse>(
      `/polls/${pollId}/vote`,
      { optionId }
    );
    return handleApiResponse<OperationResponse>(response);
  },

  getPollResults: async (pollId: string): Promise<PollResults> => {
    const response = await apiClient.get<PollResults>(`/polls/${pollId}/results`);
    return handleApiResponse<PollResults>(response);
  },
};

// Zoom Meeting API
export interface ZoomMeetingCreateInput {
  topic: string;
  agenda: string;
  startTimeIso: string;
  durationMinutes: number;
  timezone?: string;
  password?: string;
}

export const zoomApi = {
  getMeetings: async (): Promise<readonly ZoomMeeting[]> => {
    const response = await apiClient.get<readonly ZoomMeeting[]>('/zoom/meetings');
    return handleApiResponse<readonly ZoomMeeting[]>(response);
  },

  getMeeting: async (meetingId: string): Promise<ZoomMeeting> => {
    const response = await apiClient.get<ZoomMeeting>(`/zoom/meetings/${meetingId}`);
    return handleApiResponse<ZoomMeeting>(response);
  },

  createMeeting: async (meetingData: ZoomMeetingCreateInput): Promise<ZoomMeeting> => {
    const response = await apiClient.post<ZoomMeeting>('/zoom/meetings', meetingData);
    return handleApiResponse<ZoomMeeting>(response);
  },
};

export const api = {
  auth: authApi,
  users: userApi,
  admin: adminApi,
  events: eventApi,
  gallery: galleryApi,
  publications: publicationApi,
  polls: pollApi,
  zoom: zoomApi,
};

// Backward compatibility exports
export const loginUser = (usernameOrEmail: string, password: string): Promise<LoginResponse> => 
  authApi.login({ usernameOrEmail, password });

// DEPRECATED: Use OTP flow instead
export const registerUser = (_name: string, _email: string, _password: string): Promise<RegisterResponse> => {
  throw new Error('Direct registration is deprecated. Use sendRegistrationOTP() and verifyRegistrationOTP() instead.');
};

// OTP functions
export const sendRegistrationOTP = (name: string, username: string, email: string, password: string): Promise<SendOTPResponse> =>
  authApi.sendRegistrationOTP({ name, username, email, password });

export const verifyOTP = (email: string, otp: string): Promise<{ success: boolean; message: string; data: { email: string; otpValid: boolean } }> =>
  authApi.verifyOTP(email, otp);

export const verifyRegistrationOTP = (name: string, username: string, email: string, password: string, otp: string): Promise<VerifyOTPResponse> =>
  authApi.verifyRegistrationOTP({ name, username, email, password, otp });

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

// Gallery backward compatibility exports
export const getAlbums = (): Promise<readonly Album[]> => galleryApi.getAlbums();
export const createAlbum = (albumData: { title: string; description?: string; coverPhoto?: string }): Promise<Album> => 
  galleryApi.createAlbum(albumData);
export const getAlbumPhotos = (albumId: string): Promise<readonly Photo[]> => 
  galleryApi.getAlbumPhotos(albumId);

export const getPolls = (): Promise<readonly Poll[]> => pollApi.getPolls();
export const createPoll = (pollData: PollCreateInput): Promise<Poll> => pollApi.createPoll(pollData);
export const getPoll = (pollId: string): Promise<Poll> => pollApi.getPoll(pollId);
export const voteInPoll = (pollId: string, optionId: string): Promise<OperationResponse> => 
  pollApi.voteInPoll(pollId, optionId);
export const getPollResults = (pollId: string): Promise<PollResults> => pollApi.getPollResults(pollId);

export const getPublications = (): Promise<readonly Publication[]> => 
  publicationApi.getPublications();
export const createPublication = (publicationData: {
  title: string;
  description: string;
  category: string;
  file: File;
}): Promise<Publication> => 
  publicationApi.createPublication(publicationData);
export const getPublication = (publicationId: string): Promise<Publication> => 
  publicationApi.getPublication(publicationId);

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

export const getActivityLogs = (): Promise<readonly ActivityLog[]> => Promise.resolve([]);

export { apiClient };

export default api;

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
  Favorite,
  FavoriteTargetType,
  ZoomMeeting,
  ActivityLog,
  LoginResponse,
  RegisterResponse,
  OperationResponse,
  FileUploadResponse,
  UserUpdateInput,
  AdminUserUpdateInput,
  LoginInput,
  RegisterInput,
  SendOTPInput,
  VerifyOTPInput,
  ResendOTPInput,
  SendOTPResponse,
  VerifyOTPResponse,
  EventCreateInput,
  EventUpdateInput,
  GetUploadUrlsRequest,
  GetUploadUrlsResponse,
} from '@/types/api';

// NOTE: the /api proxy (app/api/users/me/documents/route.ts) re-wraps the
// backend { success, document } into { success, data: document }, and
// handleApiResponse then unwraps `data` — so this resolves to the document
// object itself, not { success, document }.
type UploadDocumentResponse = {
  title: string;
  fileUrl: string;
  status: string;
  uploadedAt?: string;
};

function handleApiResponse<T>(response: unknown): T {
  // If response is null, undefined or empty string but it reached here (meaning it was a success status),
  // return it as successfully cast data, or an empty object if T is expected to be an object.
  if (response === null || response === undefined || response === '') {
    return {} as T;
  }

  if (typeof response !== 'object') {
    // If it's a string (but not empty) or number, just return it
    return response as T;
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
      // Return the whole response if no explicit data field exists
      // This is common for OperationResponse types
      return apiResponse as T;
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

  getUploadUrls: async (uploadRequest: GetUploadUrlsRequest): Promise<GetUploadUrlsResponse> => {
    const response = await apiClient.post<GetUploadUrlsResponse>(
      '/auth/get-upload-urls',
      uploadRequest,
      { skipAuth: true }
    );

    return handleApiResponse<GetUploadUrlsResponse>(response);
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

  uploadDocument: async (file: File, title?: string): Promise<UploadDocumentResponse> => {
    const formData = new FormData();
    formData.append('document', file);
    if (title) formData.append('title', title);
    const response = await apiClient.post<UploadDocumentResponse>(
      '/users/me/documents',
      formData,
    );
    return handleApiResponse<UploadDocumentResponse>(response);
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

  getAllUsers: async (roleOrParams?: string | { role?: string; limit?: number; page?: number; approvalStatus?: string }): Promise<readonly User[]> => {
    const queryParams = new URLSearchParams();
    if (typeof roleOrParams === 'string') {
      queryParams.append('role', roleOrParams);
    } else if (roleOrParams) {
      if (roleOrParams.role) queryParams.append('role', roleOrParams.role);
      if (roleOrParams.limit !== undefined) queryParams.append('limit', String(roleOrParams.limit));
      if (roleOrParams.page !== undefined) queryParams.append('page', String(roleOrParams.page));
      if (roleOrParams.approvalStatus) queryParams.append('approvalStatus', roleOrParams.approvalStatus);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/users?${queryString}` : '/users';
    const response = await apiClient.get<readonly User[]>(url);
    return handleApiResponse<readonly User[]>(response);
  },

  approveUser: async (userId: string, memberId: string, adminNotes?: string): Promise<OperationResponse> => {
    const response = await apiClient.patch<OperationResponse>(
      `/users/admin/${userId}/approve`,
      { memberId, adminNotes }
    );
    return handleApiResponse<OperationResponse>(response);
  },

  deleteUser: async (userId: string): Promise<OperationResponse> => {
    const response = await apiClient.delete<OperationResponse>(`/users/admin/${userId}/delete`);
    return handleApiResponse<OperationResponse>(response);
  },

  updateMembershipStatus: async (
    userId: string,
    membershipStatus: "active" | "inactive"
  ): Promise<OperationResponse> => {
    const response = await apiClient.patch<OperationResponse>(
      `/users/admin/${userId}/membership-status`,
      { membershipStatus }
    );
    return handleApiResponse<OperationResponse>(response);
  },

  updateDocumentStatus: async (
    userId: string,
    documentIndex: number,
    status: "approved" | "rejected" | "pending",
    rejectionReason?: string,
  ): Promise<OperationResponse> => {
    const response = await apiClient.patch<OperationResponse>(
      `/users/admin/${userId}/documents/${documentIndex}/status`,
      { status, ...(rejectionReason ? { rejectionReason } : {}) },
    );
    return handleApiResponse<OperationResponse>(response);
  },

  updateUser: async (userId: string, data: AdminUserUpdateInput): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/admin/${userId}`, data);
    return handleApiResponse<User>(response);
  },

  uploadProfilePicture: async (
    userId: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<{ profilePictureUrl: string }> => {
    const response = await apiClient.uploadFile<{ profilePictureUrl: string }>(
      `/users/admin/${userId}/profile-picture`,
      file,
      undefined,
      onProgress,
      "profilePicture",
    );
    return handleApiResponse<{ profilePictureUrl: string }>(response);
  },

  uploadDocument: async (
    userId: string,
    file: File,
    title?: string,
  ): Promise<UploadDocumentResponse> => {
    const formData = new FormData();
    formData.append("document", file);
    if (title) formData.append("title", title);
    const response = await apiClient.post<UploadDocumentResponse>(
      `/users/admin/${userId}/documents`,
      formData,
    );
    return handleApiResponse<UploadDocumentResponse>(response);
  },

  deleteProfilePicture: async (userId: string): Promise<OperationResponse> => {
    const response = await apiClient.patch<OperationResponse>(
      `/users/admin/${userId}/profile-picture/delete`,
    );
    return handleApiResponse<OperationResponse>(response);
  },
};

// Event API
export const eventApi = {
  getEvents: async (category?: string, limit?: number): Promise<readonly Event[]> => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (limit) params.set('limit', String(limit));
    const qs = params.toString();
    const url = qs ? `/events?${qs}` : '/events';
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
    if (eventData.attendees) formData.append('attendees', eventData.attendees);
    if (eventData.decisions) formData.append('decisions', eventData.decisions);
    if (eventData.registrationUrl) formData.append('registrationUrl', eventData.registrationUrl);
    if (eventData.eventImage) {
      formData.append('eventImage', eventData.eventImage);
    }

    // Use post method with FormData - apiClient handles it correctly
    const response = await apiClient.post<Event>('/events', formData, {
      skipAuth: false,
    });
    return handleApiResponse<Event>(response);
  },

  updateEvent: async (
    eventId: string,
    eventData: EventUpdateInput & { eventImage?: File },
  ): Promise<Event> => {
    const formData = new FormData();
    // Append only the fields that are present so the backend can partially update
    if (eventData.title !== undefined) formData.append('title', eventData.title);
    if (eventData.description !== undefined) formData.append('description', eventData.description);
    if (eventData.date !== undefined) formData.append('date', eventData.date);
    if (eventData.time !== undefined) formData.append('time', eventData.time);
    if (eventData.category !== undefined) formData.append('category', eventData.category);
    if (eventData.location !== undefined) formData.append('location', eventData.location);
    if (eventData.attendees !== undefined) formData.append('attendees', eventData.attendees);
    if (eventData.decisions !== undefined) formData.append('decisions', eventData.decisions);
    if (eventData.registrationUrl !== undefined) formData.append('registrationUrl', eventData.registrationUrl);
    // Only send a new image when one was selected; otherwise the backend keeps the existing one
    if (eventData.eventImage) {
      formData.append('eventImage', eventData.eventImage);
    }

    // apiClient.patch detects FormData and strips the Content-Type header automatically
    const response = await apiClient.patch<Event>(`/events/${eventId}`, formData);
    return handleApiResponse<Event>(response);
  },

  deleteEvent: async (eventId: string): Promise<OperationResponse> => {
    const response = await apiClient.delete<OperationResponse>(`/events/${eventId}`);
    return handleApiResponse<OperationResponse>(response);
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

  deleteAlbum: async (albumId: string): Promise<OperationResponse> => {
    const response = await apiClient.delete<OperationResponse>(`/gallery/albums/${albumId}`);
    return handleApiResponse<OperationResponse>(response);
  },

  deletePhoto: async (albumId: string, photoId: string): Promise<OperationResponse> => {
    const response = await apiClient.delete<OperationResponse>(
      `/gallery/albums/${albumId}/photos?photoId=${photoId}`
    );
    return handleApiResponse<OperationResponse>(response);
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

  deletePublication: async (publicationId: string): Promise<OperationResponse> => {
    const response = await apiClient.delete<OperationResponse>(`/publications/${publicationId}`);
    return handleApiResponse<OperationResponse>(response);
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

  deletePoll: async (pollId: string): Promise<OperationResponse> => {
    const response = await apiClient.delete<OperationResponse>(`/polls/${pollId}`);
    return handleApiResponse<OperationResponse>(response);
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

// Favorites API
export const favoritesApi = {
  getFavorites: async (): Promise<readonly Favorite[]> => {
    const response = await apiClient.get<readonly Favorite[]>('/favorites');
    return handleApiResponse<readonly Favorite[]>(response);
  },

  addFavorite: async (targetType: FavoriteTargetType, targetId: string): Promise<Favorite> => {
    const response = await apiClient.post<Favorite>('/favorites', { targetType, targetId });
    return handleApiResponse<Favorite>(response);
  },

  removeFavorite: async (targetType: FavoriteTargetType, targetId: string): Promise<OperationResponse> => {
    const response = await apiClient.delete<OperationResponse>(
      `/favorites?targetType=${targetType}&targetId=${targetId}`,
    );
    return handleApiResponse<OperationResponse>(response);
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
  favorites: favoritesApi,
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

// Note: This backward compatibility function is deprecated
// Use authApi.verifyRegistrationOTP() directly with full registration data
export const verifyRegistrationOTP = (
  _name: string,
  _username: string,
  _email: string,
  _password: string,
  _otp: string
): Promise<VerifyOTPResponse> => {
  throw new Error(
    'This function signature is deprecated. Use authApi.verifyRegistrationOTP() with full registration data including designation, membershipType, phone, affiliation, addresses, and file URLs.'
  );
};

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
export const updateEvent = (
  eventId: string,
  eventData: EventUpdateInput & { eventImage?: File },
): Promise<Event> => eventApi.updateEvent(eventId, eventData);
export const deleteEvent = (eventId: string): Promise<OperationResponse> =>
  eventApi.deleteEvent(eventId);
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

export const getActivityLogs = async (): Promise<readonly ActivityLog[]> => {
  const response = await apiClient.get<readonly ActivityLog[]>('/logs');
  return handleApiResponse<readonly ActivityLog[]>(response);
};

export { apiClient };

export default api;

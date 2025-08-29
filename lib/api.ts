// Simple API configuration
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
} from "@/types/api";

import config from "./config";

const API_BASE = config.apiBase;

// Get token helper (will be overridden when called from components with useAuth)
const getAuthToken = (): string | null => {
  return typeof window !== "undefined"
    ? localStorage.getItem("auth_token")
    : null;
};

// Simple request function
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "API Error");
  }

  return data;
}

// Helper to extract data from a response object
function extractData<T>(response: {
  success: boolean;
  data: T;
  message?: string;
}): T {
  if (response.success && response.data) {
    return response.data;
  } else {
    throw new Error(response.message || "Data extraction failed");
  }
}

// Simple API functions - much cleaner!
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await request<{
      success: boolean;
      data: LoginResponse;
      message?: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await request<{
      success: boolean;
      data: RegisterResponse;
      message?: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    return response; // Return full response for register to handle success/error
  },

  logout: () => request("/auth/logout", { method: "POST" }),

  profile: async () => {
    const response = await request<{
      success: boolean;
      data: User;
      message?: string;
    }>("/users/me");
    return extractData<User>(response);
  },

  // Users
  updateProfile: async (data: Partial<User>) => {
    const response = await request<{
      success: boolean;
      data: User;
      message?: string;
    }>("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return extractData<User>(response);
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await request<{ success: boolean; message?: string }>(
      "/users/me/change-password",
      {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      }
    );
    return response; // Return full response for error handling
  },

  getMembers: async () => {
    const response = await request<{
      success: boolean;
      data: User[];
      message?: string;
    }>("/members");
    return extractData<User[]>(response);
  },

  // Events
  getEvents: () => request<Event[]>("/events"),
  getEvent: (id: string) => request<Event>(`/events/${id}`),
  createEvent: (data: Partial<Event>) =>
    request<Event>("/events", { method: "POST", body: JSON.stringify(data) }),
  registerForEvent: (id: string) =>
    request(`/events/${id}/register`, { method: "POST" }),

  // Documents
  getMyDocuments: () => request<Document[]>("/documents/my-documents"),
  getAllDocuments: () => request<Document[]>("/documents/admin/all"),
  updateDocumentStatus: (id: string, status: "approved" | "rejected") =>
    request(`/documents/admin/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // Gallery
  getAlbums: () => request<Album[]>("/gallery/albums"),
  createAlbum: (data: Partial<Album>) =>
    request<Album>("/gallery/albums", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAlbumPhotos: (id: string) =>
    request<Photo[]>(`/gallery/albums/${id}/photos`),

  // Polls
  getPolls: () => request<Poll[]>("/polls"),
  getPoll: (id: string) => request<Poll>(`/polls/${id}`),
  createPoll: (data: Partial<Poll>) =>
    request<Poll>("/polls", { method: "POST", body: JSON.stringify(data) }),
  voteInPoll: (id: string, optionId: string) =>
    request(`/polls/${id}/vote`, {
      method: "POST",
      body: JSON.stringify({ optionId }),
    }),
  getPollResults: (id: string) => request<Poll>(`/polls/${id}/results`),

  // Publications
  getPublications: () => request<Publication[]>("/publications"),
  getPublication: (id: string) => request<Publication>(`/publications/${id}`),
  createPublication: (data: Partial<Publication>) =>
    request<Publication>("/publications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Search
  search: (query: string) => request(`/search?q=${encodeURIComponent(query)}`),

  // Notifications
  subscribeNotifications: () =>
    request("/notifications/subscribe", { method: "POST" }),
  unsubscribeNotifications: () =>
    request("/notifications/unsubscribe", { method: "POST" }),

  // 2FA
  generate2FA: () => request("/2fa/generate", { method: "POST" }),
  turnOn2FA: (token: string) =>
    request("/2fa/turn-on", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  turnOff2FA: () => request("/2fa/turn-off", { method: "POST" }),
  authenticate2FA: (token: string) =>
    request("/2fa/authenticate", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  // Zoom
  createZoomMeeting: (data: Partial<ZoomMeeting>) =>
    request<ZoomMeeting>("/zoom/meetings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Logs
  getActivityLogs: () => request<ActivityLog[]>("/logs/activity"),

  // File upload helper
  uploadFile: async (
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>
  ) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Upload failed");
    }

    return data;
  },

  // Profile image upload helper
  uploadProfileImage: async (file: File) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE}/upload-image`, {
      method: "POST",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Upload failed");
    }

    return data;
  },
};

// Backward compatibility aliases (for existing code)
export const loginUser = api.login;
export const registerUser = api.register;
export const logoutUser = api.logout;
export const getProfile = api.profile;
export const updateProfile = api.updateProfile;
export const changePassword = api.changePassword;
export const getAllMembers = api.getMembers;
export const getEvents = api.getEvents;
export const createEvent = api.createEvent;
export const getEvent = api.getEvent;
export const registerForEvent = api.registerForEvent;
export const getMyDocuments = api.getMyDocuments;
export const getAllDocuments = api.getAllDocuments;
export const updateDocumentStatus = api.updateDocumentStatus;
export const getAlbums = api.getAlbums;
export const createAlbum = api.createAlbum;
export const getAlbumPhotos = api.getAlbumPhotos;
export const getPolls = api.getPolls;
export const createPoll = api.createPoll;
export const getPoll = api.getPoll;
export const voteInPoll = api.voteInPoll;
export const getPollResults = api.getPollResults;
export const getPublications = api.getPublications;
export const createPublication = api.createPublication;
export const getPublication = api.getPublication;
export const globalSearch = api.search;
export const subscribeToNotifications = api.subscribeNotifications;
export const unsubscribeFromNotifications = api.unsubscribeNotifications;
export const generate2FA = api.generate2FA;
export const turnOn2FA = api.turnOn2FA;
export const turnOff2FA = api.turnOff2FA;
export const authenticate2FA = api.authenticate2FA;
export const createZoomMeeting = api.createZoomMeeting;
export const getActivityLogs = api.getActivityLogs;
export const uploadProfileImage = api.uploadProfileImage;

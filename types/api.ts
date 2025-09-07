// API Types - All interfaces for the BCNS Society Management API

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
  
  // Additional fields from membership form
  affiliation?: string;
  mailingAddress?: string;
  permanentAddress?: string;
  
  // Education qualifications
  educationQualifications?: Array<{
    qualification: string;
    year: string;
    institution: string;
  }>;
  
  // Training
  training?: Array<{
    period: string;
    institute: string;
  }>;
  
  // Research interests
  primaryResearchInterest?: string;
  secondaryResearchInterest?: string;
  
  // Dashboard metrics (these would come from backend calculations)
  membershipStatus?: string;
  membershipExpiry?: string;
  eventsAttended?: number;
  eventsThisMonth?: number;
  publicationsRead?: number;
  publicationsThisWeek?: number;
  networkConnections?: number;
  newConnections?: number;
  
  // Professional info
  specialization?: string;
  institution?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  isRegistered?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected";
  uploadedBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Album {
  id: string;
  title: string;
  description?: string;
  coverPhoto?: string;
  photoCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Photo {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  albumId: string;
  uploadedBy: string;
  createdAt?: string;
}

export interface Poll {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  isActive: boolean;
  endDate?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Publication {
  id: string;
  title: string;
  content: string;
  author: string;
  tags?: string[];
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ZoomMeeting {
  id: string;
  topic: string;
  startTime: string;
  duration: number;
  joinUrl: string;
  password?: string;
  createdBy: string;
  createdAt?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  userId: string;
  userEmail: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Auth response types
export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

// Common API response wrapper (if needed)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

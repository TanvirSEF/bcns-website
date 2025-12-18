/**
 * TypeScript API Types for BCNS Website
 */

export type UUID = string;
export type ISODateString = string;
export type EmailAddress = string;
export type URL = string;

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum MembershipStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired'
}

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  MODERATOR = 'moderator',
  GUEST = 'guest'
}

export interface EducationQualification {
  readonly qualification: string;
  readonly year: string;
  readonly institution: string;
}

export interface Training {
  readonly period: string;
  readonly institute: string;
}

export interface PollOption {
  readonly id: UUID;
  readonly text: string;
  readonly votes: number;
}

export interface User {
  readonly id: UUID;
  readonly name: string;
  readonly email: EmailAddress;
  readonly role: UserRole;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
  
  readonly avatar?: URL;
  readonly phone?: string;
  readonly address?: string;
  readonly bio?: string;
  readonly profilePictureUrl?: URL;
  
  readonly affiliation?: string;
  readonly mailingAddress?: string;
  readonly permanentAddress?: string;
  readonly membershipStatus: MembershipStatus;
  readonly membershipExpiry?: ISODateString;
  
  readonly specialization?: string;
  readonly institution?: string;
  
  readonly educationQualifications: readonly EducationQualification[];
  readonly training: readonly Training[];
  
  readonly primaryResearchInterest?: string;
  readonly secondaryResearchInterest?: string;
  
  readonly eventsAttended: number;
  readonly eventsThisMonth: number;
  readonly publicationsRead: number;
  readonly publicationsThisWeek: number;
  readonly networkConnections: number;
  readonly newConnections: number;
}

export interface Event {
  readonly id: UUID;
  readonly title: string;
  readonly date: ISODateString;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
  readonly description?: string;
  readonly location?: string;
  readonly category?: "Program" | "Workshop" | "Meeting";
  readonly time?: string;
  readonly imageUrl?: URL;
  readonly isRegistered: boolean;
}

export interface Document {
  readonly id: UUID;
  readonly title: string;
  readonly fileUrl: URL;
  readonly status: DocumentStatus;
  readonly uploadedBy: UUID;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
  readonly description?: string;
}

export interface Album {
  readonly id: UUID;
  readonly title: string;
  readonly photoCount: number;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
  readonly description?: string;
  readonly coverPhoto?: URL;
}

export interface Photo {
  readonly id: UUID;
  readonly imageUrl: URL;
  readonly albumId: UUID;
  readonly uploadedBy: UUID;
  readonly createdAt: ISODateString;
  readonly title?: string;
  readonly description?: string;
}

export interface Poll {
  readonly id: UUID;
  readonly question: string;
  readonly description?: string;
  readonly options: readonly PollOption[];
  readonly isActive: boolean;
  readonly createdBy: UUID;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
  readonly endDate?: ISODateString;
}

export interface Publication {
  readonly id: UUID;
  readonly title: string;
  readonly content: string;
  readonly author: string;
  readonly tags: readonly string[];
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
  readonly publishedAt?: ISODateString;
}

export interface ZoomMeeting {
  readonly id: UUID;
  readonly topic: string;
  readonly agenda?: string;
  readonly startTime: ISODateString;
  readonly duration: number;
  readonly durationMinutes?: number;
  readonly joinUrl: URL;
  readonly startUrl?: string;
  readonly zoomMeetingId?: string;
  readonly timezone?: string;
  readonly createdBy: UUID | string;
  readonly createdAt: ISODateString;
  readonly password?: string;
}

export interface ActivityLog {
  readonly id: UUID;
  readonly action: string;
  readonly description: string;
  readonly userId: UUID;
  readonly userEmail: EmailAddress;
  readonly createdAt: ISODateString;
  readonly ipAddress?: string;
  readonly userAgent?: string;
}

export interface LoginResponse {
  readonly user: User;
  readonly token: string;
  readonly refreshToken?: string;
  readonly expiresIn: number;
}

export interface RegisterResponse {
  readonly user: User;
  readonly token: string;
  readonly refreshToken?: string;
  readonly expiresIn: number;
}

export interface TokenRefreshResponse {
  readonly token: string;
  readonly refreshToken?: string;
  readonly expiresIn: number;
}

// Strict API response interfaces - NO 'any' types
export interface ApiSuccessResponse<T> {
  readonly success: true;
  readonly data: T;
  readonly message?: string;
}

export interface ApiErrorResponse {
  readonly success: false;
  readonly message: string;
  readonly error?: string;
  readonly code?: string;
  readonly details?: Record<string, unknown>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Utility type to extract data type from API response
export type ExtractApiData<T> = T extends ApiResponse<infer U> ? U : never;

// Standard operation response
export interface OperationResponse {
  readonly success: boolean;
  readonly message: string;
}

// File upload response
export interface FileUploadResponse {
  readonly profilePictureUrl: URL;
  readonly fileSize: number;
  readonly mimeType: string;
}

// Pagination response wrapper
export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly totalCount: number;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

// Search response
export interface SearchResponse<T> {
  readonly results: readonly T[];
  readonly totalCount: number;
  readonly query: string;
  readonly searchTime: number;
}

// Validation error details
export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
}

export interface ValidationErrorResponse extends ApiErrorResponse {
  readonly code: 'VALIDATION_ERROR';
  readonly details: {
    readonly errors: readonly ValidationError[];
  };
}

// Type guards for API responses
export function isApiSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

export function isApiErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiErrorResponse {
  return response.success === false;
}

export function isValidationErrorResponse(
  response: ApiErrorResponse
): response is ValidationErrorResponse {
  return response.code === 'VALIDATION_ERROR';
}

// Input types for API operations (what we send to the server)
export interface UserUpdateInput {
  readonly formNo?: string;
  readonly refNo?: string;
  readonly name?: string;
  // email is read-only, cannot be updated via profile
  readonly phone?: string;
  readonly bio?: string;
  readonly affiliation?: string;
  readonly mailingAddress?: string;
  readonly permanentAddress?: string;
  // specialization and institution are read-only (set during registration)
  readonly primaryResearchInterest?: string;
  readonly secondaryResearchInterest?: string;
  readonly educationQualifications?: readonly EducationQualification[];
  readonly training?: readonly Training[];
}

export interface PasswordChangeInput {
  readonly currentPassword: string;
  readonly newPassword: string;
}

export interface LoginInput {
  readonly usernameOrEmail: string; // Can be either username or email
  readonly password: string;
}

export interface RegisterInput {
  readonly name: string;
  readonly email: EmailAddress;
  readonly password: string;
}

export interface SendOTPInput {
  readonly name: string;
  readonly username: string;
  readonly email: EmailAddress;
  readonly password: string;
}

export interface VerifyOTPInput {
  readonly name: string;
  readonly username: string;
  readonly email: EmailAddress;
  readonly password: string;
  readonly otp: string;
}

export interface ResendOTPInput {
  readonly email: EmailAddress;
}

export interface SendOTPResponse {
  readonly success: boolean;
  readonly message: string;
  readonly email: EmailAddress;
}

export interface VerifyOTPResponse {
  readonly user: User;
  readonly token: string | null;
  readonly refreshToken?: string | null;
  readonly expiresIn: number;
  readonly requiresLogin?: boolean;
}

export interface EventCreateInput {
  readonly title: string;
  readonly description?: string;
  readonly date: ISODateString;
  readonly time?: string;
  readonly category: "program" | "workshop" | "meeting";
  readonly location?: string;
  readonly imageUrl?: string;
}

export interface DocumentCreateInput {
  readonly title: string;
  readonly description?: string;
}

export interface AlbumCreateInput {
  readonly title: string;
  readonly description?: string;
}

export interface PollCreateInput {
  readonly question: string;
  readonly options: readonly string[];
  readonly endDate?: ISODateString;
}

export interface PublicationCreateInput {
  readonly title: string;
  readonly content: string;
  readonly tags?: readonly string[];
}

export interface ZoomMeetingCreateInput {
  readonly topic: string;
  readonly startTime: ISODateString;
  readonly duration: number;
  readonly password?: string;
}

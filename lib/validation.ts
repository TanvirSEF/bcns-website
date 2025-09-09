/**
 * Runtime Validation Schemas for BCNS API
 * 
 * Provides runtime type checking and validation for all API data.
 * Uses Zod for schema validation with TypeScript integration.
 */

// Base validation schemas
export const UUIDSchema = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const EmailSchema = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const URLSchema = /^https?:\/\/.+/;
export const ISODateSchema = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

// Validation functions
export function isValidUUID(value: string): boolean {
  return UUIDSchema.test(value);
}

export function isValidEmail(value: string): boolean {
  return EmailSchema.test(value);
}

export function isValidURL(value: string): boolean {
  return URLSchema.test(value);
}

export function isValidISODate(value: string): boolean {
  return ISODateSchema.test(value) && !isNaN(Date.parse(value));
}

// Type assertion functions
export function assertUUID(value: unknown, fieldName = 'UUID'): asserts value is string {
  if (typeof value !== 'string' || !isValidUUID(value)) {
    throw new ValidationError(`${fieldName} must be a valid UUID`);
  }
}

export function assertEmail(value: unknown, fieldName = 'Email'): asserts value is string {
  if (typeof value !== 'string' || !isValidEmail(value)) {
    throw new ValidationError(`${fieldName} must be a valid email address`);
  }
}

export function assertURL(value: unknown, fieldName = 'URL'): asserts value is string {
  if (typeof value !== 'string' || !isValidURL(value)) {
    throw new ValidationError(`${fieldName} must be a valid URL`);
  }
}

export function assertISODate(value: unknown, fieldName = 'Date'): asserts value is string {
  if (typeof value !== 'string' || !isValidISODate(value)) {
    throw new ValidationError(`${fieldName} must be a valid ISO date string`);
  }
}

export function assertString(value: unknown, fieldName = 'String'): asserts value is string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }
}

export function assertNumber(value: unknown, fieldName = 'Number'): asserts value is number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`);
  }
}

export function assertBoolean(value: unknown, fieldName = 'Boolean'): asserts value is boolean {
  if (typeof value !== 'boolean') {
    throw new ValidationError(`${fieldName} must be a boolean`);
  }
}

export function assertArray<T>(
  value: unknown, 
  itemValidator: (item: unknown) => asserts item is T,
  fieldName = 'Array'
): asserts value is T[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an array`);
  }
  
  value.forEach((item, index) => {
    try {
      itemValidator(item);
    } catch (error) {
      throw new ValidationError(`${fieldName}[${index}]: ${error instanceof Error ? error.message : 'Invalid item'}`);
    }
  });
}

// Custom validation error class
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Enum validation functions
export function assertDocumentStatus(value: unknown): asserts value is 'pending' | 'approved' | 'rejected' {
  if (value !== 'pending' && value !== 'approved' && value !== 'rejected') {
    throw new ValidationError('Document status must be pending, approved, or rejected');
  }
}

export function assertMembershipStatus(value: unknown): asserts value is 'active' | 'inactive' | 'suspended' | 'expired' {
  if (value !== 'active' && value !== 'inactive' && value !== 'suspended' && value !== 'expired') {
    throw new ValidationError('Membership status must be active, inactive, suspended, or expired');
  }
}

export function assertUserRole(value: unknown): asserts value is 'admin' | 'member' | 'moderator' | 'guest' {
  if (value !== 'admin' && value !== 'member' && value !== 'moderator' && value !== 'guest') {
    throw new ValidationError('User role must be admin, member, moderator, or guest');
  }
}

// Complex object validators
export function validateEducationQualification(value: unknown): asserts value is {
  qualification: string;
  year: string;
  institution: string;
} {
  if (typeof value !== 'object' || value === null) {
    throw new ValidationError('Education qualification must be an object');
  }
  
  const obj = value as Record<string, unknown>;
  assertString(obj.qualification, 'qualification');
  assertString(obj.year, 'year');
  assertString(obj.institution, 'institution');
}

export function validateTraining(value: unknown): asserts value is {
  period: string;
  institute: string;
} {
  if (typeof value !== 'object' || value === null) {
    throw new ValidationError('Training must be an object');
  }
  
  const obj = value as Record<string, unknown>;
  assertString(obj.period, 'period');
  assertString(obj.institute, 'institute');
}

export function validatePollOption(value: unknown): asserts value is {
  id: string;
  text: string;
  votes: number;
} {
  if (typeof value !== 'object' || value === null) {
    throw new ValidationError('Poll option must be an object');
  }
  
  const obj = value as Record<string, unknown>;
  assertUUID(obj.id, 'id');
  assertString(obj.text, 'text');
  assertNumber(obj.votes, 'votes');
}

// API Response validators
export function validateApiResponse<T>(
  value: unknown,
  dataValidator: (data: unknown) => asserts data is T
): asserts value is { success: true; data: T; message?: string } | { success: false; message: string; error?: string; code?: string } {
  if (typeof value !== 'object' || value === null) {
    throw new ValidationError('API response must be an object');
  }
  
  const obj = value as Record<string, unknown>;
  assertBoolean(obj.success, 'success');
  
  if (obj.success === true) {
    if ('data' in obj) {
      dataValidator(obj.data);
    } else {
      throw new ValidationError('Success response must have data field');
    }
    
    if (obj.message !== undefined) {
      assertString(obj.message, 'message');
    }
  } else {
    assertString(obj.message, 'message');
    
    if (obj.error !== undefined) {
      assertString(obj.error, 'error');
    }
    
    if (obj.code !== undefined) {
      assertString(obj.code, 'code');
    }
  }
}

// User validator
export function validateUser(value: unknown): asserts value is import('@/types/api').User {
  if (typeof value !== 'object' || value === null) {
    throw new ValidationError('User must be an object');
  }
  
  const obj = value as Record<string, unknown>;
  
  // Required fields
  assertUUID(obj.id, 'id');
  assertString(obj.name, 'name');
  assertEmail(obj.email, 'email');
  assertUserRole(obj.role);
  assertISODate(obj.createdAt, 'createdAt');
  assertISODate(obj.updatedAt, 'updatedAt');
  assertMembershipStatus(obj.membershipStatus);
  
  // Required arrays (can be empty)
  assertArray(obj.educationQualifications, validateEducationQualification, 'educationQualifications');
  assertArray(obj.training, validateTraining, 'training');
  
  // Required numbers
  assertNumber(obj.eventsAttended, 'eventsAttended');
  assertNumber(obj.eventsThisMonth, 'eventsThisMonth');
  assertNumber(obj.publicationsRead, 'publicationsRead');
  assertNumber(obj.publicationsThisWeek, 'publicationsThisWeek');
  assertNumber(obj.networkConnections, 'networkConnections');
  assertNumber(obj.newConnections, 'newConnections');
  
  // Optional fields
  if (obj.avatar !== undefined) assertURL(obj.avatar, 'avatar');
  if (obj.phone !== undefined) assertString(obj.phone, 'phone');
  if (obj.address !== undefined) assertString(obj.address, 'address');
  if (obj.bio !== undefined) assertString(obj.bio, 'bio');
  if (obj.profilePictureUrl !== undefined) assertURL(obj.profilePictureUrl, 'profilePictureUrl');
  if (obj.affiliation !== undefined) assertString(obj.affiliation, 'affiliation');
  if (obj.mailingAddress !== undefined) assertString(obj.mailingAddress, 'mailingAddress');
  if (obj.permanentAddress !== undefined) assertString(obj.permanentAddress, 'permanentAddress');
  if (obj.membershipExpiry !== undefined) assertISODate(obj.membershipExpiry, 'membershipExpiry');
  if (obj.specialization !== undefined) assertString(obj.specialization, 'specialization');
  if (obj.institution !== undefined) assertString(obj.institution, 'institution');
  if (obj.primaryResearchInterest !== undefined) assertString(obj.primaryResearchInterest, 'primaryResearchInterest');
  if (obj.secondaryResearchInterest !== undefined) assertString(obj.secondaryResearchInterest, 'secondaryResearchInterest');
}

// Safe parsing function that returns validation results
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function safeValidate<T>(
  value: unknown,
  validator: (value: unknown) => asserts value is T
): ValidationResult<T> {
  try {
    validator(value);
    return { success: true, data: value };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Validation failed'
    };
  }
}

// Utility function to validate and extract API response data
export function extractValidatedData<T>(
  response: unknown,
  dataValidator: (data: unknown) => asserts data is T
): T {
  validateApiResponse(response, dataValidator);
  
  if ('success' in response && response.success === true && 'data' in response) {
    return response.data;
  }
  
  throw new ValidationError('Invalid API response structure');
}

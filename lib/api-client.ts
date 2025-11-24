/**
 * Professional ApiClient for BCNS Website
 * 
 * Features:
 * - JWT token management with automatic refresh
 * - Comprehensive error handling with user-friendly messages
 * - TypeScript generics for type-safe API calls
 * - Request/response interceptors
 * - Retry logic for failed requests
 * - Proper loading states and error boundaries
 */

// Token management interface
interface TokenData {
  token: string;
  expiresAt: number;
  refreshToken?: string | undefined;
}

// Request configuration interface
interface RequestConfig extends Omit<RequestInit, 'body'> {
  body?: any;
  skipAuth?: boolean;
  retries?: number;
  timeout?: number;
}

// API Error class for better error handling
export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string | undefined;
  public readonly details?: any;

  constructor(
    message: string,
    status: number = 500,
    code?: string | undefined,
    details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /**
   * Get user-friendly error message based on status code
   */
  getUserFriendlyMessage(): string {
    switch (this.status) {
      case 400:
        return this.message || 'Invalid request. Please check your input.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return this.message || 'This action conflicts with existing data.';
      case 422:
        return this.message || 'Please check your input and try again.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return this.message || 'An unexpected error occurred. Please try again.';
    }
  }
}

// Event emitter for API events
type ApiEventType = 'tokenExpired' | 'tokenRefreshed' | 'authError' | 'networkError';
type ApiEventListener = (data?: any) => void;

class ApiEventEmitter {
  private listeners: Map<ApiEventType, ApiEventListener[]> = new Map();

  on(event: ApiEventType, listener: ApiEventListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  off(event: ApiEventType, listener: ApiEventListener): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  emit(event: ApiEventType, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }
}

/**
 * Professional API Client with comprehensive error handling and token management
 */
export class ApiClient {
  private baseURL: string;
  private tokenData: TokenData | null = null;
  private refreshPromise: Promise<string> | null = null;
  private eventEmitter = new ApiEventEmitter();
  private defaultTimeout = 30000; // 30 seconds
  private maxRetries = 3;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.loadTokenFromStorage();
  }

  /**
   * Event subscription for API events
   */
  on(event: ApiEventType, listener: ApiEventListener): void {
    this.eventEmitter.on(event, listener);
  }

  off(event: ApiEventType, listener: ApiEventListener): void {
    this.eventEmitter.off(event, listener);
  }

  /**
   * Load token from localStorage
   */
  private loadTokenFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const token = localStorage.getItem('auth_token');
      const expiresAt = localStorage.getItem('token_expires_at');
      const refreshToken = localStorage.getItem('refresh_token');

      if (token && expiresAt) {
        this.tokenData = {
          token,
          expiresAt: parseInt(expiresAt, 10),
          refreshToken: refreshToken ?? undefined,
        };
      }
    } catch (error) {
      console.error('Failed to load token from storage:', error);
      this.clearTokenData();
    }
  }

  /**
   * Save token to localStorage
   */
  private saveTokenToStorage(tokenData: TokenData): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('auth_token', tokenData.token);
      localStorage.setItem('token_expires_at', tokenData.expiresAt.toString());
      
      if (tokenData.refreshToken !== undefined) {
        localStorage.setItem('refresh_token', tokenData.refreshToken);
      }
    } catch (error) {
      console.error('Failed to save token to storage:', error);
    }
  }

  /**
   * Clear token data from memory and storage
   */
  private clearTokenData(): void {
    this.tokenData = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expires_at');
      localStorage.removeItem('refresh_token');
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string, expiresIn?: number, refreshToken?: string | undefined): void {
    // Validate token format
    if (!this.isJWTValid(token)) {
      throw new ApiError('Invalid JWT token format', 400, 'INVALID_TOKEN');
    }

    // Calculate expiration time - prefer JWT payload, then expiresIn, then default
    let expiresAt: number;
    
    const jwtExpiration = this.parseJWTExpiration(token);
    if (jwtExpiration > Date.now()) {
      expiresAt = jwtExpiration;
    } else if (expiresIn) {
      expiresAt = Date.now() + (expiresIn * 1000);
    } else {
      expiresAt = Date.now() + 3600000; // Default to 1 hour
    }
    
    this.tokenData = {
      token,
      expiresAt,
      refreshToken: refreshToken ?? undefined,
    };

    if (this.tokenData) {
      this.saveTokenToStorage(this.tokenData);
    }
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.tokenData?.token || null;
  }

  /**
   * Check if token is expired or about to expire (within 5 minutes)
   */
  private isTokenExpired(): boolean {
    if (!this.tokenData?.token) return true;
    
    // First check JWT validity
    if (!this.isJWTValid(this.tokenData.token)) {
      return true;
    }
    
    // Then check our stored expiration with 5-minute buffer
    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
    return this.tokenData.expiresAt <= fiveMinutesFromNow;
  }

  /**
   * Refresh the authentication token
   */
  private async refreshToken(): Promise<string> {
    if (!this.tokenData?.refreshToken) {
      throw new ApiError('No refresh token available', 401, 'NO_REFRESH_TOKEN');
    }

    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;
      return newToken;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.tokenData?.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new ApiError('Token refresh failed', response.status);
      }

      const data = await response.json();
      
      if (data.success && data.data?.token) {
        const { token, expiresIn, refreshToken } = data.data;
        this.setToken(token, expiresIn, refreshToken);
        this.eventEmitter.emit('tokenRefreshed', { token });
        return token;
      } else {
        throw new ApiError('Invalid refresh response', 401);
      }
    } catch (error) {
      this.clearTokenData();
      this.eventEmitter.emit('tokenExpired');
      throw error;
    }
  }

  /**
   * Get authorization headers
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    let token = this.getToken();

    // Check if token needs refresh
    if (token && this.isTokenExpired()) {
      try {
        token = await this.refreshToken();
      } catch (error) {
        this.eventEmitter.emit('authError', error);
        throw error;
      }
    }

    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Parse JWT token to extract payload information
   */
  private parseJWTPayload(token: string): { exp?: number; iat?: number; userId?: string } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }
      
      const payloadPart = parts[1];
      if (!payloadPart) {
        throw new Error('Invalid JWT payload');
      }
      
      const payload = JSON.parse(atob(payloadPart));
      return payload;
    } catch (error) {
      console.error('Failed to parse JWT token:', error);
      return null;
    }
  }

  /**
   * Parse JWT token to extract expiration
   */
  private parseJWTExpiration(token: string): number {
    const payload = this.parseJWTPayload(token);
    if (payload?.exp) {
      return payload.exp * 1000; // Convert to milliseconds
    }
    
    // Default to 1 hour if no expiration found
    return Date.now() + 3600000;
  }

  /**
   * Check if JWT token is valid and not expired
   */
  private isJWTValid(token: string): boolean {
    const payload = this.parseJWTPayload(token);
    if (!payload) return false;

    // Check expiration
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (now >= payload.exp) {
        return false;
      }
    }

    // Check issued at time (not in future)
    if (payload.iat) {
      const now = Math.floor(Date.now() / 1000);
      if (payload.iat > now + 60) { // Allow 60 seconds clock skew
        return false;
      }
    }

    return true;
  }

  /**
   * Perform HTTP request with comprehensive error handling
   */
  private async performRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      skipAuth = false,
      retries = this.maxRetries,
      timeout = this.defaultTimeout,
      headers: customHeaders = {},
      body,
      ...fetchOptions
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add custom headers
    Object.assign(headers, customHeaders);

    // Add authentication headers if not skipped
    if (!skipAuth) {
      try {
        const authHeaders = await this.getAuthHeaders();
        Object.assign(headers, authHeaders);
      } catch (error) {
        // If auth fails, continue without auth for public endpoints
        if (!endpoint.includes('/auth/')) {
          throw error;
        }
      }
    }

    // Prepare request body
    let requestBody: string | FormData | null = null;
    if (body !== undefined) {
      if (body instanceof FormData) {
        requestBody = body;
        delete headers['Content-Type']; // Let browser set it for FormData
      } else {
        requestBody = JSON.stringify(body);
      }
    }

    // Create AbortController for timeout handling
    const controller = new AbortController();
    // Only set timeout if it's a positive number to prevent immediate abort
    const timeoutId = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;

    const fetchPromise = fetch(url, {
      ...fetchOptions,
      headers,
      body: requestBody,
      signal: controller.signal,
    });

    let response: Response;
    
    try {
      response = await fetchPromise;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Handle response
      
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle abort/timeout errors
      // Check for AbortError from fetch abort, TimeoutError from fetchWithTimeout, or timeout message
      if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout'))) {
        throw new ApiError('Request timeout', 408, 'TIMEOUT', error);
      }
      
      // Network error
      this.eventEmitter.emit('networkError', error);
      throw new ApiError(
        'Network error. Please check your connection.',
        0,
        'NETWORK_ERROR',
        error
      );
    }

    // Handle response
    let responseData: any;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
    } catch (error) {
      console.error(`[ApiClient] Failed to parse response from ${url}:`, error);
      throw new ApiError(
        'Invalid response format',
        response.status,
        'INVALID_RESPONSE',
        error
      );
    }

    // Handle error responses
    if (!response.ok) {
      const errorMessage = responseData?.message || 
                          responseData?.error || 
                          `HTTP ${response.status}`;
      
      const apiError = new ApiError(
        errorMessage,
        response.status,
        responseData?.code,
        responseData
      );

      // Handle specific error cases
      if (response.status === 401) {
        this.clearTokenData();
        this.eventEmitter.emit('tokenExpired');
      }

      throw apiError;
    }

    return responseData;
  }

  /**
   * Make API request with retry logic
   */
  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { retries = this.maxRetries } = config;
    let lastError: ApiError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.performRequest<T>(endpoint, {
          ...config,
          retries: 0, // Prevent nested retries
        });
      } catch (error) {
        lastError = error instanceof ApiError ? error : new ApiError(
          error instanceof Error ? error.message : 'Unknown error',
          500,
          'UNKNOWN_ERROR',
          error
        );

        // Don't retry on certain error types
        if (
          lastError.status === 400 || // Bad Request
          lastError.status === 401 || // Unauthorized
          lastError.status === 403 || // Forbidden
          lastError.status === 404 || // Not Found
          lastError.status === 408 || // Request Timeout (non-idempotent operations shouldn't retry)
          lastError.status === 422 || // Unprocessable Entity
          attempt === retries // Last attempt
        ) {
          break;
        }

        // Wait before retry (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Convenience methods for different HTTP verbs
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>,
    onProgress?: (progress: number) => void,
    fieldName: string = 'file'
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    // For file uploads, we need to handle progress if supported
    if (onProgress && typeof XMLHttpRequest !== 'undefined') {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new ApiError('Invalid response format', xhr.status));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new ApiError(
                errorData.message || 'Upload failed',
                xhr.status,
                errorData.code,
                errorData
              ));
            } catch {
              reject(new ApiError('Upload failed', xhr.status));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new ApiError('Network error during upload', 0, 'NETWORK_ERROR'));
        });

        xhr.open('POST', `${this.baseURL}${endpoint}`);
        
        // Add auth header if available
        const token = this.getToken();
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.send(formData);
      });
    }

    // Fallback to regular request for environments without XMLHttpRequest
    return this.post<T>(endpoint, formData);
  }

  /**
   * Clear authentication and reset client
   */
  logout(): void {
    this.clearTokenData();
    this.eventEmitter.emit('tokenExpired');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (!this.tokenData?.token) return false;
    
    // Check JWT validity and expiration
    return this.isJWTValid(this.tokenData.token) && !this.isTokenExpired();
  }

  /**
   * Get token payload information
   */
  getTokenPayload(): { exp?: number; iat?: number; userId?: string } | null {
    if (!this.tokenData?.token) return null;
    return this.parseJWTPayload(this.tokenData.token);
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(): Date | null {
    const payload = this.getTokenPayload();
    if (!payload?.exp) return null;
    return new Date(payload.exp * 1000);
  }
}

/**
 * Create and export singleton instance
 * Frontend calls /api routes, which then call the live backend
 */
const baseURL = '/api';
const apiClient = new ApiClient(baseURL);

export default apiClient;

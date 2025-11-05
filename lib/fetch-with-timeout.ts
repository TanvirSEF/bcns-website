/**
 * Utility function for fetch with timeout and error handling
 */

import config from './config';

interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number;
}

/**
 * Fetch with timeout and enhanced error handling
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeout = config.api.timeout, ...fetchOptions } = options;

  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort (timeout) specifically
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }

    // Re-throw other errors
    throw error;
  }
}

/**
 * Get user-friendly error message based on error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (
      error.message.includes('fetch') ||
      error.message.includes('timeout') ||
      error.message.includes('Connect') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND')
    ) {
      return 'Unable to connect to the server. Please check your connection and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timeout. The server is taking too long to respond. Please try again.';
    }
    return error.message;
  }
  return 'An unexpected error occurred';
}

/**
 * Get appropriate HTTP status code based on error type
 */
export function getErrorStatusCode(error: unknown): number {
  if (error instanceof Error) {
    if (
      error.message.includes('fetch') ||
      error.message.includes('Connect') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND')
    ) {
      return 503; // Service Unavailable
    }
    if (error.message.includes('timeout')) {
      return 504; // Gateway Timeout
    }
  }
  return 500; // Internal Server Error
}


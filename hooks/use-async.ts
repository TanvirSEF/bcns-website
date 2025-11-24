/**
 * Custom hook for handling async operations with proper error handling and loading states
 * 
 * Features:
 * - Automatic loading state management
 * - Error handling with user-friendly messages
 * - Retry functionality
 * - Cleanup on component unmount
 * - TypeScript generics for type safety
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiError } from '@/lib/api-client';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | Error | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError | Error) => void;
}

interface UseAsyncReturn<T> extends UseAsyncState<T> {
  execute: (...args: any[]) => Promise<T | void>;
  reset: () => void;
  retry: () => Promise<T | void>;
}

/**
 * Hook for handling async operations with comprehensive error handling
 */
export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> {
  const { immediate = false, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const lastArgsRef = useRef<any[]>([]);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]): Promise<T | void> => {
      lastArgsRef.current = args;

      if (!mountedRef.current) return;

      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const data = await asyncFunction(...args);

        if (!mountedRef.current) return;

        setState({
          data,
          loading: false,
          error: null,
        });

        if (onSuccess) {
          onSuccess(data);
        }

        return data;
      } catch (error) {
        if (!mountedRef.current) return;

        const apiError = error instanceof ApiError ? error : 
          error instanceof Error ? error :
          new Error('An unexpected error occurred');

        setState({
          data: null,
          loading: false,
          error: apiError,
        });

        if (onError) {
          onError(apiError);
        }

        throw apiError;
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  const retry = useCallback(
    () => execute(...lastArgsRef.current),
    [execute]
  );

  const reset = useCallback(() => {
    if (!mountedRef.current) return;
    
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    retry,
    reset,
  };
}

/**
 * Hook for handling async operations that should execute on mount
 */
export function useAsyncEffect<T = any>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList = [],
  options: Omit<UseAsyncOptions, 'immediate'> = {}
): UseAsyncReturn<T> {
  const asyncResult = useAsync(asyncFunction, { ...options, immediate: false });

  useEffect(() => {
    asyncResult.execute();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return asyncResult;
}

/**
 * Hook for handling form submissions with async operations
 */
export function useAsyncSubmit<T = any>(
  submitFunction: (data: any) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> & {
  handleSubmit: (data: any) => Promise<void>;
} {
  const asyncResult = useAsync(submitFunction, options);

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        await asyncResult.execute(data);
      } catch (error) {
        // Error is already handled by useAsync
        // This catch prevents unhandled promise rejection
      }
    },
    [asyncResult]
  );

  // Return execute directly so it can be called
  return {
    ...asyncResult,
    execute: asyncResult.execute, // Make sure execute is returned
    handleSubmit,
  };
}

/**
 * Hook for handling paginated data fetching
 */
interface UsePaginatedAsyncOptions extends UseAsyncOptions {
  initialPage?: number;
  pageSize?: number;
}

interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function usePaginatedAsync<T = any>(
  fetchFunction: (page: number, pageSize: number) => Promise<PaginatedData<T>>,
  options: UsePaginatedAsyncOptions = {}
): UseAsyncReturn<PaginatedData<T>> & {
  nextPage: () => Promise<void>;
  previousPage: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  currentPage: number;
} {
  const { initialPage = 1, pageSize = 10, ...asyncOptions } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginatedFetch = useCallback(
    () => fetchFunction(currentPage, pageSize),
    [fetchFunction, currentPage, pageSize]
  );

  const asyncResult = useAsync(paginatedFetch, asyncOptions);

  const goToPage = useCallback(
    async (page: number) => {
      setCurrentPage(page);
      try {
        await asyncResult.execute();
      } catch (error) {
        // Error handled by useAsync
      }
    },
    [asyncResult]
  );

  const nextPage = useCallback(
    async () => {
      if (asyncResult.data?.hasNextPage) {
        await goToPage(currentPage + 1);
      }
    },
    [asyncResult.data?.hasNextPage, goToPage, currentPage]
  );

  const previousPage = useCallback(
    async () => {
      if (asyncResult.data?.hasPreviousPage) {
        await goToPage(currentPage - 1);
      }
    },
    [asyncResult.data?.hasPreviousPage, goToPage, currentPage]
  );

  // Re-execute when page changes
  useEffect(() => {
    if (asyncResult.data) {
      asyncResult.execute();
    }
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...asyncResult,
    nextPage,
    previousPage,
    goToPage,
    currentPage,
  };
}

/**
 * Hook for handling optimistic updates
 */
export function useOptimisticAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  optimisticUpdate: (currentData: T | null, ...args: any[]) => T | null,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> {
  const asyncResult = useAsync(asyncFunction, options);

  const executeWithOptimism = useCallback(
    async (...args: any[]): Promise<T | void> => {
      // Apply optimistic update
      const optimisticData = optimisticUpdate(asyncResult.data, ...args);
      
      if (optimisticData !== null) {
        asyncResult.reset();
        // TODO: Implement proper optimistic data setting
        // For now, just proceed with the async call
      }

      try {
        return await asyncResult.execute(...args);
      } catch (error) {
        // Revert optimistic update on error
        asyncResult.reset();
        throw error;
      }
    },
    [asyncFunction, optimisticUpdate, asyncResult]
  );

  return {
    ...asyncResult,
    execute: executeWithOptimism,
  };
}


"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { PaginationCursorDto, PaginationCursorResponseDto } from '@/lib/dto/pagination.dto'
import { ESort } from '@/lib/enums/sort.enum'

// Re-export DTOs and enum for convenience
export type { PaginationCursorDto, PaginationCursorResponseDto }
export { ESort }

export interface PaginationOptions extends Omit<PaginationCursorDto, 'cursor'> {
  initialCursor?: string | null
  ttl?: number // Time to live for cached pages, in milliseconds
  cacheSize?: number // Maximum number of pages to cache
  autoFetch?: boolean // Whether to fetch data on mount
  searchQuery?: string // Search query parameter
  searchDebounceMs?: number // Debounce delay for search queries
}

export interface CachedPage<T> {
  cursor: string | null
  data: T[]
  nextCursor?: string | null
  hasNextPage: boolean
  timestamp: number // For cache expiration
}

export interface UsePaginatedFetchReturn<T> {
  // Data
  data: T[]
  currentCursor: string | null
  nextCursor: string | null
  hasNextPage: boolean
  hasPrevPage: boolean
  
  // Loading states
  loading: boolean
  error: string | null
  
  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearching: boolean
  clearSearch: () => void
  clearSearchInput: () => void
  
  // Actions
  fetchData: (cursor?: string | null) => Promise<void>
  goToNextPage: () => void
  goToPrevPage: () => void
  goToFirstPage: () => void
  refresh: () => void
  clearCache: () => void
  
  // Cache info
  cacheSize: number
  cursorsHistory: string[]
}

export type UrlBuilder<T> = (params: PaginationCursorDto) => string;
// add ; in code for me

export function usePaginatedFetch<T>(
  endpoint: string | UrlBuilder<T>,
  options: PaginationOptions = {}
): UsePaginatedFetchReturn<T> {
  const {
    limit = 10,
    sort = ESort.DESC,
    initialCursor = null,
    cacheSize = 50,
    autoFetch = true,
    searchQuery: initialSearchQuery = '',
    searchDebounceMs = 300
  } = options;

  // State
  const [data, setData] = useState<T[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | null>(initialCursor);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearchQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [lastExecutedQuery, setLastExecutedQuery] = useState(initialSearchQuery);
  
  // Navigation history
  const [cursorsHistory, setCursorsHistory] = useState<string[]>([]);
  
  // Cache
  const cacheRef = useRef<Map<string, CachedPage<T>>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      // Always update the debounced query - the comparison will happen in the search trigger
      setDebouncedSearchQuery(searchQuery.trim());
    }, searchDebounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, searchDebounceMs]);

  // Helper functions
  const getCacheKey = useCallback((cursor: string | null, searchQuery: string = '') => {
    return `${cursor || 'first-page'}_search:${searchQuery}`
  }, []);

  const buildUrl = useCallback((cursor: string | null, searchQuery: string = '') => {
    const params: PaginationCursorDto = {
      cursor: cursor || undefined,
      limit,
      sort
    };
    
    if (typeof endpoint === 'function') {
      return endpoint(params);
    }

    let url = endpoint;
    const separator = endpoint.includes('?') ? '&' : '?';
    const searchParams = new URLSearchParams();

    searchParams.set('limit', limit.toString());
    if (sort) searchParams.set('sort', sort);
    if (cursor) searchParams.set('cursor', cursor);
    if (searchQuery.trim()) searchParams.set('search', searchQuery.trim());

    return `${url}${separator}${searchParams.toString()}`;
  }, [endpoint, limit, sort]);

  const cleanupCache = useCallback(() => {
    const cache = cacheRef.current;
    if (cache.size <= cacheSize) return;

    // Sort by timestamp and remove oldest entries
    const entries = Array.from(cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);

    const entriesToRemove = entries.slice(0, entries.length - cacheSize);
    entriesToRemove.forEach(([key]) => cache.delete(key));
  }, [cacheSize])

  const fetchData = useCallback(async (cursor: string | null = currentCursor, searchQueryOverride?: string) => {
    // Use the override if provided, otherwise use the last executed query to maintain consistency
    const activeSearchQuery = searchQueryOverride !== undefined ? searchQueryOverride : lastExecutedQuery;
    const cacheKey = getCacheKey(cursor, activeSearchQuery);
    
    // Check cache first
    const cachedPage = cacheRef.current.get(cacheKey);
    const isExpired = cachedPage && Date.now() - cachedPage.timestamp > (options.ttl || 60000);

    if (cachedPage && !isExpired) {
      setData(cachedPage.data);
      setNextCursor(cachedPage.nextCursor || null);
      setHasNextPage(cachedPage.hasNextPage);
      setCurrentCursor(cursor);
      setError(null);
      return;
    }

    // If expired, remove from cache
    if (isExpired) {
      cacheRef.current.delete(cacheKey);
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      const url = buildUrl(cursor, activeSearchQuery);
      //console.log('🚀 Fetching:', url);

      const response = await fetch(url, {
        signal: abortController.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PaginationCursorResponseDto<T> = await response.json();

      if (!result.success) {
        throw new Error('API returned unsuccessful response');
      }

      // Cache the page data
      const pageData: CachedPage<T> = {
        cursor,
        data: result.data,
        nextCursor: result.nextCursor || null,
        hasNextPage: result.hasNextPage,
        timestamp: Date.now()
      };

      cacheRef.current.set(cacheKey, pageData);
      cleanupCache();

      // Update state
      setData(result.data);
      setNextCursor(result.nextCursor || null);
      setHasNextPage(result.hasNextPage);
      setCurrentCursor(cursor);
      
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const errorMessage = err.message || 'Failed to fetch data';
        setError(errorMessage);
        console.error('Fetch error:', err);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [currentCursor, getCacheKey, buildUrl, cleanupCache, lastExecutedQuery])

  // Trigger search when debouncedSearchQuery changes
  useEffect(() => {
    const trimmedDebouncedQuery = debouncedSearchQuery;
    const trimmedLastQuery = lastExecutedQuery;
    
    // Only trigger search if the query actually changed
    if (trimmedDebouncedQuery !== trimmedLastQuery) {
      setIsSearching(true);
      setCursorsHistory([]);
      setLastExecutedQuery(trimmedDebouncedQuery);
      fetchData(null, trimmedDebouncedQuery).finally(() => setIsSearching(false));
    }
  }, [debouncedSearchQuery, fetchData, lastExecutedQuery]);

  const goToNextPage = useCallback(() => {
    if (hasNextPage && nextCursor) {
      setCursorsHistory(prev => [...prev, currentCursor || '']);
      fetchData(nextCursor);
    }
  }, [hasNextPage, nextCursor, currentCursor, fetchData])

  const goToPrevPage = useCallback(() => {
    if (cursorsHistory.length > 0) {
      const prevCursor = cursorsHistory[cursorsHistory.length - 1];
      setCursorsHistory(prev => prev.slice(0, -1));
      fetchData(prevCursor === '' ? null : prevCursor);
    }
  }, [cursorsHistory, fetchData])

  const goToFirstPage = useCallback(() => {
    setCursorsHistory([]);
    fetchData(null);
  }, [fetchData])

  const refresh = useCallback(() => {
    // Clear cache for current page and refetch
    const cacheKey = getCacheKey(currentCursor, lastExecutedQuery);
    cacheRef.current.delete(cacheKey);
    fetchData(currentCursor, lastExecutedQuery);
  }, [currentCursor, lastExecutedQuery, getCacheKey, fetchData])

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const clearSearch = useCallback(() => {
    // Clear search without clearing the input field
    setDebouncedSearchQuery('');
    setLastExecutedQuery('');
    setCursorsHistory([]);
    // This will trigger the search effect and fetch normal data
  }, []);

  const clearSearchInput = useCallback(() => {
    // Clear both the input field and search state
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setLastExecutedQuery('');
    setCursorsHistory([]);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchData(initialCursor);
    }
  }, []) // Only run on mount

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // Data
    data,
    currentCursor,
    nextCursor,
    hasNextPage,
    hasPrevPage: cursorsHistory.length > 0,
    
    // Loading states
    loading,
    error,
    
    // Search
    searchQuery,
    setSearchQuery,
    isSearching,
    clearSearch,
    clearSearchInput,
    
    // Actions
    fetchData,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    refresh,
    clearCache,
    
    // Cache info
    cacheSize: cacheRef.current.size,
    cursorsHistory
  };
}

// Utility hook for infinite scroll pagination
export function useInfinitePaginatedFetch<T>(
  endpoint: string | UrlBuilder<T>,
  options: PaginationOptions = {}
) {
  const {
    data,
    loading,
    error,
    hasNextPage,
    fetchData,
    refresh,
    clearCache,
    ...rest
  } = usePaginatedFetch<T>(endpoint, options);

  const [allData, setAllData] = useState<T[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  // Append new data to existing data
  const loadMore = useCallback(async () => {
    if (!hasNextPage || loading || loadingMore) return;

    setLoadingMore(true);
    try {
      await rest.goToNextPage();
      setAllData(prev => [...prev, ...data]);
    } finally {
      setLoadingMore(false);
    }
  }, [hasNextPage, loading, loadingMore, rest.goToNextPage, data]);

  // Reset all data
  const resetData = useCallback(() => {
    setAllData([]);
    rest.goToFirstPage();
  }, [rest.goToFirstPage]);

  // Update allData when data changes (for first page or refresh)
  useEffect(() => {
    if (rest.currentCursor === null) {
      setAllData(data);
    }
  }, [data, rest.currentCursor]);

  return {
    data: allData,
    loading,
    loadingMore,
    error,
    hasNextPage,
    loadMore,
    refresh: () => {
      resetData()
      refresh()
    },
    clearCache,
    resetData
  }
}

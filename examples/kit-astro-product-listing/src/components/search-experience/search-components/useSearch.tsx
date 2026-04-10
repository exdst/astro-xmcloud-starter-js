import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Sitecore Edge Search API response shape
 */
interface SearchApiResponse<T> {
  total_item: number;
  widgets: Array<{
    total_item: number;
    content: T[];
  }>;
}

interface UseSearchOptions {
  searchIndexId: string;
  page: number;
  pageSize: number;
  enabled: boolean;
  query: string;
}

interface UseSearchResult<T> {
  total: number;
  totalPages: number;
  results: T[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}

interface UseInfiniteSearchOptions {
  searchIndexId: string;
  pageSize: number;
  enabled: boolean;
  query: string;
}

interface UseInfiniteSearchResult<T> {
  total: number;
  results: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean;
  loadMore: () => void;
}

const EDGE_API_URL = 'https://edge.sitecorecloud.io/api/search/v2';

async function fetchSearch<T>(
  searchIndexId: string,
  query: string,
  page: number,
  pageSize: number
): Promise<{ total: number; results: T[] }> {
  const params = new URLSearchParams({
    rfk_id: searchIndexId,
    limit: String(pageSize),
    offset: String((page - 1) * pageSize),
  });

  if (query) {
    params.set('keyphrase', query);
  }

  const response = await fetch(`${EDGE_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Search API error: ${response.status} ${response.statusText}`);
  }

  const data: SearchApiResponse<T> = await response.json();
  const widget = data.widgets?.[0];

  return {
    total: widget?.total_item ?? data.total_item ?? 0,
    results: widget?.content ?? [],
  };
}

/**
 * Custom React hook replacing @sitecore-content-sdk/nextjs useSearch.
 * Calls the Sitecore Edge Search API directly.
 */
export function useSearch<T>(options: UseSearchOptions): UseSearchResult<T> {
  const { searchIndexId, page, pageSize, enabled, query } = options;
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled || !searchIndexId) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    fetchSearch<T>(searchIndexId, query, page, pageSize)
      .then(({ total: t, results: r }) => {
        if (controller.signal.aborted) return;
        setTotal(t);
        setResults(r);
        setIsSuccess(true);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setIsError(true);
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [enabled, searchIndexId, query, page, pageSize]);

  return {
    total,
    totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
    results,
    isLoading,
    isSuccess,
    isError,
    error,
  };
}

/**
 * Custom React hook replacing @sitecore-content-sdk/nextjs useInfiniteSearch.
 * Accumulates results across pages (load more pattern).
 */
export function useInfiniteSearch<T>(options: UseInfiniteSearchOptions): UseInfiniteSearchResult<T> {
  const { searchIndexId, pageSize, enabled, query } = options;
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const prevQueryRef = useRef(query);

  // Reset when query changes
  useEffect(() => {
    if (prevQueryRef.current !== query) {
      prevQueryRef.current = query;
      setPage(1);
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    if (!enabled || !searchIndexId) return;

    const isFirstPage = page === 1;
    if (isFirstPage) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setIsError(false);
    setError(null);

    fetchSearch<T>(searchIndexId, query, page, pageSize)
      .then(({ total: t, results: r }) => {
        setTotal(t);
        setResults((prev) => (isFirstPage ? r : [...prev, ...r]));
        setIsSuccess(true);
      })
      .catch((err) => {
        setIsError(true);
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoadingMore(false);
      });
  }, [enabled, searchIndexId, query, page, pageSize]);

  const loadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const hasNextPage = results.length < total;

  return {
    total,
    results,
    isLoading,
    isLoadingMore,
    isSuccess,
    isError,
    error,
    hasNextPage,
    loadMore,
  };
}

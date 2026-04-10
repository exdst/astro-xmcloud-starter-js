import { useCallback } from 'react';
import { useDebouncedCallback } from './useDebounce';

/**
 * Replaces Next.js useRouter with vanilla browser APIs.
 * Updates the URL query string without a full page reload.
 */
export const useRouter = () => {
  const setRouterQuery = useCallback((value: string) => {
    const currentPath = window.location.pathname;
    const queryString = value ? `?q=${encodeURIComponent(value)}` : '';
    const asPath = currentPath + queryString;

    window.history.replaceState({}, '', asPath);
    // Dispatch a popstate event so listeners (like useSearchParams) can react
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  const debouncedSetRouterQuery = useDebouncedCallback(setRouterQuery);

  const setQuery = useCallback(
    (value: string, debounced: boolean = true) => {
      if (debounced) {
        debouncedSetRouterQuery(value);
      } else {
        setRouterQuery(value);
      }
    },
    [debouncedSetRouterQuery, setRouterQuery]
  );

  return { setRouterQuery: setQuery };
};

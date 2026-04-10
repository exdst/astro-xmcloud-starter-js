import { useEffect, useState } from 'react';

// Global state to track Google Maps loading
let isGoogleMapsLoaded = false;
let isGoogleMapsLoading = false;
const loadingCallbacks: (() => void)[] = [];

declare global {
  interface Window {
    google: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    initGoogleMapsCallback: () => void;
  }
}

/**
 * Inject the Google Maps <script> tag and call back when ready.
 */
function injectGoogleMapsScript(apiKey: string, onLoad: () => void, onError: (err: Error) => void) {
  if (isGoogleMapsLoaded || window.google) {
    isGoogleMapsLoaded = true;
    onLoad();
    return;
  }

  if (isGoogleMapsLoading) {
    loadingCallbacks.push(onLoad);
    return;
  }

  isGoogleMapsLoading = true;

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
  script.async = true;
  script.defer = true;

  window.initGoogleMapsCallback = () => {
    isGoogleMapsLoaded = true;
    isGoogleMapsLoading = false;
    onLoad();
    loadingCallbacks.forEach((cb) => cb());
    loadingCallbacks.length = 0;
  };

  script.onerror = () => {
    isGoogleMapsLoading = false;
    onError(new Error('Failed to load Google Maps API'));
  };

  document.head.appendChild(script);
}

export const useGoogleMaps = (apiKey: string) => {
  const [isLoaded, setIsLoaded] = useState(isGoogleMapsLoaded);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setError(new Error('Google Maps API key is not configured'));
      return;
    }

    if (isGoogleMapsLoaded || window.google) {
      isGoogleMapsLoaded = true;
      setIsLoaded(true);
      return;
    }

    if (isGoogleMapsLoading) {
      const callback = () => setIsLoaded(true);
      loadingCallbacks.push(callback);
      return () => {
        const index = loadingCallbacks.indexOf(callback);
        if (index > -1) {
          loadingCallbacks.splice(index, 1);
        }
      };
    }

    let cancelled = false;
    const schedule =
      typeof window.requestIdleCallback === 'function'
        ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 4000 })
        : (cb: () => void) => window.setTimeout(cb, 2500);

    const handle = schedule(() => {
      if (cancelled) return;
      injectGoogleMapsScript(
        apiKey,
        () => setIsLoaded(true),
        (err) => setError(err)
      );
    });

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === 'function' && typeof handle === 'number') {
        window.cancelIdleCallback(handle);
      } else {
        clearTimeout(handle as unknown as ReturnType<typeof setTimeout>);
      }
      window.initGoogleMapsCallback = () => {};
    };
  }, [apiKey]);

  return { isLoaded, error };
};

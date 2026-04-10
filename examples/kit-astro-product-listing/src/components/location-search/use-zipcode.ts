import { useState, useCallback } from 'react';

/**
 * Hook for managing zipcode state with geolocation support.
 * Simplified version for Astro React islands (no Next.js dependencies).
 */
export function useZipcode(defaultZipCode: string) {
  const [zipcode, setZipcode] = useState(defaultZipCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchZipcode = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setShowModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocode to get zipcode from coordinates
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
              (window as any).__GOOGLE_MAPS_API_KEY || ''
            }`
          );
          const data = await response.json();

          if (data.status === 'OK' && data.results?.length > 0) {
            // Find the postal code component
            for (const result of data.results) {
              for (const component of result.address_components) {
                if (component.types.includes('postal_code')) {
                  setZipcode(component.long_name);
                  setLoading(false);
                  return;
                }
              }
            }
          }

          // If we couldn't find a zipcode, show the modal
          setError('Could not determine your zipcode from your location');
          setShowModal(true);
          setLoading(false);
        } catch {
          setError('Failed to determine your location');
          setShowModal(true);
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setShowModal(true);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const updateZipcode = useCallback((zip: string) => {
    setZipcode(zip);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return {
    zipcode,
    loading,
    error,
    showModal,
    fetchZipcode,
    updateZipcode,
    closeModal,
  };
}

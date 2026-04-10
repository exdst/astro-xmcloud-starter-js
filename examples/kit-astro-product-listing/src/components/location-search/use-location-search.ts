import { useMemo, useCallback, useState, useEffect } from 'react';
import type { LocationSearchProps, Dealership, DealershipFields } from './location-search.props';
import { enrichDealerships } from './utils';
import { useZipcode } from './use-zipcode';

/**
 * Shared hook for all LocationSearch variants.
 * Extracts and manages dealership state, zipcode, geolocation, and map center.
 */
export function useLocationSearch(props: LocationSearchProps) {
  const defaultZipCode = props.defaultZipCode || '';
  const googleMapsApiKey = props.googleMapsApiKey || '';

  const [showChangeZipcodeModal, setShowChangeZipcodeModal] = useState(false);

  const {
    zipcode: geoZipcode,
    loading: geoLoading,
    error: geoError,
    showModal,
    fetchZipcode,
    updateZipcode,
    closeModal,
  } = useZipcode(defaultZipCode);

  const initialDealerships = useMemo(() => {
    return props.initialDealerships || [];
  }, [props.initialDealerships]);

  const [zipCode, setZipCode] = useState(defaultZipCode);
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [selectedDealership, setSelectedDealership] = useState<Dealership | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 33.749, lng: -84.388 });
  const [isLoading, setIsLoading] = useState(true);

  const handleSelectDealership = useCallback((dealership: Dealership) => {
    setSelectedDealership(dealership);
    if (dealership.latitude && dealership.longitude) {
      setMapCenter({ lat: dealership.latitude, lng: dealership.longitude });
    }
  }, []);

  const updateDealershipsWithZipcode = useCallback(
    async (zip: string) => {
      if (!zip || initialDealerships.length === 0) return;

      setIsLoading(true);
      try {
        const enrichedDealerships = await enrichDealerships(
          initialDealerships,
          zip,
          googleMapsApiKey
        );

        setDealerships(enrichedDealerships);

        if (enrichedDealerships.length > 0) {
          handleSelectDealership(enrichedDealerships[0]);
        }
      } catch (error) {
        console.error('Error updating dealerships:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [initialDealerships, googleMapsApiKey, handleSelectDealership]
  );

  // Update local zipcode when geolocation zipcode changes
  useEffect(() => {
    if (geoZipcode && geoZipcode !== zipCode) {
      setZipCode(geoZipcode);
      updateDealershipsWithZipcode(geoZipcode);
    }
  }, [geoZipcode, zipCode, updateDealershipsWithZipcode]);

  // Initial load of dealerships
  useEffect(() => {
    const initializeDealerships = async () => {
      if (initialDealerships.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const enrichedDealerships = await enrichDealerships(
          initialDealerships,
          zipCode,
          googleMapsApiKey
        );

        setDealerships(enrichedDealerships);

        if (enrichedDealerships.length > 0) {
          handleSelectDealership(enrichedDealerships[0]);
        }
      } catch (error) {
        console.error('Error initializing dealerships:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDealerships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDealerships, googleMapsApiKey]);

  // Update distances when zip code changes
  useEffect(() => {
    updateDealershipsWithZipcode(zipCode);
  }, [zipCode, updateDealershipsWithZipcode]);

  const handleUseMyLocation = useCallback(() => {
    setZipCode('');
    fetchZipcode();
  }, [fetchZipcode]);

  const handleModalSubmit = useCallback(
    (zipcode: string) => {
      updateZipcode(zipcode);
      setZipCode(zipcode);
      setShowChangeZipcodeModal(false);
    },
    [updateZipcode]
  );

  const handleOpenModal = useCallback(() => {
    setShowChangeZipcodeModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    closeModal();
    setShowChangeZipcodeModal(false);
  }, [closeModal]);

  return {
    title: props.title,
    googleMapsApiKey,
    isPageEditing: props.isPageEditing || false,
    styles: props.styles || '',
    zipCode,
    dealerships,
    selectedDealership,
    mapCenter,
    isLoading,
    initialDealerships,
    geoLoading,
    geoError,
    showModal: showModal || showChangeZipcodeModal,
    handleSelectDealership,
    handleUseMyLocation,
    handleModalSubmit,
    handleOpenModal,
    handleCloseModal,
  };
}

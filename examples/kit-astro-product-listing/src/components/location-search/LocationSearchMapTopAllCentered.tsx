import type { LocationSearchProps } from './location-search.props';
import { LocationSearchItem } from './LocationSearchItem';
import { GoogleMap } from './GoogleMap';
import { ZipcodeModal } from './ZipcodeModal';
import { useLocationSearch } from './use-location-search';
import { cn } from '@/lib/utils';

export const LocationSearchMapTopAllCentered = (props: LocationSearchProps) => {
  const {
    title,
    googleMapsApiKey,
    isPageEditing,
    styles,
    zipCode,
    dealerships,
    selectedDealership,
    mapCenter,
    isLoading,
    initialDealerships,
    geoLoading,
    showModal,
    geoError,
    handleSelectDealership,
    handleUseMyLocation,
    handleModalSubmit,
    handleOpenModal,
    handleCloseModal,
  } = useLocationSearch(props);

  const hasPagesPositionStyles = styles ? styles.includes('position-') : false;

  return (
    <div
      className="@container bg-background text-foreground group relative"
      data-component="LocationSearch"
    >
      <div className="mx-auto max-w-screen-xl px-4 py-8">
        {googleMapsApiKey === '' && isPageEditing && (
          <p className="border-default bg-secondary text-secondary-foreground max-w-3/4 absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform p-4 text-center text-xl">
            Please set the Google Maps API key in the environment variables to enable the map.
          </p>
        )}
        <div
          className={cn('group', {
            'position-center': !hasPagesPositionStyles,
            [styles]: styles,
          })}
          data-class-change
        >
          {title?.value && (
            <h2 className="mb-3">{title.value}</h2>
          )}
          <div
            className={cn(
              'mb-11 flex flex-wrap items-center gap-2 group-[.position-center]:justify-center',
              {
                'opacity-20': googleMapsApiKey === '' && isPageEditing,
              }
            )}
          >
            <span className="font-heading text-lg font-light">Locations near</span>
            <button
              onClick={handleOpenModal}
              className="font-heading flex p-0 text-lg font-bold underline decoration-current underline-offset-2 transition-all duration-200 hover:decoration-transparent bg-transparent border-none cursor-pointer"
              disabled={geoLoading}
            >
              {!geoLoading ? (
                <>
                  {zipCode}
                  <span className="sr-only">Change Location</span>
                </>
              ) : (
                <>
                  <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-b-2"></div>
                  <span className="font-heading flex text-lg font-bold underline underline-offset-4">
                    Detecting location...
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
        <div
          className={cn('flex flex-col gap-6', {
            'opacity-20': googleMapsApiKey === '' && isPageEditing,
          })}
        >
          <div className="relative mx-auto h-[439px] w-full overflow-hidden bg-white">
            <GoogleMap
              apiKey={googleMapsApiKey}
              center={mapCenter}
              zoom={12}
              selectedDealership={selectedDealership}
              dealerships={dealerships}
              onDealershipSelect={handleSelectDealership}
            />
          </div>
          <div className="mx-auto max-h-[470px] max-w-[600px] space-y-6 overflow-y-auto">
            {isLoading ? (
              <div className="py-4 text-center">Loading dealerships...</div>
            ) : dealerships.length === 0 ? (
              <div className="py-4 text-center">
                No dealerships found
                <span className="mt-2 block text-xs text-gray-400">
                  (Initial count from Sitecore: {initialDealerships.length})
                </span>
              </div>
            ) : (
              dealerships.map((dealership, index) => (
                <LocationSearchItem
                  key={index}
                  dealership={dealership}
                  isSelected={
                    selectedDealership?.dealershipName?.jsonValue?.value ===
                    dealership.dealershipName?.jsonValue?.value
                  }
                  onSelect={handleSelectDealership}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <ZipcodeModal
        open={showModal}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        onUseMyLocation={handleUseMyLocation}
        isGeoLoading={geoLoading}
        error={geoError}
      />
    </div>
  );
};

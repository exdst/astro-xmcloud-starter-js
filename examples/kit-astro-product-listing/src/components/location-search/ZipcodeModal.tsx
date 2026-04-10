import { useState, useEffect, useRef } from 'react';

interface ZipcodeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (zipcode: string) => void;
  onUseMyLocation: () => void;
  isGeoLoading: boolean;
  error: string | null;
}

export function ZipcodeModal({
  open,
  onClose,
  onSubmit,
  onUseMyLocation,
  isGeoLoading,
  error,
}: ZipcodeModalProps) {
  const [zipcode, setZipcode] = useState('');
  const [validationError, setValidationError] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = zipcode.trim();

    if (!trimmed) {
      setValidationError('Please enter a valid zipcode');
      return;
    }

    const zipcodeRegex = /^\d{5}(-\d{4})?$/;
    if (!zipcodeRegex.test(trimmed)) {
      setValidationError('Please enter a valid 5-digit zipcode');
      return;
    }

    setValidationError('');
    onSubmit(trimmed);
    setZipcode('');
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-full max-w-[425px] rounded-lg bg-background p-0 text-foreground shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold leading-none tracking-tight">Enter your zipcode</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error
              ? `We couldn't access your location: ${error}. Please enter your zipcode manually or try again.`
              : 'Please enter your zipcode to continue.'}
          </p>
        </div>

        {/* Close button */}
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Form */}
        <form className="space-y-4 py-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter your zipcode (e.g., 10001)"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={zipcode}
              onChange={(e) => {
                setZipcode(e.target.value);
                setValidationError('');
              }}
            />
            {validationError && (
              <p className="text-sm text-red-500">{validationError}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={onUseMyLocation}
              disabled={isGeoLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{isGeoLoading ? 'Getting location...' : 'Use my location'}</span>
              {isGeoLoading && (
                <div className="ml-1 h-4 w-4 animate-spin rounded-full border-b-2 border-primary" />
              )}
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Save zipcode
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

import type { LocationSearchItemProps } from './location-search.props';

export const LocationSearchItem = ({
  dealership,
  isSelected,
  onSelect,
}: LocationSearchItemProps) => {
  return (
    <article
      className={`border-1 cursor-pointer p-5 transition-colors ${
        isSelected
          ? 'bg-primary text-primary-foreground rounded-default border-primary'
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/70 border-border '
      }`}
      onClick={() => onSelect(dealership)}
      onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter' ? onSelect(dealership) : null)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      data-component="LocationSearchItem"
    >
      <div className="flex items-start justify-between">
        <div>
          {dealership?.dealershipName?.jsonValue && (
            <h3 className="font-heading @md:text-3xl text-2xl font-normal">
              {dealership.dealershipName.jsonValue.value}
            </h3>
          )}
          <p className="font-heading mt-3 text-lg">
            {dealership.dealershipAddress?.jsonValue?.value}
            {', '}
            {dealership.dealershipCity?.jsonValue?.value}{' '}
            {dealership.dealershipZipCode?.jsonValue?.value}
          </p>
        </div>
        {dealership.distance !== undefined && (
          <span className="font-heading whitespace-nowrap text-right">
            {dealership.distance.toFixed(1)}mi
          </span>
        )}
      </div>
    </article>
  );
};

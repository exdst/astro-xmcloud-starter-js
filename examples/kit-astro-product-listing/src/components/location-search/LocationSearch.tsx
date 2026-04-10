import type { LocationSearchProps } from './location-search.props';
import { LocationSearchDefault } from './LocationSearchDefault';
import { LocationSearchMapRight } from './LocationSearchMapRight';
import { LocationSearchMapTopAllCentered } from './LocationSearchMapTopAllCentered';
import { LocationSearchMapRightTitleZipCentered } from './LocationSearchMapRightTitleZipCentered';
import { LocationSearchTitleZipCentered } from './LocationSearchTitleZipCentered';

/**
 * LocationSearch dispatcher component.
 * Renders the appropriate variant based on the `variant` prop.
 */
export default function LocationSearch(props: LocationSearchProps) {
  const { variant = 'Default', ...rest } = props;

  switch (variant) {
    case 'MapRight':
      return <LocationSearchMapRight {...rest} />;
    case 'MapTopAllCentered':
      return <LocationSearchMapTopAllCentered {...rest} />;
    case 'MapRightTitleZipCentered':
      return <LocationSearchMapRightTitleZipCentered {...rest} />;
    case 'TitleZipCentered':
    case 'MapLeftTitleZipCentered':
      return <LocationSearchTitleZipCentered {...rest} />;
    case 'Default':
    default:
      return <LocationSearchDefault {...rest} />;
  }
}

// These fields are authored in Sitecore
export interface DealershipFields {
  dealershipName: { jsonValue: { value: string } };
  dealershipAddress: { jsonValue: { value: string } };
  dealershipCity: { jsonValue: { value: string } };
  dealershipState: { jsonValue: { value: string } };
  dealershipZipCode: { jsonValue: { value: string } };
}

// This extends the authored fields with runtime calculated values
export interface Dealership extends DealershipFields {
  distance?: number;
  latitude?: number;
  longitude?: number;
}

export interface LocationSearchParams {
  [key: string]: string | undefined;
  styles?: string;
  RenderingIdentifier?: string;
}

export interface LocationSearchFields {
  title: { jsonValue: { value: string } };
  defaultZipCode: string;
}

export interface LocationSearchProps {
  variant?: string;
  isPageEditing?: boolean;
  params?: LocationSearchParams;
  title?: { value: string };
  defaultZipCode?: string;
  googleMapsApiKey?: string;
  initialDealerships?: DealershipFields[];
  styles?: string;
}

export interface LocationSearchItemProps {
  dealership: Dealership;
  isSelected: boolean;
  onSelect: (dealership: Dealership) => void;
}

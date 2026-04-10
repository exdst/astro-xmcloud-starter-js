export type SearchParams = {
  columns?: string;
  pageSize?: number;
  styles?: string;
  GridParameters?: string;
  RenderingIdentifier?: string;
};

export type SearchDocument = {
  sc_item_id: string;
  Description: string;
  Price: string;
  ProductName: string;
  AmpPower: string;
  Link: string;
};

type SearchDocumentKey = keyof SearchDocument;

/**
 * Mapping of the component fields to the search index fields
 */
export interface SearchFieldsMapping {
  description?: SearchDocumentKey;
  type?: SearchDocumentKey;
  title?: SearchDocumentKey;
  link?: SearchDocumentKey;
  images?: SearchDocumentKey;
  tags?: SearchDocumentKey;
}

export interface SearchField {
  searchIndex: string;
  fieldsMapping: SearchFieldsMapping;
}

/**
 * Dictionary keys for translations - passed as a prop dictionary from the Astro wrapper
 */
export type SearchDictionary = {
  resultsFound?: string;
  noResultsFound?: string;
  tryAdjustingYourSearch?: string;
  clearSearch?: string;
  somethingWentWrong?: string;
  tryAgain?: string;
  loadMore?: string;
  searchInputPlaceholder?: string;
  previousPage?: string;
  nextPage?: string;
  readMore?: string;
};

export interface SearchExperienceReactProps {
  params: SearchParams;
  searchFieldValue: string;
  renderingUid?: string;
  isEditing: boolean;
  isPreview: boolean;
  siteName: string;
  routeName?: string;
  routeLanguage?: string;
  dictionary?: SearchDictionary;
}

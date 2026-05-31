import type { Field } from '@sitecore-content-sdk/content/layout';

export type PageTitles = {
  pageTitle: Field<string>;
  pageSubtitle?: Field<string>;
  pageShortTitle?: Field<string>;
  pageHeaderTitle: Field<string>;
  dynamicListingTitle?: Field<string>;
};

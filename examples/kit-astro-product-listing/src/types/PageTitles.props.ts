import { Field } from '@sitecore-content-sdk/core';

export type PageTitles = {
  pageTitle: Field<string>;
  pageSubtitle?: Field<string>;
  pageShortTitle?: Field<string>;
  pageHeaderTitle: Field<string>;
  dynamicListingTitle?: Field<string>;
};

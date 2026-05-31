import type { Field } from '@sitecore-content-sdk/content/layout';
import type { LinkField } from '@exdst-sitecore-content-sdk/astro/components/Link.astro';
import type { ImageField } from '@exdst-sitecore-content-sdk/astro/components/Image.astro';

export type GqlField<T> = {
  jsonValue: T;
};

/**
 * WARNING Link languages are not correct GraphQL links. Use "languageLinksUtils"
 */
export type GqlLink = GqlField<LinkField>;

export type GqlFieldString = GqlField<Field<string>>;
export type GqlFieldBoolean = GqlField<Field<boolean>>;
export type GqlFieldNumber = GqlField<Field<number>>;

export type GqlImage = GqlField<ImageField>;

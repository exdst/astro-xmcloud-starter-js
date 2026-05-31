import type { Field, Item } from '@sitecore-content-sdk/content/layout';

export type ReferenceField = {
  id: string;
  name: string;
  url?: string;
  displayName?: string;
  fields?: {
    [key: string]: Field | Item[] | ReferenceField | null;
  };
};

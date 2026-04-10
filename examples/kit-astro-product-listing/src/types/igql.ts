import { ImageField, LinkField, RichTextField, TextField } from '@sitecore-content-sdk/core';

export interface IGQLTextField {
  jsonValue: TextField;
}
export interface IGQLImageField {
  jsonValue: ImageField;
}
export interface IGQLLinkField {
  jsonValue: LinkField;
}
export interface IGQLRichTextField {
  jsonValue: RichTextField;
}

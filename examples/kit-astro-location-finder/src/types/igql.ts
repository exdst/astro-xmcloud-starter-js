import type { ImageField } from '@exdst-sitecore-content-sdk/astro/components/Image.astro';
import type { LinkField } from '@exdst-sitecore-content-sdk/astro/components/Link.astro';
import type { RichTextField } from '@exdst-sitecore-content-sdk/astro/components/RichText.astro';
import type { TextField } from '@exdst-sitecore-content-sdk/astro/components/Text.astro';

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

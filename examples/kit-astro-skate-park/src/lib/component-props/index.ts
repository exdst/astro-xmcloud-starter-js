import { ComponentParams, ComponentRendering } from "@exdst-sitecore-content-sdk/astro";

export type ComponentProps = {
  rendering: ComponentRendering;
  params: ComponentParams & {
    RenderingIdentifier?: string;
    styles?: string;
    EnabledPlaceholders?: string;
  };
};

import type { APIRoute, APIContext } from "astro";
import { EditingRenderMiddleware } from "@exdst-sitecore-content-sdk/astro/editing";

/**
 * This API route is used to handle GET requests from Sitecore Editor.
 * This route should match the `serverSideRenderingEngineEndpointUrl` in your Sitecore configuration,
 * which is set to "http://<rendering_host>/api/editing/render" by default (see the settings item under /sitecore/content/<your/site/path>/Settings/Site Grouping).
 */
export const ALL: APIRoute = async ({ request }: APIContext) => {
  const handler = new EditingRenderMiddleware().getHandler();
  return await handler(request);
};

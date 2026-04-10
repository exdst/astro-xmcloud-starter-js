import type { APIRoute } from "astro";
import { fetchServicesFromEdge } from "@/lib/service-from-edge";
import { aiJsonResponse } from "@/lib/ai-json-response";

export const GET: APIRoute = async () => {
  const result = await fetchServicesFromEdge();

  if (!result.services.length) {
    return aiJsonResponse(
      { error: "No services available" },
      { status: 404, maxAge: 300 }
    );
  }

  return aiJsonResponse(result, {
    maxAge: 86400,
    sMaxAge: 86400,
    staleWhileRevalidate: 43200,
  });
};

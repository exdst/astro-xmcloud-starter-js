import type { APIRoute } from "astro";
import { fetchFaqFromEdge } from "@/lib/faq-from-edge";
import { aiJsonResponse } from "@/lib/ai-json-response";

export const GET: APIRoute = async () => {
  const result = await fetchFaqFromEdge();

  if (!result.items.length) {
    return aiJsonResponse(
      { error: "No FAQ items available" },
      { status: 404, maxAge: 300 }
    );
  }

  return aiJsonResponse(result, {
    maxAge: 86400,
    sMaxAge: 86400,
    staleWhileRevalidate: 43200,
  });
};

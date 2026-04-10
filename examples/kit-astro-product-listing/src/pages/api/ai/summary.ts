import type { APIRoute } from "astro";
import { fetchSummaryFromEdge } from "@/lib/summary-from-edge";
import { aiJsonResponse } from "@/lib/ai-json-response";

export const GET: APIRoute = async () => {
  const summary = await fetchSummaryFromEdge();

  if (!summary) {
    return aiJsonResponse(
      { error: "Summary not available" },
      { status: 404, maxAge: 300 }
    );
  }

  return aiJsonResponse(summary, {
    maxAge: 86400,
    sMaxAge: 86400,
    staleWhileRevalidate: 43200,
  });
};

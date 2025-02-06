// src/utils/api.ts
export function createApiResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function createErrorResponse(error: string, status = 400) {
  return createApiResponse({ error }, status);
}

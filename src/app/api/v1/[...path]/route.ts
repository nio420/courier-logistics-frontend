import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

async function handler(request: NextRequest) {
  if (!API_URL) {
    return Response.json(
      { message: "API URL is not configured." },
      { status: 500 },
    );
  }

  const path = request.nextUrl.pathname.replace(/^\/api\/v1/, "");
  const url = `${API_URL}${path}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("connection");
  headers.delete("origin");

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const response = await fetch(url, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
    redirect: "manual",
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
  handler as HEAD,
};

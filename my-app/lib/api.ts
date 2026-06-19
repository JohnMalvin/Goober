type HttpMethod = "GET" | "POST";

export async function apiRequest(
  url: string,
  method: HttpMethod = "GET",
  body?: unknown
) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method === "POST" ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: data.error || "Unknown error",
    };
  }

  return {
    ok: true,
    status: res.status,
    data,
  };
}
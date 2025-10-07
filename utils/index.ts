// Re-export all utilities from a single entry point
export * from "./formatters";
export * from "./validation";

// Keep the existing postJson function for backward compatibility
export async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message || res.statusText || "Request failed");
  }
  return json;
}

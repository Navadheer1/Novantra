/**
 * Client-Side Meeting Code Utility
 * Generates valid abc-defg-hij meeting codes as fallback for offline or guest mode.
 */

export function generateClientMeetingCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part1}-${part2}-${part3}`;
}

export async function safeFetchJson(url: string, options: RequestInit = {}): Promise<{ ok: boolean; data: any; status: number }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      return { ok: res.ok, data, status: res.status };
    } else {
      const text = await res.text();
      console.warn(`[SafeFetchJson Warning] Non-JSON response (${res.status}) from ${url}:`, text.slice(0, 150));
      return { ok: false, data: { error: `Server returned non-JSON response (${res.status})` }, status: res.status };
    }
  } catch (err: any) {
    console.error(`[SafeFetchJson Error] Network fetch failed for ${url}:`, err);
    return { ok: false, data: { error: err.message || "Network connection failure" }, status: 0 };
  }
}

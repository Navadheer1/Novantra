import { getApiUrl } from "./apiConfig";
import { useMailStore } from "./stores/useMailStore";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  offline: boolean;
  status: number;
  message?: string;
}

export interface ApiClientOptions extends RequestInit {
  token?: string | null;
  timeoutMs?: number;
  retries?: number;
}

/**
 * Normalized Resilient Centralized API Client
 * Method-specific retries, AbortController timeout protection, dual host fallback, and normalized response shape.
 */
export async function resilientFetch<T = any>(
  path: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const method = (options.method || "GET").toUpperCase();
  const timeoutMs = options.timeoutMs || 5000;
  
  // Safe retry rules: GET (up to 2), PATCH (at most 1), POST/DELETE (0 retries)
  const maxRetries = options.retries !== undefined ? options.retries : method === "GET" ? 2 : method === "PATCH" ? 1 : 0;

  const baseUrls = [
    getApiUrl(),
    "http://localhost:5000",
    "http://127.0.0.1:5000"
  ];

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    for (const baseUrl of baseUrls) {
      const fullUrl = `${baseUrl}${cleanPath}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const signal = options.signal
        ? (options.signal as AbortSignal)
        : controller.signal;

      try {
        const headers: Record<string, string> = {
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...(options.headers as Record<string, string> || {})
        };

        if (options.token) {
          headers["Authorization"] = `Bearer ${options.token}`;
        }

        console.log(`[resilientFetch] ${method} ${fullUrl} (Attempt ${attempt + 1})`);
        const res = await fetch(fullUrl, {
          ...options,
          method,
          headers,
          signal
        });

        clearTimeout(timeoutId);

        if (useMailStore.getState().offlineMode) {
          useMailStore.getState().setOfflineMode(false);
        }

        if (res.ok) {
          try {
            const data = await res.json();
            return {
              success: true,
              data: data as T,
              offline: false,
              status: res.status
            };
          } catch (e) {
            return {
              success: true,
              data: null,
              offline: false,
              status: res.status
            };
          }
        } else {
          return {
            success: false,
            data: null,
            offline: false,
            status: res.status,
            message: `HTTP ${res.status} ${res.statusText}`
          };
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        lastError = err;
        if (err.name === "AbortError" && options.signal?.aborted) {
          return {
            success: false,
            data: null,
            offline: false,
            status: 0,
            message: "Request aborted"
          };
        }
      }
    }

    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 200));
    }
  }

  console.warn(`[resilientFetch] Backend network connection unavailable for ${path}:`, lastError);
  useMailStore.getState().setOfflineMode(true);
  return {
    success: false,
    data: null,
    offline: true,
    status: 0,
    message: "Backend unavailable"
  };
}

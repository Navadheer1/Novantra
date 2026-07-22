import { getApiUrl } from "./api";
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
 * Method-specific retries, AbortController timeout protection, and normalized response shape.
 */
export async function resilientFetch<T = any>(
  path: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const method = (options.method || "GET").toUpperCase();
  const timeoutMs = options.timeoutMs || 5000;
  
  // Safe retry rules: GET (up to 2), PATCH (at most 1), POST/DELETE (0 retries)
  const maxRetries = options.retries !== undefined ? options.retries : method === "GET" ? 2 : method === "PATCH" ? 1 : 0;

  const baseUrl = getApiUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
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

      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal
      });

      clearTimeout(timeoutId);

      // On 2xx, 3xx, or 4xx responses, return structured API response
      if (response.ok || response.status < 500) {
        let responseData: any = null;
        try {
          responseData = await response.json();
        } catch (_) {
          responseData = null;
        }

        useMailStore.getState().setOfflineMode(false);

        return {
          success: response.ok,
          data: responseData,
          offline: false,
          status: response.status,
          message: response.ok ? "Success" : responseData?.error || responseData?.message || `HTTP ${response.status}`
        };
      }

      lastError = new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    } catch (err: any) {
      clearTimeout(timeoutId);
      lastError = err;
    }

    // Wait before retrying (exponential backoff)
    if (attempt < maxRetries) {
      await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 300));
    }
  }

  // Network / server unavailable fallback
  useMailStore.getState().setOfflineMode(true);

  return {
    success: false,
    data: null,
    offline: true,
    status: 0,
    message: lastError?.name === "AbortError" 
      ? `Network Timeout: Connection to ${baseUrl} timed out`
      : `Network Error: Unable to connect to ${baseUrl}`
  };
}

/**
 * Centralized API URL Configuration and Request Manager
 * Provides validation, logging, and unified fetch handling.
 */

export const getApiUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  let baseUrl = envUrl || "http://127.0.0.1:5000";

  // Validate URL protocol format
  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    console.error(`[API Config Error] Invalid NEXT_PUBLIC_API_URL format: "${baseUrl}". Must start with http:// or https://. Defaulting to http://127.0.0.1:5000`);
    baseUrl = "http://127.0.0.1:5000";
  }

  // Strip trailing slashes
  return baseUrl.replace(/\/$/, "");
};

export interface ApiFetchOptions extends RequestInit {
  token?: string | null;
}

/**
 * Robust Centralized fetch wrapper with diagnostic logging and error throwing
 */
export const apiFetch = async (path: string, options: ApiFetchOptions = {}): Promise<Response> => {
  const apiUrl = getApiUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${apiUrl}${cleanPath}`;
  const method = options.method || "GET";

  // Item 5 Checklist Requirement: Print resolved apiUrl before every request
  console.log(`[API Request] Method: ${method} | Base URL: ${apiUrl} | Full URL: ${fullUrl}`);

  const headers: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers as Record<string, string> || {})
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers
    });

    console.log(`[API Response] Status: ${response.status} ${response.statusText} | URL: ${fullUrl}`);
    return response;
  } catch (err: any) {
    console.error(`[API Fetch Failure] Failed to connect to ${fullUrl}. Error:`, err);
    throw new Error(`API Network Error: Could not connect to backend server at ${fullUrl}. Ensure backend is running on port 5000.`);
  }
};

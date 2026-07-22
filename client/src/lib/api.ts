import axios from "axios";

/**
 * Master API & Networking Configuration
 * Single source of truth for REST, WebSocket, and Health connections.
 * Environment-agnostic (supports Localhost Dev & Render Production via NEXT_PUBLIC_API_URL).
 */

export const getApiUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  let baseUrl = envUrl || (process.env.NODE_ENV === "production" 
    ? "https://noventra-1bpu.onrender.com" 
    : "http://127.0.0.1:5000");

  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    baseUrl = `http://${baseUrl}`;
  }

  return baseUrl.replace(/\/$/, "");
};

export const API_URL = getApiUrl();

export const getWsUrl = (): string => {
  const baseUrl = getApiUrl();
  if (baseUrl.startsWith("https://")) {
    return baseUrl.replace("https://", "wss://");
  }
  return baseUrl.replace("http://", "ws://");
};

export const WS_URL = getWsUrl();

export const HEALTH_ENDPOINT = `${API_URL}/api/health`;

/**
 * Diagnostic logger for application startup
 */
export const logApiDiagnostics = () => {
  if (typeof window !== "undefined") {
    console.log(`
==================================================
  🌐 Noventra Networking Engine Initialized
--------------------------------------------------
  Environment : ${process.env.NODE_ENV || "development"}
  API URL     : ${API_URL}
  Health API  : ${HEALTH_ENDPOINT}
  WebSocket   : ${WS_URL}
==================================================
`);
  }
};

/**
 * Connection Verification helper
 */
export const checkBackendHealth = async (timeoutMs = 4000): Promise<{ healthy: boolean; status: string; latencyMs: number }> => {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(HEALTH_ENDPOINT, {
      method: "GET",
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" },
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (res.ok) {
      return { healthy: true, status: "online", latencyMs };
    }
    return { healthy: false, status: `HTTP ${res.status}`, latencyMs };
  } catch (err: any) {
    clearTimeout(timeoutId);
    return { healthy: false, status: err.name === "AbortError" ? "timeout" : "unreachable", latencyMs: Date.now() - startTime };
  }
};

export interface ApiFetchOptions extends RequestInit {
  token?: string | null;
}

/**
 * Production-ready Centralized fetch wrapper
 * Features: Automatic token injection, timing logs in dev, friendly error messages.
 */
export const apiFetch = async (path: string, options: ApiFetchOptions = {}): Promise<Response> => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${API_URL}${cleanPath}`;
  const method = options.method || "GET";
  const startTime = Date.now();

  const headers: Record<string, string> = {
    ...(options.body && typeof options.body === "string" ? { "Content-Type": "application/json" } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (process.env.NODE_ENV !== "production") {
      const durationMs = Date.now() - startTime;
      console.log(`[API Log] ${method} ${cleanPath} - ${response.status} (${durationMs}ms)`);
    }

    return response;
  } catch (err: any) {
    console.error(`[API Network Error] ${method} ${fullUrl} failed:`, err);
    throw new Error(`Network Error: Unable to reach backend server at ${API_URL}. Please check your connection.`);
  }
};

// Axios Singleton Instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const uploadFile = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_URL}/api/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const generateAIResponse = async (promptType: string, data: any, token: string) => {
  const response = await api.post("/api/ai/generate", { promptType, data }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createMeeting = async (startupId: string, token: string) => {
  const response = await api.post("/api/meetings", { startupId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Centralized API Configuration Wrapper
 * Re-exports master networking configuration from src/lib/api.ts
 */

export { 
  getApiUrl, 
  getWsUrl, 
  apiFetch, 
  checkBackendHealth, 
  logApiDiagnostics, 
  API_URL, 
  WS_URL, 
  HEALTH_ENDPOINT 
} from "./api";

export type { ApiFetchOptions } from "./api";

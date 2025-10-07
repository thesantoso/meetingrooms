/**
 * Enhanced API Client with TanStack Query
 * Similar to Dio in Flutter with interceptors and debugging
 */

import { apiLogger } from "./logger";

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiErrorInfo {
  message: string;
  status?: number;
  data?: any;
  url?: string;
  method?: string;
}

interface RequestConfig {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

class ApiClient {
  private baseURL: string = "";
  private defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  constructor(baseURL?: string) {
    if (baseURL) {
      this.baseURL = baseURL;
    }
  }

  setBaseURL(url: string) {
    this.baseURL = url;
  }

  setDefaultHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  setAuthToken(token: string) {
    this.setDefaultHeader("Authorization", `Bearer ${token}`);
  }

  private buildURL(endpoint: string, params?: Record<string, string>): string {
    let url = endpoint;

    // Add base URL if endpoint is relative
    if (!endpoint.startsWith("http") && this.baseURL) {
      url = `${this.baseURL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    }

    // Add query parameters
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += (url.includes("?") ? "&" : "?") + searchParams.toString();
    }

    return url;
  }

  private async makeRequest<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    const { method, url, data, headers = {}, params } = config;

    const finalURL = this.buildURL(url, params);
    const finalHeaders = { ...this.defaultHeaders, ...headers };

    // Log request
    apiLogger.logRequest(method, finalURL, data, finalHeaders);

    try {
      const fetchConfig: RequestInit = {
        method,
        headers: finalHeaders,
      };

      if (data && method !== "GET") {
        fetchConfig.body = JSON.stringify(data);
      }

      const response = await fetch(finalURL, fetchConfig);
      const duration = Date.now() - startTime;

      let responseData;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      const apiResponse: ApiResponse<T> = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: this.extractHeaders(response.headers),
      };

      // Log response
      apiLogger.logResponse(
        method,
        finalURL,
        response.status,
        responseData,
        duration,
        apiResponse.headers
      );

      if (!response.ok) {
        throw new ApiError({
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          data: responseData,
          url: finalURL,
          method,
        });
      }

      return apiResponse;
    } catch (error) {
      const duration = Date.now() - startTime;

      let apiError: ApiError;

      if (error instanceof ApiError) {
        apiError = error;
      } else if (error instanceof Error) {
        apiError = new ApiError({
          message: error.message,
          url: finalURL,
          method,
        });
      } else {
        apiError = new ApiError({
          message: "Unknown error occurred",
          url: finalURL,
          method,
        });
      }

      // Log error
      apiLogger.logError(method, finalURL, apiError, duration);

      throw apiError;
    }
  }

  private extractHeaders(headers: Headers): Record<string, string> {
    const headerObj: Record<string, string> = {};
    headers.forEach((value, key) => {
      headerObj[key] = value;
    });
    return headerObj;
  }

  // HTTP Methods
  async get<T>(
    url: string,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ method: "GET", url, params, headers });
  }

  async post<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ method: "POST", url, data, headers });
  }

  async put<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ method: "PUT", url, data, headers });
  }

  async patch<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ method: "PATCH", url, data, headers });
  }

  async delete<T>(
    url: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ method: "DELETE", url, headers });
  }
}

// Custom ApiError class
export class ApiError extends Error {
  status?: number;
  data?: any;
  url?: string;
  method?: string;

  constructor(errorInfo: ApiErrorInfo) {
    super(errorInfo.message);
    this.name = "ApiError";
    this.status = errorInfo.status;
    this.data = errorInfo.data;
    this.url = errorInfo.url;
    this.method = errorInfo.method;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// For development, expose to global scope
if (__DEV__) {
  // @ts-ignore
  global.apiClient = apiClient;
}

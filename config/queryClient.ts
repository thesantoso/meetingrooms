/**
 * QueryClient Configuration for TanStack Query
 * Global configuration with error handling and retry logic
 */

import { DefaultOptions, QueryClient } from "@tanstack/react-query";
import { ApiError } from "../utils/apiClient";
import { apiLogger } from "../utils/logger";

// Default query options
const queryConfig: DefaultOptions = {
  queries: {
    // Stale time: how long data stays fresh
    staleTime: 5 * 60 * 1000, // 5 minutes

    // Cache time: how long data stays in cache after unused
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

    // Retry configuration
    retry: (failureCount, error: any) => {
      // Don't retry on client errors (4xx)
      if (
        error instanceof ApiError &&
        error.status &&
        error.status >= 400 &&
        error.status < 500
      ) {
        return false;
      }

      // Retry up to 3 times for network/server errors
      return failureCount < 3;
    },

    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch configurations
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    refetchOnMount: true, // Refetch when component mounts
  },

  mutations: {
    // Retry mutations only once
    retry: 1,

    // Retry delay for mutations
    retryDelay: 1000,
  },
};

// Error handler function
const handleQueryError = (error: unknown) => {
  if (error instanceof ApiError) {
    apiLogger.logError("QUERY", error.url || "unknown", error);

    // You can add global error handling here
    // For example, show toast notifications, redirect to login, etc.

    if (error.status === 401) {
      // Handle unauthorized error
      console.warn("🔐 Unauthorized access - consider redirecting to login");
    } else if (error.status === 403) {
      // Handle forbidden error
      console.warn("🚫 Forbidden access - insufficient permissions");
    } else if (error.status && error.status >= 500) {
      // Handle server errors
      console.error("🔥 Server error - please try again later");
    }
  } else {
    // Handle non-API errors
    console.error("❌ Unexpected error:", error);
  }
};

// Create and configure QueryClient
export const createQueryClient = () => {
  const client = new QueryClient({
    defaultOptions: queryConfig,
  });

  // Set up global error handling
  client.getQueryCache().config = {
    onError: handleQueryError,
  };

  client.getMutationCache().config = {
    onError: handleQueryError,
  };

  // Development logging
  if (__DEV__) {
    // Log query state changes
    client.getQueryCache().subscribe((event) => {
      if (event?.type === "added") {
        apiLogger.logRequest(
          "CACHE",
          `Query Added: ${event.query.queryKey.join("/")}`
        );
      } else if (event?.type === "removed") {
        apiLogger.logResponse(
          "CACHE",
          `Query Removed: ${event.query.queryKey.join("/")}`,
          200,
          null,
          0
        );
      }
    });

    console.log("⚡ QueryClient initialized with debug logging");
  }

  return client;
};

// Query key factory for consistent naming
export const queryKeys = {
  // Auth related
  auth: ["auth"] as const,
  user: () => [...queryKeys.auth, "user"] as const,

  // Meetings related
  meetings: ["meetings"] as const,
  meetingsList: (filters?: any) =>
    [...queryKeys.meetings, "list", filters] as const,
  meetingDetail: (id: string) => [...queryKeys.meetings, "detail", id] as const,

  // Rooms related
  rooms: ["rooms"] as const,
  roomsList: () => [...queryKeys.rooms, "list"] as const,
  roomAvailability: (roomId: string, date: string) =>
    [...queryKeys.rooms, "availability", roomId, date] as const,
} as const;

// Mutation key factory
export const mutationKeys = {
  // Auth mutations
  login: ["auth", "login"] as const,
  logout: ["auth", "logout"] as const,

  // Meeting mutations
  createMeeting: ["meetings", "create"] as const,
  updateMeeting: ["meetings", "update"] as const,
  deleteMeeting: ["meetings", "delete"] as const,
} as const;

// Helper function to invalidate queries
export const invalidateQueries = (
  client: QueryClient,
  keys: readonly string[]
) => {
  return client.invalidateQueries({ queryKey: keys });
};

// Helper function to reset queries
export const resetQueries = (client: QueryClient) => {
  client.clear();
  if (__DEV__) {
    apiLogger.clearLogs();
    console.log("🗑️ All queries and cache cleared");
  }
};

// Export default client instance
export const queryClient = createQueryClient();

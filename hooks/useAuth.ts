/**
 * Consolidated Auth Hook with TanStack Query
 * Manages login, logout, user session, and alerts
 */

import { mutationKeys, queryKeys } from "@/config/queryClient";
import { api } from "@/services/api";
import { AlertConfig, LoginCredentials, LoginResponse } from "@/types";
import { apiLogger } from "@/utils/logger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    title: "",
    message: "",
    type: "success",
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationKey: mutationKeys.login,
    mutationFn: (credentials: LoginCredentials) => api.auth.login(credentials),
    onSuccess: (data: LoginResponse) => {
      // Cache user data
      queryClient.setQueryData(queryKeys.user(), data);

      setAlertConfig({
        title: "Login Berhasil",
        message: "Selamat datang! Anda akan diarahkan ke halaman utama.",
        type: "success",
      });
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        router.replace("/(tabs)");
      }, 2000);

      if (__DEV__) {
        apiLogger.logResponse("AUTH", "Login successful", 200, data, 0);
      }
    },
    onError: (error: any) => {
      setAlertConfig({
        title: "Login Gagal",
        message: error.message || "Email atau password salah",
        type: "error",
      });
      setShowAlert(true);

      if (__DEV__) {
        apiLogger.logError("AUTH", "Login failed", error);
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationKey: mutationKeys.logout,
    mutationFn: () => {
      api.auth.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();

      setAlertConfig({
        title: "Logout Berhasil",
        message: "Anda telah keluar dari sistem",
        type: "success",
      });
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        router.replace("/");
      }, 1500);

      if (__DEV__) {
        apiLogger.logResponse("AUTH", "Logout successful", 200, null, 0);
      }
    },
  });

  // User profile query
  const userQuery = useQuery({
    queryKey: queryKeys.user(),
    queryFn: () => api.user.getProfile(),
    enabled: false, // Only fetch when explicitly needed
  });

  // Legacy login function for backward compatibility
  const login = (credentials: LoginCredentials) => {
    loginMutation.mutate(credentials);
  };

  // Logout function
  const logout = () => {
    logoutMutation.mutate();
  };

  // Set auth token
  const setAuthToken = (token: string) => {
    api.auth.setToken(token);
    if (__DEV__) {
      console.log("🔑 Auth token set");
    }
  };

  // Alert functions
  const closeAlert = () => {
    setShowAlert(false);
  };

  const showCustomAlert = (config: AlertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
  };

  return {
    // Legacy compatibility
    login,
    loading: loginMutation.isPending,
    showAlert,
    alertConfig,
    closeAlert,

    // New TanStack Query features
    loginMutation,
    logoutMutation,
    logout,
    userQuery,
    setAuthToken,

    // Enhanced alert handling
    showCustomAlert,

    // Auth state
    isAuthenticated: !!queryClient.getQueryData(queryKeys.user()),
    user: userQuery.data,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}

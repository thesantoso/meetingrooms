import { authService } from "@/services/api";
import { AlertConfig, LoginCredentials } from "@/types";
import { useRouter } from "expo-router";
import { useState } from "react";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    title: "",
    message: "",
    type: "success",
  });

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);

      if (response?.status === "success") {
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
      } else {
        setAlertConfig({
          title: "Login Gagal",
          message: response?.message || "Email atau password salah",
          type: "error",
        });
        setShowAlert(true);
      }
    } catch (error: any) {
      setAlertConfig({
        title: "Error",
        message: error.message || "Terjadi kesalahan jaringan",
        type: "error",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return {
    login,
    loading,
    showAlert,
    alertConfig,
    closeAlert,
  };
}

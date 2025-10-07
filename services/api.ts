import { ApiResponse, LoginCredentials, LoginResponse, Meeting } from "@/types";

const BASE_URL = "https://uat-api.ftlgym.com/api/v1/test";

// Generic API helper function
async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

// Authentication Service
export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<LoginResponse>> {
    return apiRequest<LoginResponse>(`${BASE_URL}/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
};

// Meeting Service
export const meetingService = {
  async getSchedule(): Promise<ApiResponse<Meeting[]>> {
    return apiRequest<Meeting[]>(`${BASE_URL}/jadwalruangan`);
  },

  async createBooking(bookingData: any): Promise<ApiResponse<any>> {
    // TODO: Replace with actual booking endpoint when available
    return apiRequest<any>(`${BASE_URL}/booking`, {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  },
};

export const roomService = {
  async getRooms(): Promise<ApiResponse<any[]>> {
    // TODO: Replace with actual rooms endpoint when available
    return apiRequest<any[]>(`${BASE_URL}/rooms`);
  },
};

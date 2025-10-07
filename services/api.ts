/**
 * Enhanced API Services with TanStack Query
 * Using enhanced API client with debugging capabilities
 */

import { LoginCredentials, LoginResponse, Meeting } from "@/types";
import { apiClient } from "@/utils/apiClient";

// Configure base URL
const BASE_URL = "https://uat-api.ftlgym.com/api/v1/test";
apiClient.setBaseURL(BASE_URL);

// Authentication Service
export const authService = {
  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/login", credentials);

    // Set auth token for subsequent requests
    if (response.data.token) {
      apiClient.setAuthToken(response.data.token);
    }

    return response.data;
  },

  /**
   * Logout user and clear auth token
   */
  logout(): void {
    apiClient.setDefaultHeader("Authorization", "");
  },

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    apiClient.setAuthToken(token);
  },
};

// Meeting Service
export const meetingService = {
  /**
   * Get all scheduled meetings
   */
  async getSchedule(): Promise<Meeting[]> {
    const response = await apiClient.get<any>("/jadwalruangan");
    // API returns { data: [...], message: "...", status: "success" }
    // We need to extract the actual data array
    return response.data.data || [];
  },

  /**
   * Create new meeting booking
   */
  async createBooking(bookingData: {
    tanggal: string;
    waktu_mulai: string;
    waktu_selesai: string;
    ruangan: string;
    keperluan: string;
    jumlah_peserta: number;
    divisi: string;
    pic: string;
    no_telp: string;
  }): Promise<any> {
    const response = await apiClient.post("/booking", bookingData);
    return response.data;
  },

  /**
   * Update existing meeting
   */
  async updateMeeting(
    id: string,
    updateData: Partial<Meeting>
  ): Promise<Meeting> {
    const response = await apiClient.put<Meeting>(
      `/meetings/${id}`,
      updateData
    );
    return response.data;
  },

  /**
   * Delete meeting
   */
  async deleteMeeting(id: string): Promise<void> {
    await apiClient.delete(`/meetings/${id}`);
  },

  /**
   * Get meeting details by ID
   */
  async getMeetingById(id: string): Promise<Meeting> {
    const response = await apiClient.get<Meeting>(`/meetings/${id}`);
    return response.data;
  },
};

// Room Service
export const roomService = {
  /**
   * Get all available rooms
   */
  async getRooms(): Promise<any[]> {
    const response = await apiClient.get<any[]>("/rooms");
    return response.data;
  },

  /**
   * Get room availability for specific date
   */
  async getRoomAvailability(roomId: string, date: string): Promise<any> {
    const response = await apiClient.get(`/rooms/${roomId}/availability`, {
      date,
    });
    return response.data;
  },

  /**
   * Get room details by ID
   */
  async getRoomById(id: string): Promise<any> {
    const response = await apiClient.get(`/rooms/${id}`);
    return response.data;
  },
};

// User Service
export const userService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<any> {
    const response = await apiClient.get("/profile");
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData: any): Promise<any> {
    const response = await apiClient.put("/profile", profileData);
    return response.data;
  },
};

// Export services as a combined object for easier imports
export const api = {
  auth: authService,
  meetings: meetingService,
  rooms: roomService,
  user: userService,
};

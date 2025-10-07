// API Response Types
export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
}

// Meeting Types
export interface Meeting {
  waktu_mulai: string;
  waktu_selesai: string;
  nama_ruangan: string;
}

// User Types
export interface User {
  id?: string;
  name?: string;
  email: string;
  role?: string;
}

// Login Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: User;
}

// Form Types
export interface FormErrors {
  [key: string]: string;
}

// Booking Types
export interface BookingData {
  divisi: string;
  ruangan: string;
  jumlah_peserta: number;
  tanggal: Date;
  waktu_mulai: Date;
  waktu_selesai: Date;
}

// Alert Types
export interface AlertConfig {
  title: string;
  message: string;
  type: "success" | "error" | "warning";
}

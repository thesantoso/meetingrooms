// Form Validation Utilities
export const validators = {
  required: (value: any): string | null => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return "Field ini wajib diisi";
    }
    return null;
  },

  email: (value: string): string | null => {
    if (!value?.trim()) {
      return "Email wajib diisi";
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(value)) {
      return "Format email tidak valid";
    }
    return null;
  },

  password: (value: string): string | null => {
    if (!value?.trim()) {
      return "Password wajib diisi";
    }
    if (value.length < 6) {
      return "Password minimal 6 karakter";
    }
    return null;
  },

  phone: (value: string): string | null => {
    if (!value?.trim()) {
      return "Nomor telepon wajib diisi";
    }
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(value)) {
      return "Format nomor telepon tidak valid";
    }
    return null;
  },

  minLength:
    (min: number) =>
    (value: string): string | null => {
      if (!value?.trim()) {
        return "Field ini wajib diisi";
      }
      if (value.length < min) {
        return `Minimal ${min} karakter`;
      }
      return null;
    },

  number: (value: any): string | null => {
    if (value === null || value === undefined || value === "") {
      return "Field ini wajib diisi";
    }
    if (isNaN(Number(value)) || Number(value) <= 0) {
      return "Harus berupa angka positif";
    }
    return null;
  },
};

// Create validation rules for specific forms
export const loginValidationRules = {
  email: validators.email,
  password: validators.password,
};

export const bookingValidationRules = {
  divisi: validators.required,
  ruangan: validators.required,
  jumlah_peserta: validators.number,
};

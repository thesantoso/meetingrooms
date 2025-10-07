// Date and Time Formatting Utilities
export const formatters = {
  // Format date for display (e.g., "7 Oktober 2025")
  formatDate: (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  },

  // Format time for display - handles both Date objects and time strings like "08:00"
  formatTime: (time: Date | string): string => {
    if (typeof time === "string" && /^\d{2}:\d{2}$/.test(time)) {
      return time;
    }

    const d = typeof time === "string" ? new Date(time) : time;
    return d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  },

  // Format date and time together (e.g., "7 Oktober 2025, 14:30")
  formatDateTime: (date: Date | string): string => {
    return `${formatters.formatDate(date)}, ${formatters.formatTime(date)}`;
  },

  // Format date for API (ISO string)
  formatDateForAPI: (date: Date): string => {
    return date.toISOString();
  },

  // Format phone number display
  formatPhone: (phone: string): string => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, "");

    // Format Indonesian phone numbers
    if (cleaned.startsWith("62")) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith("0")) {
      return cleaned;
    } else {
      return `0${cleaned}`;
    }
  },

  // Format meeting duration - handles time strings like "08:00" and "09:00"
  formatDuration: (startTime: string, endTime: string): string => {
    // Helper function to convert time string to minutes
    const timeToMinutes = (timeStr: string): number => {
      if (typeof timeStr !== "string" || !timeStr.includes(":")) {
        return 0;
      }
      const [hours, minutes] = timeStr
        .split(":")
        .map((num) => parseInt(num) || 0);
      return hours * 60 + minutes;
    };

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const diffMins = endMinutes - startMinutes;

    if (diffMins <= 0) {
      return "0 menit";
    }

    if (diffMins < 60) {
      return `${diffMins} menit`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return mins > 0 ? `${hours} jam ${mins} menit` : `${hours} jam`;
    }
  },
};

// Helper functions
export const helpers = {
  // Check if a date is today
  isToday: (date: Date | string): boolean => {
    const d = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },

  // Check if a date is in the past
  isPast: (date: Date | string): boolean => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d < new Date();
  },

  // Generate time slots for dropdown
  generateTimeSlots: (
    startHour = 8,
    endHour = 18,
    intervalMinutes = 30
  ): string[] => {
    const slots: string[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }

    return slots;
  },

  // Capitalize first letter of each word
  capitalize: (str: string): string => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },
};

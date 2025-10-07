import { ROOM_NAMES } from "@/constants/rooms";
import { formatters } from "@/utils/formatters";
import { useState } from "react";

export interface MeetingFilters {
  selectedRoom: string;
  selectedDate: Date | null;
}

export function useMeetingFilter() {
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const filterMeetings = (meetings: any[] | null) => {
    if (!meetings) return [];

    let filteredMeetings = [...meetings];

    // Filter by room
    if (selectedRoom !== "all") {
      filteredMeetings = filteredMeetings.filter((meeting) => {
        const roomValue =
          meeting.nama_ruangan === "Squats Room"
            ? "squats"
            : meeting.nama_ruangan === "Lungles Room"
            ? "lungles"
            : "unknown";
        return roomValue === selectedRoom;
      });
    }

    // Filter by date (if API provides date info)
    if (selectedDate) {
      const targetDateStr = formatters
        .formatDateForAPI(selectedDate)
        .split("T")[0]; // Get YYYY-MM-DD

      filteredMeetings = filteredMeetings.filter((meeting) => {
        // If meeting has tanggal field
        if (meeting.tanggal) {
          const meetingDateStr =
            typeof meeting.tanggal === "string"
              ? meeting.tanggal.split("T")[0]
              : formatters.formatDateForAPI(meeting.tanggal).split("T")[0];
          return meetingDateStr === targetDateStr;
        }

        // If no date field, assume it's for today (current behavior)
        const todayStr = formatters.formatDateForAPI(new Date()).split("T")[0];
        return targetDateStr === todayStr;
      });
    }

    return filteredMeetings;
  };

  const getRoomDisplayName = (roomName: string): string => {
    if (roomName === "Squats Room") return ROOM_NAMES.squats;
    if (roomName === "Lungles Room") return ROOM_NAMES.lungles;
    return roomName;
  };

  const resetFilters = () => {
    setSelectedRoom("all");
    setSelectedDate(null);
  };

  const resetRoomFilter = () => {
    setSelectedRoom("all");
  };

  const resetDateFilter = () => {
    setSelectedDate(null);
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (selectedRoom !== "all") count++;
    if (selectedDate) count++;
    return count;
  };

  const getFilterSummary = (): string => {
    const parts: string[] = [];

    if (selectedRoom !== "all") {
      const roomName = getRoomDisplayName(
        selectedRoom === "squats" ? "Squats Room" : "Lungles Room"
      );
      parts.push(roomName);
    }

    if (selectedDate) {
      parts.push(formatters.formatDate(selectedDate));
    }

    return parts.length > 0 ? parts.join(" • ") : "Semua jadwal";
  };

  return {
    // State
    selectedRoom,
    selectedDate,

    // Setters
    setSelectedRoom,
    setSelectedDate,

    // Main filter function
    filterMeetings,

    // Utility functions
    getRoomDisplayName,
    resetFilters,
    resetRoomFilter,
    resetDateFilter,
    getActiveFiltersCount,
    getFilterSummary,
  };
}

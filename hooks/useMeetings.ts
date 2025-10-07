/**
 * Consolidated Meeting Hooks with TanStack Query
 * Combines data fetching, filtering, and booking operations
 */

import { mutationKeys, queryKeys } from "@/config/queryClient";
import { ROOM_NAMES } from "@/constants/rooms";
import { api } from "@/services/api";
import { Meeting } from "@/types";
import { formatters } from "@/utils/formatters";
import { apiLogger } from "@/utils/logger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Meeting Filters Interface
export interface MeetingFilters {
  selectedRoom: string;
  selectedDate: Date | null;
}

// Main hook for meetings with filtering
export function useMeetings(filters?: any) {
  // TanStack Query for data fetching
  const query = useQuery({
    queryKey: queryKeys.meetingsList(filters),
    queryFn: () => api.meetings.getSchedule(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Filter state
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Filter meetings function
  const filterMeetings = (meetings: Meeting[] | null | undefined) => {
    if (!meetings || !Array.isArray(meetings)) return [];

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
        if ((meeting as any).tanggal) {
          const meetingDateStr =
            typeof (meeting as any).tanggal === "string"
              ? (meeting as any).tanggal.split("T")[0]
              : formatters
                  .formatDateForAPI((meeting as any).tanggal)
                  .split("T")[0];
          return meetingDateStr === targetDateStr;
        }

        // If no date field, assume it's for today (current behavior)
        const todayStr = formatters.formatDateForAPI(new Date()).split("T")[0];
        return targetDateStr === todayStr;
      });
    }

    return filteredMeetings;
  };

  // Apply filters to the data
  const filteredMeetings = filterMeetings(query.data);

  // Room utility functions
  const getRoomDisplayName = (roomName: string): string => {
    if (roomName === "Squats Room") return ROOM_NAMES.squats;
    if (roomName === "Lungles Room") return ROOM_NAMES.lungles;
    return roomName;
  };

  // Filter reset functions
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
    // TanStack Query data
    meetings: filteredMeetings,
    loading: query.isLoading,
    error: query.error?.message || null,
    isRefetching: query.isRefetching,
    refetch: query.refetch,

    // Legacy compatibility
    refreshMeetings: () => query.refetch(),

    // Filter state
    selectedRoom,
    selectedDate,

    // Filter setters
    setSelectedRoom,
    setSelectedDate,

    // Filter utilities
    filterMeetings,
    getRoomDisplayName,
    resetFilters,
    resetRoomFilter,
    resetDateFilter,
    getActiveFiltersCount,
    getFilterSummary,

    // Raw query for advanced usage
    query,
  };
}

// Get single meeting by ID
export const useMeeting = (id: string) => {
  return useQuery({
    queryKey: queryKeys.meetingDetail(id),
    queryFn: () => api.meetings.getMeetingById(id),
    enabled: !!id, // Only fetch if ID is provided
  });
};

// Create new booking mutation
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.createMeeting,
    mutationFn: (bookingData: {
      tanggal: string;
      waktu_mulai: string;
      waktu_selesai: string;
      ruangan: string;
      keperluan: string;
      jumlah_peserta: number;
      divisi: string;
      pic: string;
      no_telp: string;
    }) => api.meetings.createBooking(bookingData),
    onSuccess: (data, variables) => {
      // Invalidate meetings list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });

      // Invalidate room availability for the booked room and date
      queryClient.invalidateQueries({
        queryKey: queryKeys.roomAvailability(
          variables.ruangan,
          variables.tanggal
        ),
      });

      if (__DEV__) {
        apiLogger.logResponse(
          "BOOKING",
          "Booking created successfully",
          201,
          data,
          0
        );
      }
    },
    onError: (error, variables) => {
      if (__DEV__) {
        apiLogger.logError("BOOKING", "Failed to create booking", error);
      }
    },
  });
};

// Update meeting mutation
export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.updateMeeting,
    mutationFn: ({ id, data }: { id: string; data: Partial<Meeting> }) =>
      api.meetings.updateMeeting(id, data),
    onSuccess: (data, variables) => {
      // Update the specific meeting in cache
      queryClient.setQueryData(queryKeys.meetingDetail(variables.id), data);

      // Invalidate meetings list
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });

      if (__DEV__) {
        apiLogger.logResponse(
          "MEETING",
          "Meeting updated successfully",
          200,
          data,
          0
        );
      }
    },
  });
};

// Delete meeting mutation
export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.deleteMeeting,
    mutationFn: (id: string) => api.meetings.deleteMeeting(id),
    onSuccess: (data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.meetingDetail(id) });

      // Invalidate meetings list
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });

      if (__DEV__) {
        apiLogger.logResponse(
          "MEETING",
          "Meeting deleted successfully",
          200,
          null,
          0
        );
      }
    },
  });
};

// Hook to prefetch meetings (useful for background loading)
export const usePrefetchMeetings = () => {
  const queryClient = useQueryClient();

  return (filters?: any) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.meetingsList(filters),
      queryFn: () => api.meetings.getSchedule(),
      staleTime: 2 * 60 * 1000,
    });
  };
};

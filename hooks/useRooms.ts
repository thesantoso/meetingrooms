/**
 * Consolidated Room Hook with TanStack Query
 * Manages room data, availability, filtering, and related operations
 */

import { queryKeys } from "@/config/queryClient";
import {
  BOOKING_ROOM_OPTIONS,
  ROOM_NAMES,
  ROOM_OPTIONS,
} from "@/constants/rooms";
import { api } from "@/services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useRooms() {
  // Room filter state
  const [selectedRoom, setSelectedRoom] = useState("all");

  // Get all rooms query
  const roomsQuery = useQuery({
    queryKey: queryKeys.roomsList(),
    queryFn: () => api.rooms.getRooms(),
    staleTime: 10 * 60 * 1000, // 10 minutes (rooms don't change often)
  });

  // Room utility functions
  const getRoomDisplayName = (roomValue: string): string => {
    switch (roomValue) {
      case "squats":
        return ROOM_NAMES.squats;
      case "lungles":
        return ROOM_NAMES.lungles;
      default:
        return roomValue;
    }
  };

  const getRoomOptions = () => ROOM_OPTIONS;

  const getBookingRoomOptions = () => BOOKING_ROOM_OPTIONS;

  // Filter functions
  const resetRoomFilter = () => {
    setSelectedRoom("all");
  };

  // Room availability helpers
  const checkRoomAvailability = (roomId: string, date: string) => {
    // This could be enhanced to check against actual bookings
    // For now, returning a simple availability check
    return true; // Placeholder
  };

  return {
    // Query data
    rooms: roomsQuery.data || [],
    loading: roomsQuery.isLoading,
    error: roomsQuery.error?.message || null,
    isRefetching: roomsQuery.isRefetching,
    refetch: roomsQuery.refetch,

    // Filter state
    selectedRoom,
    setSelectedRoom,
    resetRoomFilter,

    // Utility functions
    getRoomDisplayName,
    getRoomOptions,
    getBookingRoomOptions,
    checkRoomAvailability,

    // Raw query for advanced usage
    query: roomsQuery,
  };
}

// Get room availability for specific date
export const useRoomAvailability = (roomId: string, date: string) => {
  return useQuery({
    queryKey: queryKeys.roomAvailability(roomId, date),
    queryFn: () => api.rooms.getRoomAvailability(roomId, date),
    enabled: !!(roomId && date), // Only fetch if both params are provided
    staleTime: 1 * 60 * 1000, // 1 minute (availability changes frequently)
  });
};

// Get single room details
export const useRoom = (id: string) => {
  return useQuery({
    queryKey: [...queryKeys.rooms, "detail", id],
    queryFn: () => api.rooms.getRoomById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// Hook to prefetch rooms (useful for background loading)
export const usePrefetchRooms = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.roomsList(),
      queryFn: () => api.rooms.getRooms(),
      staleTime: 10 * 60 * 1000,
    });
  };
};

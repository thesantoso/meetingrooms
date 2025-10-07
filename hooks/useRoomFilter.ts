import { ROOM_NAMES } from "@/constants/rooms";
import { useState } from "react";

export function useRoomFilter() {
  const [selectedRoom, setSelectedRoom] = useState("all");

  const filterMeetingsByRoom = (meetings: any[] | null) => {
    if (!meetings) return [];

    if (selectedRoom === "all") {
      return meetings;
    }

    return meetings.filter((meeting) => {
      // Convert room name to room value for filtering
      const roomValue =
        meeting.nama_ruangan === "Squats Room"
          ? "squats"
          : meeting.nama_ruangan === "Lungles Room"
          ? "lungles"
          : "unknown";
      return roomValue === selectedRoom;
    });
  };

  const getRoomDisplayName = (roomName: string): string => {
    if (roomName === "Squats Room") return ROOM_NAMES.squats;
    if (roomName === "Lungles Room") return ROOM_NAMES.lungles;
    return roomName;
  };

  const resetFilter = () => {
    setSelectedRoom("all");
  };

  return {
    selectedRoom,
    setSelectedRoom,
    filterMeetingsByRoom,
    getRoomDisplayName,
    resetFilter,
  };
}

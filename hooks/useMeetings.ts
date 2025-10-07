import { meetingService } from "@/services/api";
import { Meeting } from "@/types";
import { useEffect, useState } from "react";

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await meetingService.getSchedule();
      setMeetings(response?.data ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch meetings");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const refreshMeetings = () => {
    fetchMeetings();
  };

  return {
    meetings,
    loading,
    error,
    refreshMeetings,
  };
}

// Shared constants for room options and divisions
export const ROOM_OPTIONS = [
  { label: "Semua Ruangan", value: "all" }, // For filtering purposes
  { label: "Squats Room", value: "squats" },
  { label: "Lungles Room", value: "lungles" },
];

export const BOOKING_ROOM_OPTIONS = [
  { label: "Squats Room", value: "squats" },
  { label: "Lungles Room", value: "lungles" },
];

export const DIVISI_OPTIONS = [
  { label: "HR", value: "hr" },
  { label: "Engineering", value: "engineering" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "Finance", value: "finance" },
  { label: "Operations", value: "operations" },
];

// Room display names mapping
export const ROOM_NAMES = {
  squats: "Squats Room",
  lungles: "Lungles Room",
  all: "Semua Ruangan",
} as const;

// Helper function to get room display name
export const getRoomDisplayName = (value: string): string => {
  return ROOM_NAMES[value as keyof typeof ROOM_NAMES] || value;
};

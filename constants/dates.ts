// Date filter presets and utilities for meeting filters
export const DATE_FILTER_OPTIONS = [
  {
    label: "Hari Ini",
    value: "today",
    getDate: () => new Date(),
  },
  {
    label: "Besok",
    value: "tomorrow",
    getDate: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    },
  },
  {
    label: "Minggu Ini",
    value: "this_week",
    getDate: () => {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      return startOfWeek;
    },
  },
  {
    label: "Minggu Depan",
    value: "next_week",
    getDate: () => {
      const now = new Date();
      const nextWeek = new Date(now);
      nextWeek.setDate(now.getDate() + (7 - now.getDay())); // Next Sunday
      return nextWeek;
    },
  },
];

export const getDateFilterPreset = (value: string): Date | null => {
  const preset = DATE_FILTER_OPTIONS.find((option) => option.value === value);
  return preset ? preset.getDate() : null;
};

// NumberInput presets for common use cases
import { NumberInput } from "@/components/ui/NumberInput";

export const NumberInputPresets = {
  // Participants (1-50 people)
  participants: {
    minValue: 1,
    maxValue: 50,
    step: 1,
    placeholder: "0",
  },

  // Duration in hours (1-12 hours)
  durationHours: {
    minValue: 1,
    maxValue: 12,
    step: 1,
    placeholder: "0",
  },

  // Duration in minutes (15-480 minutes, step by 15)
  durationMinutes: {
    minValue: 15,
    maxValue: 480,
    step: 15,
    placeholder: "0",
  },

  // Room capacity (5-100 people)
  roomCapacity: {
    minValue: 5,
    maxValue: 100,
    step: 5,
    placeholder: "0",
  },

  // Age input (18-100 years)
  age: {
    minValue: 18,
    maxValue: 100,
    step: 1,
    placeholder: "0",
  },

  // Quantity (1-999 items)
  quantity: {
    minValue: 1,
    maxValue: 999,
    step: 1,
    placeholder: "0",
  },
};

// Helper function to create NumberInput with preset
export const createNumberInputWithPreset = (
  preset: keyof typeof NumberInputPresets,
  additionalProps?: Partial<React.ComponentProps<typeof NumberInput>>
) => {
  const presetConfig = NumberInputPresets[preset];
  return {
    ...presetConfig,
    ...additionalProps,
  };
};

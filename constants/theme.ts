/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#6B73FF";
const tintColorDark = "#8B93FF";

export const Colors = {
  light: {
    text: "#2D3748",
    background: "#FFFFFF",
    surface: "#F7FAFC",
    cardBackground: "#FFFFFF",
    border: "#E2E8F0",
    tint: tintColorLight,
    secondary: "#A0AEC0",
    success: "#48BB78",
    error: "#F56565",
    warning: "#ED8936",
    icon: "#718096",
    tabIconDefault: "#A0AEC0",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#F7FAFC",
    background: "#1A202C",
    surface: "#2D3748",
    cardBackground: "#2D3748",
    border: "#4A5568",
    tint: tintColorDark,
    secondary: "#718096",
    success: "#68D391",
    error: "#FC8181",
    warning: "#F6AD55",
    icon: "#A0AEC0",
    tabIconDefault: "#718096",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

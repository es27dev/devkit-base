// External Libraries
import { useEffect, useState } from "react";

// Types
export type Theme = "light" | "dark";

// Hook
export function useTheme() {
  // Hooks
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem("pacon-theme");
    if (stored && (stored === "light" || stored === "dark")) {
      return stored as Theme;
    }

    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    // Default to light
    return "light";
  });

  // Data Loading
  // (none)

  // Early Returns
  // (none)

  // Computed Data
  // (none)

  // Event Handlers
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Effects
  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Store preference
    localStorage.setItem("pacon-theme", theme);

    // Update CSS custom properties for PACON brand colors
    if (theme === "dark") {
      root.style.setProperty("--background", "#2a2a29");
      root.style.setProperty("--primary", "#b13d38");
    } else {
      root.style.setProperty("--background", "#faf8f5");
      root.style.setProperty("--primary", "#a63631");
    }
  }, [theme]);

  return {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
  };
}
"use client";

// External Libraries
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

// Base Components
import { Button } from "@/components/base/button";

// Hooks
import { useTheme } from "./use-theme";

// Component
export function ThemeToggle() {
  // Hooks
  const { theme, toggleTheme } = useTheme();

  // Translations
  const { t } = useTranslation();

  // Data Loading
  // (none)

  // Early Returns
  // (none)

  // Computed Data
  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;
  const label = t(isDark ? "themeToggle.switchToLight" : "themeToggle.switchToDark");

  // Event Handlers
  const handleToggle = () => {
    toggleTheme();
  };

  // Effects
  // (none)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={label}
      title={label}
    >
      <Icon className="h-[1.2rem] w-[1.2rem] transition-all" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
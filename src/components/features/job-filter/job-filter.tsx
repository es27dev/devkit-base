// External Libraries
import { useTranslation } from "react-i18next";

// Components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/base/select";

// Types
import type { LocationFilter } from "@/shared/lib/form-validation";

// Hooks

// Translations

// Data Loading

// Early Returns

// Computed Data

// Event Handlers

// Effects

export interface JobFilterProps {
  selectedLocation: LocationFilter;
  onLocationChange: (location: LocationFilter) => void;
}

export function JobFilter({ selectedLocation, onLocationChange }: JobFilterProps) {
  // Hooks

  // Translations
  const { t } = useTranslation();

  // Data Loading

  // Early Returns

  // Computed Data
  const locationOptions: { value: LocationFilter; label: string }[] = [
    { value: "Alle", label: t("jobFilter.locationAll") },
    { value: "Berlin", label: "Berlin" },
    { value: "Frankfurt am Main", label: "Frankfurt am Main" },
    { value: "Heidelberg", label: "Heidelberg" },
    { value: "Heilbronn", label: "Heilbronn" },
    { value: "Leipzig", label: "Leipzig" },
    { value: "Mannheim", label: "Mannheim" },
    { value: "Wiesbaden", label: "Wiesbaden" },
  ];

  // Event Handlers
  const handleLocationChange = (value: LocationFilter) => {
    onLocationChange(value);
  };

  // Effects

  return (
    <div className="flex items-center gap-4">
      <label htmlFor="location-filter" className="text-sm font-medium text-muted-foreground">
        {t("jobFilter.filterByLocation")}
      </label>
      <Select value={selectedLocation} onValueChange={handleLocationChange}>
        <SelectTrigger id="location-filter" className="w-[180px]">
          <SelectValue placeholder={t("jobFilter.selectLocation")} />
        </SelectTrigger>
        <SelectContent>
          {locationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
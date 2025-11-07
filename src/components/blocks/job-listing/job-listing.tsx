// External Libraries
import { useTranslation } from "react-i18next";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card";
import { Button } from "@/components/base/button";

// Types
import type { JobListing as JobListingData } from "@/shared/data/mock-jobs";

// Hooks

// Translations

// Data Loading

// Early Returns

// Computed Data

// Event Handlers

// Effects

export interface JobListingProps {
  job: JobListingData;
  onApply: (jobTitle: string) => void;
}

export function JobListing({ job, onApply }: JobListingProps) {
  // Hooks

  // Translations
  const { t } = useTranslation();

  // Data Loading

  // Early Returns

  // Computed Data

  // Event Handlers
  const handleApplyClick = () => {
    onApply(job.title);
  };

  // Effects

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{job.title}</CardTitle>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>{job.location}</span>
          <span>•</span>
          <span>{job.entryLevel}</span>
          <span>•</span>
          <span>{job.employmentType}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm mb-2">{t("jobListing.tasks")}</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {job.tasks.map((task, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1 text-xs">•</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-sm mb-2">{t("jobListing.requirements")}</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {job.profileRequirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1 text-xs">•</span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={handleApplyClick} className="w-full mt-4">
          {t("jobListing.applyForPosition")}
        </Button>
      </CardContent>
    </Card>
  );
}
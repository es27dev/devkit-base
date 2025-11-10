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
  onViewDetails: (jobI18nKey: string) => void;
  onApply: (jobTitle: string) => void;
}

export function JobListing({ job, onViewDetails, onApply }: JobListingProps) {
  // 1. HOOKS
  // (none)

  // 2. TRANSLATIONS
  const { t } = useTranslation();

  // 3. DATA LOADING
  // Load job data from i18n using the i18nKey
  const jobData = t(`jobs.${job.i18nKey}`, { returnObjects: true }) as {
    title: string;
    location: string;
    startDate: string;
    employmentType: string;
    tasks: string[];
    requirements: string[];
    benefits: string[];
  };

  // 4. EARLY RETURNS
  if (!jobData || typeof jobData !== 'object') {
    return null;
  }

  // 5. COMPUTED DATA
  // Preview: Show only first 3 items
  const previewTasks = jobData.tasks.slice(0, 3);
  const previewRequirements = jobData.requirements.slice(0, 3);
  const hasMore = jobData.tasks.length > 3 || jobData.requirements.length > 3;

  // 6. EVENT HANDLERS
  const handleViewDetails = () => {
    onViewDetails(job.i18nKey);
  };

  const handleApplyClick = () => {
    onApply(jobData.title);
  };

  // 7. EFFECTS
  // (none)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{jobData.title}</CardTitle>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>{jobData.location}</span>
          <span>•</span>
          <span>{jobData.startDate}</span>
          <span>•</span>
          <span>{jobData.employmentType}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div>
          <h4 className="font-medium text-sm mb-2">Ihre Aufgaben</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {previewTasks.map((task, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1 text-xs">•</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-sm mb-2">Ihre Erfahrungen</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {previewRequirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1 text-xs">•</span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        {hasMore && (
          <Button
            onClick={handleViewDetails}
            variant="outline"
            className="w-full"
          >
            Mehr erfahren
          </Button>
        )}

        <div className="flex-1" />

        <Button onClick={handleApplyClick} className="w-full mt-auto">
          Jetzt bewerben
        </Button>
      </CardContent>
    </Card>
  );
}
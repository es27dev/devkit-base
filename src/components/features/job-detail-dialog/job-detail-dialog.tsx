// Job detail dialog - shows full job description with application form
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/base/dialog';
import { Separator } from '@/components/base/separator';
import { QuickApplicationForm } from '@/components/features/quick-application-form/quick-application-form';

// Types
export interface JobDetailDialogProps {
  jobI18nKey: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (jobTitle: string) => void;
}

export function JobDetailDialog({
  jobI18nKey,
  open,
  onOpenChange,
  onApply,
}: JobDetailDialogProps) {
  // 1. HOOKS
  // (none)

  // 2. TRANSLATIONS
  const { t } = useTranslation();

  // 3. DATA LOADING
  const jobData = jobI18nKey
    ? (t(`jobs.${jobI18nKey}`, { returnObjects: true }) as {
        title: string;
        location: string;
        startDate: string;
        employmentType: string;
        tasks: string[];
        requirements: string[];
        benefits: string[];
      })
    : null;

  // 4. EARLY RETURNS
  if (!jobData || typeof jobData !== 'object') {
    return null;
  }

  // 5. COMPUTED DATA
  // (none)

  // 6. EVENT HANDLERS
  const handleApply = () => {
    onApply(jobData.title);
    onOpenChange(false);
  };

  // 7. EFFECTS
  // (none)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{jobData.title}</DialogTitle>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>{jobData.location}</span>
            <span>•</span>
            <span>{jobData.startDate}</span>
            <span>•</span>
            <span>{jobData.employmentType}</span>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Ihre Aufgaben */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Ihre Aufgaben</h3>
            <ul className="space-y-2">
              {jobData.tasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Ihre Erfahrungen */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Ihre Erfahrungen</h3>
            <ul className="space-y-2">
              {jobData.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Wir bieten Ihnen */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Wir bieten Ihnen</h3>
            <ul className="space-y-2">
              {jobData.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator className="my-8" />

          {/* Quick Application Form */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Jetzt bewerben</h3>
            <QuickApplicationForm
              jobTitle={jobData.title}
              onSubmit={() => {
                handleApply();
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

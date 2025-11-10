// Job detail dialog - shows full job description with application form
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/base/dialog';

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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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

        <div className="grid md:grid-cols-2 gap-8 mt-6">
          {/* Left: Full Job Description */}
          <div className="space-y-6">
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
          </div>

          {/* Right: Quick Application Form */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Jetzt bewerben</h3>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  placeholder="Ihr vollständiger Name"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  E-Mail *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  placeholder="ihre.email@beispiel.de"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Telefon
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  placeholder="+49 123 456789"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Lebenslauf (PDF) *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Anschreiben (optional)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md bg-background resize-none"
                  placeholder="Kurze Nachricht an uns..."
                />
              </div>

              <button
                type="button"
                onClick={handleApply}
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Bewerbung absenden
              </button>

              <p className="text-xs text-muted-foreground">
                * Pflichtfelder
              </p>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

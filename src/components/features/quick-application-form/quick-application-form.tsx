// Quick application form - simplified form for job applications (Name, Email, Phone, CV)
import { useState } from 'react';
import { Button } from '@/components/base/button';
import { cn } from '@/shared/lib/utils';

// Types
export interface QuickApplicationFormProps {
  jobTitle?: string;
  onSubmit?: (data: QuickApplicationData) => void;
  className?: string;
}

export interface QuickApplicationData {
  name: string;
  email: string;
  phone?: string;
  cv: File;
  message?: string;
}

export function QuickApplicationForm({
  jobTitle,
  onSubmit,
  className,
}: QuickApplicationFormProps) {
  // 1. HOOKS
  const [formData, setFormData] = useState<Partial<QuickApplicationData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. TRANSLATIONS
  // (hardcoded German for now)

  // 3. DATA LOADING
  // (none)

  // 4. EARLY RETURNS
  // (none)

  // 5. COMPUTED DATA
  // (none)

  // 6. EVENT HANDLERS
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.cv) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      setIsSubmitting(false);
      return;
    }

    // Call parent handler if provided
    if (onSubmit) {
      onSubmit(formData as QuickApplicationData);
    } else {
      // Default behavior: log to console
      console.log('Quick Application submitted:', {
        ...formData,
        jobTitle,
      });
      alert('Bewerbung erfolgreich abgesendet! (Demo-Modus)');
    }

    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, cv: file });
    }
  };

  // 7. EFFECTS
  // (none)

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div>
        <label className="text-sm font-medium mb-1 block">Name *</label>
        <input
          type="text"
          required
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-md bg-background"
          placeholder="Ihr vollständiger Name"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">E-Mail *</label>
        <input
          type="email"
          required
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border rounded-md bg-background"
          placeholder="ihre.email@beispiel.de"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Telefon</label>
        <input
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded-md bg-background file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:text-sm file:cursor-pointer"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">
          Anschreiben (optional)
        </label>
        <textarea
          rows={4}
          value={formData.message || ''}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-md bg-background resize-none"
          placeholder="Kurze Nachricht an uns..."
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Wird gesendet...' : 'Bewerbung absenden'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        * Pflichtfelder
      </p>
    </form>
  );
}

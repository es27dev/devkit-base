// React Core
import { useState } from "react";

// External Libraries
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

// Base Components
import { Button } from "@/components/base/button";
import { Input } from "@/components/base/input";
import { Textarea } from "@/components/base/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/base/select";
import { Checkbox } from "@/components/base/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card";
import { Label } from "@/components/base/label";
import { Alert, AlertDescription } from "@/components/base/alert";

// Services & Validation
import { contactFormSchema, type ContactFormData } from "@/shared/lib/form-validation";
import { submitContactForm } from "@/shared/services/form-submission";
import { isDuplicateSubmission, recordSubmission, getDuplicateMessage } from "@/shared/services/duplicate-detection";

// Types
type FormState = 'idle' | 'submitting' | 'success' | 'error' | 'duplicate';

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className = "" }: ContactFormProps) {
  // 1. Hooks
  const { t } = useTranslation();
  const [formState, setFormState] = useState<FormState>('idle');
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      location: 'Berlin',
      consent: false
    }
  });

  // 2. Translations
  // (handled by useTranslation hook)

  // 3. Data Loading
  const locationOptions = [
    { value: 'Berlin', label: 'Berlin' },
    { value: 'Hamburg', label: 'Hamburg' },
    { value: 'Heidelberg', label: 'Heidelberg' },
    { value: 'anderes', label: 'Anderes' }
  ];

  const areaOfUseOptions = [
    { value: 'Technisches FM', label: 'Technisches FM' },
    { value: 'Infra-Services', label: 'Infra-Services' },
    { value: 'Compliance', label: 'Compliance' },
    { value: 'Energie', label: 'Energie' },
    { value: 'Digitalisierung', label: 'Digitalisierung' }
  ];

  // 4. Early Returns
  // (none needed)

  // 5. Computed Data
  const isLoading = formState === 'submitting';
  const isDisabled = isLoading || formState === 'success';
  const consentValue = watch('consent');

  // 6. Event Handlers
  const onSubmit = async (data: ContactFormData) => {
    try {
      setFormState('submitting');
      setSubmitMessage('');

      // Check for duplicate submission (FR-049)
      if (isDuplicateSubmission(data.email, 'sales')) {
        setFormState('duplicate');
        setSubmitMessage(getDuplicateMessage('sales'));
        return;
      }

      // Submit form (FR-017)
      const result = await submitContactForm(data);

      if (result.state === 'success') {
        // Record successful submission for duplicate detection
        recordSubmission(data.email, 'sales');
        setFormState('success');
        setSubmitMessage(result.message || 'Danke. Wir melden uns binnen 1 Werktag.');
        reset(); // Clear form
      } else {
        setFormState('error');
        setSubmitMessage(result.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      setFormState('error');
      setSubmitMessage('Verbindung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
  };

  const handleRetry = () => {
    setFormState('idle');
    setSubmitMessage('');
  };

  const handleLocationChange = (value: string) => {
    setValue('location', value as ContactFormData['location']);
  };

  const handleAreaOfUseChange = (value: string) => {
    setValue('areaOfUse', value as ContactFormData['areaOfUse']);
  };

  // 7. Effects
  // (none needed)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Contact Person Details - T050 (FR-014) */}
      <Card>
        <CardHeader>
          <CardTitle>Ihr Ansprechpartner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-lg font-semibold">Mario Unger-Faulhaber</div>
          <div className="text-sm text-muted-foreground">Vertriebsleitung</div>
          <div className="space-y-1 text-sm">
            <div>Telefon: +49 (0) 621 123 456 78</div>
            <div>E-Mail: mario.unger-faulhaber@pacon-re.com</div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form - T047 (FR-013 to FR-016) */}
      <Card>
        <CardHeader>
          <CardTitle>Kontaktformular</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field - Required */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                disabled={isDisabled}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field - Required with validation (FR-015) */}
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled={isDisabled}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Field - Optional */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                disabled={isDisabled}
              />
            </div>

            {/* Company Field - Optional */}
            <div className="space-y-2">
              <Label htmlFor="company">Unternehmen</Label>
              <Input
                id="company"
                {...register('company')}
                disabled={isDisabled}
              />
            </div>

            {/* Location Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="location">Standort</Label>
              <Select onValueChange={handleLocationChange} defaultValue="Berlin" disabled={isDisabled}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie einen Standort" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            {/* Area of Use Dropdown - Optional */}
            <div className="space-y-2">
              <Label htmlFor="areaOfUse">Einsatzbereich</Label>
              <Select onValueChange={handleAreaOfUseChange} disabled={isDisabled}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie einen Einsatzbereich" />
                </SelectTrigger>
                <SelectContent>
                  {areaOfUseOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message Field - Optional */}
            <div className="space-y-2">
              <Label htmlFor="message">Nachricht</Label>
              <Textarea
                id="message"
                {...register('message')}
                placeholder="Teilen Sie uns Ihre Anfrage mit..."
                rows={4}
                disabled={isDisabled}
              />
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>

            {/* Consent Checkbox - Required (FR-016) */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={consentValue}
                onCheckedChange={(checked) => setValue('consent', checked as boolean)}
                disabled={isDisabled}
                className={errors.consent ? 'border-red-500' : ''}
              />
              <div className="space-y-1">
                <Label htmlFor="consent" className="text-sm leading-tight">
                  Ich stimme der Datenverarbeitung zu und möchte kontaktiert werden. *
                </Label>
                {errors.consent && (
                  <p className="text-sm text-red-500">{errors.consent.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isDisabled}
              className="w-full"
            >
              {isLoading ? 'Wird gesendet...' : 'Angebot anfordern'}
            </Button>

            {/* Status Messages */}
            {submitMessage && (
              <Alert className={formState === 'success' || formState === 'duplicate' ? 'border-green-500' : 'border-red-500'}>
                <AlertDescription>
                  {submitMessage}
                  {formState === 'error' && (
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      size="sm"
                      className="ml-2"
                    >
                      Erneut versuchen
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Privacy Notice - T051 (FR-018) */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Keine Werbung. Keine Weitergabe an Dritte.
        </p>
      </div>
    </div>
  );
}
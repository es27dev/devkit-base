// External Libraries
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

// Components
import { Button } from "@/components/base/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/base/form";
import { Input } from "@/components/base/input";
import { Textarea } from "@/components/base/textarea";
import { Checkbox } from "@/components/base/checkbox";

// Types and Validation
import { jobApplicationSchema, type JobApplicationData, type FormState } from "@/shared/lib/form-validation";

// Hooks

// Translations

// Data Loading

// Early Returns

// Computed Data

// Event Handlers

// Effects

export interface ApplicationFormProps {
  prefilledJobTitle?: string;
  onSubmitSuccess?: () => void;
}

export function ApplicationForm({ prefilledJobTitle = "", onSubmitSuccess }: ApplicationFormProps) {
  // Hooks
  const [formState, setFormState] = useState<FormState>("idle");
  const [submitMessage, setSubmitMessage] = useState<string>("");

  // Translations
  const { t } = useTranslation();

  // Data Loading
  const form = useForm<JobApplicationData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
      jobTitle: prefilledJobTitle,
      message: "",
      gdprConsent: false as any, // Cast needed due to Zod literal type
    },
  });

  // Early Returns

  // Computed Data
  const isSubmitting = formState === "submitting";
  const isSuccess = formState === "success";
  const isError = formState === "error";

  // Event Handlers
  const handleFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove data URL prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const checkDuplicateSubmission = (email: string): boolean => {
    const key = `application_${email}`;
    const lastSubmission = localStorage.getItem(key);

    if (lastSubmission) {
      const lastSubmissionTime = new Date(lastSubmission).getTime();
      const now = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      return (now - lastSubmissionTime) < twentyFourHours;
    }

    return false;
  };

  const onSubmit = async (data: JobApplicationData) => {
    try {
      setFormState("submitting");
      setSubmitMessage("");

      // Check for duplicate submission
      if (checkDuplicateSubmission(data.email)) {
        setFormState("error");
        setSubmitMessage(t("applicationForm.duplicateSubmission"));
        return;
      }

      // Convert CV file to base64
      let cvBase64 = "";
      if (data.cvFile) {
        cvBase64 = await handleFileToBase64(data.cvFile);
      }

      // Prepare form data for FormSubmit.co
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("location", data.location || "");
      formData.append("jobTitle", data.jobTitle);
      formData.append("message", data.message || "");
      formData.append("cvFileName", data.cvFile.name);
      formData.append("cvBase64", cvBase64);
      formData.append("submissionType", "job_application");

      // Submit to FormSubmit.co (replace with actual endpoint)
      const response = await fetch("https://formsubmit.co/your-email@example.com", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Store submission timestamp to prevent duplicates
        localStorage.setItem(`application_${data.email}`, new Date().toISOString());

        setFormState("success");
        setSubmitMessage(t("applicationForm.submitSuccess"));
        form.reset();
        onSubmitSuccess?.();
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      setFormState("error");
      setSubmitMessage(t("applicationForm.submitError"));
    }
  };

  const handleRetry = () => {
    setFormState("idle");
    setSubmitMessage("");
  };

  // Effects
  useEffect(() => {
    if (prefilledJobTitle) {
      form.setValue('jobTitle', prefilledJobTitle);
    }
  }, [prefilledJobTitle, form]);

  return (
    <Card id="bewerben">
      <CardHeader>
        <CardTitle>{t("applicationForm.title")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("applicationForm.description")}
        </p>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="text-green-600 font-medium">
              {submitMessage}
            </div>
            <Button onClick={() => setFormState("idle")} variant="outline">
              {t("applicationForm.submitAnother")}
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("applicationForm.nameLabel")} *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("applicationForm.emailLabel")} *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("applicationForm.locationLabel")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("applicationForm.jobTitleLabel")} *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly={!!prefilledJobTitle}
                          className={prefilledJobTitle ? "bg-muted" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cvFile"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>{t("applicationForm.cvLabel")} *</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("applicationForm.cvDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("applicationForm.messageLabel")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t("applicationForm.messagePlaceholder")}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gdprConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        {t("applicationForm.gdprLabel")} *
                      </FormLabel>
                      <FormDescription className="text-xs">
                        {t("applicationForm.gdprDescription")}
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {isError && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-destructive text-sm mb-3">{submitMessage}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                  >
                    {t("applicationForm.retryButton")}
                  </Button>
                </div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? t("applicationForm.submitting") : t("applicationForm.submitButton")}
              </Button>
            </form>
          </Form>
        )}

        <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
          <p>{t("applicationForm.contactInfo")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
// External Libraries
import { z } from "zod";

// Contact Form Schema (Sales Page)
export const contactFormSchema = z.object({
  name: z.string().min(1, "Dieses Feld ist erforderlich"),
  email: z.string().email("Bitte gültige E-Mail angeben"),
  phone: z.string().optional(),
  company: z.string().optional(),
  location: z.enum(["Berlin", "Frankfurt am Main", "Heidelberg", "Heilbronn", "Leipzig", "Mannheim", "Wiesbaden", "anderes"]),
  areaOfUse: z
    .enum([
      "Technisches FM",
      "Infra-Services",
      "Compliance",
      "Energie",
      "Digitalisierung",
    ])
    .optional(),
  message: z
    .string()
    .max(1000, "Nachricht zu lang (max. 1000 Zeichen)")
    .optional(),
  consent: z.literal(true, {
    message: "Bitte stimmen Sie der Datenverarbeitung zu"
  }),
});

// Job Application Schema (Career Page)
export const jobApplicationSchema = z.object({
  name: z.string().min(1, "Dieses Feld ist erforderlich"),
  email: z.string().email("Bitte gültige E-Mail angeben"),
  location: z.string().optional(),
  jobTitle: z.string().min(1, "Dieses Feld ist erforderlich"),
  cvFile: z
    .instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, "Datei zu groß (max. 10MB)")
    .refine(file => file.type === "application/pdf", "Nur PDF-Dateien erlaubt"),
  message: z
    .string()
    .max(2000, "Nachricht zu lang (max. 2000 Zeichen)")
    .optional(),
  gdprConsent: z.literal(true, {
    message: "Bitte stimmen Sie der Datenverarbeitung zu"
  }),
});

// Type exports
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type JobApplicationData = z.infer<typeof jobApplicationSchema>;

// Location type for consistency
export type Location = "Berlin" | "Frankfurt am Main" | "Heidelberg" | "Heilbronn" | "Leipzig" | "Mannheim" | "Wiesbaden" | "anderes";
export type LocationFilter = "Alle" | Location;

// Form state type
export type FormState = "idle" | "submitting" | "success" | "error";

export interface FormSubmissionResult {
  state: FormState;
  message?: string;
  errors?: Record<string, string>;
}
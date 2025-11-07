// Types
import type { ContactFormData, JobApplicationData, FormSubmissionResult } from "@/shared/lib/form-validation";

// Types
interface ContactSubmissionPayload extends Omit<ContactFormData, 'consent'> {
  submittedAt: string;
  formType: 'sales-contact';
  areaOfUse?: string; // Override to allow string for submission
}

interface JobSubmissionPayload extends Omit<JobApplicationData, 'cvFile' | 'gdprConsent'> {
  cvBase64?: string;
  cvFileName?: string;
  submittedAt: string;
  formType: 'job-application';
}

// Constants
const FORMSUBMIT_ENDPOINTS = {
  contact: "https://formsubmit.co/ajax/sales@pacon-re.de",
  career: "https://formsubmit.co/ajax/career@pacon-re.de",
} as const;

// Service: Submit Contact Form
export async function submitContactForm(data: ContactFormData): Promise<FormSubmissionResult> {
  try {
    const payload: ContactSubmissionPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      company: data.company || '',
      location: data.location,
      areaOfUse: data.areaOfUse,
      message: data.message || '',
      submittedAt: new Date().toISOString(),
      formType: 'sales-contact',
    };

    const response = await fetch(FORMSUBMIT_ENDPOINTS.contact, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success === false) {
      throw new Error(result.message || "Submission failed");
    }

    return {
      state: "success",
      message: "Danke. Wir melden uns binnen 1 Werktag.",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      state: "error",
      message: "Übertragung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    };
  }
}

// Service: Submit Job Application
export async function submitJobApplication(data: JobApplicationData): Promise<FormSubmissionResult> {
  try {
    // Convert CV file to base64 if provided
    let cvBase64: string | undefined;
    let cvFileName: string | undefined;

    if (data.cvFile) {
      cvBase64 = await fileToBase64(data.cvFile);
      cvFileName = data.cvFile.name;
    }

    const payload: JobSubmissionPayload = {
      name: data.name,
      email: data.email,
      location: data.location || '',
      jobTitle: data.jobTitle,
      message: data.message || '',
      cvBase64,
      cvFileName,
      submittedAt: new Date().toISOString(),
      formType: 'job-application',
    };

    const response = await fetch(FORMSUBMIT_ENDPOINTS.career, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success === false) {
      throw new Error(result.message || "Submission failed");
    }

    return {
      state: "success",
      message: "Danke für Ihre Bewerbung. Wir melden uns innerhalb von 5 Werktagen.",
    };
  } catch (error) {
    console.error("Job application submission error:", error);
    return {
      state: "error",
      message: "Übertragung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    };
  }
}

// Helper: Convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
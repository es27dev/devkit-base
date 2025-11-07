// Types
export type FormType = "sales" | "career";

// Constants
const DUPLICATE_WINDOW_HOURS = 24;

// Helper: Hash email for privacy
function hashEmail(email: string): string {
  // Simple hash function for client-side duplicate detection
  // Note: This is not cryptographically secure, but sufficient for our use case
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString();
}

// Helper: Generate storage key
function getStorageKey(email: string, formType: FormType): string {
  const hashedEmail = hashEmail(email.toLowerCase().trim());
  return `pacon_submission_${formType}_${hashedEmail}`;
}

// Service: Check if submission is duplicate
export function isDuplicateSubmission(email: string, formType: FormType): boolean {
  const key = getStorageKey(email, formType);
  const stored = localStorage.getItem(key);

  if (!stored) {
    return false;
  }

  try {
    const timestamp = parseInt(stored, 10);
    const hoursSince = (Date.now() - timestamp) / (1000 * 60 * 60);

    // Clean up if older than 24 hours
    if (hoursSince > DUPLICATE_WINDOW_HOURS) {
      localStorage.removeItem(key);
      return false;
    }

    return true; // Duplicate within 24h window
  } catch (error) {
    // Invalid timestamp, clean up
    localStorage.removeItem(key);
    return false;
  }
}

// Service: Record submission timestamp
export function recordSubmission(email: string, formType: FormType): void {
  const key = getStorageKey(email, formType);
  const timestamp = Date.now().toString();
  localStorage.setItem(key, timestamp);
}

// Service: Clean up old submissions (optional maintenance)
export function cleanupOldSubmissions(): void {
  const keys = Object.keys(localStorage);
  const submissionKeys = keys.filter(key => key.startsWith("pacon_submission_"));

  submissionKeys.forEach(key => {
    const stored = localStorage.getItem(key);
    if (!stored) return;

    try {
      const timestamp = parseInt(stored, 10);
      const hoursSince = (Date.now() - timestamp) / (1000 * 60 * 60);

      if (hoursSince > DUPLICATE_WINDOW_HOURS) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      // Invalid timestamp, clean up
      localStorage.removeItem(key);
    }
  });
}

// Service: Get duplicate message
export function getDuplicateMessage(formType: FormType): string {
  switch (formType) {
    case "sales":
      return "Ihre Anfrage wurde bereits registriert. Wir melden uns binnen 1 Werktag.";
    case "career":
      return "Ihre Bewerbung wurde bereits registriert. Wir melden uns innerhalb von 5 Werktagen.";
    default:
      return "Diese Anfrage wurde bereits registriert.";
  }
}
/**
 * Mock Submission Handler Contract
 *
 * Phase: MVP (Phase 1-7)
 * Purpose: Simulates form submission for development/testing
 * Replaced by: Supabase integration in Phase 8a
 */

export interface SalesContactFormData {
  name: string;
  email: string;
  telefon?: string;  // Optional phone field
  nachricht: string;
}

export interface SubmissionResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Mock submission handler
 *
 * Simulates async form submission with artificial delay
 * Logs data to console for development verification
 *
 * @param data - Form data matching SalesContactFormData interface
 * @returns Promise<SubmissionResult> - Always succeeds in MVP
 *
 * @example
 * ```typescript
 * const result = await submitLeadContact({
 *   name: "Max Mustermann",
 *   email: "max@example.com",
 *   telefon: "+49 123 456 789",
 *   nachricht: "Interested in your product"
 * });
 * ```
 */
export async function submitLeadContact(
  data: SalesContactFormData
): Promise<SubmissionResult> {
  // Artificial delay to simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));

  // Log submission for development verification
  console.log('=== Lead Contact Submission ===');
  console.log(JSON.stringify(data, null, 2));
  console.log('===============================');

  // Always succeed in MVP
  return {
    success: true,
    message: 'Vielen Dank! Wir melden uns in Kürze.'
  };
}

/**
 * Type guard to validate form data structure
 *
 * @param data - Unknown data to validate
 * @returns boolean - True if data matches SalesContactFormData interface
 */
export function isSalesContactFormData(data: unknown): data is SalesContactFormData {
  if (typeof data !== 'object' || data === null) return false;

  const d = data as Record<string, unknown>;

  return (
    typeof d.name === 'string' &&
    typeof d.email === 'string' &&
    typeof d.nachricht === 'string' &&
    (d.telefon === undefined || typeof d.telefon === 'string')
  );
}

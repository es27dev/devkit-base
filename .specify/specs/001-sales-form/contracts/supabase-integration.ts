/**
 * Supabase Integration Contract (Phase 8a)
 *
 * Phase: Database Integration (Phase 8a)
 * Purpose: Production-ready form submission with Supabase
 * Replaces: mock-submission.ts
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface LeadContactRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;  // Note: DB column is 'phone' (English)
  message: string;
  created_at: string;
  updated_at: string;
}

export interface SalesContactFormData {
  name: string;
  email: string;
  telefon?: string;  // Form field is 'telefon' (German)
  nachricht: string; // Form field is 'nachricht' (German)
}

export interface SubmissionResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: LeadContactRow;
}

/**
 * Supabase submission handler (Phase 8a)
 *
 * Inserts lead contact into devKit.leads table
 * Handles German form fields → English DB columns mapping
 *
 * @param supabase - Supabase client instance
 * @param data - Form data from SalesContactForm component
 * @returns Promise<SubmissionResult> - Success or error result
 *
 * @example
 * ```typescript
 * import { createClient } from '@supabase/supabase-js';
 * const supabase = createClient(url, key);
 *
 * const result = await submitLeadContactToSupabase(supabase, {
 *   name: "Max Mustermann",
 *   email: "max@example.com",
 *   telefon: "+49 123 456 789",
 *   nachricht: "Interested in your product"
 * });
 *
 * if (result.success) {
 *   toast.success(result.message);
 * } else {
 *   toast.error(result.error);
 * }
 * ```
 */
export async function submitLeadContactToSupabase(
  supabase: SupabaseClient,
  data: SalesContactFormData
): Promise<SubmissionResult> {
  try {
    // Map German form fields → English DB columns
    const { data: insertedRow, error } = await supabase
      .from('leads')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.telefon || null,
        message: data.nachricht
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return {
        success: false,
        error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
      };
    }

    return {
      success: true,
      message: 'Vielen Dank! Wir melden uns in Kürze.',
      data: insertedRow as LeadContactRow
    };
  } catch (error) {
    console.error('Unexpected error during submission:', error);
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
    };
  }
}

/**
 * Check for duplicate email submissions (optional enhancement)
 *
 * @param supabase - Supabase client instance
 * @param email - Email to check
 * @returns Promise<boolean> - True if email already exists
 */
export async function checkDuplicateEmail(
  supabase: SupabaseClient,
  email: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('leads')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (error) {
    console.error('Duplicate check error:', error);
    return false;
  }

  return (data?.length ?? 0) > 0;
}

/**
 * Migration Notes (Phase 8a)
 *
 * 1. Install Supabase client:
 *    npm install @supabase/supabase-js
 *
 * 2. Create Supabase client in src/shared/lib/supabase.ts:
 *    ```typescript
 *    import { createClient } from '@supabase/supabase-js';
 *    export const supabase = createClient(
 *      import.meta.env.VITE_SUPABASE_URL,
 *      import.meta.env.VITE_SUPABASE_ANON_KEY
 *    );
 *    ```
 *
 * 3. Update sales-contact-form.tsx:
 *    - Replace import from './contracts/mock-submission'
 *    - With import from './contracts/supabase-integration'
 *    - Update handleSubmit to use submitLeadContactToSupabase(supabase, data)
 *
 * 4. Run migration 004_leads_table.sql (create table + RLS policies)
 *
 * 5. Test with chrome-devtools:
 *    - Verify RLS policies (anon can INSERT, authenticated can SELECT)
 *    - Check German→English field mapping
 *    - Validate error handling
 */

# Form Submission API Contracts

**Feature**: 001-pacon-re | **Date**: 2025-11-07

## Overview

This document defines the API contracts for form submissions. Since this is a frontend-only application, forms submit to **FormSubmit.co** (third-party email service) instead of a custom backend.

---

## 1. FormSubmit.co Integration

**Service**: https://formsubmit.co/
**Purpose**: Convert form submissions to emails without backend infrastructure
**Cost**: Free tier (no registration needed)

### 1.1 Configuration

**Endpoint Pattern**:
```
POST https://formsubmit.co/ajax/{recipient-email}
```

**Headers**:
```http
Content-Type: application/json
Accept: application/json
```

**Rate Limiting**: 50 submissions per hour per IP (free tier)

---

## 2. Contact Form Submission (Sales Page)

**Endpoint**: `POST https://formsubmit.co/ajax/sales@pacon-re.de`

**Purpose**: Submit sales inquiries from /sales page (FR-013 to FR-017)

### 2.1 Request

**Method**: POST

**Headers**:
```http
Content-Type: application/json
Accept: application/json
```

**Request Body**:
```json
{
  "name": "Max Mustermann",
  "email": "max.mustermann@example.com",
  "phone": "+49 123 456789",
  "company": "Muster GmbH",
  "location": "Heidelberg",
  "areaOfUse": "Technisches FM",
  "message": "Wir interessieren uns für Ihre FM-Services...",
  "_subject": "Neue Anfrage über pacon-re.de",
  "_template": "box",
  "_captcha": "false"
}
```

**Required Fields**:
- `name` (string, min 1 char)
- `email` (string, valid email format)
- `location` (enum: "Berlin" | "Hamburg" | "Heidelberg" | "anderes")

**Optional Fields**:
- `phone` (string)
- `company` (string)
- `areaOfUse` (enum: "Technisches FM" | "Infra-Services" | "Compliance" | "Energie" | "Digitalisierung")
- `message` (string, max 1000 chars)

**FormSubmit.co Special Fields**:
- `_subject`: Email subject line
- `_template`: Email template style ("box", "table", or "plain")
- `_captcha`: Set to "false" for AJAX submissions

### 2.2 Response

**Success (200 OK)**:
```json
{
  "success": "true",
  "message": "Email sent successfully"
}
```

**Error (400 Bad Request)**:
```json
{
  "success": "false",
  "message": "Invalid email address"
}
```

**Error (429 Too Many Requests)**:
```json
{
  "success": "false",
  "message": "Rate limit exceeded"
}
```

### 2.3 Error Handling

**Client-Side Validation** (before submission):
- Email format validation (Zod schema)
- Required field validation
- Consent checkbox validation

**Network Error Handling**:
- Display retry button on failure (FR-047)
- Message: "Übertragung fehlgeschlagen. Bitte erneut versuchen."

**Duplicate Detection**:
- Check localStorage for submissions within 24h (FR-049)
- Message: "Ihre Anfrage wurde bereits registriert."

### 2.4 Success Flow

1. Submit form via AJAX
2. Receive success response
3. Display confirmation message (FR-017):
   > "Danke. Wir melden uns binnen 1 Werktag."
4. Store submission timestamp in localStorage
5. Reset form

---

## 3. Job Application Submission (Career Page)

**Endpoint**: `POST https://formsubmit.co/ajax/karriere@pacon-re.de`

**Purpose**: Submit job applications with CV upload from /career page (FR-037 to FR-040)

### 3.1 Request

**Method**: POST

**Headers**:
```http
Content-Type: application/json
Accept: application/json
```

**Request Body**:
```json
{
  "name": "Anna Schmidt",
  "email": "anna.schmidt@example.com",
  "location": "Berlin",
  "jobTitle": "Technischer Facility Manager (m/w/d)",
  "message": "Hiermit bewerbe ich mich...",
  "cvFile": "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMy...",
  "_subject": "Neue Bewerbung: Technischer Facility Manager (m/w/d)",
  "_template": "box",
  "_captcha": "false"
}
```

**Required Fields**:
- `name` (string, min 1 char)
- `email` (string, valid email format)
- `jobTitle` (string) - Readonly if from job teaser, "Initiativ" if unsolicited
- `cvFile` (base64 string) - PDF file, max 10MB

**Optional Fields**:
- `location` (string)
- `message` (string, max 2000 chars)

**File Upload**:
- Format: PDF only (validated client-side)
- Size: Max 10MB (validated client-side)
- Encoding: base64 string with data URI prefix
- FormSubmit.co automatically extracts and attaches the file to email

**FormSubmit.co Special Fields**:
- `_subject`: Email subject line (includes job title)
- `_template`: Email template style
- `_captcha`: Set to "false" for AJAX submissions

### 3.2 Response

**Success (200 OK)**:
```json
{
  "success": "true",
  "message": "Email sent successfully"
}
```

**Error (400 Bad Request)**:
```json
{
  "success": "false",
  "message": "Invalid email address or file too large"
}
```

**Error (413 Payload Too Large)**:
```json
{
  "success": "false",
  "message": "File size exceeds limit"
}
```

### 3.3 Error Handling

**Client-Side Validation** (before submission):
- CV file format: PDF only (FR-038)
  - Error: "Nur PDF-Dateien erlaubt"
- CV file size: max 10MB (FR-038)
  - Error: "Datei zu groß (max. 10MB)"
- Email format validation
  - Error: "Bitte gültige E-Mail angeben"
- Required field validation
  - Error: "Dieses Feld ist erforderlich"
- GDPR consent validation (FR-039)

**Network Error Handling**:
- Display retry button on failure
- Message: "Übertragung fehlgeschlagen. Bitte erneut versuchen."

**Duplicate Detection**:
- Check localStorage for applications within 24h (FR-049)
- Message: "Ihre Bewerbung wurde bereits registriert."

### 3.4 Success Flow

1. Validate CV file (PDF, 10MB)
2. Convert CV to base64
3. Submit form via AJAX
4. Receive success response
5. Display confirmation message
6. Store submission timestamp in localStorage
7. Reset form

---

## 4. TypeScript Integration

### 4.1 Form Submission Service

**File**: `src/shared/services/form-submission.ts`

```typescript
export interface FormSubmitResponse {
  success: string;
  message: string;
}

export interface FormSubmitConfig {
  endpoint: string;
  subject: string;
  template?: 'box' | 'table' | 'plain';
}

export class FormSubmissionService {
  /**
   * Submit form data to FormSubmit.co
   */
  static async submit(
    data: Record<string, unknown>,
    config: FormSubmitConfig
  ): Promise<FormSubmitResponse> {
    const payload = {
      ...data,
      _subject: config.subject,
      _template: config.template || 'box',
      _captcha: 'false'
    };

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Submission failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Submit contact form (sales)
   */
  static async submitContactForm(data: ContactFormSubmission) {
    return this.submit(data, {
      endpoint: 'https://formsubmit.co/ajax/sales@pacon-re.de',
      subject: 'Neue Anfrage über pacon-re.de'
    });
  }

  /**
   * Submit job application (career)
   */
  static async submitJobApplication(data: JobApplication) {
    return this.submit(data, {
      endpoint: 'https://formsubmit.co/ajax/karriere@pacon-re.de',
      subject: `Neue Bewerbung: ${data.jobTitle}`
    });
  }
}
```

### 4.2 Duplicate Detection Service

**File**: `src/shared/services/duplicate-detection.ts`

```typescript
import { createHash } from 'crypto';

export class DuplicateDetectionService {
  private static readonly WINDOW_HOURS = 24;

  /**
   * Hash email for privacy-friendly storage
   */
  private static hashEmail(email: string): string {
    return createHash('sha256').update(email.toLowerCase()).digest('hex');
  }

  /**
   * Check if submission is duplicate within 24h window
   */
  static isDuplicate(email: string, formType: 'sales' | 'career'): boolean {
    const key = `submission_${formType}_${this.hashEmail(email)}`;
    const stored = localStorage.getItem(key);

    if (!stored) return false;

    const timestamp = parseInt(stored, 10);
    const hoursSince = (Date.now() - timestamp) / (1000 * 60 * 60);

    // Clean up if > 24 hours
    if (hoursSince > this.WINDOW_HOURS) {
      localStorage.removeItem(key);
      return false;
    }

    return true; // Duplicate within 24h
  }

  /**
   * Record submission timestamp
   */
  static recordSubmission(email: string, formType: 'sales' | 'career'): void {
    const key = `submission_${formType}_${this.hashEmail(email)}`;
    localStorage.setItem(key, Date.now().toString());
  }
}
```

### 4.3 File Upload Service

**File**: `src/shared/services/file-upload.ts`

```typescript
export class FileUploadService {
  /**
   * Convert File to base64 string
   */
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate CV file (PDF, 10MB max)
   */
  static validateCV(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (file.type !== 'application/pdf') {
      return { valid: false, error: 'Nur PDF-Dateien erlaubt' };
    }

    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'Datei zu groß (max. 10MB)' };
    }

    return { valid: true };
  }
}
```

---

## 5. Error Messages

**Validation Errors** (FR-040):
```typescript
export const ERROR_MESSAGES = {
  required: 'Dieses Feld ist erforderlich',
  invalidEmail: 'Bitte gültige E-Mail angeben',
  pdfOnly: 'Nur PDF-Dateien erlaubt',
  fileTooLarge: 'Datei zu groß (max. 10MB)',
  messageTooLong: 'Nachricht zu lang (max. 1000 Zeichen)',
  applicationMessageTooLong: 'Nachricht zu lang (max. 2000 Zeichen)',
  consentRequired: 'Bitte stimmen Sie der Datenverarbeitung zu'
};
```

**Network Errors**:
```typescript
export const NETWORK_MESSAGES = {
  submissionFailed: 'Übertragung fehlgeschlagen. Bitte erneut versuchen.',
  duplicate: 'Ihre Anfrage wurde bereits registriert.',
  rateLimited: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.'
};
```

**Success Messages**:
```typescript
export const SUCCESS_MESSAGES = {
  contactForm: 'Danke. Wir melden uns binnen 1 Werktag.',
  jobApplication: 'Danke für Ihre Bewerbung. Wir melden uns in Kürze.'
};
```

---

## 6. Testing

### 6.1 Manual Testing Checklist

**Contact Form**:
- [ ] Valid submission succeeds
- [ ] Email format validation works
- [ ] Required fields validation works
- [ ] Consent checkbox validation works
- [ ] Duplicate detection works (24h window)
- [ ] Network error shows retry button
- [ ] Success message displays correctly

**Job Application**:
- [ ] Valid submission with PDF succeeds
- [ ] PDF-only validation works
- [ ] 10MB size limit validation works
- [ ] Email format validation works
- [ ] Required fields validation works
- [ ] GDPR consent validation works
- [ ] Duplicate detection works (24h window)
- [ ] Network error shows retry button
- [ ] Success message displays correctly

### 6.2 Edge Cases

1. **Network offline during submission**: Show error with retry button (FR-047)
2. **Duplicate submission within 24h**: Show message, prevent submission (FR-049)
3. **File > 10MB**: Show error before submission (FR-038)
4. **Non-PDF file**: Show error before submission (FR-038)
5. **Invalid email format**: Show error before submission (FR-015)
6. **Missing consent checkbox**: Show error before submission (FR-016, FR-039)

---

## 7. Privacy & GDPR

**Data Processing Notice** (FR-018):
> "Keine Werbung. Keine Weitergabe an Dritte."

**GDPR Compliance**:
- Consent checkbox required before submission
- Email hashed for duplicate detection (privacy-friendly)
- No third-party tracking in form submissions
- Data sent directly to company email via FormSubmit.co
- FormSubmit.co privacy policy: https://formsubmit.co/privacy

---

## Summary

This contract defines:

1. **FormSubmit.co integration** for email-based form submissions
2. **Contact form API** for sales inquiries
3. **Job application API** with CV upload
4. **TypeScript services** for form submission, duplicate detection, file upload
5. **Error handling** for validation and network failures
6. **Testing checklist** for manual validation

All contracts align with functional requirements (FR-013 to FR-040) and research decisions.

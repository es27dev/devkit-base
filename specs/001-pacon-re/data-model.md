# Data Model: PACON Real Estate Website

**Feature**: 001-pacon-re | **Date**: 2025-11-07

## Overview

This document defines data structures for the PACON website. Since this is a **frontend-only** application with no database persistence, the data model consists of:

1. **TypeScript interfaces** for type safety
2. **Zod schemas** for validation (forms, CV upload)
3. **Mock data structures** for static content

Forms submit to email endpoints (FormSubmit.co) - no backend database in MVP phase.

---

## 1. Form Submissions

### 1.1 Contact Form Submission (Sales Page)

**Purpose**: Capture sales inquiries from potential customers (FR-013 to FR-017)

**TypeScript Interface**:
```typescript
export interface ContactFormSubmission {
  name: string;                    // Required
  email: string;                   // Required, validated format
  phone?: string;                  // Optional
  company?: string;                // Optional
  location: 'Berlin' | 'Hamburg' | 'Heidelberg' | 'anderes';  // Dropdown
  areaOfUse?: 'Technisches FM' | 'Infra-Services' | 'Compliance' | 'Energie' | 'Digitalisierung';
  message?: string;                // Optional free text
  consent: boolean;                // Required (GDPR)
  submittedAt: string;             // ISO timestamp
}
```

**Zod Validation Schema**:
```typescript
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Dieses Feld ist erforderlich'),
  email: z.string().email('Bitte gültige E-Mail angeben'),
  phone: z.string().optional(),
  company: z.string().optional(),
  location: z.enum(['Berlin', 'Hamburg', 'Heidelberg', 'anderes']),
  areaOfUse: z.enum([
    'Technisches FM',
    'Infra-Services',
    'Compliance',
    'Energie',
    'Digitalisierung'
  ]).optional(),
  message: z.string().max(1000, 'Nachricht zu lang (max. 1000 Zeichen)').optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Bitte stimmen Sie der Datenverarbeitung zu' })
  })
});
```

**Validation Rules** (from spec):
- Email format validation (FR-015)
- Consent checkbox required (FR-016)
- Duplicate detection within 24h (FR-049)

**Success Message** (FR-017):
> "Danke. Wir melden uns binnen 1 Werktag."

**Privacy Notice** (FR-018):
> "Keine Werbung. Keine Weitergabe an Dritte."

---

### 1.2 Job Application (Career Page)

**Purpose**: Capture job applications with CV upload (FR-037 to FR-040)

**TypeScript Interface**:
```typescript
export interface JobApplication {
  name: string;                    // Required
  email: string;                   // Required, validated format
  location?: string;               // Optional (Berlin, Hamburg, Heidelberg, etc.)
  jobTitle: string;                // Readonly if from job teaser, "Initiativ" if unsolicited
  cvFile: File;                    // Required, PDF only, max 10MB
  cvBase64?: string;               // For FormSubmit.co submission
  message?: string;                // Optional motivation letter
  gdprConsent: boolean;            // Required
  submittedAt: string;             // ISO timestamp
}
```

**Zod Validation Schema**:
```typescript
export const jobApplicationSchema = z.object({
  name: z.string().min(1, 'Dieses Feld ist erforderlich'),
  email: z.string().email('Bitte gültige E-Mail angeben'),
  location: z.string().optional(),
  jobTitle: z.string().min(1, 'Dieses Feld ist erforderlich'),
  cvFile: z
    .instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, 'Datei zu groß (max. 10MB)')
    .refine(file => file.type === 'application/pdf', 'Nur PDF-Dateien erlaubt'),
  message: z.string().max(2000, 'Nachricht zu lang (max. 2000 Zeichen)').optional(),
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: 'Bitte stimmen Sie der Datenverarbeitung zu' })
  })
});
```

**Validation Rules** (from spec):
- CV file format: PDF only (FR-038)
- CV file size: max 10MB (FR-038)
- GDPR consent required (FR-039)
- Field error messages (FR-040):
  - "Bitte gültige E-Mail angeben"
  - "Dieses Feld ist erforderlich"
  - "Nur PDF-Dateien erlaubt"
  - "Datei zu groß (max. 10MB)"

---

## 2. Static Content Entities

These entities represent static/mock data displayed on pages. No backend storage in MVP.

### 2.1 Job Listing

**Purpose**: Display open positions on Career page (FR-031 to FR-033)

**TypeScript Interface**:
```typescript
export interface JobListing {
  id: string;                      // Unique identifier
  title: string;                   // e.g., "Technischer Facility Manager"
  location: 'Heidelberg' | 'Berlin' | 'Hamburg';  // Filterable
  entryLevel: string;              // e.g., "Berufserfahren", "Junior"
  employmentType: string;          // e.g., "Vollzeit", "Teilzeit"
  tasks: string[];                 // 3 bullet points
  profileRequirements: string[];   // 3 bullet points
  active: boolean;                 // Show/hide listing
}
```

**Example Data**:
```typescript
const mockJobListings: JobListing[] = [
  {
    id: 'job-001',
    title: 'Technischer Facility Manager (m/w/d)',
    location: 'Heidelberg',
    entryLevel: 'Berufserfahren',
    employmentType: 'Vollzeit',
    tasks: [
      'Wartung und Instandhaltung technischer Anlagen',
      'Koordination von Dienstleistern',
      'Dokumentation und Reporting'
    ],
    profileRequirements: [
      'Abgeschlossene technische Ausbildung',
      '3+ Jahre Erfahrung im FM-Bereich',
      'Führerschein Klasse B'
    ],
    active: true
  }
];
```

**Features**:
- Location filter (FR-031, FR-032): "Alle", "Heidelberg", "Berlin", "Hamburg"
- Pre-filled job title when clicking "Für diese Stelle bewerben" (FR-033)
- Empty state: "Gerade gibt es keine offenen Stellen" (FR-048)

---

### 2.2 Team Member Profile

**Purpose**: Display team information on Career page (FR-035)

**TypeScript Interface**:
```typescript
export interface TeamMemberProfile {
  id: string;
  name: string;                    // Full name
  role: string;                    // Job title
  focus: string;                   // 1-sentence description
  photoUrl?: string;               // Optional photo reference
  displayOrder: number;            // Sort order
}
```

**Example Data**:
```typescript
const mockTeamProfiles: TeamMemberProfile[] = [
  {
    id: 'team-001',
    name: 'Dr. Stefan Müller',
    role: 'Geschäftsführer',
    focus: 'Spezialist für nachhaltige Gebäudetechnik und Energieeffizienz',
    photoUrl: '/assets/team/stefan-mueller.jpg',
    displayOrder: 1
  }
];
```

**Requirements** (FR-035):
- 6-10 profile cards
- Name, Role, 1-sentence focus
- Optional photo

---

### 2.3 Customer Logo

**Purpose**: Display client references on Landing and About pages (FR-003, FR-027)

**TypeScript Interface**:
```typescript
export interface CustomerLogo {
  id: string;
  companyName: string;             // Alt text for accessibility
  logoUrl: string;                 // Image reference
  displayOrder: number;            // Sort order
}
```

**Example Data**:
```typescript
const mockCustomerLogos: CustomerLogo[] = [
  {
    id: 'customer-001',
    companyName: 'Deutsche Bahn AG',
    logoUrl: '/assets/logos/deutsche-bahn.svg',
    displayOrder: 1
  }
];
```

**Requirements**:
- Landing page: Logo wall with link to /about#kunden (FR-003)
- About page: 8-12 logos (FR-027)
- Empty state: "Die Kundenlogos konnten nicht geladen werden" (FR-048)

---

### 2.4 Project Reference

**Purpose**: Display completed projects with images (FR-005, FR-012, FR-024)

**TypeScript Interface**:
```typescript
export interface ProjectReference {
  id: string;
  title: string;                   // Project name
  description: string;             // 1-line impact statement
  imageUrl: string;                // Project photo
  displayOrder: number;            // Sort order
}
```

**Example Data**:
```typescript
const mockProjectReferences: ProjectReference[] = [
  {
    id: 'project-001',
    title: 'Bürokomplex Berlin Mitte',
    description: '20% Energieeinsparung durch optimierte Gebäudeleittechnik',
    imageUrl: '/assets/projects/berlin-mitte.jpg',
    displayOrder: 1
  }
];
```

**Requirements**:
- Landing page: Gallery with link to /about#referenzen (FR-005)
- Sales page: 3-6 project items with titles and impact statements (FR-012)
- About page: 6-8 project images with titles and impact statements (FR-024)

---

### 2.5 Testimonial

**Purpose**: Display customer and employee quotes (FR-025, FR-030)

**TypeScript Interface**:
```typescript
export interface Testimonial {
  id: string;
  text: string;                    // 1-2 sentences
  author?: string;                 // Optional name
  authorFunction?: string;         // Optional role/company
  type: 'customer' | 'employee';   // Distinguish types
  displayOrder: number;            // Sort order
}
```

**Example Data**:
```typescript
const mockTestimonials: Testimonial[] = [
  {
    id: 'testimonial-001',
    text: 'pacon hat unsere Facility-Management-Prozesse revolutioniert. Transparenz und Effizienz auf höchstem Niveau.',
    author: 'Michael Schmidt',
    authorFunction: 'Leiter Facility Management, Deutsche Bahn AG',
    type: 'customer',
    displayOrder: 1
  },
  {
    id: 'testimonial-002',
    text: 'Die Weiterbildungsmöglichkeiten und das Team bei pacon sind unübertroffen. Hier kann ich mich wirklich entwickeln.',
    author: 'Anna Weber',
    authorFunction: 'Technische Facility Managerin',
    type: 'employee',
    displayOrder: 1
  }
];
```

**Requirements**:
- About page: 3 customer testimonials with 1-2 sentences each (FR-025)
- Career page: Employee testimonials with slider navigation, at least 3 (FR-030)

---

### 2.6 Benefit Tile

**Purpose**: Display employee benefits on Career page (FR-036)

**TypeScript Interface**:
```typescript
export interface BenefitTile {
  id: string;
  title: string;                   // e.g., "Karriereentwicklung"
  description: string;             // 1-sentence benefit explanation
  iconName?: string;               // Optional icon identifier
  displayOrder: number;            // Sort order
}
```

**Example Data**:
```typescript
const mockBenefits: BenefitTile[] = [
  {
    id: 'benefit-001',
    title: 'Karriereentwicklung',
    description: 'Individuelle Förderpläne und klare Aufstiegsperspektiven in allen Bereichen',
    iconName: 'chart-line',
    displayOrder: 1
  },
  {
    id: 'benefit-002',
    title: 'Weiterbildung',
    description: 'Regelmäßige Schulungen, Zertifizierungen und Zugang zu Fachkonferenzen',
    iconName: 'graduation-cap',
    displayOrder: 2
  }
];
```

**Requirements** (FR-036):
- At least 6 benefit tiles
- Each with 1-sentence benefit explanation
- Suggested benefits: Karriereentwicklung, Weiterbildung, Work-Life-Balance, Teamgeist, Anerkennung, Vielfalt

---

### 2.7 Service Item

**Purpose**: Display core services on Landing and Sales pages (FR-002, FR-010)

**TypeScript Interface**:
```typescript
export interface ServiceItem {
  id: string;
  title: string;                   // e.g., "Technisches FM"
  description: string;             // Short benefit/description
  iconName?: string;               // Optional icon identifier
  displayOrder: number;            // Sort order
}
```

**Example Data**:
```typescript
const mockServices: ServiceItem[] = [
  {
    id: 'service-001',
    title: 'Technisches FM',
    description: 'Wartung, Instandhaltung und Störungsbeseitigung aller technischen Anlagen',
    iconName: 'wrench',
    displayOrder: 1
  },
  {
    id: 'service-002',
    title: 'Infrastrukturelle Services',
    description: 'Reinigung, Sicherheit, Empfangsdienste und Catering-Management',
    iconName: 'building',
    displayOrder: 2
  }
];
```

**Requirements**:
- Landing page: 5 service bullets with link to /about#leistungen (FR-002)
- Sales page: 5 core services with descriptions (FR-010)
- Services: Technisches FM, Infrastrukturelle Services, Betreiberverantwortung & Compliance, Energie & Nachhaltigkeit, Digitalisierung & Reporting

---

### 2.8 News Update

**Purpose**: Display company news on About page (FR-028)

**TypeScript Interface**:
```typescript
export interface NewsUpdate {
  id: string;
  text: string;                    // Update text
  date: string;                    // ISO date string
  displayOrder: number;            // Sort order (newest first)
}
```

**Example Data**:
```typescript
const mockNews: NewsUpdate[] = [
  {
    id: 'news-001',
    text: 'pacon erhält ISO 14001 Zertifizierung für Umweltmanagement',
    date: '2025-10-15',
    displayOrder: 1
  }
];
```

**Requirements** (FR-028):
- 3 update cards showing text and date
- Displayed on About page

---

### 2.9 Certification Badge

**Purpose**: Display certifications on About page (FR-026)

**TypeScript Interface**:
```typescript
export interface CertificationBadge {
  id: string;
  name: string;                    // e.g., "ISO 9001"
  description: string;             // Short description
  badgeUrl?: string;               // Optional badge image
  displayOrder: number;            // Sort order
}
```

**Example Data**:
```typescript
const mockCertifications: CertificationBadge[] = [
  {
    id: 'cert-001',
    name: 'ISO 9001',
    description: 'Qualitätsmanagement',
    badgeUrl: '/assets/certifications/iso-9001.svg',
    displayOrder: 1
  }
];
```

**Requirements** (FR-026):
- Badges: ISO 9001, ISO 14001, GEFMA guidelines, VDI 6000
- Note: "Zertifikate auf Anfrage verfügbar"

---

## 3. Shared Types

### 3.1 Form Submission State

**Purpose**: Track form submission progress and errors

**TypeScript Interface**:
```typescript
export type FormState = 'idle' | 'submitting' | 'success' | 'error';

export interface FormSubmissionResult {
  state: FormState;
  message?: string;
  errors?: Record<string, string>;  // Field-level errors
}
```

---

### 3.2 Location Type

**Purpose**: Consistent location values across forms and filters

**TypeScript Type**:
```typescript
export type Location = 'Berlin' | 'Hamburg' | 'Heidelberg' | 'anderes';
export type LocationFilter = 'Alle' | Location;  // For job filtering
```

---

### 3.3 Theme Type

**Purpose**: Dark/light mode state

**TypeScript Type**:
```typescript
export type Theme = 'light' | 'dark';
```

---

## 4. Validation Rules Summary

| Field | Validation | Error Message |
|-------|------------|---------------|
| Email | RFC 5322 format | "Bitte gültige E-Mail angeben" |
| Name | Min 1 char | "Dieses Feld ist erforderlich" |
| Consent | Must be true | "Bitte stimmen Sie der Datenverarbeitung zu" |
| CV File | PDF only | "Nur PDF-Dateien erlaubt" |
| CV File | Max 10MB | "Datei zu groß (max. 10MB)" |
| Message (contact) | Max 1000 chars | "Nachricht zu lang (max. 1000 Zeichen)" |
| Message (application) | Max 2000 chars | "Nachricht zu lang (max. 2000 Zeichen)" |

---

## 5. Data Flow

### 5.1 Contact Form Submission Flow

```
User fills form → Client validation (Zod) → Check duplicate (localStorage) →
Submit to FormSubmit.co → Success/Error → Show message → Store submission timestamp
```

### 5.2 Job Application Flow

```
User fills form + uploads CV → Validate file (PDF, 10MB) → Convert to base64 →
Client validation (Zod) → Check duplicate (localStorage) →
Submit to FormSubmit.co (with base64 CV) → Success/Error → Show message → Store timestamp
```

### 5.3 Job Filtering Flow

```
User selects location filter → Filter jobListings array → Re-render list →
If empty: Show "Gerade gibt es keine offenen Stellen"
```

---

## 6. State Management Decisions (per Constitution Section 4)

| Entity | State Pattern | Rationale |
|--------|--------------|-----------|
| **Form State** | Component-local (useState) | <3 components, no sharing needed |
| **Job Filter** | URL State (Search Params) | Shareable, bookmarkable filter |
| **Theme** | Persistent (localStorage) + Global (Zustand) | Cross-page, persistent preference |
| **Static Content** | Component-local (mock data) | No backend, imported as constants |
| **Duplicate Detection** | Persistent (localStorage) | 24h window, no backend |

---

## 7. Mock Data Location

All mock data constants will be stored in:

```
src/shared/data/
├── mock-jobs.ts           # JobListing[]
├── mock-team.ts           # TeamMemberProfile[]
├── mock-customers.ts      # CustomerLogo[]
├── mock-projects.ts       # ProjectReference[]
├── mock-testimonials.ts   # Testimonial[]
├── mock-benefits.ts       # BenefitTile[]
├── mock-services.ts       # ServiceItem[]
├── mock-news.ts           # NewsUpdate[]
└── mock-certifications.ts # CertificationBadge[]
```

Each file exports a typed array with named export:

```typescript
// src/shared/data/mock-jobs.ts
export const mockJobListings: JobListing[] = [...];
```

---

## Summary

This data model provides:

1. **Type safety** via TypeScript interfaces
2. **Validation** via Zod schemas (forms only)
3. **Mock data** structure for static content
4. **State management** decisions per constitution
5. **Error messages** aligned with spec requirements

All entities align with functional requirements (FR-001 to FR-051) and constitution guidelines.

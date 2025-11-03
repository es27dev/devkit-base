# Data Model: Sales Contact Form

**Feature**: Sales Contact Form | **Date**: 2025-11-03
**Phase**: 1 (Design & Contracts)

## Entities

### LeadContact

**Description**: Lead contact submission from sales page form

**TypeScript Interface**:
```typescript
interface LeadContact {
  name: string;           // Required, customer full name
  email: string;          // Required, validated email address
  telefon?: string;       // Optional, auto-formatted phone (spaces every 3 digits)
  nachricht: string;      // Required, max 500 characters
}
```

**Validation Schema (Zod)**:
```typescript
import { z } from 'zod';

const salesContactSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  email: z.string().email("Bitte gültige Email-Adresse eingeben"),
  telefon: z.string().optional(),
  nachricht: z.string()
    .min(1, "Nachricht ist erforderlich")
    .max(500, "Maximal 500 Zeichen erlaubt")
});

type SalesContactFormData = z.infer<typeof salesContactSchema>;
```

**Field Details**:

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| name | string | Yes | min(1) | Full name of lead |
| email | string | Yes | RFC 5322 basic pattern | Email validation on blur |
| telefon | string | No | - | Auto-formatted display only, no pattern validation |
| nachricht | string | Yes | min(1), max(500) | Character counter shown below field |

**State Transitions**: N/A (single submission, no state changes)

---

## Future Database Schema (Phase 8a)

**Table**: `leads` (Supabase, "devKit" schema)

```sql
CREATE TABLE "devKit".leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,                           -- Note: column name 'phone' (English), form field 'telefon' (German)
  message TEXT NOT NULL CHECK(length(message) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS Policies
ALTER TABLE "devKit".leads ENABLE ROW LEVEL SECURITY;

-- Policy: Public can INSERT (anonymous form submissions)
CREATE POLICY "leads_insert_public" ON "devKit".leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Authenticated users can SELECT (sales team)
CREATE POLICY "leads_select_authenticated" ON "devKit".leads
  FOR SELECT
  TO authenticated
  USING (true);
```

**Migration Strategy**:
1. Keep current mock handler in MVP
2. Phase 8a: Create `leads` table with RLS policies
3. Replace mock handler with Supabase client insert
4. Add server-side validation duplicate check (optional)

**Data Flow** (MVP vs Phase 8a):

**MVP (Current)**:
```
User Submit → Validation → Mock Handler (console.log) → Toast Success → Form Reset
```

**Phase 8a (Future)**:
```
User Submit → Validation → Supabase Insert → Toast Success → Form Reset
                                         ↓
                                  Error → Toast Error (form preserved)
```

---

## Relationships

**None** - LeadContact is an isolated entity (no foreign keys or joins needed)

---

## Data Constraints

### Business Rules
1. Email must be unique per submission (future: consider duplicate detection)
2. Phone is cosmetic-only (formatting for display, stored as-entered)
3. Message length hard limit: 500 characters (enforced client + server)
4. All timestamps in UTC

### Validation Rules
- **Name**: Non-empty string, any characters allowed (including unicode)
- **Email**: RFC 5322 basic pattern via Zod `.email()`
- **Phone**: Optional, no pattern validation (accepts any format)
- **Message**: 1-500 characters, XSS prevention on backend (Phase 8a)

---

## Summary

**Total Entities**: 1 (LeadContact)
**Database Tables (Phase 8a)**: 1 (leads)
**Relationships**: 0
**Constraints**: 4 business rules, 4 validation rules

**TypeScript Types Generated**:
- `LeadContact` (interface)
- `SalesContactFormData` (Zod inferred type)
- `salesContactSchema` (Zod schema)

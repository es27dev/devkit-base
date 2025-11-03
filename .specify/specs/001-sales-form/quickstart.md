# Quickstart: Sales Contact Form Integration

**Feature**: Sales Contact Form | **Date**: 2025-11-03
**Phase**: 1 (Design & Contracts)

## Overview

This guide shows how to integrate the `SalesContactForm` component into the Sales page.

---

## Prerequisites

1. ✅ shadcn/ui components installed:
   - `npx shadcn@latest add form input textarea button sonner`
2. ✅ Sonner `<Toaster />` added to [main.tsx](../../../src/main.tsx)
3. ✅ react-hook-form + Zod installed (already in constitution tech stack)
4. ✅ i18n translations ready in [src/components/features/salesContactForm/i18n/locales/de.json](../../../src/components/features/salesContactForm/i18n/locales/de.json)

---

## Installation Steps

### 1. Add Sonner to Root Layout

**File**: [src/main.tsx](../../../src/main.tsx)

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { Toaster } from '@/components/base/sonner' // ADD THIS
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Toaster /> {/* ADD THIS */}
  </React.StrictMode>
)
```

---

### 2. Integrate into Sales Page

**File**: [src/pages/Sales.tsx](../../../src/pages/Sales.tsx)

```typescript
import { SalesContactForm } from '@/components/features/salesContactForm'

export function Sales() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Existing sales page content */}
      <section className="hero">
        <h1>Vertrieb</h1>
        <p>Ihre Sales-Lösung...</p>
      </section>

      {/* ADD CONTACT FORM SECTION */}
      <section className="contact-form-section mt-16" id="contact">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Kontaktieren Sie uns
          </h2>
          <SalesContactForm />
        </div>
      </section>
    </div>
  );
}
```

---

## Component Usage

### Basic Usage (Default)

```typescript
import { SalesContactForm } from '@/components/features/salesContactForm'

<SalesContactForm />
```

**Output**: Full contact form with all fields (Name, Email, Phone, Message)

---

### Integration Scenarios

#### Scenario 1: Embed in Hero Section

```typescript
<section className="hero-with-form grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Left: Hero content */}
  <div>
    <h1>Ihre Vertriebslösung</h1>
    <p>Starten Sie noch heute...</p>
  </div>

  {/* Right: Contact form */}
  <div>
    <SalesContactForm />
  </div>
</section>
```

---

#### Scenario 2: Dedicated Contact Section (Recommended)

```typescript
<section className="contact-section bg-muted py-16" id="contact">
  <div className="container mx-auto max-w-2xl px-4">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-2">Kontaktieren Sie uns</h2>
      <p className="text-muted-foreground">
        Wir melden uns innerhalb von 24 Stunden bei Ihnen.
      </p>
    </div>
    <SalesContactForm />
  </div>
</section>
```

---

#### Scenario 3: Modal/Dialog Integration (Advanced)

```typescript
import { Dialog, DialogContent, DialogTrigger } from '@/components/base/dialog'
import { Button } from '@/components/base/button'
import { SalesContactForm } from '@/components/features/salesContactForm'

<Dialog>
  <DialogTrigger asChild>
    <Button>Kontakt aufnehmen</Button>
  </DialogTrigger>
  <DialogContent className="max-w-2xl">
    <SalesContactForm />
  </DialogContent>
</Dialog>
```

---

## Testing Scenarios

### Test 1: Successful Submission (User Story 1 - P1)

**Steps**:
1. Navigate to `/sales` or `/vertrieb`
2. Scroll to contact form section
3. Fill all required fields:
   - Name: "Max Mustermann"
   - Email: "max@example.com"
   - Phone: "+49 123 456 789" (optional)
   - Message: "Interested in your solution"
4. Click "Absenden"

**Expected**:
- ✅ Button shows loading state ("Wird gesendet...")
- ✅ After 800ms, success toast appears: "Vielen Dank! Wir melden uns in Kürze."
- ✅ Toast auto-dismisses after 4 seconds
- ✅ Form resets (all fields empty)
- ✅ Console shows submission data (MVP mock handler)

---

### Test 2: Validation Errors (User Story 2 - P2)

**Steps**:
1. Navigate to form
2. Enter invalid email: "test@"
3. Click outside email field (blur)

**Expected**:
- ✅ Error appears below email field within 100ms: "Bitte gültige Email-Adresse eingeben"
- ✅ Error styling applied (red text, red border)

**Steps**:
1. Leave Name field empty
2. Click "Absenden"

**Expected**:
- ✅ Error appears below Name field: "Dieses Feld ist erforderlich"
- ✅ Form does NOT submit

---

### Test 3: Phone Auto-Formatting

**Steps**:
1. Navigate to form
2. Type in Phone field: "491234567890"

**Expected**:
- ✅ Display updates in real-time: "491 234 567 890"
- ✅ Spaces inserted every 3 digits automatically

---

### Test 4: Character Counter (Message Field)

**Steps**:
1. Navigate to form
2. Type in Message field: "Test message"

**Expected**:
- ✅ Below field shows: "12 / 500 Zeichen"
- ✅ Counter updates in real-time

**Steps**:
1. Type 501 characters

**Expected**:
- ✅ Validation error on submit: "Maximal 500 Zeichen erlaubt"

---

### Test 5: Responsive Design (Success Criteria SC-004)

**Steps**:
1. Open DevTools
2. Switch to mobile viewport (375px width)
3. Test form submission

**Expected**:
- ✅ Form layout adapts to mobile
- ✅ All fields remain usable
- ✅ Toast notifications visible
- ✅ Submit button accessible

---

## Customization Options

### Styling

The component uses shadcn/ui primitives and respects your global theme (light/dark mode). No custom styling needed.

**Optional**: Wrap in custom container for spacing/background:

```typescript
<div className="bg-card p-8 rounded-lg shadow-md">
  <SalesContactForm />
</div>
```

---

### Translations

Default: German (`de.json`)

**To add English**:
1. Create `src/components/features/salesContactForm/i18n/locales/en.json`
2. Copy structure from `de.json`
3. Translate all values
4. i18n config auto-merges

---

## Troubleshooting

### Issue: Toast not appearing

**Solution**: Verify `<Toaster />` is added to [main.tsx](../../../src/main.tsx)

```typescript
import { Toaster } from '@/components/base/sonner'

// In render
<Toaster />
```

---

### Issue: Form validation not working

**Solution**: Check Zod schema is imported correctly and zodResolver is configured

```typescript
import { zodResolver } from '@hookform/resolvers/zod'

const form = useForm({
  resolver: zodResolver(salesContactSchema)
})
```

---

### Issue: Phone formatting not working

**Solution**: Verify Controller is used for phone field (not direct Input)

```typescript
<Controller
  name="telefon"
  control={control}
  render={({ field }) => <Input {...field} onChange={formatPhone} />}
/>
```

---

## Migration to Supabase (Phase 8a)

When ready for production database integration:

1. Follow migration notes in [contracts/supabase-integration.ts](./contracts/supabase-integration.ts)
2. Run migration `004_leads_table.sql`
3. Update component to use `submitLeadContactToSupabase`
4. Test RLS policies with chrome-devtools

**No changes to component API** - internal implementation only

---

## Summary

**Integration Time**: ~5 minutes
**Required Files**: 1 (Sales.tsx update)
**Breaking Changes**: None
**Dependencies**: shadcn/ui, react-hook-form, Zod (already installed)

**Next Steps**:
1. Integrate into [src/pages/Sales.tsx](../../../src/pages/Sales.tsx)
2. Test all 5 test scenarios above
3. Deploy MVP with mock handler
4. Plan Phase 8a Supabase migration

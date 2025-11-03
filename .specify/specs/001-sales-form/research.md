# Research: Sales Contact Form

**Feature**: Sales Contact Form | **Date**: 2025-11-03
**Phase**: 0 (Outline & Research)

## Research Questions

### 1. Phone Auto-Formatting Implementation Pattern

**Question**: How to implement auto-formatting phone input with spaces every 3 digits using react-hook-form Controller?

**Decision**: Custom onChange handler with regex pattern

**Implementation**:
```typescript
// Helper function
function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  // Add space every 3 digits
  return digits.replace(/(\d{1,3})(?=\d)/g, '$1 ').trim();
}

// In Controller
<Controller
  name="telefon"
  control={control}
  render={({ field }) => (
    <Input
      {...field}
      onChange={(e) => {
        const formatted = formatPhoneNumber(e.target.value);
        field.onChange(formatted);
      }}
    />
  )}
/>
```

**Rationale**:
- No external library needed (keeps bundle size minimal)
- Real-time formatting on input
- Preserves raw digits for validation if needed
- Works with react-hook-form Controller pattern

**Alternatives Considered**:
- ❌ react-input-mask: Additional dependency, overkill for simple spacing
- ❌ Manual regex on blur: Poor UX (no instant feedback)
- ❌ Zod transform: Runs after validation, not during typing

**Source**: react-hook-form Controller API documentation

---

### 2. Sonner Toast Integration Pattern

**Question**: Where and how to integrate shadcn/ui Sonner for toast notifications?

**Decision**: Add `<Toaster />` to root layout (main.tsx), use `toast()` function in component

**Implementation**:

**main.tsx**:
```typescript
import { Toaster } from '@/components/base/sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
)
```

**sales-contact-form.tsx**:
```typescript
import { toast } from 'sonner'

const handleSubmit = async (data: SalesContactFormData) => {
  try {
    // Mock submission
    console.log(JSON.stringify(data, null, 2));
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network

    toast.success('Vielen Dank! Wir melden uns in Kürze.', {
      duration: 4000
    });
    reset(); // react-hook-form reset
  } catch (error) {
    toast.error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.', {
      duration: 4000
    });
  }
}
```

**Rationale**:
- Single `<Toaster />` instance handles all toasts app-wide
- Functional `toast()` API is simpler than component-based approach
- 4000ms duration per spec requirement
- Error handling preserves form data (no reset on error)

**Alternatives Considered**:
- ❌ Component-level Toaster: Creates multiple toast containers
- ❌ Context API for toast state: Overcomplicated for simple notifications
- ❌ Manual toast component: Reinvents wheel, loses shadcn/ui consistency

**Source**: shadcn/ui Sonner documentation

---

### 3. Form Reset After Successful Submission

**Question**: How to reset react-hook-form after successful submission?

**Decision**: Use `reset()` method from `useForm` hook

**Implementation**:
```typescript
const { reset, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SalesContactFormData>({
  resolver: zodResolver(salesContactSchema),
  mode: 'onBlur'
});

const onSubmit = async (data: SalesContactFormData) => {
  // ... submission logic
  toast.success('...');
  reset(); // Clears all fields to default values
}
```

**Rationale**:
- Built-in react-hook-form method
- Resets all fields, validation state, and errors
- Works seamlessly with Controller components

**Alternatives Considered**:
- ❌ Manual field clearing: Error-prone, misses validation state
- ❌ Form remounting: Poor UX (screen flicker)

**Source**: react-hook-form API documentation

---

### 4. Validation Timing Strategy

**Question**: When should validation run (onChange, onBlur, onSubmit)?

**Decision**: `mode: 'onBlur'` for email, other fields validate on submit

**Implementation**:
```typescript
const form = useForm<SalesContactFormData>({
  resolver: zodResolver(salesContactSchema),
  mode: 'onBlur' // Validates on blur
});
```

**Rationale**:
- Email validation on blur (FR-001, SC-002: <100ms feedback)
- Prevents validation errors while user is typing
- Required field errors shown only on submit attempt
- Balance between immediate feedback and non-intrusive UX

**Alternatives Considered**:
- ❌ onChange: Too aggressive, shows errors mid-typing
- ❌ onSubmit only: Delays feedback, multiple submit attempts needed

**Source**: react-hook-form validation modes best practices

---

### 5. Zod Schema Design for Phone Field

**Question**: Should phone field be validated or just optional?

**Decision**: Optional string, no validation pattern (auto-formatting handles display)

**Implementation**:
```typescript
const salesContactSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  email: z.string().email("Bitte gültige Email-Adresse eingeben"),
  telefon: z.string().optional(), // No pattern validation
  nachricht: z.string().min(1, "Nachricht ist erforderlich").max(500, "Maximal 500 Zeichen erlaubt")
});
```

**Rationale**:
- FR-006: Phone is optional (no required validation)
- Auto-formatting ensures consistent display format
- International numbers have varying formats (hard to validate universally)
- User can enter any number format, formatting is purely cosmetic

**Alternatives Considered**:
- ❌ Strict regex validation: Fails for international formats
- ❌ Min length requirement: Contradicts "optional" requirement

**Source**: Spec requirement FR-006

---

### 6. Character Counter for Message Field

**Question**: Should we show character count for 500-char limit?

**Decision**: YES - show counter below textarea (e.g., "245 / 500")

**Implementation**:
```typescript
const messageValue = watch('nachricht'); // react-hook-form watch

<FormDescription>
  {messageValue?.length || 0} / 500 Zeichen
</FormDescription>
```

**Rationale**:
- Improves UX (user sees limit before hitting it)
- Prevents frustration from hard cutoff
- Standard pattern for length-limited inputs
- Uses react-hook-form `watch` for reactive count

**Alternatives Considered**:
- ❌ No counter: Users unaware of limit until validation error
- ❌ maxLength attribute: Works but no visual feedback

**Source**: UX best practices for constrained inputs

---

### 7. Loading State Implementation

**Question**: How to show loading state during mock submission (User Story 3)?

**Decision**: Use `isSubmitting` from `formState` + Button disabled + loading prop

**Implementation**:
```typescript
const { formState: { isSubmitting } } = useForm();

<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Wird gesendet...' : 'Absenden'}
</Button>
```

**Rationale**:
- `isSubmitting` automatically true during async handleSubmit
- shadcn/ui Button has built-in disabled styles
- Text change provides clear feedback
- No manual state management needed

**Alternatives Considered**:
- ❌ Manual useState: Duplicates react-hook-form internal state
- ❌ Spinner icon: Requires additional icon component

**Source**: react-hook-form formState API

---

## Summary

**Total Research Items**: 7
**Decisions Made**: 7
**NEEDS CLARIFICATION Resolved**: All resolved

**Key Technologies Validated**:
- ✅ react-hook-form Controller for phone formatting
- ✅ Sonner toast integration pattern
- ✅ Form reset strategy
- ✅ Validation timing (onBlur mode)
- ✅ Optional phone field (no strict validation)
- ✅ Character counter with watch()
- ✅ Loading state with isSubmitting

**Ready for Phase 1**: Data Model & Contracts

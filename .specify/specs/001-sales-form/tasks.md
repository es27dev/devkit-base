# Implementation Tasks: Sales Contact Form

**Feature**: Sales Contact Form | **Branch**: `001-sales-form` | **Date**: 2025-11-03

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Data Model**: [data-model.md](./data-model.md)

---

## Task Summary

**Total Tasks**: 19
**User Stories**: 3 (P1: 9 tasks, P2: 4 tasks, P3: 3 tasks)
**Parallelizable Tasks**: 7

**🎯 MVP Scope**: Phase 1 + Phase 2 = 12 tasks
**Post-MVP**: Phase 3 + Phase 4 = 7 tasks

---

## Phase 1: Setup & Infrastructure

### Prerequisites

- [ ] T001 Verify shadcn/ui components installed (form, input, textarea, button, sonner)
- [ ] T002 [P] Add Sonner Toaster to src/main.tsx root layout
- [ ] T003 [P] Create feature directory structure src/components/features/salesContactForm/

**Phase 1 Completion Criteria**: Directory structure exists, Sonner configured, shadcn/ui components available

---

## Phase 2: User Story 1 - Lead Contact Submission (Priority: P1)

**Goal**: Core MVP - User can submit contact form with validation and success feedback

**Independent Test**: Navigate to `/sales`, fill all fields, click "Absenden". Success toast appears, form resets.

### Implementation Tasks

- [ ] T004 [P] [US1] Create Zod validation schema in src/components/features/salesContactForm/sales-contact-form.tsx (Region 2: Constants)
- [ ] T005 [P] [US1] Create German translations file src/components/features/salesContactForm/i18n/locales/de.json
- [ ] T006 [P] [US1] Implement mock submission handler function in src/components/features/salesContactForm/sales-contact-form.tsx (Region 4: Helper Functions)
- [ ] T007 [US1] Implement SalesContactForm component with 7 Regions Pattern in src/components/features/salesContactForm/sales-contact-form.tsx
- [ ] T008 [US1] Configure useForm hook with zodResolver and onBlur mode in src/components/features/salesContactForm/sales-contact-form.tsx (Region 3: Hooks)
- [ ] T009 [US1] Implement form JSX with Form, Input, Textarea, Button components in src/components/features/salesContactForm/sales-contact-form.tsx (Region 7: JSX)
- [ ] T010 [US1] Implement submission handler with toast.success and form reset in src/components/features/salesContactForm/sales-contact-form.tsx (Region 6: Event Handlers)
- [ ] T011 [US1] Create barrel export file src/components/features/salesContactForm/sales-contact-form.ts
- [ ] T012 [US1] Integrate SalesContactForm into src/pages/Sales.tsx

**Acceptance Criteria**:
1. ✅ User fills all required fields (Name, Email, Nachricht) → Click "Absenden" → Success toast "Vielen Dank! Wir melden uns in Kürze." appears
2. ✅ After success toast → Form resets (all fields empty)
3. ✅ Console shows submitted data (mock handler)

**Phase 2 Completion Criteria**: US1 acceptance scenarios pass, form submits successfully with mock handler

---

## 🎯 MVP DELIVERY COMPLETE AFTER PHASE 2

**Deliverables**:
- ✅ Working contact form with Name, Email, Phone, Message fields
- ✅ Mock submission handler (console.log)
- ✅ Success toast notification (4s auto-dismiss)
- ✅ Form reset after successful submission
- ✅ Basic Zod validation (required fields)
- ✅ Component integrated in Sales page

**What's NOT in MVP** (Post-MVP enhancements):
- ❌ Real-time validation feedback on blur (Phase 3)
- ❌ Phone auto-formatting (Phase 3)
- ❌ Character counter for message field (Phase 3)
- ❌ Error toast for network failures (Phase 3)
- ❌ Loading state during submission (Phase 4)
- ❌ Double-submission prevention (Phase 4)

**MVP Test**: Navigate to `/sales`, fill form, click "Absenden" → Success toast appears, form resets, console shows data.

---

## Phase 3: User Story 2 - Client-Side Validation (Priority: P2) [POST-MVP]

**Goal**: Improve UX with immediate validation feedback

**Independent Test**: Enter invalid email `test@`, blur field. Error "Bitte gültige Email-Adresse eingeben" appears.

### Implementation Tasks

- [ ] T013 [P] [US2] Add phone auto-formatting helper function formatPhoneNumber in src/components/features/salesContactForm/sales-contact-form.tsx (Region 4: Helper Functions)
- [ ] T014 [US2] Wrap phone field with Controller component for auto-formatting in src/components/features/salesContactForm/sales-contact-form.tsx (Region 7: JSX)
- [ ] T015 [P] [US2] Add character counter for message field using watch() in src/components/features/salesContactForm/sales-contact-form.tsx (Region 3: Hooks + Region 7: JSX)
- [ ] T016 [US2] Add error handling with toast.error for network failures in src/components/features/salesContactForm/sales-contact-form.tsx (Region 6: Event Handlers)

**Acceptance Criteria**:
1. ✅ User enters invalid email `test@` → Blur field → Error "Bitte gültige Email-Adresse eingeben" appears within 100ms
2. ✅ User leaves Name field empty → Click "Absenden" → Error "Dieses Feld ist erforderlich" appears
3. ✅ Phone field shows auto-formatting (spaces every 3 digits) in real-time
4. ✅ Message field shows character counter "X / 500 Zeichen"

**Phase 3 Completion Criteria**: All validation errors display correctly, phone formatting works, character counter visible

---

## Phase 4: User Story 3 - Loading State During Submission (Priority: P3) [POST-MVP]

**Goal**: Prevent double-submissions with visual feedback

**Independent Test**: Fill form, click "Absenden". Button shows "Wird gesendet..." and is disabled during submission.

### Implementation Tasks

- [ ] T017 [P] [US3] Add isSubmitting check to Button component in src/components/features/salesContactForm/sales-contact-form.tsx (Region 7: JSX)
- [ ] T018 [US3] Update Button text based on isSubmitting state in src/components/features/salesContactForm/sales-contact-form.tsx (Region 7: JSX)
- [ ] T019 [US3] Verify 800ms artificial delay in mock handler for testing in src/components/features/salesContactForm/sales-contact-form.tsx (Region 4: Helper Functions)

**Acceptance Criteria**:
1. ✅ User clicks "Absenden" → Button text changes to "Wird gesendet..." and button is disabled
2. ✅ After submission completes → Button re-enables with text "Absenden"

**Phase 4 Completion Criteria**: Loading state works, double-submissions prevented

---

## Dependencies & Execution Order

### User Story Dependencies

```
Phase 1 (Setup) → MUST complete before all user stories
Phase 2 (US1 - P1) → MUST complete before Phase 3 and Phase 4
Phase 3 (US2 - P2) → Can start after Phase 2
Phase 4 (US3 - P3) → Can start after Phase 2
```

**Critical Path**: Phase 1 → Phase 2 (US1)

**Parallel Opportunities**:
- Phase 3 (US2) and Phase 4 (US3) can be implemented in parallel after Phase 2 completes
- Within Phase 1: T002 (Sonner) and T003 (directory) are independent
- Within Phase 2: T004 (Zod schema), T005 (translations), T006 (mock handler) are independent

---

## Implementation Strategy

### MVP Delivery (Phase 1 + Phase 2 only)

**Scope**: User Story 1 (P1) - 8 implementation tasks
**Delivers**: Core lead contact form with mock submission and success feedback
**Timeline**: Shortest path to working feature

**Post-MVP Enhancements**:
- Phase 3 (US2): Validation improvements + phone formatting + character counter
- Phase 4 (US3): Loading state and double-submission prevention

### Incremental Testing

After each phase:
1. Run `tsc --noEmit` to verify TypeScript compilation
2. Test acceptance scenarios manually via chrome-devtools
3. Verify responsive design (mobile + desktop)
4. Check console for submitted data (mock handler)

---

## File Checklist

**Files Created** (9 files):
- [ ] src/components/features/salesContactForm/sales-contact-form.tsx (main component)
- [ ] src/components/features/salesContactForm/sales-contact-form.ts (barrel export)
- [ ] src/components/features/salesContactForm/i18n/locales/de.json (translations)

**Files Modified** (2 files):
- [ ] src/main.tsx (add Toaster)
- [ ] src/pages/Sales.tsx (integrate component)

---

## Success Criteria (from spec.md)

- **SC-001**: User kann Formular in unter 60 Sekunden ausfüllen und absenden ✅
- **SC-002**: Validierungsfehler erscheinen innerhalb 100ms nach Field-Blur ✅
- **SC-003**: 95% der Submissions mit gültigen Daten sind erfolgreich (keine Tech-Errors) ✅
- **SC-004**: Formular ist responsive und funktioniert auf Mobile/Desktop gleich gut ✅

---

## Next Steps After Implementation

1. **Coder Agent**: Implement tasks in order (Phase 1 → Phase 2 → Phase 3 → Phase 4)
2. **Self-Check**: Run `tsc --noEmit` after each phase
3. **Reviewer Agent**: Quality check with chrome-devtools MCP
4. **Database-Architect** (Phase 8a): Supabase integration (optional, post-MVP)

---

## Notes

- **Tests**: No automated tests requested in spec - manual testing via chrome-devtools (Reviewer agent)
- **7 Regions Pattern**: Enforced in constitution (§3.2) and explicitly required in spec
- **Mock Handler**: MVP uses console.log with 800ms delay, replaced in Phase 8a with Supabase
- **Parallelization**: 7 tasks marked [P] can run in parallel within their phase
- **Contract Files**: Located in specs/main/contracts/ for reference (not implementation tasks)

# Implementation Plan: Sales Contact Form

**Branch**: `001-sales-form` | **Date**: 2025-11-03 | **Spec**: [.specify/specs/001-sales-form/spec.md](.specify/specs/001-sales-form/spec.md)
**Input**: Feature specification from `.specify/specs/001-sales-form/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Lead contact form for sales page with client-side validation, auto-formatting phone input, and toast notifications. MVP uses mock submission handler (console.log), designed for later Supabase integration. Built with react-hook-form + Zod following 7 Regions Pattern. Embeds in existing Sales page component.

## Technical Context

**Language/Version**: TypeScript 5.x + React 18
**Primary Dependencies**: react-hook-form, Zod, shadcn/ui (Form, Input, Textarea, Button, Sonner), react-i18next
**Storage**: Mock handler (MVP), Supabase leads table (Phase 8a)
**Testing**: Manual chrome-devtools verification (Reviewer agent)
**Target Platform**: Web (Desktop + Mobile responsive)
**Project Type**: Web (single SPA)
**Performance Goals**: <100ms validation feedback on blur, <2.5s LCP, <60s form completion time
**Constraints**: Form reset post-submission, 500 char limit on message, phone auto-formatting, 4s toast duration
**Scale/Scope**: Single reusable component, 4 form fields, 3 user stories (P1-P3)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### §1.1 Core Technologies
✅ **PASS** - Using React 18, TypeScript, react-hook-form, Zod, shadcn/ui, react-i18next per constitution

### §1.2 Architecture Principles
✅ **PASS** - Named exports only, one component per file, @/ path aliases
- Component location: `src/components/features/salesContactForm/` (business logic → features/)

### §1.3 Directory Structure
✅ **PASS** - Features directory for business logic components (form submission, validation)

### §2.1 File Naming
✅ **PASS** - Files: `sales-contact-form.tsx`, `sales-contact-form.ts` (kebab-case)
✅ **PASS** - Exports: `SalesContactForm` (PascalCase named exports)

### §2.2 Interface Naming
✅ **PASS** - Will use: `SalesContactFormProps`, `SalesContactSchema` (entity), standard suffixes

### §3.2 Component Regions (7 Regions Pattern)
✅ **PASS** - Spec explicitly requires 7 Regions Pattern (§3.2 reference in spec.md)
- Region 1: Imports & Types
- Region 2: Constants (Zod schema, i18n keys)
- Region 3: Custom Hooks (useForm)
- Region 4: Helper Functions (formatPhone, handleSubmit)
- Region 5: Component Definition
- Region 6: Event Handlers
- Region 7: Render/JSX

### §4.1 State Management
✅ **PASS** - Component-local state with react-hook-form (< 3 components threshold met)
- Form state via `useForm` hook, no global state needed

### §5.1 Core Web Vitals
✅ **PASS** - Target: LCP <2.5s (specified in Technical Context)

### §5.3 Testing
✅ **PASS** - chrome-devtools MCP for performance testing (Reviewer agent)

### §6 Multi-Agent Workflow
✅ **PASS** - Following Planner → Coder → Reviewer → Database-Architect workflow

### §7.1 Translation Pattern
✅ **PASS** - Feature-co-located translations: `src/components/features/salesContactForm/i18n/locales/de.json`

**Result**: ALL GATES PASSED - Proceed to Phase 0 (Research)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── base/                                    # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── (sonner configured in main.tsx)
│   ├── blocks/                                  # Reusable UI (not used for this feature)
│   └── features/
│       └── salesContactForm/                    # THIS FEATURE
│           ├── sales-contact-form.tsx           # Main component (7 Regions)
│           ├── sales-contact-form.ts            # Barrel export
│           └── i18n/
│               └── locales/
│                   └── de.json                  # Form-specific translations
├── pages/
│   └── Sales.tsx                                # Integration point
├── shared/
│   ├── i18n/
│   │   ├── config.ts                           # Merges all translations
│   │   └── locales/de.json                     # Common translations
│   ├── lib/
│   │   └── utils.ts                            # cn() from tailwind-merge
│   └── hooks/                                  # Shared hooks (if needed)
└── main.tsx                                    # Sonner <Toaster /> integration
```

**Structure Decision**: Web SPA with Feature-Sliced Design. Sales Contact Form is a feature component (business logic + future DB access) located in `src/components/features/salesContactForm/`. Integrates into existing `src/pages/Sales.tsx` without routing changes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitution violations. All gates passed.

---

## Phase 0: Research (Complete)

**Generated**: [research.md](./research.md)

**Research Items Completed**: 7
1. ✅ Phone auto-formatting implementation pattern (regex, no library)
2. ✅ Sonner toast integration pattern (root layout + functional API)
3. ✅ Form reset strategy (useForm reset() method)
4. ✅ Validation timing (onBlur mode for balance)
5. ✅ Zod schema for optional phone field (no pattern validation)
6. ✅ Character counter for message field (watch() API)
7. ✅ Loading state implementation (isSubmitting from formState)

**Key Decisions**:
- No external libraries for phone formatting (minimal bundle)
- Sonner `<Toaster />` in main.tsx (single instance app-wide)
- Validation on blur for better UX (FR-001, SC-002)
- Optional phone field with cosmetic-only formatting

---

## Phase 1: Design & Contracts (Complete)

### Generated Artifacts

**[data-model.md](./data-model.md)**:
- Entity: `LeadContact` with 4 fields (name, email, telefon, nachricht)
- Zod schema: `salesContactSchema` with validation rules
- Future DB schema: `devKit.leads` table with RLS policies
- TypeScript types: `SalesContactFormData` interface

**[contracts/](./contracts/)**:
- [mock-submission.ts](./contracts/mock-submission.ts): MVP submission handler (console.log, 800ms delay)
- [supabase-integration.ts](./contracts/supabase-integration.ts): Phase 8a database integration contract

**[quickstart.md](./quickstart.md)**:
- Integration scenarios (3 patterns: dedicated section, hero, modal)
- 5 test scenarios (submission, validation, formatting, counter, responsive)
- Troubleshooting guide
- Migration plan to Supabase

### Constitution Re-Check (Post-Design)

✅ **ALL GATES STILL PASSING** - No design decisions violate constitution

**Confirmed**:
- ✅ §1.1: Using react-hook-form, Zod, shadcn/ui per spec
- ✅ §1.2: Named exports, single component file, @/ aliases
- ✅ §3.2: 7 Regions Pattern applied in design
- ✅ §4.1: Component-local state (useForm hook)
- ✅ §7.1: Feature-co-located translations

---

## Implementation Ready

**Status**: ✅ Plan phase complete, ready for `/speckit.tasks`

**Next Command**: `/speckit.tasks @specs/main/spec.md`

**Generated Files**:
- [x] plan.md (this file)
- [x] research.md (Phase 0)
- [x] data-model.md (Phase 1)
- [x] contracts/mock-submission.ts (Phase 1)
- [x] contracts/supabase-integration.ts (Phase 1)
- [x] quickstart.md (Phase 1)

**Pending**:
- [ ] tasks.md (Phase 2 - generated by /speckit.tasks)
- [ ] Agent context update (Phase 1 - run update-agent-context.ps1)

# Implementation Plan: PACON Real Estate Company Website

**Branch**: `001-pacon-re` | **Date**: 2025-11-07 | **Spec**: [/home/eriks/devkit-base/.specify/specs/001-pacon-re/spec.md](/home/eriks/devkit-base/.specify/specs/001-pacon-re/spec.md)
**Input**: Feature specification from `.specify/specs/001-pacon-re/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a frontend-only marketing website for PACON Real Estate facility management company to attract potential employees and customers. The site features 4 main pages (Landing, Sales, About, Career) with comprehensive content sections, two forms (sales contact, career application), and full mobile responsiveness. Implementation uses React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui with feature-colocated i18n infrastructure (German initially). Forms submit to email endpoints; no database persistence in this phase.

## Technical Context

**Language/Version**: TypeScript 5.x + React 18
**Primary Dependencies**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, react-router-dom, react-i18next, react-hook-form, Zod
**Storage**: N/A (frontend-only marketing site; forms submit to email endpoints)
**Testing**: NEEDS CLARIFICATION (testing strategy not specified in feature spec)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: Single web application (frontend-only)
**Performance Goals**:
  - Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
  - Lighthouse performance score ≥90/100
  - Page load <3 seconds on standard broadband connection
  - Progressive image loading without layout shift
**Constraints**:
  - Must follow PACON brand guidelines (Light: bg #faf8f5, primary #a63631 / Dark: bg #2a2a29, primary #b13d38)
  - Typography: Poppins (headings), Lora (body text) with fallbacks
  - Mobile-first responsive design (minimum 320px viewport width)
  - German language initially with i18n infrastructure for future expansion
  - Frontend-only (no backend APIs or database in this phase)
  - Bottom sheet pattern for mobile overflow content
**Scale/Scope**:
  - 4 main pages (Main Landing, Sales, About, Career)
  - ~20 content sections total across all pages
  - 2 forms (Sales contact form with 7 fields, Career application form with 6 fields + CV upload)
  - Dynamic content: Job listings (filterable by location), Team profiles, Customer logos, Project galleries, Testimonials

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1: Tech Stack & Architecture (Section 1)

**Required Technologies** (Constitution 1.1):
- ✅ React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui - Present in spec
- ✅ react-router-dom + react-i18next + react-hook-form + Zod - Present in spec
- ⚠️ Supabase - Constitution requires it, but spec explicitly states "No database persistence in this phase, forms submit to email endpoints"
- **RESOLUTION**: Supabase omitted for MVP phase (forms → email). Database integration deferred to future phase if needed.

**Architecture Principles** (Constitution 1.2):
- ✅ Feature-Sliced Design (base/ → blocks/ → features/) - Will be followed
- ✅ Named Exports Only - Specified in spec constraints (FR-279)
- ✅ One Component Per File - Will be followed
- ✅ Path Aliases (@/ → src/) - Already configured in project

**Directory Structure** (Constitution 1.3):
- ✅ Compliant with src/ structure (base/, blocks/, features/, pages/, shared/)

**Status**: ✅ PASS (with documented Supabase deferral)

---

### Gate 2: Naming Conventions (Section 2)

**File Naming** (Constitution 2.1):
- ✅ kebab-case.tsx - Specified in spec constraints (FR-279)
- ✅ Named exports only - Specified in spec constraints (FR-278)

**Interface Naming** (Constitution 2.2):
- ✅ ComponentNameProps, FunctionNameParams, EntityItem - Specified in spec constraints (FR-279)

**Status**: ✅ PASS

---

### Gate 3: Component Structure (Section 3)

**Decision Point**: [TO BE DEFINED IN /specify per feature]

**Import Organization** (Constitution 3.1):
- Decision deferred to Phase 1: Will use 7-region pattern from .claude/agents/coder.md

**Component Regions** (Constitution 3.2):
- Decision deferred to Phase 1: Will use 7-region pattern (Hooks, Translations, Data Loading, Early Returns, Computed Data, Event Handlers, Effects)

**Status**: ⏳ DEFERRED TO PHASE 1

---

### Gate 4: State Management (Section 4)

**Decision Point**: [TO BE DEFINED IN /specify per feature]

**State Management Strategy** (Constitution 4.1):
- Decision deferred to Phase 1 based on decision tree:
  1. Component-local (useState) - For <3 components
  2. URL State (Search Params) - For shareable filters (e.g., Career page location filter)
  3. Persistent (localStorage) - For theme toggle
  4. Feature-scoped (Context) - For 3+ components in feature
  5. Server State (TanStack Query) - Not applicable (no backend)
  6. Global (Zustand) - For theme, potentially form state

**Status**: ⏳ DEFERRED TO PHASE 1 (will be justified per component/feature)

---

### Gate 5: Performance Targets (Section 5)

**Core Web Vitals** (Constitution 5.1):
- ✅ LCP <2.5s - Specified in spec (SC-005, FR-045)
- ✅ FID <100ms - Specified in spec (SC-005, FR-045)
- ✅ CLS <0.1 - Specified in spec (SC-005, FR-045)
- ✅ Lighthouse ≥90/100 - Specified in spec (SC-010)

**Optimization Thresholds** (Constitution 5.2):
- Decision deferred to Phase 1: Will use guidelines from .claude/agents/reviewer.md
- Above-the-fold mandatory optimizations: Hero sections, Navigation, CTAs
- Below-the-fold based on measured performance

**Testing** (Constitution 5.3):
- ✅ Chrome DevTools MCP (chrome-devtools) available for performance testing

**Status**: ✅ PASS (optimization thresholds deferred to Phase 1)

---

### Gate 6: Multi-Agent Workflow (Section 6)

**Workflow Compliance** (Constitution 6.1-6.2):
- ✅ Orchestrator (CLAUDE.md) coordinates all agents
- ✅ Specialized agents available: Planner, Coder, Reviewer, Database-Architect
- ✅ Workflow: Planner → Coder → Reviewer → Database-Architect (if needed)

**Review Standards** (Constitution 6.3):
- ✅ Three-tier system: APPROVED (with fixes) / CHANGES REQUESTED / APPROVED AS-IS

**Status**: ✅ PASS

---

### Gate 7: Internationalization (Section 7)

**Translation Pattern** (Constitution 7.1):
- ✅ Feature-co-located translations with global merge - Specified in spec (FR-051, FR-280)
- ✅ Structure: pages/i18n/locales/de.json + features/i18n/locales/de.json + shared/i18n/
- ✅ Usage: useTranslation() hook with flat merged object
- ✅ Initial content in German with infrastructure for future expansion

**Status**: ✅ PASS

---

### Gate 8: Refactoring Principles (Section 8)

**Bottom-Up Approach** (Constitution 8.1):
- ✅ Will be followed: Start from leaf components (no dependencies) moving upward

**Status**: ✅ PASS

---

### Overall Constitution Compliance

**PASS**: ✅ All non-negotiable gates passed with documented decisions
**DEFERRED**: Component structure and state management patterns (resolved in Phase 1)
**CLARIFICATION NEEDED**: Testing strategy (not specified in feature spec)

---

## Post-Phase-1 Re-evaluation

**Date**: 2025-11-07 | **Status**: After Phase 1 (Design & Contracts) completion

### Resolved Decisions

**Component Structure (Gate 3)**:
- ✅ Import organization: 7-region pattern documented in quickstart.md
- ✅ Component regions: 7-region pattern (Hooks, Translations, Data Loading, Early Returns, Computed Data, Event Handlers, Effects)
- **Status**: RESOLVED

**State Management (Gate 4)**:
- ✅ Form state: Component-local (useState) - justified in data-model.md
- ✅ Job filter: URL State (Search Params) - shareable, bookmarkable
- ✅ Theme: Persistent (localStorage) + Global (Zustand) - cross-page preference
- ✅ Static content: Component-local (mock data imports)
- ✅ Duplicate detection: Persistent (localStorage) - 24h window
- **Status**: RESOLVED with justifications per constitution Section 4.1

**Testing Strategy (Technical Context clarification)**:
- ✅ Manual testing against acceptance scenarios
- ✅ Performance testing via Chrome DevTools MCP (mandatory per constitution)
- ✅ Cross-browser and responsive testing
- ✅ Automated testing deferred to post-MVP
- **Status**: RESOLVED in research.md

### Updated Constitution Compliance

All gates now fully resolved:

| Gate | Status | Notes |
|------|--------|-------|
| Gate 1: Tech Stack | ✅ PASS | All technologies present, Supabase deferral documented |
| Gate 2: Naming | ✅ PASS | kebab-case, named exports, ComponentNameProps |
| Gate 3: Component Structure | ✅ PASS | 7-region pattern documented |
| Gate 4: State Management | ✅ PASS | Decisions justified per constitution hierarchy |
| Gate 5: Performance | ✅ PASS | Core Web Vitals + Lighthouse targets set |
| Gate 6: Multi-Agent Workflow | ✅ PASS | Planner → Coder → Reviewer → Database-Architect |
| Gate 7: i18n | ✅ PASS | Feature-colocated with global merge |
| Gate 8: Refactoring | ✅ PASS | Bottom-up approach documented |

**Overall Status**: ✅ FULL COMPLIANCE - Ready for Phase 2 (tasks.md generation)

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
│   ├── base/              # shadcn/ui primitives (Button, Sheet, Dialog, etc.)
│   ├── blocks/            # Reusable UI blocks (no business logic)
│   │   ├── hero-section/
│   │   ├── service-card/
│   │   ├── team-profile/
│   │   ├── testimonial-slider/
│   │   ├── job-listing/
│   │   ├── customer-logo-wall/
│   │   ├── project-gallery/
│   │   └── cta-card/
│   └── features/          # Business logic features
│       ├── contact-form/  # Sales contact form (react-hook-form + Zod)
│       │   └── i18n/locales/de.json
│       ├── application-form/  # Career application form (with CV upload)
│       │   └── i18n/locales/de.json
│       ├── job-filter/    # Location-based job filtering
│       │   └── i18n/locales/de.json
│       └── theme-toggle/  # Dark/light mode switcher
│           └── i18n/locales/de.json
├── pages/
│   ├── Main.tsx           # Landing page (Hero + sections)
│   ├── Sales.tsx          # Sales page (Services + contact form)
│   ├── About.tsx          # About page (Mission + values + references)
│   ├── Career.tsx         # Career page (Jobs + team + application)
│   └── i18n/locales/de.json  # Page-specific translations
├── shared/
│   ├── i18n/
│   │   ├── config.ts      # i18next setup + merge all translations
│   │   └── locales/de.json  # Common translations
│   ├── lib/
│   │   ├── cn.ts          # Tailwind merge utility
│   │   └── form-validation.ts  # Shared Zod schemas
│   └── hooks/
│       └── use-bottom-sheet.ts  # Mobile bottom sheet pattern
└── main.tsx               # Entry point + routing

public/
├── assets/
│   ├── logos/             # Customer logos
│   ├── projects/          # Project gallery images
│   ├── team/              # Team member photos
│   └── certifications/    # ISO badges, GEFMA, VDI
└── fonts/                 # Poppins, Lora fonts
```

**Structure Decision**: Single web application (Option 1) adapted for React. This is a frontend-only marketing website with no backend or mobile components. Following Feature-Sliced Design: base/ (primitives) → blocks/ (reusable UI) → features/ (business logic). Pages handle routing and composition. No tests/ directory in this phase as testing strategy not specified.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations detected. Supabase deferral is intentional per spec requirements (forms → email endpoints for MVP). All other architecture decisions align with constitution requirements.

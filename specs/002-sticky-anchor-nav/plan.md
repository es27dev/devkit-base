# Implementation Plan: Sticky Anchor Navigation

**Branch**: `002-sticky-anchor-nav` | **Date**: 2025-11-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-sticky-anchor-nav/spec.md`

## Summary

Implement sticky header with horizontal anchor navigation that highlights the active section as users scroll. Desktop shows anchors below main menu; mobile integrates anchors into navigation sheet. Uses CSS `position: sticky` for header, Intersection Observer API for active section detection, and Tailwind responsive utilities for mobile/desktop switching.

## Technical Context

**Language/Version**: TypeScript (React 18)
**Primary Dependencies**: React 18, React Router v6, Tailwind CSS, shadcn/ui, react-i18next
**Storage**: N/A (client-side only, no persistence)
**Testing**: TypeScript type checking (`tsc --noEmit`), Chrome DevTools Performance profiling
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge 2025+)
**Project Type**: Web application (React SPA)
**Performance Goals**:
- Active section update < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- No scroll jank (maintain 60fps during scroll)
**Constraints**:
- Desktop: ≥768px viewport width
- Mobile: <768px viewport width
- Sticky header must not break parent layout
- Intersection Observer API required (all modern browsers support)
**Scale/Scope**:
- 4-8 anchor links per page typical
- 3-5 pages with anchor navigation initially (About, Career, Sales)
- Multiple sections per page (5-10 sections typical)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Tech Stack & Architecture (Non-Negotiable)

- ✅ React 18 + TypeScript: Used
- ✅ Tailwind CSS: Used for responsive utilities (`hidden md:block`)
- ✅ shadcn/ui: SheetClose for mobile navigation
- ✅ react-router-dom: Outlet Context for page config
- ✅ react-i18next: Optional i18nKey in anchor config
- ✅ Named Exports Only: All new components use named exports
- ✅ One Component Per File: Each component in separate file
- ✅ Path Aliases: `@/` used throughout

### ✅ Naming Conventions (Non-Negotiable)

- ✅ Files: `kebab-case.tsx` (e.g., `anchor-links.tsx`)
- ✅ Component Props: `AnchorLinksProps`, `NavigationHeaderProps`
- ✅ Hook Return Types: `UseScrollSpyReturn`
- ✅ Data Entities: `PageAnchorConfig` (entity + suffix pattern)

### ✅ Component Structure (Framework)

- ✅ Feature-Sliced Design: `blocks/anchor-links/`, `hooks/use-scroll-spy.ts`
- ✅ Component Organization: Follows 7-region pattern where applicable
- ✅ i18n Pattern: Translations colocated in `pages/i18n/locales/de.json`, merged globally

### ✅ State Management (Decision Tree)

**Decision**: Component-local + Custom Hook (Level 1 + 4)

**Justification**:
- Active section state: Component-local (`useState` in page component)
- Scroll observation: Custom hook (`useScrollSpy`) - reusable across pages
- Page anchor config: React Router Outlet Context (page-to-layout communication)
- No global state needed (anchors are page-specific)
- No server state needed (client-side only)

**Complies with**: Constitution Section 4.1 decision hierarchy

### ✅ Performance Targets (Non-Negotiable)

- ✅ CLS < 0.1: CSS `position: sticky` maintains document flow
- ✅ LCP < 2.5s: No impact (UI enhancement only)
- ✅ FID < 100ms: Intersection Observer runs off main thread

**Optimization Approach**:
- ✅ Intersection Observer: Off-thread, no scroll event listeners
- ✅ CSS-first responsive: Zero JS cost for visibility toggles
- ✅ No useMemo/useCallback needed: Minimal re-renders, simple state updates

### ✅ Multi-Agent Workflow (Non-Negotiable)

**Planned Workflow**:
1. ✅ Planner: Research + plan (completed by this command)
2. Coder: Implement components with mock data
3. Reviewer: Quality check + performance validation
4. Database-Architect: Not needed (no database integration)

**Complies with**: Constitution Section 6.2 UI Development Flow

### ✅ Summary

**All gates passed** ✅

No constitution violations. Feature follows all naming conventions, architecture principles, and state management patterns. Complexity is appropriate for requirements.

## Project Structure

### Documentation (this feature)

```text
specs/002-sticky-anchor-nav/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (technology decisions)
├── data-model.md        # Phase 1 output (entities & interfaces)
├── quickstart.md        # Phase 1 output (implementation guide)
├── contracts/           # Phase 1 output (TypeScript interfaces)
│   └── typescript-interfaces.ts
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT YET CREATED)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── base/
│   │   └── navbar/
│   │       ├── navbar.tsx                # MODIFIED: Add sticky positioning
│   │       └── navigation-sheet.tsx      # MODIFIED: Add anchor links
│   └── blocks/
│       └── anchor-links/                 # NEW
│           └── anchor-links.tsx          # NEW: Horizontal anchor navigation
├── pages/
│   ├── About.tsx                         # MODIFIED: Add anchor config
│   ├── Career.tsx                        # MODIFIED: Add anchor config
│   ├── Sales.tsx                         # OPTIONAL: Add anchor config
│   └── i18n/
│       └── locales/
│           └── de.json                   # MODIFIED: Add navigation translations
├── shared/
│   ├── hooks/
│   │   └── use-scroll-spy.ts            # NEW: Active section detection
│   └── types/
│       └── page-config.ts                # NEW: TypeScript interfaces
└── App.tsx                               # MODIFIED: Add Outlet Context (optional)
```

**Structure Decision**: Single React web application (Option 1). All code resides in `src/` with standard React + TypeScript structure. Feature follows existing Feature-Sliced Design pattern (`base/` → `blocks/` → `pages/`).

## Complexity Tracking

**No violations detected**. This section is not applicable as all constitution checks passed.

---

## Phase 0: Research Summary

**Status**: ✅ Complete

All research tasks completed and consolidated in `research.md`:

1. ✅ Sticky Header Implementation - CSS `position: sticky` with `scroll-margin-top`
2. ✅ Scroll Spy (Active Section Detection) - Intersection Observer API with dynamic threshold
3. ✅ Responsive Navigation - CSS-first with Tailwind `hidden md:block`
4. ✅ Page Configuration Pattern - React Router Outlet Context

**Key Decisions**:
- Sticky header: CSS native, zero CLS impact
- Active detection: Intersection Observer (off-thread, <100ms)
- Mobile responsive: CSS classes + shadcn/ui SheetClose
- Page config: Outlet Context (type-safe, auto-reset)

---

## Phase 1: Design & Contracts

**Status**: ✅ Complete

All design artifacts generated:

1. ✅ `data-model.md` - Entities, interfaces, state transitions
2. ✅ `contracts/typescript-interfaces.ts` - TypeScript interface definitions
3. ✅ `quickstart.md` - Implementation guide with code examples

**Key Entities**:
- `PageAnchorConfig` - Single anchor link configuration
- `PageLayoutContext` - Outlet context object
- `ActiveSectionState` - Runtime scroll position tracking

**No database integration required** - client-side only feature.

---

## Next Steps

1. Run `/speckit.tasks` to generate implementation tasks from this plan
2. Use coder agent to implement components
3. Use reviewer agent to validate quality and performance
4. Test against success criteria in spec.md

**Files ready for implementation**:
- `specs/002-sticky-anchor-nav/quickstart.md` - Step-by-step guide
- `specs/002-sticky-anchor-nav/contracts/typescript-interfaces.ts` - Copy to `src/shared/types/page-config.ts`
- `specs/002-sticky-anchor-nav/research.md` - Technical decisions reference

---

## Agent Context Update

Agent context will be updated after plan completion to include:
- Intersection Observer API usage pattern
- React Router Outlet Context pattern
- Tailwind responsive utilities pattern
- shadcn/ui Sheet integration pattern

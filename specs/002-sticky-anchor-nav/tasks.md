# Tasks: Sticky Anchor Navigation

**Input**: Design documents from `/specs/002-sticky-anchor-nav/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in specification - no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US3, US2, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- Single React web application
- All source code in `src/`
- Project root: `/home/eriks/devkit-base/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and type definitions

- [ ] T001 [P] Create TypeScript interfaces file in src/shared/types/page-config.ts (copy from contracts/typescript-interfaces.ts)
- [ ] T002 [P] Create anchor-links component directory at src/components/blocks/anchor-links/
- [ ] T003 [P] Create use-scroll-spy hook file at src/shared/hooks/use-scroll-spy.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Update navbar to use sticky positioning in src/components/base/navbar/navbar.tsx (change from relative to sticky, add z-50)
- [ ] T005 [P] Add scroll-margin-top utility classes to existing About page sections in src/pages/About.tsx (add scroll-mt-24 to all section elements)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Quick Section Navigation (Priority: P1) 🎯 MVP

**Goal**: Users can click anchor links to smoothly scroll to page sections with URL hash updates

**Independent Test**: Click any anchor link → page scrolls smoothly to section → URL updates with hash (e.g., #mission)

### Implementation for User Story 1

- [ ] T006 [P] [US1] Create AnchorLinks component in src/components/blocks/anchor-links/anchor-links.tsx (horizontal navigation, smooth scroll on click, URL hash update)
- [ ] T007 [P] [US1] Add anchor configuration to About page in src/pages/About.tsx (define anchors array, render AnchorLinks above page content)
- [ ] T008 [US1] Implement smooth scroll to section on hash in URL in src/shared/hooks/use-anchor-scroll.ts (detect hash on page load, scroll to section if hash exists)

**Checkpoint**: At this point, clicking anchor links scrolls to sections and updates URL. Opening URL with hash scrolls to correct section.

---

## Phase 4: User Story 3 - Persistent Navigation Access (Priority: P1)

**Goal**: Header with anchor navigation remains visible when scrolling (sticky behavior)

**Independent Test**: Scroll down page → header stays at top → anchor links remain accessible

### Implementation for User Story 3

- [ ] T009 [US3] Verify sticky header behavior in src/components/base/navbar/navbar.tsx (ensure sticky class works, test scroll performance, verify no layout shift)
- [ ] T010 [US3] Add anchor navigation below main menu in src/components/base/navbar/navbar.tsx (integrate AnchorLinks component below existing nav menu, conditional rendering if anchors exist)

**Checkpoint**: Header remains sticky while scrolling. Anchor navigation accessible at all scroll positions.

---

## Phase 5: User Story 2 - Visual Scroll Position Feedback (Priority: P2)

**Goal**: Active section is highlighted in Pacon red as user scrolls through page

**Independent Test**: Scroll through page → anchor link for current section highlights in red → changes as you enter new sections

### Implementation for User Story 2

- [ ] T011 [US2] Implement useScrollSpy hook in src/shared/hooks/use-scroll-spy.ts (Intersection Observer with dynamic threshold, rootMargin config, return active section ID)
- [ ] T012 [US2] Add active state highlighting to AnchorLinks in src/components/blocks/anchor-links/anchor-links.tsx (accept activeId prop, apply Pacon red color text-[#C41E3A] to active link)
- [ ] T013 [US2] Integrate useScrollSpy in About page in src/pages/About.tsx (call useScrollSpy with section IDs, pass activeSectionId to AnchorLinks)

**Checkpoint**: Scrolling highlights correct anchor link. Active state updates within 100ms (feels instant).

---

## Phase 6: User Story 4 - Page-Specific Anchors (Priority: P2)

**Goal**: Different pages can define their own anchor links (Career, Sales have different anchors than About)

**Independent Test**: Navigate between About and Career → anchor links change to match page → no stale links displayed

### Implementation for User Story 4

- [ ] T014 [P] [US4] Add anchor configuration to Career page in src/pages/Career.tsx (define Career-specific anchors, add scroll-mt-24 to sections, integrate AnchorLinks and useScrollSpy)
- [ ] T015 [P] [US4] Add anchor configuration to Sales page in src/pages/Sales.tsx (define Sales-specific anchors, add scroll-mt-24 to sections, integrate AnchorLinks and useScrollSpy)
- [ ] T016 [US4] Add translation keys for anchor navigation in src/pages/i18n/locales/de.json (about.navigation.*, career.navigation.*, sales.navigation.*)

**Checkpoint**: Each page shows its own anchor links. Navigating between pages updates anchors correctly.

---

## Phase 7: User Story 5 - Mobile Navigation Integration (Priority: P2)

**Goal**: On mobile (<768px), anchor navigation hidden in header and shown in navigation sheet instead

**Independent Test**: Resize to mobile → anchors hidden in header → open sheet → anchors visible → click anchor → sheet closes and scrolls to section

### Implementation for User Story 5

- [ ] T017 [US5] Hide anchor navigation on mobile in src/components/blocks/anchor-links/anchor-links.tsx (wrap with hidden md:block Tailwind classes)
- [ ] T018 [US5] Add anchor links to mobile navigation sheet in src/components/base/navbar/navigation-sheet.tsx (accept anchors prop, render as vertical list, use SheetClose wrapper for auto-close)
- [ ] T019 [US5] Pass anchor configuration to navigation sheet in src/pages/About.tsx (pass anchors to navbar/sheet, ensure mobile sheet receives anchors)
- [ ] T020 [P] [US5] Pass anchor configuration to navigation sheet in src/pages/Career.tsx (pass anchors to navbar/sheet)
- [ ] T021 [P] [US5] Pass anchor configuration to navigation sheet in src/pages/Sales.tsx (pass anchors to navbar/sheet)

**Checkpoint**: Mobile hides header anchors, shows in sheet. Desktop shows header anchors. Responsive behavior works at 768px breakpoint.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T022 [P] Verify performance with Chrome DevTools (check CLS <0.1, no scroll jank, active state update <100ms)
- [ ] T023 [P] Test edge cases from spec (invalid hash in URL, short sections, fast scrolling, viewport resize)
- [ ] T024 [P] Run TypeScript type check with tsc --noEmit
- [ ] T025 Validate implementation against quickstart.md checklist (all acceptance scenarios from spec.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (P1) + US3 (P1): Can proceed in parallel after Phase 2
  - US2 (P2): Depends on US1 (needs AnchorLinks component)
  - US4 (P2): Depends on US1 (needs AnchorLinks component and useScrollSpy)
  - US5 (P2): Depends on US1 (needs AnchorLinks component)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 (needs AnchorLinks component to add highlighting)
- **User Story 4 (P2)**: Depends on US1 (needs AnchorLinks and useScrollSpy to work)
- **User Story 5 (P2)**: Depends on US1 (needs AnchorLinks to integrate into sheet)

### Within Each User Story

- US1: T006 and T007 can run in parallel, T008 after T007
- US2: T011 and T012 can run in parallel, T013 after both
- US3: T009 before T010 (verify then integrate)
- US4: T014, T015, T016 can all run in parallel
- US5: T017 before T018-021, then T019-021 can run in parallel

### Parallel Opportunities

- **Phase 1**: All Setup tasks (T001, T002, T003) can run in parallel
- **Phase 2**: T004 and T005 can run in parallel
- **Phase 3 + Phase 4**: US1 and US3 can run in parallel (both P1, no dependencies)
- **Phase 6**: T014, T015, T016 can run in parallel (different pages/files)
- **Phase 7**: T020 and T021 can run in parallel (different files)
- **Phase 8**: T022, T023, T024 can run in parallel

---

## Parallel Example: MVP (US1 + US3)

```bash
# After Phase 1 + 2 complete, launch US1 and US3 together:

# User Story 1 tasks:
Task T006: "Create AnchorLinks component in src/components/blocks/anchor-links/anchor-links.tsx"
Task T007: "Add anchor configuration to About page in src/pages/About.tsx"
# Then T008 after T007

# User Story 3 tasks (in parallel):
Task T009: "Verify sticky header behavior in src/components/base/navbar/navbar.tsx"
# Then T010 after T009
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 3 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T005) - CRITICAL
3. Complete Phase 3: User Story 1 (T006-T008)
4. Complete Phase 4: User Story 3 (T009-T010)
5. **STOP and VALIDATE**: Test clicking anchors + sticky header
6. Deploy/demo if ready

**This gives you**: Clickable anchor navigation with sticky header - core functionality working.

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 + US3 → Test independently → Deploy/Demo (MVP!)
3. Add US2 → Test scroll highlighting → Deploy/Demo
4. Add US4 → Test multiple pages → Deploy/Demo
5. Add US5 → Test mobile behavior → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers after Foundational phase:

1. **Developer A**: User Story 1 (T006-T008)
2. **Developer B**: User Story 3 (T009-T010) - in parallel with A
3. **After A+B complete**:
   - **Developer A**: User Story 2 (T011-T013)
   - **Developer B**: User Story 4 (T014-T016) - in parallel with A
4. **After above**: User Story 5 (T017-T021) - can split across devs
5. **All devs**: Polish phase together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **Priority**: P1 stories (US1, US3) before P2 stories (US2, US4, US5)
- **MVP Scope**: User Stories 1 + 3 = complete sticky anchor navigation
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 25
- Setup: 3 tasks
- Foundational: 2 tasks
- US1 (P1): 3 tasks
- US3 (P1): 2 tasks
- US2 (P2): 3 tasks
- US4 (P2): 3 tasks
- US5 (P2): 5 tasks
- Polish: 4 tasks

**Parallel Opportunities**: 12 tasks marked [P]

**MVP Scope**: Phase 1-4 (10 tasks) = Core sticky anchor navigation

**Independent Tests**:
- US1: Click anchor → smooth scroll + URL hash update
- US3: Scroll page → header stays sticky
- US2: Scroll page → active section highlights
- US4: Navigate pages → anchors change per page
- US5: Resize to mobile → anchors in sheet

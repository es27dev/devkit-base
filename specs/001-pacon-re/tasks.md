# Tasks: PACON Real Estate Company Website

**Input**: Design documents from `/specs/001-pacon-re/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Project structure from plan.md uses src/components/ structure

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Configure i18n infrastructure in src/shared/i18n/config.ts with react-i18next setup
- [X] T002 Create common translations file src/shared/i18n/locales/de.json for shared text
- [X] T003 [P] Setup PACON brand colors and dark mode configuration in tailwind.config.js
- [X] T004 [P] Create theme toggle feature component src/components/features/theme-toggle/theme-toggle.tsx
- [X] T005 [P] Create theme toggle translations src/components/features/theme-toggle/i18n/locales/de.json
- [X] T006 [P] Create form validation schemas in src/shared/lib/form-validation.ts with Zod
- [X] T007 [P] Create form submission service src/shared/services/form-submission.ts for FormSubmit.co integration
- [X] T008 [P] Create duplicate detection service src/shared/services/duplicate-detection.ts with localStorage
- [X] T009 [P] Create file upload service src/shared/services/file-upload.ts with base64 conversion
- [X] T010 [P] Create anchor scroll hook src/shared/hooks/use-anchor-scroll.ts for navigation
- [X] T011 [P] Create bottom sheet hook src/shared/hooks/use-bottom-sheet.ts for mobile overflow

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T012 [P] Create mock services data src/shared/data/mock-services.ts with 5 core services
- [X] T013 [P] Create mock customer logos data src/shared/data/mock-customers.ts with 8-12 logos
- [X] T014 [P] Create mock project references data src/shared/data/mock-projects.ts with 6-8 projects
- [X] T015 [P] Create mock testimonials data src/shared/data/mock-testimonials.ts for customer and employee quotes
- [X] T016 [P] Create mock job listings data src/shared/data/mock-jobs.ts with location-filterable positions
- [X] T017 [P] Create mock team profiles data src/shared/data/mock-team.ts with 6-10 member profiles
- [X] T018 [P] Create mock benefits data src/shared/data/mock-benefits.ts with 6+ employee benefits
- [X] T019 [P] Create mock news updates data src/shared/data/mock-news.ts with 3 company updates
- [X] T020 [P] Create mock certifications data src/shared/data/mock-certifications.ts with ISO badges
- [X] T021 [P] Create service card block component src/components/blocks/service-card/service-card.tsx
- [X] T022 [P] Create customer logo wall block component src/components/blocks/customer-logo-wall/customer-logo-wall.tsx
- [X] T023 [P] Create project gallery block component src/components/blocks/project-gallery/project-gallery.tsx
- [X] T024 [P] Create team profile block component src/components/blocks/team-profile/team-profile.tsx
- [X] T025 [P] Create CTA card block component src/components/blocks/cta-card/cta-card.tsx
- [X] T026 [P] Create hero section block component src/components/blocks/hero-section/hero-section.tsx with variants
- [X] T027 [P] Create testimonial slider block component src/components/blocks/testimonial-slider/testimonial-slider.tsx
- [X] T028 [P] Create job listing block component src/components/blocks/job-listing/job-listing.tsx

## Phase 3: User Story 1 - Main Landing Page (Priority: P1) 🎯 MVP

- [X] T029 [US1] Create landing page layout src/pages/Main.tsx with hero section (FR-001)
- [X] T030 [US1] Implement hero section with H1 "pacon Real Estate – Wir kümmern uns um die Technik" and dual CTAs (FR-001)
- [X] T031 [US1] Create "Unsere Kernleistungen" section with 5 service bullets and link to /about#leistungen (FR-002)
- [X] T032 [US1] Implement "Vertraut von bekannten Kunden" logo wall with link to /about#kunden (FR-003)
- [X] T033 [US1] Create "Regional stark vertreten" section with locations and link to /about#regionen (FR-004)
- [X] T034 [US1] Implement "Objektbilder und Projekte" gallery section with link to /about#referenzen (FR-005)
- [X] T035 [US1] Add optional "Unsere Mission" teaser with sustainability message (FR-006)
- [X] T036 [US1] Create three CTA cards at page end linking to /sales, /career, and /about (FR-007)
- [X] T037 [US1] Create landing page translations src/pages/i18n/locales/de.json with all content text
- [X] T038 [US1] Implement SEO meta tags for landing page with title and description (SC-012)
- [X] T039 [US1] Test all internal navigation links and anchor targets (FR-008)
- [X] T040 [US1] Optimize landing page for Core Web Vitals LCP <2.5s (SC-005)

## Phase 4: User Story 2 - Sales Lead Generation Page (Priority: P2)

- [X] T041 [US2] Create sales page layout src/pages/Sales.tsx with lead generation focus
- [X] T042 [US2] Implement sales hero section with H1 and three metrics display (FR-009)
- [X] T043 [US2] Create core services section displaying 5 services with descriptions (FR-010)
- [X] T044 [US2] Implement implementation process section with 3 phases and CTAs (FR-011)
- [X] T045 [US2] Create project gallery section showing 3-6 projects with impact statements (FR-012)
- [X] T046 [US2] Create contact form feature component src/components/features/contact-form/contact-form.tsx (FR-013)
- [X] T047 [US2] Implement contact form with 7 fields plus consent checkbox (FR-013 to FR-016)
- [X] T048 [US2] Add email format validation and required field validation to contact form (FR-015)
- [X] T049 [US2] Integrate FormSubmit.co submission with success confirmation message (FR-017)
- [X] T050 [US2] Display contact person details for Mario Unger-Faulhaber with contact info (FR-014)
- [X] T051 [US2] Add privacy notice "Keine Werbung. Keine Weitergabe an Dritte." (FR-018)
- [X] T052 [US2] Create contact form translations src/components/features/contact-form/i18n/locales/de.json
- [X] T053 [US2] Implement duplicate form submission detection with 24h window (FR-049)
- [X] T054 [US2] Add network error handling with retry button for form submissions (FR-047)
- [X] T055 [US2] Create two CTA cards at sales page end linking to /career and /about
- [X] T056 [US2] Implement SEO meta tags for sales page with conversion focus
- [ ] T057 [US2] Test complete form submission flow including error scenarios

## Phase 5: User Story 3 - Company Information & Trust Building (Priority: P3)

- [X] T058 [US3] Create about page layout src/pages/About.tsx with company information sections
- [X] T059 [US3] Implement page header with H1 "Über pacon Real Estate GmbH" and introduction (FR-019)
- [X] T060 [US3] Create internal anchor navigation for 8 sections (mission, values, regions, etc.) (FR-020)
- [X] T061 [US3] Implement Mission section with core value proposition text (FR-021)
- [X] T062 [US3] Create Values section with 4 tiles for Quality, Trust, Innovation, Team (FR-022)
- [X] T063 [US3] Build Regional Presence section with Berlin, Hamburg, Heidelberg locations (FR-023)
- [X] T064 [US3] Create References section with 6-8 project images and impact statements (FR-024)
- [X] T065 [US3] Implement Customer Testimonials section with 3 quotes (FR-025)
- [X] T066 [US3] Build Certifications section with ISO badges and availability note (FR-026)
- [X] T067 [US3] Create Customer logos section displaying 8-12 company logos (FR-027)
- [X] T068 [US3] Implement News section with 3 update cards showing text and dates (FR-028)
- [X] T069 [US3] Create three CTA cards at about page end linking to sales, career, and contact
- [X] T070 [US3] Implement anchor link navigation with smooth scroll behavior (FR-046)
- [X] T071 [US3] Add invalid anchor link handling with silent scroll to top (FR-050)
- [X] T072 [US3] Create about page translations with all section content
- [X] T073 [US3] Implement SEO meta tags for about page with trust and credibility focus
- [X] T074 [US3] Test all internal anchor navigation and section jumping

## Phase 6: User Story 4 - Career & Job Applications (Priority: P4)

- [X] T075 [US4] Create career page layout src/pages/Career.tsx with recruitment focus
- [X] T076 [US4] Implement career hero section with H1 and dual CTAs to #jobs and #initiativ (FR-029)
- [X] T077 [US4] Create Employee Testimonials section with slider showing 3+ testimonials (FR-030)
- [X] T078 [US4] Implement Open Positions section with location filter dropdown (FR-031)
- [X] T079 [US4] Create job filter feature component src/components/features/job-filter/job-filter.tsx (FR-032)
- [X] T080 [US4] Implement location-based job filtering for Alle, Heidelberg, Berlin, Hamburg (FR-032)
- [X] T081 [US4] Create job teasers with all required fields and application CTAs (FR-033)
- [X] T082 [US4] Implement job title pre-filling when clicking "Für diese Stelle bewerben" (FR-033)
- [X] T083 [US4] Create Unsolicited Application section with CTA to application form (FR-034)
- [X] T084 [US4] Build Team section displaying 6-10 profile cards with role information (FR-035)
- [X] T085 [US4] Create Benefits section with 6+ benefit tiles and descriptions (FR-036)
- [X] T086 [US4] Create job application feature component src/components/features/application-form/application-form.tsx (FR-037)
- [X] T087 [US4] Implement application form with 6 fields plus CV upload and GDPR consent (FR-037)
- [X] T088 [US4] Add CV file validation for PDF format and 10MB size limit (FR-038)
- [X] T089 [US4] Implement CV file to base64 conversion for FormSubmit.co submission
- [X] T090 [US4] Add GDPR notice and contact information with application form (FR-039)
- [X] T091 [US4] Implement field error messages for validation failures (FR-040)
- [X] T092 [US4] Create job filter translations src/components/features/job-filter/i18n/locales/de.json
- [X] T093 [US4] Create application form translations src/components/features/application-form/i18n/locales/de.json
- [X] T094 [US4] Implement duplicate application detection with 24h window
- [X] T095 [US4] Add network error handling with retry for application submissions
- [X] T096 [US4] Create CTA cards at career page end for application paths and about link
- [X] T097 [US4] Display empty state message "Gerade gibt es keine offenen Stellen" when no jobs (FR-048)
- [X] T098 [US4] Implement SEO meta tags for career page with recruitment focus
- [X] T099 [US4] Test complete job application flow including CV upload and validation

## Final Phase: Polish & Cross-Cutting Concerns

- [X] T100 [P] Create navigation header component src/components/blocks/navigation-header/navigation-header.tsx
- [X] T101 [P] Create footer component src/components/blocks/footer/footer.tsx with contact and legal links
- [X] T102 [P] Create 404 error page src/pages/NotFound.tsx with navigation back to main pages
- [X] T103 [P] Implement loading states for all form submissions and data loading
- [ ] T104 [P] Optimize all images for WebP format with responsive srcset attributes (SC-011)
- [ ] T105 [P] Implement lazy loading for below-the-fold images with aspect ratio containers (SC-011)
- [X] T106 [P] Add React.lazy code splitting for page components to reduce bundle size
- [ ] T107 [P] Configure vite-plugin-image-optimizer for build-time image optimization
- [ ] T108 [P] Implement progressive image loading without layout shift (CLS <0.1) (SC-005)
- [ ] T109 [P] Add missing alt text and ARIA labels for accessibility compliance (SC-007)
- [ ] T110 [P] Implement keyboard navigation support for all interactive elements (SC-007)
- [ ] T111 [P] Test color contrast ratios for WCAG AA compliance across light and dark themes
- [ ] T112 [P] Run Lighthouse audits on all pages to achieve 90/100 performance score (SC-010)
- [ ] T113 [P] Fix any Core Web Vitals issues (LCP <2.5s, FID <100ms, CLS <0.1) (SC-005)
- [ ] T114 [P] Implement mobile bottom sheet pattern for content overflow (FR-044)
- [ ] T115 [P] Test responsive design across all viewport sizes from 320px to 1920px (SC-006)
- [ ] T116 [P] Verify all forms work correctly on mobile devices with touch input
- [ ] T117 [P] Test cross-browser compatibility in Chrome, Firefox, Safari, Edge latest versions
- [X] T118 [P] Implement error boundaries for graceful error handling in production
- [X] T119 [P] Add fallback fonts for Poppins and Lora with proper font loading (FR-042)
- [X] T120 [P] Configure build process with proper TypeScript type checking (npm run type-check)

## Dependencies & Execution Order

**Critical Path Dependencies:**
1. Phase 1 (Setup) → Must complete before all other phases
2. Phase 2 (Foundational) → Blocks dependencies for all user stories
3. T021-T028 (Block components) → Must complete before page implementation
4. T046 (Contact form) → Required for US2 completion
5. T079 (Job filter) → Required for US4 job filtering
6. T086 (Application form) → Required for US4 completion

**Parallel Execution Opportunities:**
- All [P] tagged tasks can run simultaneously within their phase
- User Stories 1-4 can be implemented in parallel after foundational phase
- Polish tasks (T100-T120) can run in parallel during final phase

## Parallel Example: User Story 1

Tasks T029-T040 can be partially parallelized:
```
T029 (Main.tsx layout) → T030-T036 (sections) → T037-T040 (translations, SEO, testing)
```

Where T031-T036 can run in parallel once T029 layout is established.

## Implementation Strategy

**MVP First Approach:**
- User Story 1 (Main Landing Page) is MVP priority - delivers immediate value
- User Story 2 (Sales Page) is critical for lead generation
- User Stories 3-4 can be delivered in subsequent iterations

**Testing Strategy:**
- Manual testing against acceptance scenarios from spec.md
- Performance testing via Chrome DevTools for Core Web Vitals
- Cross-browser and responsive testing
- Form submission testing with error handling validation

**Independent Test Criteria per Story:**
- **US1**: Can load landing page and navigate to all other pages via CTAs
- **US2**: Can view services, process, and submit contact form with confirmation
- **US3**: Can browse all company information sections via anchor navigation
- **US4**: Can filter jobs, view team/benefits, and submit application with CV

**Suggested MVP Scope:**
Phase 1 (Setup) + Phase 2 (Foundational) + Phase 3 (User Story 1) = Functional landing page with navigation to other pages, establishing core brand presence and user journey entry point.

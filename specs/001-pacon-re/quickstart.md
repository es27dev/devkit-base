# Quickstart: PACON Real Estate Website

**Feature**: 001-pacon-re | **Date**: 2025-11-07

## Overview

This guide provides a quick start for implementing the PACON Real Estate marketing website. Follow the implementation order to build the site efficiently.

---

## Prerequisites

**Development Environment**:
- Node.js 18+ (LTS version)
- npm 9+
- VS Code (recommended) with TypeScript extension

**Repository Setup**:
```bash
# Clone repository
git clone <repo-url>

# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser to http://localhost:5173
```

**Branch**:
```bash
# Switch to feature branch
git checkout 001-pacon-re
```

---

## Implementation Order

### Phase 1: Foundation & Shared Components (Week 1)

**Priority**: P0 (Blockers)

1. **Setup i18n infrastructure** (1-2 hours)
   - [ ] Configure react-i18next in `src/shared/i18n/config.ts`
   - [ ] Create common translations: `src/shared/i18n/locales/de.json`
   - [ ] Test with sample text: `const { t } = useTranslation()`

2. **Setup theme system** (2-3 hours)
   - [ ] Configure Tailwind dark mode in `tailwind.config.js`
   - [ ] Create PACON color variables (light/dark)
   - [ ] Implement theme toggle: `src/components/features/theme-toggle/`
   - [ ] Test localStorage persistence

3. **Create mock data files** (2-3 hours)
   - [ ] `src/shared/data/mock-services.ts` (5 services)
   - [ ] `src/shared/data/mock-customers.ts` (8-12 logos)
   - [ ] `src/shared/data/mock-projects.ts` (6-8 references)
   - [ ] `src/shared/data/mock-testimonials.ts` (3-6 quotes)
   - [ ] `src/shared/data/mock-jobs.ts` (3-5 job listings)
   - [ ] `src/shared/data/mock-team.ts` (6-10 profiles)
   - [ ] `src/shared/data/mock-benefits.ts` (6+ benefits)
   - [ ] `src/shared/data/mock-news.ts` (3 updates)
   - [ ] `src/shared/data/mock-certifications.ts` (4 badges)

4. **Create shared utilities** (1-2 hours)
   - [ ] Form validation: `src/shared/lib/form-validation.ts` (Zod schemas)
   - [ ] Form submission: `src/shared/services/form-submission.ts`
   - [ ] Duplicate detection: `src/shared/services/duplicate-detection.ts`
   - [ ] File upload: `src/shared/services/file-upload.ts`
   - [ ] Anchor scroll: `src/shared/hooks/use-anchor-scroll.ts`

---

### Phase 2: Reusable Block Components (Week 1-2)

**Priority**: P1 (High)

Build in **dependency order** (leaf components first):

5. **Base UI blocks** (4-6 hours)
   - [ ] `src/components/blocks/service-card/` (title, description, icon)
   - [ ] `src/components/blocks/customer-logo-wall/` (grid of logos)
   - [ ] `src/components/blocks/project-gallery/` (image grid with lazy loading)
   - [ ] `src/components/blocks/team-profile/` (photo, name, role, focus)
   - [ ] `src/components/blocks/cta-card/` (title, description, button)
   - [ ] Test each block in isolation with mock data

6. **Hero sections** (3-4 hours)
   - [ ] `src/components/blocks/hero-section/` (H1, subline, CTAs)
   - [ ] Variants: Main (2 CTAs), Sales (metrics), Career (2 CTAs)
   - [ ] Test responsive layout (320px to 1920px)

7. **Interactive blocks** (4-5 hours)
   - [ ] `src/components/blocks/testimonial-slider/` (navigation dots)
   - [ ] `src/components/blocks/job-listing/` (expandable details)
   - [ ] Test mobile bottom sheet pattern

---

### Phase 3: Feature Components (Week 2)

**Priority**: P2 (Medium)

8. **Contact form feature** (4-5 hours)
   - [ ] `src/components/features/contact-form/contact-form.tsx`
   - [ ] Integrate react-hook-form + Zod validation
   - [ ] 7 fields + consent checkbox
   - [ ] FormSubmit.co integration
   - [ ] Duplicate detection (24h)
   - [ ] Network error handling with retry
   - [ ] Success/error messages
   - [ ] Translations: `contact-form/i18n/locales/de.json`

9. **Job application feature** (5-6 hours)
   - [ ] `src/components/features/application-form/application-form.tsx`
   - [ ] 6 fields + CV upload + GDPR consent
   - [ ] CV validation (PDF, 10MB)
   - [ ] File to base64 conversion
   - [ ] FormSubmit.co integration
   - [ ] Duplicate detection (24h)
   - [ ] Network error handling with retry
   - [ ] Success/error messages
   - [ ] Translations: `application-form/i18n/locales/de.json`

10. **Job filter feature** (2-3 hours)
    - [ ] `src/components/features/job-filter/job-filter.tsx`
    - [ ] Location dropdown (Alle, Heidelberg, Berlin, Hamburg)
    - [ ] URL state (search params) for shareability
    - [ ] Filter logic for job listings
    - [ ] Empty state: "Gerade gibt es keine offenen Stellen"
    - [ ] Translations: `job-filter/i18n/locales/de.json`

---

### Phase 4: Page Components (Week 2-3)

**Priority**: Based on User Story priority (P1 → P4)

**Implementation order follows spec user stories**:

11. **Main Landing Page** (P1 - 6-8 hours)
    - [ ] `src/pages/Main.tsx`
    - [ ] Hero section (FR-001)
    - [ ] "Unsere Kernleistungen" (5 services, FR-002)
    - [ ] "Vertraut von bekannten Kunden" (logo wall, FR-003)
    - [ ] "Regional stark vertreten" (locations, FR-004)
    - [ ] "Objektbilder und Projekte" (gallery, FR-005)
    - [ ] Optional "Unsere Mission" teaser (FR-006)
    - [ ] 3 CTA cards at page end (FR-007)
    - [ ] Page translations: `pages/i18n/locales/de.json`
    - [ ] SEO meta tags (Title, Description, Keywords)
    - [ ] Test all anchor links
    - [ ] Performance test (LCP <2.5s)

12. **Sales Page** (P2 - 6-8 hours)
    - [ ] `src/pages/Sales.tsx`
    - [ ] Hero with 3 metrics (FR-009)
    - [ ] 5 core services section (FR-010)
    - [ ] Implementation process (3 phases, FR-011)
    - [ ] Project gallery (3-6 items, FR-012)
    - [ ] Contact form (FR-013 to FR-017)
    - [ ] Contact person details (FR-014)
    - [ ] Privacy notice (FR-018)
    - [ ] 2 CTA cards at page end
    - [ ] SEO meta tags
    - [ ] Test form submission flow
    - [ ] Performance test

13. **About Page** (P3 - 6-8 hours)
    - [ ] `src/pages/About.tsx`
    - [ ] H1 + introduction (FR-019)
    - [ ] Internal anchor navigation (8 sections, FR-020)
    - [ ] Mission section (FR-021)
    - [ ] Values section (4 tiles, FR-022)
    - [ ] Regional Presence (3 locations, FR-023)
    - [ ] References (6-8 images, FR-024)
    - [ ] Customer Testimonials (3 quotes, FR-025)
    - [ ] Certifications (4 badges, FR-026)
    - [ ] Customer logos (8-12, FR-027)
    - [ ] News section (3 updates, FR-028)
    - [ ] 3 CTA cards at page end
    - [ ] SEO meta tags
    - [ ] Test anchor navigation
    - [ ] Performance test

14. **Career Page** (P4 - 7-9 hours)
    - [ ] `src/pages/Career.tsx`
    - [ ] Hero (2 CTAs, FR-029)
    - [ ] Employee Testimonials slider (3+, FR-030)
    - [ ] Open Positions with location filter (FR-031 to FR-033)
    - [ ] Unsolicited Application section (FR-034)
    - [ ] Team section (6-10 profiles, FR-035)
    - [ ] Benefits section (6+ tiles, FR-036)
    - [ ] Application form (FR-037 to FR-040)
    - [ ] 3 CTA cards at page end
    - [ ] SEO meta tags
    - [ ] Test job filter + form
    - [ ] Performance test

---

### Phase 5: Polish & Testing (Week 3-4)

**Priority**: P3 (Polish)

15. **Cross-page elements** (2-3 hours)
    - [ ] Navigation header (links to all pages)
    - [ ] Footer (contact info, social links, legal)
    - [ ] 404 page
    - [ ] Loading states

16. **Performance optimization** (3-4 hours)
    - [ ] Optimize images (WebP, responsive srcset)
    - [ ] Lazy loading for below-the-fold images
    - [ ] Code splitting (React.lazy for pages)
    - [ ] Run Lighthouse audits (target ≥90/100)
    - [ ] Fix any CLS issues (target <0.1)

17. **Responsive testing** (2-3 hours)
    - [ ] Test on mobile (320px, 375px, 414px)
    - [ ] Test on tablet (768px, 1024px)
    - [ ] Test on desktop (1280px, 1920px)
    - [ ] Bottom sheet pattern works on mobile
    - [ ] All forms usable on mobile

18. **Cross-browser testing** (2-3 hours)
    - [ ] Chrome (latest)
    - [ ] Firefox (latest)
    - [ ] Safari (latest)
    - [ ] Edge (latest)

19. **Accessibility audit** (2-3 hours)
    - [ ] Keyboard navigation works
    - [ ] Focus states visible
    - [ ] Alt text on all images
    - [ ] ARIA labels where needed
    - [ ] Color contrast passes WCAG AA

20. **Manual acceptance testing** (3-4 hours)
    - [ ] Test all User Story acceptance scenarios from spec.md
    - [ ] Test all edge cases from spec.md
    - [ ] Test form error handling
    - [ ] Test duplicate submission detection

---

## Estimated Timeline

**Total**: 3-4 weeks (1 developer full-time)

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1: Foundation | 6-10 hours | i18n, theme, mock data, utilities |
| Phase 2: Blocks | 11-15 hours | Reusable UI components |
| Phase 3: Features | 11-14 hours | Forms, filters, interactions |
| Phase 4: Pages | 25-33 hours | Main, Sales, About, Career |
| Phase 5: Polish | 12-17 hours | Performance, testing, accessibility |

**Total Hours**: 65-89 hours (~2-3 weeks at 40h/week)

---

## Key Files to Create

**Configuration**:
- `src/shared/i18n/config.ts` - i18next setup
- `tailwind.config.js` - PACON colors, dark mode

**Data**:
- `src/shared/data/mock-*.ts` - 9 mock data files

**Services**:
- `src/shared/services/form-submission.ts`
- `src/shared/services/duplicate-detection.ts`
- `src/shared/services/file-upload.ts`

**Validation**:
- `src/shared/lib/form-validation.ts` - Zod schemas

**Blocks** (8 components):
- `service-card/`, `customer-logo-wall/`, `project-gallery/`, `team-profile/`, `cta-card/`, `hero-section/`, `testimonial-slider/`, `job-listing/`

**Features** (4 components):
- `contact-form/`, `application-form/`, `job-filter/`, `theme-toggle/`

**Pages** (4 pages):
- `Main.tsx`, `Sales.tsx`, `About.tsx`, `Career.tsx`

**Translations** (7 files):
- `src/shared/i18n/locales/de.json` (common)
- `src/pages/i18n/locales/de.json` (pages)
- `src/components/features/contact-form/i18n/locales/de.json`
- `src/components/features/application-form/i18n/locales/de.json`
- `src/components/features/job-filter/i18n/locales/de.json`
- `src/components/features/theme-toggle/i18n/locales/de.json`

---

## Development Tips

### 1. Component Development Pattern

**Follow the 7-region structure** (from constitution):

```tsx
export function ComponentName({ prop }: ComponentNameProps) {
  // 1. HOOKS
  const [state, setState] = useState();

  // 2. TRANSLATIONS
  const { t } = useTranslation();

  // 3. DATA LOADING
  const data = mockData; // Static in this project

  // 4. EARLY RETURNS
  if (!data) return null;

  // 5. COMPUTED DATA
  const filteredData = useMemo(() => filter(data), [data]);

  // 6. EVENT HANDLERS
  const handleClick = useCallback(() => {}, []);

  // 7. EFFECTS
  useEffect(() => {}, []);

  return <div>...</div>;
}
```

### 2. Form Development Pattern

**Use react-hook-form + Zod**:

```tsx
const schema = z.object({ /* ... */ });
const form = useForm({ resolver: zodResolver(schema) });

const onSubmit = async (data) => {
  // 1. Check duplicate
  if (DuplicateDetectionService.isDuplicate(data.email, 'sales')) {
    return showError('Ihre Anfrage wurde bereits registriert.');
  }

  // 2. Submit
  try {
    await FormSubmissionService.submitContactForm(data);
    showSuccess('Danke. Wir melden uns binnen 1 Werktag.');
    DuplicateDetectionService.recordSubmission(data.email, 'sales');
  } catch (error) {
    showError('Übertragung fehlgeschlagen.', { retry: true });
  }
};
```

### 3. Image Optimization

**Use aspect ratio containers**:

```tsx
<div className="relative aspect-[16/9] bg-gray-100">
  <img
    src={project.image}
    alt={project.title}
    loading="lazy"
    className="absolute inset-0 w-full h-full object-cover"
  />
</div>
```

### 4. Dark Mode

**Use Tailwind dark: prefix**:

```tsx
<div className="bg-[#faf8f5] dark:bg-[#2a2a29]">
  <h1 className="text-[#a63631] dark:text-[#b13d38]">pacon</h1>
</div>
```

### 5. Bottom Sheet Pattern

**Mobile overflow content**:

```tsx
// Desktop: inline, Mobile: sheet
<>
  <div className="hidden md:block">
    <Content />
  </div>

  <Sheet>
    <SheetTrigger className="md:hidden">
      <Button>Mehr erfahren</Button>
    </SheetTrigger>
    <SheetContent side="bottom">
      <Content />
    </SheetContent>
  </Sheet>
</>
```

---

## Testing Checklist

### Unit Testing (Optional in MVP)
- [ ] Form validation schemas
- [ ] Utility functions (duplicate detection, file upload)

### Integration Testing (Manual)
- [ ] All user stories from spec.md
- [ ] All acceptance scenarios
- [ ] All edge cases
- [ ] Form submissions (success + error flows)

### Performance Testing (Required)
- [ ] Lighthouse score ≥90/100 for all pages
- [ ] LCP <2.5s
- [ ] FID <100ms
- [ ] CLS <0.1

### Accessibility Testing (Required)
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast WCAG AA

---

## Common Pitfalls

1. **Forgetting named exports** → Always `export function Component()`
2. **Default exports** → Use named exports only (constitution rule)
3. **Prop drilling** → Use Context API if >3 levels
4. **Layout shift** → Always use aspect-ratio containers for images
5. **Missing i18n** → All text must go through `t()` function
6. **Direct localStorage** → Use theme service, duplicate detection service
7. **Missing error handling** → All forms need network error handling + retry
8. **Forgetting duplicate detection** → Check before every form submission

---

## Deployment Checklist

- [ ] Build succeeds: `npm run build`
- [ ] Type check passes: `npm run type-check`
- [ ] All images optimized (WebP, responsive)
- [ ] All translations complete (German)
- [ ] FormSubmit.co endpoints configured correctly
- [ ] Environment variables set (if any)
- [ ] SEO meta tags on all pages
- [ ] Lighthouse score ≥90/100
- [ ] Cross-browser testing complete
- [ ] Mobile responsive testing complete

---

## Resources

**Documentation**:
- [spec.md](./spec.md) - Full feature specification
- [data-model.md](./data-model.md) - TypeScript interfaces + Zod schemas
- [contracts/form-submission-api.md](./contracts/form-submission-api.md) - Form API contracts
- [research.md](./research.md) - Technical decisions and best practices

**External**:
- [FormSubmit.co docs](https://formsubmit.co/)
- [react-hook-form docs](https://react-hook-form.com/)
- [Zod docs](https://zod.dev/)
- [Tailwind CSS docs](https://tailwindcss.com/)
- [shadcn/ui docs](https://ui.shadcn.com/)

---

## Support

For questions or blockers, reference:
- **Constitution**: `.specify/memory/constitution.md`
- **Agent Guidelines**: `.claude/agents/*.md`
- **Project README**: `CLAUDE.md`

Follow the multi-agent workflow:
1. Planner → Creates plan + context ✅ (This document)
2. Coder → Implements + self-check
3. Reviewer → Quality check
4. Database-Architect → Supabase integration (if needed in future)

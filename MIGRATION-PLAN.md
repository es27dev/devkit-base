# Component Migration Plan
**From**: `es27dev/devKit` (Branch: 004-robuste-ai-chat)
**To**: Current `devkit-base` repository
**Date**: 2025-11-10

---

## Pre-Migration Checklist

### Repository Setup
- [ ] Clone source repo: `git clone -b 004-robuste-ai-chat https://github.com/es27dev/devKit.git migration-source`
- [ ] Verify current branch: `002-sticky-anchor-nav`
- [ ] Create backup branch: `git checkout -b backup-before-migration`
- [ ] Push backup: `git push origin backup-before-migration`
- [ ] Create migration branch: `git checkout -b 003-component-migration`

---

## Phase 1: Analysis & Inventory

### 1.1 Source Component Analysis
- [ ] List all components from source repo in `migration-source/src/components/`
- [ ] Document component dependencies (imports, contexts, hooks)
- [ ] Identify shared utilities and types
- [ ] Check for external dependencies (npm packages)

### 1.2 Target Component Mapping
- [ ] Map source components → target pages/sections
- [ ] Identify conflicts with existing components
- [ ] Document components to keep vs. replace

**Target Component Inventory (Current)**:
```
blocks/
├── hero/ (HeroBuilder, HeroCounter) ✅ KEEP
├── cta-card/ ✅ KEEP
├── customer-logo-wall/ ⚠️  TO REVIEW
├── project-gallery/ ⚠️  TO REVIEW
├── testimonial-slider/ ⚠️  TO REVIEW
├── job-listing/ ⚠️  TO REVIEW
├── team-profile/ ⚠️  TO REVIEW (check Storybook reference)
└── anchor-links/ ✅ KEEP

features/
├── contact-form/ ✅ KEEP
├── application-form/ ✅ KEEP
└── job-filter/ ✅ KEEP
```

---

## Phase 2: Constitution Compliance Check

### 2.1 Naming Convention Validation
- [ ] All files use `kebab-case.tsx`
- [ ] All exports are named exports (NO default exports)
- [ ] Interface names follow: `ComponentNameProps`, `FunctionNameParams`, `EntityItem`

### 2.2 Architecture Validation
- [ ] Components properly categorized: `base/` vs `blocks/` vs `features/`
- [ ] `blocks/` = Pure UI, no business logic, props-driven
- [ ] `features/` = Business logic, API calls, Supabase
- [ ] One component per file

### 2.3 Import Organization
- [ ] Follow 7-region pattern from constitution:
  1. React Core
  2. External Libraries
  3. Base Components
  4. Block Components
  5. Feature Components
  6. Data/Types
  7. Context/Hooks

### 2.4 Component Structure
- [ ] Follow 7-region component pattern:
  1. Hooks
  2. Translations
  3. Data Loading
  4. Early Returns
  5. Computed Data
  6. Event Handlers
  7. Effects

---

## Phase 3: Component Migration (Priority Order)

### 3.1 Footer Component (High Priority)
**Source**: Reference from Storybook → `http://localhost:6006/?path=/story/library-blocks-footer-showcases--default`

- [ ] Extract Footer component from source repo
- [ ] Create `src/components/blocks/footer/footer.tsx`
- [ ] Create interface `FooterProps`
- [ ] Adapt imports to match target structure
- [ ] Create mock data: `src/shared/data/mock-footer.ts`
- [ ] Add i18n translations: `src/components/blocks/footer/i18n/locales/de.json`
- [ ] Integrate in all pages (About, Career, Sales)
- [ ] Test responsive behavior
- [ ] Type check: `npm run type-check`

**Constitution Constraints**:
- Named exports only
- Props-driven (no hardcoded content)
- No API/DB calls → Pure UI block

---

### 3.2 Card Gallery / Team Profile (High Priority)
**Target Pages**: Career (Team Section), About (multiple sections)
**Source**: Storybook → `http://localhost:6006/?path=/story/library-blocks-cardgallery-showcases--default`

#### 3.2.1 Team Profile Enhancement
- [ ] Review existing `src/components/blocks/team-profile/team-profile.tsx`
- [ ] Compare with source CardGallery component
- [ ] Decision: Keep current or migrate?
- [ ] If migrating:
  - [ ] Extract CardGallery from source
  - [ ] Adapt to `TeamProfile` use case
  - [ ] Update `mockTeamProfiles` data structure
  - [ ] Add mock profile images (Unsplash or placeholders)
- [ ] Test on Career page
- [ ] Type check: `npm run type-check`

**Constitution Constraints**:
- Interface: `TeamProfileProps`, `TeamMemberItem`
- Reusable card layout (potentially used elsewhere)

---

### 3.3 Project Gallery / References (Medium Priority)
**Target Pages**: About (References Section), Sales (Projects Section)

- [ ] Review existing `src/components/blocks/project-gallery/project-gallery.tsx`
- [ ] Extract enhanced version from source repo (if exists)
- [ ] Update interface `ProjectItem`
- [ ] Add mock project images (3-4 per project)
- [ ] Ensure responsive grid layout
- [ ] Test on both About and Sales pages
- [ ] Type check: `npm run type-check`

**Mock Data Requirements**:
- Project title, description, client, year, location
- 3-4 images per project (Unsplash building/office images)
- Category tags (FM, Technical, Compliance, etc.)

---

### 3.4 Testimonial Slider Enhancement (Medium Priority)
**Target Pages**: About (Customer Testimonials), Career (Employee Testimonials)

- [ ] Review existing `src/components/blocks/testimonial-slider/testimonial-slider.tsx`
- [ ] Check if source has enhanced testimonial component
- [ ] Add avatar images to testimonials
- [ ] Ensure smooth carousel navigation
- [ ] Test with both customer and employee data
- [ ] Type check: `npm run type-check`

**Mock Data Requirements**:
- Avatar images (Unsplash portraits or placeholder avatars)
- Company logos for customer testimonials
- Role/department for employee testimonials

---

### 3.5 Customer Logo Wall (Low Priority)
**Target Pages**: About (Customers Section)

- [ ] Review existing `src/components/blocks/customer-logo-wall/customer-logo-wall.tsx`
- [ ] Add real or placeholder logos
- [ ] Ensure grayscale filter + hover color effect
- [ ] Test responsive behavior (mobile → desktop)
- [ ] Type check: `npm run type-check`

**Mock Data Requirements**:
- 12-20 customer logos (SVG preferred)
- Consistent sizing and spacing

---

## Phase 4: Mock Data Population

### 4.1 Image Assets Strategy
- [ ] Create `public/images/` directory structure:
  ```
  public/images/
  ├── heroes/          # Hero section images
  ├── team/            # Team member photos
  ├── projects/        # Project reference images
  ├── testimonials/    # Testimonial avatars
  ├── logos/           # Customer logos
  └── certifications/  # Certification badges
  ```

### 4.2 Mock Data Files
- [ ] Review all mock data files in `src/shared/data/`
- [ ] Add placeholder images (Unsplash URLs initially)
- [ ] Ensure data structure matches interfaces
- [ ] Add realistic German content

**Files to Update**:
- [ ] `mock-team.ts` → Add images, bios, social links
- [ ] `mock-projects.ts` → Add multiple images per project
- [ ] `mock-testimonials.ts` → Add avatars, companies
- [ ] `mock-customers.ts` → Add logo URLs
- [ ] `mock-certifications.ts` → Add badge images

### 4.3 Unsplash Image URLs (Temporary)
Use Unsplash for mock images during development:
- Team photos: `https://images.unsplash.com/photo-[id]?w=400&h=400&fit=crop`
- Buildings: `https://images.unsplash.com/photo-[id]?w=800`
- Offices: `https://images.unsplash.com/photo-[id]?w=600`

**Important**: Replace with real images before production.

---

## Phase 5: Integration & Testing

### 5.1 Page-by-Page Integration
- [ ] **Sales Page**: Hero, Services, Process, Projects, Contact, CTAs
- [ ] **About Page**: Hero, Mission, Values, Regions, References, Testimonials, Certifications, Customers, News, CTAs
- [ ] **Career Page**: Hero, Testimonials, Jobs, Team, Benefits, Application, CTAs
- [ ] **Home Page**: Hero variants, Feature showcases

### 5.2 Cross-Browser Testing
- [ ] Chrome (desktop + mobile viewport)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

### 5.3 Responsive Testing
- [ ] Mobile (320px - 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Large Desktop (1920px+)

### 5.4 Type Safety
- [ ] Run `npm run type-check` (zero errors)
- [ ] Verify all component props are typed
- [ ] Check all mock data matches interfaces

---

## Phase 6: Quality Assurance

### 6.1 Constitution Compliance Audit
- [ ] All naming conventions followed
- [ ] Import organization correct (7 regions)
- [ ] Component structure correct (7 regions)
- [ ] No default exports found
- [ ] One component per file
- [ ] `blocks/` vs `features/` correctly categorized

### 6.2 Performance Check
- [ ] Components above-the-fold use `React.memo` if >3 re-renders/sec
- [ ] Heavy computations use `useMemo`
- [ ] Event handlers use `useCallback` where appropriate
- [ ] Images have proper `loading="lazy"` for below-the-fold
- [ ] No console warnings/errors

### 6.3 Accessibility Check
- [ ] All images have `alt` text
- [ ] Buttons have proper labels
- [ ] Form inputs have labels
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works

---

## Phase 7: Git Workflow

### 7.1 Pre-Commit
- [ ] Review all changes: `git status`
- [ ] Stage migration files: `git add src/components/ src/shared/data/`
- [ ] Check TypeScript: `npm run type-check`
- [ ] Test dev server: `npm run dev`

### 7.2 Commit Strategy
Use semantic commits:
```bash
git commit -m "feat: migrate Footer component from devKit repo"
git commit -m "feat: enhance TeamProfile with CardGallery pattern"
git commit -m "chore: populate mock data with images"
git commit -m "fix: resolve TypeScript errors in migrated components"
```

### 7.3 Push & Backup
- [ ] Push migration branch: `git push origin 003-component-migration`
- [ ] Verify remote branch exists
- [ ] Create GitHub backup tag: `git tag -a pre-migration-backup -m "Backup before component migration"`
- [ ] Push tags: `git push origin --tags`

---

## Phase 8: Final Validation

### 8.1 Full Application Test
- [ ] Start dev server: `npm run dev`
- [ ] Visit all pages: Home, Sales, About, Career
- [ ] Test all interactive elements (forms, buttons, navigation)
- [ ] Verify sticky navigation works
- [ ] Check anchor scroll behavior

### 8.2 Build Test
- [ ] Run production build: `npm run build`
- [ ] Preview build: `npm run preview`
- [ ] Check for build warnings/errors
- [ ] Test bundle size (should be reasonable)

### 8.3 Documentation
- [ ] Update `CLAUDE.md` if component structure changed
- [ ] Update `README.md` with new components
- [ ] Document any new dependencies
- [ ] Note any breaking changes

---

## Rollback Plan (If Issues Arise)

### Emergency Rollback Steps
```bash
# Return to backup branch
git checkout backup-before-migration

# Create new working branch from backup
git checkout -b 003-component-migration-v2

# Start migration again with lessons learned
```

### Common Issues & Solutions
- **Type errors**: Check interface definitions match
- **Import errors**: Verify path aliases (`@/`) are correct
- **Missing dependencies**: Run `npm install` for any new packages
- **Build errors**: Check for circular dependencies
- **Styling issues**: Verify Tailwind classes are valid

---

## Success Criteria

✅ **Migration Complete When**:
- [ ] All components successfully migrated
- [ ] Zero TypeScript errors
- [ ] All pages render correctly
- [ ] Responsive behavior works
- [ ] Mock data populates components
- [ ] Constitution compliance verified
- [ ] Git commits pushed
- [ ] Backup created
- [ ] Documentation updated

---

## Dependencies & Constraints

### External Dependencies
Check if source repo uses packages not in current repo:
- [ ] `framer-motion` (already installed ✅)
- [ ] Any new icon libraries?
- [ ] Any new utility libraries?

### Constitution Constraints Summary
1. **Named exports only** (NO default exports)
2. **kebab-case.tsx** file naming
3. **One component per file**
4. **blocks/** = Pure UI, props-driven
5. **features/** = Business logic, API calls
6. **7-region** import organization
7. **7-region** component structure
8. **Interface naming**: `ComponentNameProps`, `EntityItem`

### Breaking Changes
Document any breaking changes that affect existing code:
- [ ] Component API changes (prop names, types)
- [ ] Data structure changes (mock data interfaces)
- [ ] Import path changes
- [ ] Removed components

---

## Notes

- Start with high-impact, low-risk components (Footer, Card layouts)
- Test incrementally after each component migration
- Use mock images from Unsplash initially
- Keep constitution compliance in mind at every step
- Commit often with semantic messages

---

**Status**: Ready to begin
**Next Action**: Complete Pre-Migration Checklist → Start Phase 1

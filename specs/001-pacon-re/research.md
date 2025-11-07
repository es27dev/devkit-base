# Research: PACON Real Estate Website

**Feature**: 001-pacon-re | **Date**: 2025-11-07

## Research Questions

This document consolidates research findings for all unknowns and best practices identified during planning.

---

## 1. Testing Strategy

**Question**: What testing approach should be used for this frontend-only marketing website?

**Decision**: Manual testing + performance testing only for MVP

**Rationale**:
- Feature spec focuses on user acceptance scenarios (manually testable)
- No complex business logic requiring unit tests in MVP phase
- Performance testing mandatory per constitution (Section 5.3)
- Testing infrastructure can be added post-MVP if needed

**Implementation**:
1. Manual testing against acceptance scenarios in spec.md
2. Chrome DevTools MCP for performance validation:
   - Core Web Vitals (LCP, FID, CLS)
   - Lighthouse performance score
   - Network performance on 3G/4G
3. Cross-browser testing (Chrome, Firefox, Safari, Edge)
4. Responsive design testing (320px to 1920px)

**Alternatives Considered**:
- Vitest + React Testing Library: Overhead for content-heavy marketing site
- Playwright E2E: Overkill for static content pages
- Decision: Defer to post-MVP based on maintenance needs

---

## 2. Form Submission to Email Endpoints

**Question**: What's the best practice for frontend-only form submission to email?

**Decision**: Client-side validation + FormSubmit.co or EmailJS integration

**Rationale**:
- No backend in MVP phase per spec requirements
- Need reliable email delivery without managing infrastructure
- Must handle network failures gracefully (FR-047)

**Implementation Pattern**:
```typescript
// Using FormSubmit.co (no registration needed)
const handleSubmit = async (data: FormData) => {
  try {
    const response = await fetch('https://formsubmit.co/ajax/sales@pacon-re.de', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Submission failed');

    // Success: Show confirmation (FR-017)
    showConfirmation('Danke. Wir melden uns binnen 1 Werktag.');
  } catch (error) {
    // Network failure: Show retry button (FR-047)
    showError('Übertragung fehlgeschlagen.', { retry: true });
  }
};
```

**Alternatives Considered**:
- mailto: links: Poor UX, no confirmation, no validation
- EmailJS: Good, but requires account setup
- **FormSubmit.co**: Zero config, ajax support, spam protection ✅

---

## 3. Progressive Image Loading Without Layout Shift

**Question**: How to implement progressive image loading while meeting CLS <0.1 requirement?

**Decision**: Aspect ratio containers + lazy loading + blurhash placeholders

**Rationale**:
- CLS <0.1 is non-negotiable (Constitution Section 5.1)
- Spec requires progressive loading (FR-046, SC-011)
- Many images across pages (galleries, logos, team photos)

**Implementation Pattern**:
```tsx
// Aspect ratio container prevents layout shift
<div className="relative aspect-[16/9] bg-gray-100">
  <img
    src={project.image}
    alt={project.title}
    loading="lazy"
    className="absolute inset-0 w-full h-full object-cover"
  />
</div>
```

**Best Practices**:
1. Always specify width/height attributes or aspect-ratio CSS
2. Use `loading="lazy"` for below-the-fold images
3. Eager load hero images (above-the-fold)
4. Optimize images: WebP format, responsive srcset
5. Consider blurhash or LQIP (Low Quality Image Placeholder) for better UX

**Tools**: vite-plugin-image-optimizer for build-time optimization

---

## 4. Dark Mode Implementation

**Question**: What's the best practice for dark mode toggle with persistence?

**Decision**: CSS variables + localStorage + system preference detection

**Rationale**:
- PACON brand colors specified for both light and dark modes (spec constraints)
- Constitution requires persistent state for theme (Section 4.1, Level 3)
- Must respect system preferences (prefers-color-scheme)

**Implementation Pattern**:
```typescript
// Store theme preference
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // 1. Check localStorage
    const stored = localStorage.getItem('theme');
    if (stored) return stored as 'light' | 'dark';

    // 2. Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // 3. Default to light
    return 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') };
};
```

**Tailwind Configuration**:
```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        background: {
          light: '#faf8f5',
          dark: '#2a2a29',
        },
        primary: {
          light: '#a63631',
          dark: '#b13d38',
        }
      }
    }
  }
}
```

---

## 5. i18n Setup with Feature-Colocated Translations

**Question**: How to implement feature-colocated translations that merge globally?

**Decision**: react-i18next with dynamic import + flat namespace strategy

**Rationale**:
- Constitution Section 7 requires co-location with global merge
- Must support future language additions (FR-051)
- Single `useTranslation()` hook without namespace complexity

**Implementation Pattern**:
```typescript
// src/shared/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all feature translations
import commonDe from './locales/de.json';
import pagesDe from '@/pages/i18n/locales/de.json';
import contactFormDe from '@/components/features/contact-form/i18n/locales/de.json';
import applicationFormDe from '@/components/features/application-form/i18n/locales/de.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'de',
    fallbackLng: 'de',
    resources: {
      de: {
        translation: {
          ...commonDe,
          ...pagesDe,
          ...contactFormDe,
          ...applicationFormDe,
          // Merge all translations into flat structure
        }
      }
    },
    interpolation: {
      escapeValue: false // React already escapes
    }
  });

export default i18n;
```

**Translation File Structure**:
```json
// src/components/features/contact-form/i18n/locales/de.json
{
  "contactForm.name.label": "Name",
  "contactForm.name.required": "Dieses Feld ist erforderlich",
  "contactForm.email.label": "E-Mail",
  "contactForm.email.invalid": "Bitte gültige E-Mail angeben",
  "contactForm.submit": "Anfrage senden",
  "contactForm.success": "Danke. Wir melden uns binnen 1 Werktag."
}
```

**Usage in Components**:
```tsx
const { t } = useTranslation();

<label>{t('contactForm.name.label')}</label>
```

---

## 6. CV File Upload Handling

**Question**: How to implement CV upload with validation (PDF only, 10MB max)?

**Decision**: Client-side validation + FileReader API + base64 encoding for FormSubmit

**Rationale**:
- Spec requirements: PDF only, 10MB max (FR-038)
- No backend = must validate on client
- FormSubmit.co accepts base64-encoded file attachments

**Implementation Pattern**:
```typescript
// Zod schema validation
const applicationSchema = z.object({
  name: z.string().min(1, 'Dieses Feld ist erforderlich'),
  email: z.string().email('Bitte gültige E-Mail angeben'),
  cv: z
    .instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, 'Datei zu groß (max. 10MB)')
    .refine(file => file.type === 'application/pdf', 'Nur PDF-Dateien erlaubt')
});

// File upload component
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate immediately
  const result = applicationSchema.shape.cv.safeParse(file);
  if (!result.success) {
    setError(result.error.errors[0].message);
    return;
  }

  // Convert to base64 for submission
  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result as string;
    setValue('cvBase64', base64);
  };
  reader.readAsDataURL(file);
};
```

**Error Messages** (from spec FR-040):
- "Nur PDF-Dateien erlaubt"
- "Datei zu groß (max. 10MB)"
- "Dieses Feld ist erforderlich"

---

## 7. Bottom Sheet Pattern on Mobile

**Question**: How to implement bottom sheet for mobile overflow content?

**Decision**: Use shadcn/ui Sheet component + responsive breakpoints

**Rationale**:
- Spec references existing Sales.tsx implementation (FR-044)
- shadcn/ui Sheet component already available in project
- Mobile-first approach per constitution

**Implementation Pattern**:
```tsx
// Desktop: Inline content
// Mobile: Bottom sheet
const ServiceDetails = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: Sheet trigger */}
      <Button
        onClick={() => setOpen(true)}
        className="md:hidden"
      >
        Mehr erfahren
      </Button>

      {/* Desktop: Inline */}
      <div className="hidden md:block">
        <ServiceDetailContent />
      </div>

      {/* Mobile: Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[80vh]">
          <ServiceDetailContent />
        </SheetContent>
      </Sheet>
    </>
  );
};
```

**When to Use**:
- Job listing details on Career page
- Service details on Sales page
- Team member profiles on Career page
- Any content that doesn't fit on mobile viewport

---

## 8. Duplicate Form Submission Detection

**Question**: How to detect duplicate submissions within 24 hours (FR-049)?

**Decision**: localStorage + email hash + timestamp

**Rationale**:
- No backend = client-side duplicate detection
- 24-hour window per spec requirement
- Privacy-friendly (hash email, don't store plain text)

**Implementation Pattern**:
```typescript
const checkDuplicate = (email: string, formType: 'sales' | 'career'): boolean => {
  const key = `submission_${formType}_${hashEmail(email)}`;
  const stored = localStorage.getItem(key);

  if (!stored) return false;

  const timestamp = parseInt(stored, 10);
  const hoursSince = (Date.now() - timestamp) / (1000 * 60 * 60);

  // Clean up if > 24 hours
  if (hoursSince > 24) {
    localStorage.removeItem(key);
    return false;
  }

  return true; // Duplicate within 24h
};

const handleSubmit = async (data: FormData) => {
  if (checkDuplicate(data.email, 'sales')) {
    showMessage('Ihre Anfrage wurde bereits registriert.');
    return;
  }

  // Submit form...

  // Store submission timestamp
  const key = `submission_sales_${hashEmail(data.email)}`;
  localStorage.setItem(key, Date.now().toString());
};
```

---

## 9. Invalid Anchor Link Handling

**Question**: How to handle invalid/missing anchor links (FR-050)?

**Decision**: Custom scroll handler with fallback to top

**Rationale**:
- Spec requires silent fallback to top (no error message)
- React Router doesn't handle missing anchors gracefully by default
- Many internal anchor links across pages (About page has 8+ anchors)

**Implementation Pattern**:
```typescript
// src/shared/hooks/use-anchor-scroll.ts
export const useAnchorScroll = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const elementId = hash.replace('#', '');
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Invalid anchor: scroll to top silently
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);
};
```

---

## Summary of Technical Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Testing** | Manual + Performance testing | Sufficient for MVP, add automated tests post-launch |
| **Form Submission** | FormSubmit.co | Zero config, reliable, no backend needed |
| **Image Loading** | Aspect ratio + lazy loading | Meets CLS <0.1 requirement |
| **Dark Mode** | CSS vars + localStorage | Persistent, system-aware |
| **i18n** | react-i18next flat merge | Co-located, no namespace complexity |
| **CV Upload** | Client-side validation + base64 | PDF only, 10MB max per spec |
| **Bottom Sheet** | shadcn/ui Sheet component | Already available, responsive |
| **Duplicate Detection** | localStorage + hash | 24h window, privacy-friendly |
| **Anchor Handling** | Custom scroll hook | Silent fallback to top |

All decisions align with constitution requirements and spec constraints.

# Quickstart Guide: Sticky Anchor Navigation

**Feature**: `002-sticky-anchor-nav`
**For**: Developers implementing this feature
**Last Updated**: 2025-11-07

## Overview

This guide provides step-by-step instructions for implementing sticky anchor navigation with scroll spy and responsive mobile integration.

---

## Prerequisites

- React 18 + TypeScript project setup
- Tailwind CSS configured
- React Router v6 installed
- shadcn/ui components (Sheet, Button)
- react-i18next for translations

---

## Quick Start (5 Minutes)

### 1. Create Type Definitions

```bash
# Location: src/shared/types/page-config.ts
```

Copy interfaces from `specs/002-sticky-anchor-nav/contracts/typescript-interfaces.ts` to this file.

### 2. Add Sticky Header Styles

```tsx
// src/components/base/navbar/navbar.tsx (existing file)
// Change from relative to sticky positioning

<header className="sticky top-0 z-50 bg-white border-b">
  {/* Existing navbar content */}
</header>
```

### 3. Create Anchor Links Component

```tsx
// src/components/blocks/anchor-links/anchor-links.tsx (new file)

import { PageAnchorConfig } from '@/shared/types/page-config';

export interface AnchorLinksProps {
  anchors: PageAnchorConfig[];
  activeId?: string | null;
}

export function AnchorLinks({ anchors, activeId }: AnchorLinksProps) {
  const { t } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <nav className="border-b bg-muted/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-4 justify-center">
          {anchors.map((anchor) => (
            <button
              key={anchor.id}
              onClick={() => scrollToSection(anchor.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeId === anchor.id
                  ? 'text-[#C41E3A] bg-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }`}
            >
              {anchor.i18nKey ? t(anchor.i18nKey) : anchor.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

### 4. Create Scroll Spy Hook

```tsx
// src/shared/hooks/use-scroll-spy.ts (new file)

import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const viewportHeight = window.innerHeight;

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const threshold = Math.min(1, (viewportHeight / element.clientHeight) * 0.6);

      const observer = new IntersectionObserver(
        (entries) => {
          for (let i = entries.length - 1; i >= 0; i--) {
            if (entries[i].isIntersecting) {
              setActiveSection(entries[i].target.id);
              break;
            }
          }
        },
        {
          rootMargin: '-100px 0px -80% 0px',
          threshold,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [sectionIds]);

  return activeSection;
}
```

### 5. Add to Page Component

```tsx
// src/pages/About.tsx (example)

import { useScrollSpy } from '@/shared/hooks/use-scroll-spy';

export function About() {
  const { t } = useTranslation();

  // Define anchors for this page
  const anchors = [
    { id: 'mission', label: 'Mission', i18nKey: 'about.navigation.mission' },
    { id: 'values', label: 'Werte', i18nKey: 'about.navigation.values' },
    { id: 'regions', label: 'Regionen', i18nKey: 'about.navigation.regions' },
  ];

  // Track active section
  const activeSectionId = useScrollSpy(anchors.map((a) => a.id));

  return (
    <div className="min-h-screen">
      {/* Anchor Navigation */}
      <AnchorLinks anchors={anchors} activeId={activeSectionId} />

      {/* Page Sections with scroll-mt offset */}
      <section id="mission" className="scroll-mt-24 py-16">
        {/* Content */}
      </section>

      <section id="values" className="scroll-mt-24 py-16">
        {/* Content */}
      </section>

      <section id="regions" className="scroll-mt-24 py-16">
        {/* Content */}
      </section>
    </div>
  );
}
```

### 6. Add Translations

```json
// src/pages/i18n/locales/de.json

{
  "about": {
    "navigation": {
      "mission": "Mission",
      "values": "Werte",
      "regions": "Regionen"
    }
  }
}
```

---

## Mobile Integration (Optional)

### 1. Hide on Mobile with Tailwind

```tsx
// Wrap AnchorLinks with responsive class
<div className="hidden md:block">
  <AnchorLinks anchors={anchors} activeId={activeSectionId} />
</div>
```

### 2. Add to Mobile Navigation Sheet

```tsx
// In navigation-sheet.tsx
{anchors && anchors.map((anchor) => (
  <SheetClose asChild key={anchor.id}>
    <Link to={`#${anchor.id}`} className="block py-2">
      {anchor.i18nKey ? t(anchor.i18nKey) : anchor.label}
    </Link>
  </SheetClose>
))}
```

---

## Testing Checklist

### Desktop
- [ ] Header remains sticky when scrolling
- [ ] Clicking anchor link scrolls to section smoothly
- [ ] Active section is highlighted in Pacon red
- [ ] URL hash updates when scrolling/clicking
- [ ] Hash in URL causes scroll on page load

### Mobile (<768px)
- [ ] Anchor navigation hidden in header
- [ ] Anchors visible in mobile sheet
- [ ] Clicking anchor closes sheet and scrolls
- [ ] Sticky header doesn't take too much space

### Edge Cases
- [ ] Short sections (< viewport height) work correctly
- [ ] Fast scrolling updates active state correctly
- [ ] Invalid hash in URL doesn't break page
- [ ] Viewport resize switches between mobile/desktop

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces sections correctly
- [ ] Focus management preserved

### Performance
- [ ] No scroll jank (use Chrome DevTools Performance tab)
- [ ] CLS < 0.1 (use Lighthouse)
- [ ] Active state updates < 100ms

---

## Common Issues & Solutions

### Issue: Active section not updating

**Solution**: Check that section IDs match anchor config IDs exactly.

```tsx
// Anchor config
{ id: 'mission', ... }

// Section element
<section id="mission"> ✅ Correct
<section id="Mission"> ❌ Wrong (case mismatch)
```

### Issue: Scroll doesn't account for sticky header

**Solution**: Add `scroll-mt-{size}` to sections.

```tsx
<section id="mission" className="scroll-mt-24">
  {/* 24 = 6rem = 96px = header height + spacing */}
</section>
```

### Issue: Multiple sections highlighted simultaneously

**Solution**: Check rootMargin configuration in Intersection Observer.

```tsx
// Narrow activation zone
rootMargin: '-100px 0px -80% 0px'
```

### Issue: Sticky header not working

**Solution**: Ensure parent doesn't have `overflow: hidden/auto/scroll`.

```tsx
// Parent must NOT have overflow
<div className="overflow-hidden"> ❌ Breaks sticky
  <header className="sticky top-0">
</div>
```

### Issue: Hydration mismatch with useMediaQuery

**Solution**: Use CSS-first approach or initialize hook on client only.

```tsx
// CSS-first (preferred)
<div className="hidden md:block">

// Or initialize hook on mount only
const [isMobile, setIsMobile] = useState(undefined);
useEffect(() => {
  setIsMobile(window.matchMedia('(max-width: 767px)').matches);
}, []);
```

---

## File Structure Reference

```
src/
├── components/
│   ├── base/
│   │   └── navbar/
│   │       └── navbar.tsx (modified - add sticky)
│   └── blocks/
│       └── anchor-links/
│           └── anchor-links.tsx (new)
├── pages/
│   ├── About.tsx (modified - add anchors)
│   ├── Career.tsx (modified - add anchors)
│   └── i18n/
│       └── locales/
│           └── de.json (modified - add translations)
├── shared/
│   ├── hooks/
│   │   └── use-scroll-spy.ts (new)
│   └── types/
│       └── page-config.ts (new)
└── main.tsx

specs/002-sticky-anchor-nav/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/
│   └── typescript-interfaces.ts
└── quickstart.md (this file)
```

---

## Next Steps

1. Review `research.md` for technical decisions
2. Review `data-model.md` for type definitions
3. Implement according to this quickstart
4. Test against checklist above
5. Run `/speckit.tasks` to generate implementation tasks
6. Use coder agent for implementation

---

## Resources

- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [CSS position: sticky](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [scroll-margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top)
- [React Router Outlet Context](https://reactrouter.com/en/main/hooks/use-outlet-context)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)

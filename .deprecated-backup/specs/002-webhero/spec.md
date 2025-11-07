# Hero Component Specification

**Feature:** Responsive Hero Section with 3 Variants
**Client:** Pacon Real Estate GmbH (Facility Management)
**Version:** 1.0
**Date:** 2025-01-06

## Overview

A modern, mobile-responsive Hero component system with three distinct layout variants designed to target different audiences (B2B Property Managers, potential employees, property owners). Each variant features animated statistics counters, media support (image/video), and dual CTAs for recruiting and sales.

## User Story

Als Marketing-Manager von Pacon Real Estate GmbH möchte ich eine moderne, mobile-responsive Hero-Section in 3 Layout-Varianten entwickeln, damit ich verschiedene Zielgruppen (B2B Property Manager, potenzielle Mitarbeiter, Immobilienbesitzer) effektiv anspreche und gleichzeitig die Unternehmenskompetenz mit Statistiken (1000 Mitarbeiter, 35 Standorte, 2000 Kunden) unterstreiche.

## Clarifications

### Session 2025-11-06
- Q: When a hero background image fails to load (404, network timeout) or a video cannot play, what should happen? → A: Fall back to solid Pacon Red (#98221F) background with logo overlay
- Q: Should the counter animations (1000 Mitarbeiter, 35 Standorte, etc.) trigger once on page load, or re-trigger every time the hero scrolls into viewport? → A: Trigger once on page load only
- Q: Variant selection strategy - manual prop selection per page or auto-select? → A: Build all three variants for testing/comparison, Marketing Manager chooses favorite variant afterward
- Q: Testing & deployment - integrate into existing page or create dedicated test page? → A: Integrate all three variants into Home page (can completely overwrite, not final version)

## Technical Requirements

### Tech Stack
- React 18.3+
- TypeScript 5.5+
- Tailwind CSS 3.4+
- shadcn/ui components
- Framer Motion 12.23+ (animations)
- Vite 5.4+ (build tool)

### Brand Assets
- **Primary Color:** `#98221F` (Pacon Red)
- **Logo:** `public/paconMedium.svg`
- **Website:** www.pacon-re.de

### Statistics
- **Employees:** 1000
- **Locations:** 35
- **Customers:** 2000

## Component Architecture

### Variant 1: Stats-Driven Hero
**Focus:** Statistics in foreground with background media

**Layout:**
- Full viewport height
- Centered content with overlay
- Statistics cards with animated counters
- Background media (image or video) with dark overlay (opacity: 0.6)
- CTAs below statistics

### Variant 2: Split-Screen Hero
**Focus:** Content left, media right

**Layout:**
- 50/50 split on desktop (>= lg breakpoint)
- Content left: headline, stats, CTAs
- Media right: image/video (object-fit: cover)
- Mobile: Stacked layout (content → media)

### Variant 3: Fullscreen Media Hero
**Focus:** Full background media with centered overlay

**Layout:**
- Full viewport height + width
- Centered content overlay
- Statistics inline with animated counters
- Dark overlay (opacity: 0.7) for readability
- Logo positioned top-center

## Props Interface

```typescript
// Base props shared by all variants
interface HeroBaseProps {
  variant: 'stats-driven' | 'split-screen' | 'fullscreen';
  headline: string;
  subheadline: string;
  media: MediaConfig;
  stats: StatConfig[];
  ctas: CTAConfig[];
  logo?: string; // defaults to '/paconMedium.svg'
  primaryColor?: string; // defaults to '#98221F'
}

interface MediaConfig {
  type: 'image' | 'video';
  src: string;
  alt?: string; // for images
  poster?: string; // for videos
  autoplay?: boolean; // for videos, default: true
  loop?: boolean; // for videos, default: true
  muted?: boolean; // for videos, default: true
}

interface StatConfig {
  value: number;
  label: string;
  suffix?: string; // e.g., "+"
  duration?: number; // animation duration in ms, default: 2000
}

interface CTAConfig {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
  external?: boolean;
}

// Variant-specific props
interface StatsDrivenProps extends HeroBaseProps {
  variant: 'stats-driven';
  overlayOpacity?: number; // default: 0.6
}

interface SplitScreenProps extends HeroBaseProps {
  variant: 'split-screen';
  contentPosition?: 'left' | 'right'; // default: 'left'
}

interface FullscreenProps extends HeroBaseProps {
  variant: 'fullscreen';
  overlayOpacity?: number; // default: 0.7
}

type HeroProps = StatsDrivenProps | SplitScreenProps | FullscreenProps;
```

## Responsive Breakpoints

```typescript
// Tailwind breakpoints
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape / Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large desktop
}
```

### Mobile (<768px)
- **All Variants:** Stacked layout
- Font sizes reduced
- Statistics: 2-column grid
- CTAs: Full width, stacked
- Hero height: min-h-screen

### Tablet (768px - 1024px)
- **Stats-Driven & Fullscreen:** Similar to desktop, scaled
- **Split-Screen:** Content/media ratio adjusts to 40/60

### Desktop (>1024px)
- **Split-Screen:** 50/50 split
- **Stats-Driven:** 3-column stat grid
- **Fullscreen:** Max content width: 1200px

## Animation Specifications

### Counter Animation (Framer Motion)
```typescript
// Animated counter from 0 to target value
// Triggers once on component mount (page load), no re-trigger on scroll
const counterAnimation = {
  initial: { value: 0 },
  animate: { value: targetValue },
  transition: {
    duration: 2, // 2 seconds
    ease: 'easeOut'
  }
}
```

### Fade-In Animation
```typescript
// Hero content fade-in on mount
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.8,
    ease: 'easeOut'
  }
}
```

### Stagger Children
```typescript
// Statistics cards stagger animation
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1 // 100ms delay between each
    }
  }
}
```

## Media Handling

### Image
- **Format:** WebP with JPG fallback
- **Optimization:** Responsive srcset
- **Loading:** Lazy load with blur placeholder
- **Aspect Ratio:** 16:9 (maintained via object-fit)
- **Error Handling:** On load failure (404, network error), fall back to solid Pacon Red (#98221F) background with logo overlay

### Video
- **Format:** MP4 (H.264)
- **Autoplay:** Muted, loop
- **Fallback:** Poster image
- **Performance:** Preload metadata only
- **Error Handling:** On playback failure, fall back to solid Pacon Red (#98221F) background with logo overlay

## CTA Specifications

### Primary CTA ("Jetzt bewerben")
- **Background:** Primary color (#98221F)
- **Text:** White
- **Hover:** Darken 10%
- **Transition:** 200ms ease
- **Padding:** px-6 py-3 (Tailwind)
- **Border Radius:** rounded-md

### Secondary CTA ("Vertrieb kontaktieren")
- **Background:** Transparent
- **Border:** 2px solid primary (#98221F)
- **Text:** Primary color
- **Hover:** Background primary + White text
- **Transition:** 200ms ease
- **Padding:** px-6 py-3 (Tailwind)
- **Border Radius:** rounded-md

### Routing
- Internal links: Use `<Link>` from react-router-dom
- External links: `<a>` with `target="_blank" rel="noopener noreferrer"`

## Accessibility

### ARIA Labels
```tsx
<section
  aria-label="Hero section"
  role="banner"
>
  <h1>{headline}</h1>
  <h2>{subheadline}</h2>
  <div role="region" aria-label="Company statistics">
    {/* Statistics */}
  </div>
  <nav aria-label="Primary actions">
    {/* CTAs */}
  </nav>
</section>
```

### Keyboard Navigation
- All CTAs focusable via Tab
- Focus visible indicators (ring-2 ring-primary)
- Logical tab order: Logo → CTAs → Navigation

### Screen Readers
- Animated counters: Use `aria-live="polite"`
- Media: Alt text for images, captions for videos
- Skip link for background videos

### Color Contrast
- Text on overlay: Minimum WCAG AA (4.5:1)
- Primary CTA: 4.5:1 contrast
- Test with overlay opacity variations

## File Structure

```
src/components/features/hero/
├── hero.ts                    # Barrel export
├── hero-main.tsx              # Main Hero component
├── hero-stats-driven.tsx      # Variant 1
├── hero-split-screen.tsx      # Variant 2
├── hero-fullscreen.tsx        # Variant 3
├── hero-counter.tsx           # Animated counter component
├── hero-media.tsx             # Media component (image/video)
├── hero-cta.tsx               # CTA button component
└── types.ts                   # TypeScript interfaces
```

## Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.9.5",
  "framer-motion": "^12.23.24",
  "tailwind-merge": "^3.3.1",
  "clsx": "^2.1.1"
}
```

## Example Usage

```tsx
import { Hero } from '@/components/features/hero';

function LandingPage() {
  return (
    <Hero
      variant="stats-driven"
      headline="Facility Management Excellence"
      subheadline="Wir lieben Technik"
      media={{
        type: 'image',
        src: '/images/hero-bg.webp',
        alt: 'Pacon Real Estate Team'
      }}
      stats={[
        { value: 1000, label: 'Mitarbeiter', suffix: '+' },
        { value: 35, label: 'Standorte' },
        { value: 2000, label: 'Kunden', suffix: '+' }
      ]}
      ctas={[
        { label: 'Jetzt bewerben', href: '/karriere', variant: 'primary' },
        { label: 'Vertrieb kontaktieren', href: '/kontakt', variant: 'secondary' }
      ]}
    />
  );
}
```

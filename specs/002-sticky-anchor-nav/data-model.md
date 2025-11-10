# Data Model: Sticky Anchor Navigation

**Feature**: `002-sticky-anchor-nav`
**Date**: 2025-11-07
**Status**: Complete

## Overview

This feature is primarily UI-focused with client-side state management. No database entities required. All data structures are TypeScript interfaces for runtime type safety.

---

## 1. Core Entities

### 1.1 PageAnchorConfig

**Description**: Represents a single anchor link configuration for a page section.

**Attributes**:
- `id` (string, required): HTML element ID of the target section (e.g., "mission", "values")
- `label` (string, required): Display text for the anchor link
- `i18nKey` (string, optional): Translation key for internationalized label (e.g., "about.navigation.mission")

**Validation Rules**:
- `id` must be valid HTML ID (alphanumeric + hyphens, no spaces)
- `id` must correspond to actual section ID in DOM
- `label` must not be empty string
- `i18nKey` if provided must exist in translation files

**Example**:
```typescript
{
  id: "mission",
  label: "Mission",
  i18nKey: "about.navigation.mission"
}
```

---

### 1.2 PageLayoutContext

**Description**: Context object passed from page components to layout via React Router Outlet Context.

**Attributes**:
- `anchors` (PageAnchorConfig[], optional): Array of anchor configurations for current page

**Relationships**:
- Contains 0-n `PageAnchorConfig` items
- Provided by page component (About, Career, etc.)
- Consumed by NavigationHeader component

**Validation Rules**:
- `anchors` array can be undefined (pages without anchor navigation)
- `anchors` array can be empty (explicit no anchors)
- `anchors` if provided must contain unique `id` values

**Example**:
```typescript
{
  anchors: [
    { id: "mission", label: "Mission", i18nKey: "about.navigation.mission" },
    { id: "values", label: "Values", i18nKey: "about.navigation.values" }
  ]
}
```

---

### 1.3 ActiveSectionState (Runtime Only)

**Description**: React state tracking which section is currently active based on scroll position.

**Attributes**:
- `activeSectionId` (string | null): ID of currently active section, null if none active

**State Transitions**:
1. **Initial**: `null` (page load, no section in view)
2. **Scrolling**: Updates to section ID when Intersection Observer detects new active section
3. **Click Navigation**: Immediately sets to clicked section ID
4. **Page Change**: Resets to `null`

**Validation Rules**:
- Must correspond to one of the `PageAnchorConfig.id` values from current page
- Can be `null` when at top of page before first section

---

## 2. Component Props Interfaces

### 2.1 NavigationHeaderProps

**Description**: Props for NavigationHeader component (existing navbar extended).

**Attributes**:
- `anchors` (PageAnchorConfig[], optional): Anchor links to display below main menu

**Usage**:
```typescript
<NavigationHeader anchors={pageAnchors} />
```

---

### 2.2 AnchorLinksProps

**Description**: Props for horizontal anchor navigation component (new).

**Attributes**:
- `anchors` (PageAnchorConfig[], required): Anchor links to render
- `activeId` (string | null, optional): Currently active section ID for highlighting

**Usage**:
```typescript
<AnchorLinks anchors={anchors} activeId={activeSectionId} />
```

---

### 2.3 MobileAnchorLinksProps

**Description**: Props for anchor links in mobile navigation sheet (new).

**Attributes**:
- `anchors` (PageAnchorConfig[], required): Anchor links to render in sheet

**Usage**:
```typescript
<MobileAnchorLinks anchors={anchors} />
```

---

## 3. Hook Return Types

### 3.1 useScrollSpy

**Description**: Custom hook for detecting active section via Intersection Observer.

**Parameters**:
- `sectionIds` (string[], required): Array of section IDs to observe

**Returns**:
- `activeSectionId` (string | null): Currently active section ID

**Example**:
```typescript
const activeSectionId = useScrollSpy(['mission', 'values', 'regions']);
```

---

### 3.2 usePageLayout

**Description**: Type-safe wrapper around `useOutletContext` for accessing page layout context.

**Parameters**: None

**Returns**:
- `PageLayoutContext`: Context object with optional anchors array

**Example**:
```typescript
const { anchors } = usePageLayout();
```

---

### 3.3 useMediaQuery

**Description**: Hook for responsive behavior based on viewport width.

**Parameters**:
- `query` (string, required): CSS media query (e.g., "(max-width: 767px)")

**Returns**:
- `matches` (boolean): Whether media query currently matches

**Example**:
```typescript
const isMobile = useMediaQuery("(max-width: 767px)");
```

---

## 4. Data Flow Diagram

```
┌─────────────────┐
│  Page Component │ (e.g., About.tsx)
│  (defines       │
│   anchors)      │
└────────┬────────┘
         │ Outlet Context
         ▼
┌─────────────────┐
│ LayoutWithHeader│
│ (extracts       │
│  anchors)       │
└────────┬────────┘
         │ Props
         ▼
┌─────────────────┐
│NavigationHeader │
│ (renders        │
│  anchor nav)    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Desktop     Mobile
(Header)    (Sheet)
    │         │
    └────┬────┘
         │ Click Handler
         ▼
  scrollIntoView()
         │
         ▼
┌─────────────────┐
│ useScrollSpy    │
│ (Intersection   │
│  Observer)      │
└────────┬────────┘
         │ State Update
         ▼
┌─────────────────┐
│ Active Highlight│
│ (Pacon Red)     │
└─────────────────┘
```

---

## 5. Translation Structure

### 5.1 Page-Specific Translations

**Location**: `src/pages/{page}/i18n/locales/de.json`

**Structure**:
```json
{
  "about": {
    "navigation": {
      "mission": "Mission",
      "values": "Werte",
      "regions": "Regionen",
      "references": "Referenzen",
      "testimonials": "Kundenstimmen",
      "certifications": "Zertifikate",
      "customers": "Kunden",
      "news": "News"
    }
  }
}
```

**Merge Pattern**:
All page translations merged in `src/shared/i18n/config.ts` and accessed via `useTranslation()` hook.

---

## 6. CSS Classes (Tailwind)

### 6.1 Sticky Header
- `sticky top-0 z-50`: Makes header stick to top
- `bg-white border-b`: Background and border styling

### 6.2 Anchor Navigation
- `hidden md:block`: Desktop only (≥768px)
- `md:hidden`: Mobile only (<768px)
- `scroll-mt-24`: Scroll offset for sections (24 = 6rem = 96px)

### 6.3 Active State
- Text color: `text-[#C41E3A]` (Pacon Red)
- Or use CSS variable if defined: `text-primary`

---

## 7. No Database Required

This feature is entirely client-side with no persistence requirements:
- ❌ No Supabase tables
- ❌ No API endpoints
- ❌ No localStorage (configuration is code-based)
- ❌ No server-side state

All data structures exist only in TypeScript type system and React runtime state.

---

## 8. Type Definitions Location

All interfaces should be defined in:
- `src/shared/types/page-config.ts` - Core entities (PageAnchorConfig, PageLayoutContext)
- Component-specific props - Colocated with component files

---

## Summary

**Primary Entity**: `PageAnchorConfig` (anchor link definition)
**Context Object**: `PageLayoutContext` (page-to-layout communication)
**Runtime State**: `activeSectionId` (scroll position tracking)
**Storage**: None (ephemeral, code-based configuration)
**Relationships**: Simple array composition, no complex relations

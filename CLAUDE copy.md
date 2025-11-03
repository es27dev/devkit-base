# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + react-router-dom + react-i18next + Supabase + react-hook-form + Zod

## Development Commands

```bash
npm run dev          # Dev server auf Port 5173
npm run build        # Production build → dist/
npm run preview      # Preview des Production Builds
npm run type-check   # TypeScript prüfen ohne Build
```

## Path Aliases

- `@/` → `src/`
- Examples:
  - `import { cn } from '@/shared/lib/utils'`
  - `import { Button } from '@/components/base/button'`
  - `import Home from '@/pages/Home'`

## Refactoring Principles

**Bottom-Up Approach:**

When refactoring components, always start from **leaf components** (no dependencies) and move up the dependency tree.

**Why:** Changes propagate upward, not downward. Refactoring leaves first ensures parent components receive stable, tested components.

**Example Dependency Tree:**

```
ProductShowcase (Root)
└── ProductShowcaseContent
    ├── ImageGallery
    │   └── ProductCard ← START HERE (Leaf)
    └── SheetProductContent
```

**Refactoring Order:**

1. ProductCard (Leaf - no dependencies)
2. ImageGallery (uses ProductCard)
3. ProductShowcaseContent (uses ImageGallery)
4. ProductShowcase (Root)

## Architecture Overview

### Component Structure (Feature-Sliced Design Inspired)

```
src/
├── components/
│   ├── base/              # shadcn/ui primitives (Button, Sheet, etc.)
│   ├── blocks/            # Reusable UI composition (hero, carousels, galleries)
│   └── features/          # Business logic + API/DB access (invoice-form, productFeature)
├── pages/                 # Route-level components (Home, About, Sales, Career)
├── shared/
│   ├── i18n/             # i18next config + locales (German default)
│   ├── lib/              # Utilities (cn() from tailwind-merge + clsx)
│   └── hooks/            # Shared React hooks
└── main.tsx              # Entry: React.StrictMode + BrowserRouter + i18n init
```

**blocks/ vs. features/ Decision Criteria:**

- **blocks/**: Pure UI composition, no business logic/API/database access. Props-based, reusable across contexts.
- **features/**: Business logic, API calls, Supabase queries, use-case-specific. Often uses Context API for complex state.

### Key Patterns

**Component File Naming:**

- Files: `kebab-case.tsx` (e.g., `product-showcase.tsx`)
- Exports: `PascalCase` **named exports only** (e.g., `export function ProductShowcase()`)
- **No default exports** - always use named exports for consistency
- **One component per file** - prevents re-creation on parent re-render (exception: barrel exports)
- Barrel exports: named barrel files (e.g., `product-feature.ts`)

**Feature Organization Pattern:**

Features (in `components/features/`) follow a self-contained structure:

```
components/features/productFeature/
├── product-showcase.tsx          # Component files (kebab-case)
├── product-feature-context.tsx   # Context/state management
├── product-feature.ts            # Barrel export (named exports only!)
└── i18n/
    └── locales/
        └── de.json               # Feature-specific translations
```

**Barrel Export Rules:**

- File name matches feature name: `product-feature.ts`
- **Only named exports** (NEVER `export default`)
- Re-export all public components from the feature

Example barrel (`product-feature.ts`):

```typescript
// Named exports only!
export { ProductShowcase } from "./product-showcase";
export {
  ProductFeatureProvider,
  useProductFeature,
} from "./product-feature-context";
```

Usage:

```typescript
// Import from barrel
import { ProductShowcase } from "@/components/features/productFeature/product-feature";

// NOT from individual files (unless internal to feature)
// ❌ import { ProductShowcase } from '@/components/features/productFeature/product-showcase';
```

**Import Organization (VSCode Foldable Regions):**

```tsx
//###--------------------------------------------------------IMPORTS-----------------------------------------------------------------------##
//#region IMPORTS
//#region Core/Libs

//  React Core
import { useEffect, useState } from "react";

//  External Libraries
import { useTranslation } from "react-i18next";
//#endregion

//#region Components

//Components - base (shadcn)
import { Button } from "../../base/button";

//Components - blocks (reusable UI)

//Components - features (business logic)

//#endregion

//#region Icons
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
//#endregion

//#region Local Module (in-feature-only-ordered-by-hierachie)
import { ServiceItem } from "./product-card";
import { useProductFeature } from "./product-feature-context";
import { ProductCard } from "./product-feature";
//#endregion

//#endregion
//###--------------------------------------------------------IMPORTS-----------------------------------------------------------------------##

//###--------------------------------------------------------INTERFACE-----------------------------------------------------------------------##
//#region Interfaces
// Function Parameters
interface UpdateCardParams { ... }

// Data/Entities
export interface ServiceItem { ... }

// Component Props
interface ComponentNameProps { ... }
//#endregion
//###--------------------------------------------------------INTERFACE-----------------------------------------------------------------------##

export function ComponentName({...}: ComponentNameProps) {
  //###-------------------------COMPONENT LOGIC-----------------------------##
  //#region COMPONENT LOGIC

  //#region Hooks
  const [state, setState] = useState();
  const itemRef = useRef<HTMLDivElement>(null);
  //#endregion

  //#region Translations
  const { t } = useTranslation();
  const serviceItemList = t("feature.services", { returnObjects: true }) as ServiceItem[];
  //#endregion

  //#region Data Loading
  //#endregion

  //#region Early Returns
  //#endregion

  //#region Computed Data
  const currentItem = serviceItemList.find(item => item.value === selectedValue);
  const name = currentItem?.name || "";
  const description = currentItem?.description || "";
  //#endregion

  //#region Event Handlers
  const handleClick = () => {...};
  //#endregion

  //#region Effects
  useEffect(() => {...}, []);
  //#endregion

  //#endregion
  //###-------------------------COMPONENT LOGIC-----------------------------##

  //###-------------------------RETURN-----------------------------##
  //#region RETURN
  return <div>...</div>;
  //#endregion
  //###-------------------------RETURN-----------------------------##
}
```

**Region Rules:**

- **Nested structure:** Sub-regions without "Component Logic -" prefix (parent already defines scope)
- **Always present:** All 7 regions included even if empty (no omissions)
- **No numbering:** Region names without numbers for clean foldability
- **VSCode support:** Full collapsible nesting with parent/child regions
- **Separators:** `//###` markers for visual separation (function-level shorter than file-level)

**Translation vs Data Loading:**

- **Translations:** All i18n data via `t()` (even `returnObjects: true`)
- **Data Loading:** API calls, Supabase, localStorage, props (NOT i18n)

**Reusability through Clean Separation:**

The region structure enhances reusability by isolating the data source. Change **only** the Data Loading region to adapt the component:

```tsx
// Option 1: Props
//#region Data Loading
const serviceItemList = props.services;
//#endregion

// Option 2: API data
//#region Data Loading
const serviceItemList = await fetchServices();
//#endregion

// Option 3: Supabase
//#region Data Loading
const { data: serviceItemList } = await supabase.from('services').select();
//#endregion
```

All other regions (Translations, Computed Data, Event Handlers, Effects, Return) remain **identical** across all variants.

**VSCode Folding Shortcuts:**

- `Ctrl+K Ctrl+0` - Collapse all regions
- `Ctrl+K Ctrl+J` - Expand all regions
- Click arrow in gutter - Toggle individual region

### Naming Conventions

**Interface Naming (Standard Suffixes):**

```typescript
// Component Props
interface ProductCardProps { ... }

// Function Parameters
interface UpdateCardParams { ... }
interface CardConfig { ... }

// Data Entities (Array Items)
interface ServiceItem { ... }
interface ProductItem { ... }

// State/Transform/Single Entities (No Suffix)
interface CardTransform { ... }
interface User { ... }
```

**Variable Naming (Explicit & Balanced):**

```tsx
// ✅ Explicit for spreads
const productCardProps = { imageSrc: "...", value: "..." };
<ProductCard {...productCardProps} />

// ✅ Explicit for lists
const serviceItemList: ServiceItem[] = [ ... ];

// ✅ Standard in short scopes (loops, maps)
serviceItemList.map(item => <div key={item.value}>{item.name}</div>)

// ❌ Too redundant
const serviceItemListData: ServiceItem[] = [ ... ];

// ❌ Too generic (avoid at component level)
const data = fetchData();
const props = { ... };
```

**Naming Rules Summary:**

- **Interfaces:** Use standard suffixes (Props, Params, Item) for clarity
- **Variables:** Explicit at component/feature level, standard in short scopes
- **Spreads:** Always use explicit naming (e.g., `productCardProps` not `props`)
- **Lists:** Add `List` suffix (e.g., `serviceItemList`)
- **Short scopes:** Standard shortcuts OK (`item`, `idx` in loops)

**Interface Organization (Grouped by Type):**

```tsx
// 1. React Core
import { useState } from "react";

// 2. External Libraries
import { useTranslation } from "react-i18next";

// 3. Base Components
import { Button } from "@/components/base/button";

// Function Parameters
interface CardTransformParams {
  rotateX: number;
  rotateY: number;
  scale: number;
}

// Data/Entities
export interface ServiceItem {
  selectedItemValue: string;
  itemName: string;
  description: string;
  imageUrl: string;
}

// Component Props
interface ProductCardProps extends ServiceItem {
  sheetTrigger?: React.ReactNode;
}

export function ProductCard() { ... }
```

**Interface Grouping Order:**

1. **Function Parameters** - Params, Config, Options interfaces
2. **Data/Entities** - ServiceItem, User, Product (often exported)
3. **Component Props** - ComponentNameProps (always last before component)

### Context API Patterns

Feature-scoped state management using Context API:

- Create context provider in feature folder (e.g., `product-feature-context.tsx`)
- Export custom hook for consuming context (e.g., `useProductFeature()`)
- Wrap feature root with provider to avoid prop drilling
- Use Context for feature-level state, not global app state

### State Management

**Decision Tree (simple → complex):**

1. **Component-local** (`useState`/`useReducer`) - Default for <3 components
2. **URL State** (React Router Search Params) - Shareable, bookmarkable filters/tabs
3. **Persistent** (localStorage/sessionStorage) - Browser-native persistence (theme, cookie banner)
4. **Feature-scoped** (Context API) - 3+ components in feature, prop drilling avoidance
5. **Server State** (TanStack Query) - API/DB data with caching, revalidation, background sync
6. **Global** (Zustand) - App-wide: Auth, Theme, UI preferences

**Organization:**

- Feature Context: `src/components/features/{feature}/{feature}-context.tsx`
- Global Zustand: `src/shared/stores/{store-name}.ts`
- Persistent helpers: `src/shared/lib/storage.ts`

**Examples:**

```tsx
// 1. Component-local
const [count, setCount] = useState(0);

// 2. URL State (React Router v7)
const [searchParams, setSearchParams] = useSearchParams();
const filter = searchParams.get("filter") || "all";

// 3. Persistent
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");

// 4. Feature-scoped Context (see product-feature-context.tsx)
const { selectedKey, setSelectedKey } = useProductFeature();

// 5. Server State (TanStack Query - install when needed)
const { data } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});

// 6. Global (Zustand - install when needed)
const { user, setUser } = useAuthStore();
```

**Anti-Patterns:**

- ❌ Zustand for feature-local state → Use Context API
- ❌ Context API for global state → Use Zustand
- ❌ localStorage for server data → Use TanStack Query
- ❌ Prop drilling >3 levels → Use Context API

### Performance Optimization

**Note:** All components are performance-tested after implementation using Chrome DevTools MCP (see webapp-testing skill).

**useMemo** - Cache expensive calculations:

```tsx
const sorted = useMemo(() => items.sort(...), [items]);
```

**useCallback** - Stabilize function references:

```tsx
const handleClick = useCallback(() => doSomething(value), [value]);
```

**React.memo** - Prevent unnecessary re-renders:

```tsx
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
```

**When to use (SEO-driven thresholds):**

- **useMemo:**

  - Above-the-fold: Arrays >50 items, calculations >3ms
  - Below-the-fold: Arrays >100 items, calculations >5ms
  - Always: Object/Array props for React.memo children

- **useCallback:**

  - Above-the-fold: All event handlers in Hero/Navigation/CTA
  - Below-the-fold: Callbacks for React.memo components, useEffect dependencies
  - Always: API call triggers (prevents duplicate requests)

- **React.memo:**
  - Above-the-fold: Hero, Navigation, CTA sections
  - Below-the-fold: Components with >3 re-renders/second, >10 children
  - Always: Heavy rendering (SVG, Canvas, complex DOM)

**When NOT to use:**

- Primitives (strings, numbers, booleans)
- Small arrays/objects (<50 items for above-the-fold, <100 for below-the-fold)
- Components without measured performance issues

**Performance targets (Google Core Web Vitals):**

- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

**Measurement:** Use Chrome DevTools Lighthouse or webapp-testing skill performance pattern.

### Routing

React Router DOM v7 with declarative routes in `App.tsx`:

- Root redirects to `/home`
- German route names (e.g., `/mehr-erfahren`, `/karriere`, `/vertrieb`)
- Layout: Fixed navbar + responsive main content (max-width: 1400px)

### Internationalization

**Pattern: Feature-Co-Located Translations with Global Merge**

Translation files are organized by feature/page and merged in global config:

```
src/
├── shared/i18n/
│   ├── config.ts              # Imports & merges all translations
│   └── locales/de.json        # Common/global translations
├── pages/i18n/
│   └── locales/de.json        # Page-specific translations
├── components/blocks/[block]/i18n/
│   └── locales/de.json        # Block-specific translations
└── components/features/[feature]/i18n/
    └── locales/de.json        # Feature-specific translations
```

**Configuration Pattern:**

```tsx
// src/shared/i18n/config.ts
// External Libraries
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Common Translations
import commonDe from "./locales/de.json";

// Component Translations (Blocks + Features)
import productFeatureDe from "@/components/features/productFeature/i18n/locales/de.json";

// Page Translations
import pagesDe from "@/pages/i18n/locales/de.json";

// Merge all translations into one flat object
const mergedDe = {
  ...commonDe,
  ...productFeatureDe,
  ...pagesDe,
};

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: mergedDe },
  },
  lng: "de",
  fallbackLng: "de",
  interpolation: { escapeValue: false },
});
```

**Usage:**

- All components: `const { t } = useTranslation()`
- Access any key: `t('sales.hero.title')`, `t('feature.services[0].name')`, `t('common.loading')`
- Arrays/Objects: `t('key', { returnObjects: true })`

**Benefits:**

- Co-location: Translations live near their components
- Single import: Components don't import translation files directly
- No namespace complexity: One flat merged object
- Scalable: Add new translation files by importing in config

### Forms

- **react-hook-form** + **Zod** for type-safe form validation
- Form components in `src/components/features/invoice-form/`
- Unified field component pattern: `UnifiedFormField` wraps all control types
- Control types: Input, Textarea, Select, Checkbox, Radio, Slider, Combobox, DatePicker

## shadcn/ui Integration

- Components installed in `src/components/base/`
- Config: [components.json](components.json) (style: "new-york", CSS variables enabled)
- Add components: `npx shadcn@latest add button`
- Custom navbar component in `src/components/base/navbar/`

## Styling

- Tailwind CSS with CSS variables for theming
- `cn()` utility in `src/shared/lib/utils.ts` (tailwind-merge + clsx)
- Theme variables in `src/index.css`
- Dark mode support via `next-themes` (attribute="class")
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`

## TypeScript

- Strict mode enabled
- ESNext module system with bundler resolution
- `noEmit: true` (Vite handles builds separately)
- Path mapping: `@/*` → `src/*` (tsconfig.json + vite.config.ts)

---

Du bist mein persönlicher Programmierlehrer.

Ziel:

- Ich will selbst lernen, nicht bloß Lösungen kopieren.
- Du erklärst Konzepte nur, wenn ich explizit nachfrage oder hängenbleibe.

Regeln:

1. Schreibe nur minimalen Code, wenn nötig zum Verständnis.
2. Gib kurze, präzise Antworten – keine langen Erklärungen.
3. Wenn ich eine Frage stelle, liefere nur den nächsten logischen Hinweis oder Schritt.
4. Du recherchierst jedes Problem des Nutzers automatisch, nur gibst nicht immer die Lösung vor.
5. Der Nutzer ist angehalten dich als Glossar und Suchassistent zu nutzen.
6. Warte immer auf meine Rückmeldung, bevor du weitermachst.
7. Keine automatischen Komplettlösungen.
8. Verwende prägnante Syntax-Hinweise und Denkanstöße statt fertiger Antworten.
9. Ziel: Ich soll lernen, wie man selbst debuggt, strukturiert denkt und Code liest.

Nutze Context7 MCP und weitere MCP bei komplexen Problemen für fundiertes Wissen.

Ton:

- Direkt, ruhig, sachlich.
- Kein Smalltalk, keine Motivationsphrasen.

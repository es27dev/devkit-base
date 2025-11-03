<!--
SYNC IMPACT REPORT
==================
Version Change: 0.0.0 → 1.0.0
Rationale: Initial constitution creation - establishing foundational governance framework

New Sections Added:
- 1. Tech Stack & Architecture (Non-Negotiable)
- 2. Naming Conventions (Non-Negotiable)
- 3. Component Structure (Framework - Details in /specify)
- 4. State Management (Decision Tree)
- 5. Performance Targets (Non-Negotiable)
- 6. Multi-Agent Workflow (Non-Negotiable)

Template Consistency:
- ✅ spec-template.md: Aligned with constitution requirements
- ✅ plan-template.md: Constitution Check section references this file
- ✅ tasks-template.md: Task organization reflects multi-agent workflow
- ⚠️  Commands: No command files exist yet in .specify/templates/commands/

Follow-up TODOs:
- None - all placeholders filled

Notes:
- This is a "light" constitution with Decision Points marked for /specify and /plan
- German translation created separately in constitution-de.md
- Indexed structure (1.1, 1.2, etc.) for easy cross-language updates
-->

# Base-Template Constitution

**Version**: 1.0.0 | **Ratified**: 2025-11-03 | **Last Amended**: 2025-11-03

---

## 1. Tech Stack & Architecture (Non-Negotiable)

### 1.1 Core Technologies

React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + react-router-dom + react-i18next + Supabase + react-hook-form + Zod

**Rationale**: Established project foundation. Changes require migration plan and constitution amendment.

### 1.2 Architecture Principles

1. **Feature-Sliced Design**: `base/` → `blocks/` → `features/`
2. **Named Exports Only**: NO default exports (prevents refactoring issues)
3. **One Component Per File**: Prevents component re-creation on parent re-render
4. **Path Aliases**: `@/` → `src/` (configured in tsconfig.json + vite.config.ts)

**Rationale**: These patterns enforce consistency and prevent common React anti-patterns.

### 1.3 Directory Structure

```
src/
├── components/
│   ├── base/              # shadcn/ui primitives (Button, Sheet, etc.)
│   ├── blocks/            # Reusable UI composition (no business logic)
│   └── features/          # Business logic + API/DB access
├── pages/                 # Route-level components
├── shared/
│   ├── i18n/             # i18next config + locales
│   ├── lib/              # Utilities (cn() from tailwind-merge + clsx)
│   └── hooks/            # Shared React hooks
└── main.tsx              # Entry point
```

**blocks/ vs. features/ Decision Criteria**:
- `blocks/`: Pure UI composition, no business logic/API/database access. Props-based, reusable.
- `features/`: Business logic, API calls, Supabase queries, use-case-specific.

---

## 2. Naming Conventions (Non-Negotiable)

### 2.1 File Naming

- **Files**: `kebab-case.tsx` (e.g., `product-showcase.tsx`)
- **Exports**: `PascalCase` named exports only (e.g., `export function ProductShowcase()`)
- **Barrel Exports**: Named barrel files (e.g., `product-feature.ts`)

### 2.2 Interface Naming

**Standard Suffixes**:
- Component Props: `ComponentNameProps`
- Function Parameters: `FunctionNameParams`
- Data Entities (Array Items): `EntityItem` (e.g., `ServiceItem`, `ProductItem`)

**Rationale**: Consistent suffixes improve code readability and IDE autocomplete.

### 2.3 Variable Naming

- **Explicit for spreads**: `productCardProps` not `props`
- **Explicit for lists**: `serviceItemList: ServiceItem[]`
- **Standard in short scopes**: `item`, `idx` in loops/maps

---

## 3. Component Structure (Framework - Details in /specify)

### 3.1 Import Organization

**[TO BE DEFINED IN /specify]**: Import grouping strategy for each feature.

**Available Pattern** (7 Regions - not mandatory):
1. Core/Libs (React Core, External Libraries)
2. Components (base, blocks, features)
3. Icons
4. Local Module (in-feature-only, ordered by hierarchy)

### 3.2 Component Regions

**[TO BE DEFINED IN /specify]**: Component structure pattern for each feature.

**Available Pattern** (7 Regions - reference in .claude/agents/coder.md):
1. Hooks
2. Translations
3. Data Loading
4. Early Returns
5. Computed Data
6. Event Handlers
7. Effects

**Rationale**: Region structure enhances reusability by isolating data sources. Change only Data Loading region to adapt component (Props → API → Supabase).

### 3.3 Interface Organization

**Grouping Order**:
1. Function Parameters (Params, Config, Options)
2. Data/Entities (ServiceItem, User, Product - often exported)
3. Component Props (ComponentNameProps - always last before component)

---

## 4. State Management (Decision Tree)

### 4.1 Decision Hierarchy

**[TO BE DEFINED IN /specify per feature]**: Which pattern to use for this feature.

**Decision Tree** (simple → complex):
1. **Component-local** (`useState`/`useReducer`) - Default for <3 components
2. **URL State** (React Router Search Params) - Shareable, bookmarkable filters/tabs
3. **Persistent** (localStorage/sessionStorage) - Theme, cookie banner, preferences
4. **Feature-scoped** (Context API) - 3+ components in feature, prop drilling avoidance
5. **Server State** (TanStack Query) - API/DB data with caching, revalidation
6. **Global** (Zustand) - App-wide: Auth, Theme, UI preferences

**Rule**: Planner agent MUST justify choice in `/specify` based on this hierarchy.

### 4.2 Organization

- Feature Context: `src/components/features/{feature}/{feature}-context.tsx`
- Global Zustand: `src/shared/stores/{store-name}.ts`
- Persistent helpers: `src/shared/lib/storage.ts`

### 4.3 Anti-Patterns

- ❌ Zustand for feature-local state → Use Context API
- ❌ Context API for global state → Use Zustand
- ❌ localStorage for server data → Use TanStack Query
- ❌ Prop drilling >3 levels → Use Context API

---

## 5. Performance Targets (Non-Negotiable)

### 5.1 Core Web Vitals

- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1

**Rationale**: Google Core Web Vitals directly impact SEO and user experience.

### 5.2 Optimization Thresholds

**[TO BE DEFINED IN /plan per feature]**: useMemo/useCallback/React.memo usage thresholds.

**Available Guidelines** (reference in .claude/agents/reviewer.md):

**useMemo**:
- Above-the-fold: Arrays >50 items, calculations >3ms
- Below-the-fold: Arrays >100 items, calculations >5ms

**useCallback**:
- Above-the-fold: All event handlers in Hero/Navigation/CTA
- Below-the-fold: Callbacks for React.memo components, useEffect dependencies

**React.memo**:
- Above-the-fold: Hero, Navigation, CTA sections
- Below-the-fold: Components with >3 re-renders/second, >10 children

**Rule**: Above-the-fold optimizations mandatory. Below-the-fold optimizations based on measured performance.

### 5.3 Testing

All components MUST be performance-tested after implementation using Chrome DevTools MCP (chrome-devtools).

---

## 6. Multi-Agent Workflow (Non-Negotiable)

### 6.1 Agent Roles

**Orchestrator** (CLAUDE.md): Coordinates all agents, no coding.

**Specialized Agents** (.claude/agents/*.md):
- **Planner**: Research + planning (MCP: Context-7, Shadcn, Supabase)
- **Coder**: Implementation with mock data (MCP: Shadcn)
- **Reviewer**: Quality check + minor fixes (MCP: chrome-devtools)
- **Database-Architect**: Supabase integration (MCP: Supabase, chrome-devtools)

**Rationale**: Each agent invocation = new context (no persistence). Specialization reduces token usage.

### 6.2 Workflow

**UI Development Flow**:
1. Planner → Creates plan + context
2. Coder → Implements + self-check (`tsc --noEmit`)
3. Reviewer → Quality check (fixes minor issues himself)
   - Decision: APPROVED / APPROVED (with fixes) / CHANGES REQUESTED
4. If CHANGES REQUESTED → Back to Coder (max 3 iterations)
5. If 3 iterations fail → Orchestrator intervention

**Database Integration Flow** (optional, AFTER Reviewer approval):
6. Database-Architect → Schema + RLS + Supabase integration
7. Final validation

### 6.3 Review Standards

**Three-Tier System**:
- **APPROVED (with fixes)**: Reviewer fixes minor issues (import order, naming) to save tokens
- **CHANGES REQUESTED**: Critical bugs, missing features, structural issues → back to Coder
- **APPROVED AS-IS**: No issues found

---

## 7. Internationalization

### 7.1 Translation Pattern

**Feature-Co-Located Translations with Global Merge**:

```
src/
├── shared/i18n/config.ts              # Imports & merges all translations
├── shared/i18n/locales/de.json        # Common translations
├── pages/i18n/locales/de.json         # Page-specific
├── components/blocks/[block]/i18n/locales/de.json
└── components/features/[feature]/i18n/locales/de.json
```

**Usage**: All components use `const { t } = useTranslation()` - single flat merged object.

**Rationale**: Co-location (translations near components) + no namespace complexity.

---

## 8. Refactoring Principles

### 8.1 Bottom-Up Approach

When refactoring components, ALWAYS start from **leaf components** (no dependencies) and move up the dependency tree.

**Rationale**: Changes propagate upward, not downward. Refactoring leaves first ensures parent components receive stable, tested components.

**Example Order**:
1. ProductCard (Leaf - no dependencies)
2. ImageGallery (uses ProductCard)
3. ProductShowcaseContent (uses ImageGallery)
4. ProductShowcase (Root)

---

## 9. Governance

### 9.1 Constitution Authority

This constitution supersedes all other development practices and guidelines.

### 9.2 Amendment Process

1. **Proposal**: Document proposed change with rationale
2. **Impact Analysis**: Identify affected components, templates, and workflows
3. **Migration Plan**: Create step-by-step migration if breaking change
4. **Version Bump**: Follow semantic versioning (MAJOR.MINOR.PATCH)
5. **Propagation**: Update all dependent files (templates, agent files, CLAUDE.md)

### 9.3 Version Semantics

- **MAJOR**: Backward-incompatible governance/principle removals or redefinitions
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements

### 9.4 Compliance Review

All PRs and agent implementations MUST verify compliance with this constitution.

### 9.5 Decision Point Resolution

All items marked **[TO BE DEFINED IN /specify]** or **[TO BE DEFINED IN /plan]** MUST be resolved during the respective SpecKit command execution.

### 9.6 Runtime Guidance

For detailed implementation guidance, agents should reference:
- **Agent-specific knowledge**: `.claude/agents/*.md`
- **General project knowledge**: `.claude/knowledge/general.md`
- **Orchestrator workflow**: `CLAUDE.md`
- **SpecKit templates**: `.specify/templates/*.md`

---

**Version**: 1.0.0 | **Ratified**: 2025-11-03 | **Last Amended**: 2025-11-03

<!--
SYNC IMPACT REPORT
==================
Version Change: 0.0.0 → 1.0.0
Begründung: Initiale Constitution-Erstellung - Etablierung des grundlegenden Governance-Frameworks

Neue Abschnitte hinzugefügt:
- 1. Tech Stack & Architektur (Nicht verhandelbar)
- 2. Namenskonventionen (Nicht verhandelbar)
- 3. Komponentenstruktur (Framework - Details in /specify)
- 4. State Management (Entscheidungsbaum)
- 5. Performance-Ziele (Nicht verhandelbar)
- 6. Multi-Agent Workflow (Nicht verhandelbar)

Template-Konsistenz:
- ✅ spec-template.md: Ausgerichtet auf Constitution-Anforderungen
- ✅ plan-template.md: Constitution Check Abschnitt referenziert diese Datei
- ✅ tasks-template.md: Task-Organisation reflektiert Multi-Agent Workflow
- ⚠️  Commands: Keine Command-Dateien existieren noch in .specify/templates/commands/

Follow-up TODOs:
- Keine - alle Platzhalter ausgefüllt

Notizen:
- Dies ist eine "light" Constitution mit Decision Points für /specify und /plan
- Englische Übersetzung separat in constitution.md
- Indizierte Struktur (1.1, 1.2, etc.) für einfache sprachübergreifende Updates
-->

# Base-Template Constitution

**Version**: 1.0.0 | **Ratifiziert**: 2025-11-03 | **Zuletzt geändert**: 2025-11-03

---

## 1. Tech Stack & Architektur (Nicht verhandelbar)

### 1.1 Kern-Technologien

React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + react-router-dom + react-i18next + Supabase + react-hook-form + Zod

**Begründung**: Etabliertes Projekt-Fundament. Änderungen erfordern Migrationsplan und Constitution-Amendment.

### 1.2 Architektur-Prinzipien

1. **Feature-Sliced Design**: `base/` → `blocks/` → `features/`
2. **Nur Named Exports**: KEINE default exports (verhindert Refactoring-Probleme)
3. **Eine Komponente pro Datei**: Verhindert Komponenten-Neuerststellung bei Parent-Re-Render
4. **Path Aliases**: `@/` → `src/` (konfiguriert in tsconfig.json + vite.config.ts)

**Begründung**: Diese Patterns erzwingen Konsistenz und verhindern gängige React Anti-Patterns.

### 1.3 Verzeichnisstruktur

```
src/
├── components/
│   ├── base/              # shadcn/ui Primitives (Button, Sheet, etc.)
│   ├── blocks/            # Wiederverwendbare UI-Komposition (keine Business-Logik)
│   └── features/          # Business-Logik + API/DB Zugriff
├── pages/                 # Route-Level Komponenten
├── shared/
│   ├── i18n/             # i18next Config + Locales
│   ├── lib/              # Utilities (cn() from tailwind-merge + clsx)
│   └── hooks/            # Shared React Hooks
└── main.tsx              # Entry Point
```

**blocks/ vs. features/ Entscheidungskriterien**:
- `blocks/`: Reine UI-Komposition, keine Business-Logik/API/Datenbank-Zugriff. Props-basiert, wiederverwendbar.
- `features/`: Business-Logik, API-Calls, Supabase Queries, use-case-spezifisch.

---

## 2. Namenskonventionen (Nicht verhandelbar)

### 2.1 Datei-Benennung

- **Dateien**: `kebab-case.tsx` (z.B. `product-showcase.tsx`)
- **Exports**: `PascalCase` named exports only (z.B. `export function ProductShowcase()`)
- **Barrel Exports**: Named Barrel Files (z.B. `product-feature.ts`)

### 2.2 Interface-Benennung

**Standard-Suffixe**:
- Component Props: `ComponentNameProps`
- Function Parameters: `FunctionNameParams`
- Data Entities (Array Items): `EntityItem` (z.B. `ServiceItem`, `ProductItem`)

**Begründung**: Konsistente Suffixe verbessern Code-Lesbarkeit und IDE-Autocomplete.

### 2.3 Variablen-Benennung

- **Explizit für Spreads**: `productCardProps` nicht `props`
- **Explizit für Listen**: `serviceItemList: ServiceItem[]`
- **Standard in kurzen Scopes**: `item`, `idx` in Loops/Maps

---

## 3. Komponentenstruktur (Framework - Details in /specify)

### 3.1 Import-Organisation

**[IN /specify ZU DEFINIEREN]**: Import-Gruppierungsstrategie für jedes Feature.

**Verfügbares Pattern** (7 Regions - nicht verpflichtend):
1. Core/Libs (React Core, External Libraries)
2. Components (base, blocks, features)
3. Icons
4. Local Module (in-feature-only, geordnet nach Hierarchie)

### 3.2 Komponenten-Regions

**[IN /specify ZU DEFINIEREN]**: Komponentenstruktur-Pattern für jedes Feature.

**Verfügbares Pattern** (7 Regions - Referenz in .claude/agents/coder.md):
1. Hooks
2. Translations
3. Data Loading
4. Early Returns
5. Computed Data
6. Event Handlers
7. Effects

**Begründung**: Region-Struktur verbessert Wiederverwendbarkeit durch Isolation der Datenquellen. Nur Data Loading Region ändern, um Komponente anzupassen (Props → API → Supabase).

### 3.3 Interface-Organisation

**Gruppierungs-Reihenfolge**:
1. Function Parameters (Params, Config, Options)
2. Data/Entities (ServiceItem, User, Product - oft exportiert)
3. Component Props (ComponentNameProps - immer zuletzt vor Komponente)

---

## 4. State Management (Entscheidungsbaum)

### 4.1 Entscheidungshierarchie

**[IN /specify PRO FEATURE ZU DEFINIEREN]**: Welches Pattern für dieses Feature.

**Entscheidungsbaum** (einfach → komplex):
1. **Component-local** (`useState`/`useReducer`) - Standard für <3 Komponenten
2. **URL State** (React Router Search Params) - Shareable, bookmarkable Filter/Tabs
3. **Persistent** (localStorage/sessionStorage) - Theme, Cookie Banner, Einstellungen
4. **Feature-scoped** (Context API) - 3+ Komponenten im Feature, Prop-Drilling vermeiden
5. **Server State** (TanStack Query) - API/DB Daten mit Caching, Revalidation
6. **Global** (Zustand) - App-weit: Auth, Theme, UI Preferences

**Regel**: Planner Agent MUSS Wahl in `/specify` basierend auf dieser Hierarchie begründen.

### 4.2 Organisation

- Feature Context: `src/components/features/{feature}/{feature}-context.tsx`
- Global Zustand: `src/shared/stores/{store-name}.ts`
- Persistent Helpers: `src/shared/lib/storage.ts`

### 4.3 Anti-Patterns

- ❌ Zustand für Feature-Local State → Context API verwenden
- ❌ Context API für Global State → Zustand verwenden
- ❌ localStorage für Server-Daten → TanStack Query verwenden
- ❌ Prop Drilling >3 Levels → Context API verwenden

---

## 5. Performance-Ziele (Nicht verhandelbar)

### 5.1 Core Web Vitals

- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1

**Begründung**: Google Core Web Vitals beeinflussen direkt SEO und User Experience.

### 5.2 Optimierungs-Schwellwerte

**[IN /plan PRO FEATURE ZU DEFINIEREN]**: useMemo/useCallback/React.memo Nutzungs-Schwellwerte.

**Verfügbare Richtlinien** (Referenz in .claude/agents/reviewer.md):

**useMemo**:
- Above-the-fold: Arrays >50 Items, Berechnungen >3ms
- Below-the-fold: Arrays >100 Items, Berechnungen >5ms

**useCallback**:
- Above-the-fold: Alle Event Handler in Hero/Navigation/CTA
- Below-the-fold: Callbacks für React.memo Komponenten, useEffect Dependencies

**React.memo**:
- Above-the-fold: Hero, Navigation, CTA Sections
- Below-the-fold: Komponenten mit >3 Re-Renders/Sekunde, >10 Children

**Regel**: Above-the-fold Optimierungen verpflichtend. Below-the-fold Optimierungen basierend auf gemessener Performance.

### 5.3 Testing

Alle Komponenten MÜSSEN nach Implementierung Performance-getestet werden mit Chrome DevTools MCP (chrome-devtools).

---

## 6. Multi-Agent Workflow (Nicht verhandelbar)

### 6.1 Agent-Rollen

**Orchestrator** (CLAUDE.md): Koordiniert alle Agents, kein Coding.

**Spezialisierte Agents** (.claude/agents/*.md):
- **Planner**: Research + Planung (MCP: Context-7, Shadcn, Supabase)
- **Coder**: Implementierung mit Mock-Daten (MCP: Shadcn)
- **Reviewer**: Qualitätskontrolle + Minor Fixes (MCP: chrome-devtools)
- **Database-Architect**: Supabase Integration (MCP: Supabase, chrome-devtools)

**Begründung**: Jede Agent-Invocation = neuer Context (keine Persistenz). Spezialisierung reduziert Token-Nutzung.

### 6.2 Workflow

**UI Development Flow**:
1. Planner → Erstellt Plan + Context
2. Coder → Implementiert + Self-Check (`tsc --noEmit`)
3. Reviewer → Qualitätskontrolle (fixt minor Issues selbst)
   - Entscheidung: APPROVED / APPROVED (with fixes) / CHANGES REQUESTED
4. Falls CHANGES REQUESTED → Zurück zu Coder (max 3 Iterationen)
5. Falls 3 Iterationen fehlschlagen → Orchestrator-Intervention

**Database Integration Flow** (optional, NACH Reviewer-Approval):
6. Database-Architect → Schema + RLS + Supabase Integration
7. Finale Validierung

### 6.3 Review-Standards

**Drei-Stufen-System**:
- **APPROVED (with fixes)**: Reviewer fixt minor Issues (Import-Order, Naming) um Tokens zu sparen
- **CHANGES REQUESTED**: Kritische Bugs, fehlende Features, strukturelle Probleme → zurück zu Coder
- **APPROVED AS-IS**: Keine Probleme gefunden

---

## 7. Internationalisierung

### 7.1 Translation-Pattern

**Feature-Co-Located Translations mit Global Merge**:

```
src/
├── shared/i18n/config.ts              # Imports & mergt alle Translations
├── shared/i18n/locales/de.json        # Common Translations
├── pages/i18n/locales/de.json         # Page-spezifisch
├── components/blocks/[block]/i18n/locales/de.json
└── components/features/[feature]/i18n/locales/de.json
```

**Verwendung**: Alle Komponenten nutzen `const { t } = useTranslation()` - ein flaches merged Object.

**Begründung**: Co-Location (Translations nahe Komponenten) + keine Namespace-Komplexität.

---

## 8. Refactoring-Prinzipien

### 8.1 Bottom-Up Ansatz

Bei Refactoring von Komponenten, IMMER bei **Leaf Components** (keine Dependencies) beginnen und Dependency Tree hochgehen.

**Begründung**: Änderungen propagieren aufwärts, nicht abwärts. Refactoring von Leaves zuerst stellt sicher, dass Parent Components stabile, getestete Komponenten erhalten.

**Beispiel-Reihenfolge**:
1. ProductCard (Leaf - keine Dependencies)
2. ImageGallery (nutzt ProductCard)
3. ProductShowcaseContent (nutzt ImageGallery)
4. ProductShowcase (Root)

---

## 9. Governance

### 9.1 Constitution-Autorität

Diese Constitution steht über allen anderen Development Practices und Guidelines.

### 9.2 Amendment-Prozess

1. **Proposal**: Dokumentiere vorgeschlagene Änderung mit Begründung
2. **Impact Analysis**: Identifiziere betroffene Komponenten, Templates und Workflows
3. **Migration Plan**: Erstelle Step-by-Step Migration bei Breaking Changes
4. **Version Bump**: Folge Semantic Versioning (MAJOR.MINOR.PATCH)
5. **Propagation**: Update alle abhängigen Dateien (Templates, Agent Files, CLAUDE.md)

### 9.3 Version-Semantik

- **MAJOR**: Rückwärts-inkompatible Governance/Principle Entfernungen oder Neudefinitionen
- **MINOR**: Neue Principle/Section hinzugefügt oder materiell erweiterte Guidance
- **PATCH**: Klarstellungen, Wording, Tippfehler, nicht-semantische Verfeinerungen

### 9.4 Compliance Review

Alle PRs und Agent-Implementierungen MÜSSEN Compliance mit dieser Constitution verifizieren.

### 9.5 Decision Point Resolution

Alle Items markiert mit **[IN /specify ZU DEFINIEREN]** oder **[IN /plan ZU DEFINIEREN]** MÜSSEN während der jeweiligen SpecKit Command Ausführung aufgelöst werden.

### 9.6 Runtime Guidance

Für detaillierte Implementierungs-Guidance sollten Agents referenzieren:
- **Agent-spezifisches Wissen**: `.claude/agents/*.md`
- **Allgemeines Projekt-Wissen**: `.claude/knowledge/general.md`
- **Orchestrator Workflow**: `CLAUDE.md`
- **SpecKit Templates**: `.specify/templates/*.md`

---

**Version**: 1.0.0 | **Ratifiziert**: 2025-11-03 | **Zuletzt geändert**: 2025-11-03

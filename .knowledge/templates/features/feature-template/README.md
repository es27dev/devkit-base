# Feature Template

Complete feature folder structure for business logic components with optional state management.

## Directory Structure

```
feature-template/
├── feature-template.ts              # Barrel export (named exports only)
├── feature-main.tsx                 # Main component (with minimal structure)
├── feature-main.cleaned.tsx         # Main component (structure only, AI-optimized)
├── feature-sub-component.tsx        # Sub component (with minimal structure)
├── feature-sub-component.cleaned.tsx # Sub component (structure only, AI-optimized)
├── i18n/
│   └── locales/
│       └── de.json                  # Feature-specific translations
└── README.md
```

## Usage

### Create New Feature

```bash
# Copy entire feature template folder
cp -r .claude/templates/features/feature-template src/components/features/my-feature

# Rename files:
# - feature-template.ts → my-feature.ts
# - feature-main.tsx → my-feature-main.tsx (or keep generic name)
# - feature-sub-component.tsx → actual-component-name.tsx
# - Delete .cleaned.tsx files after copying base versions

# Update all references:
# - Replace "FeatureMain" with "MyFeatureMain" in all files
# - Replace "FeatureSubComponent" with actual component names
# - Replace "feature-template" with "my-feature" in imports
# - Update i18n keys in de.json
```

### Component File Options

**Option 1: With minimal structure (manual development)**
- Use `feature-main.tsx` and `feature-sub-component.tsx`
- Contains minimal comments for guidance

**Option 2: Cleaned structure (AI-assisted)**
- Use `feature-main.cleaned.tsx` and `feature-sub-component.cleaned.tsx`
- Structure only, no comments
- AI fills by referencing existing components

## State Management

Features often need state management. Choose from 6 patterns in `.claude/templates/state-management/`:

### Decision Tree

1. **Component-local** (`useState`) - Default for <3 components
2. **URL State** (Search Params) - Shareable filters/tabs
3. **Persistent** (localStorage) - Theme, preferences
4. **Feature-scoped Context** - 3+ components, shared state
5. **Server State** (TanStack Query) - API/DB data
6. **Global** (Zustand) - App-wide state

### Add Context to Feature

```bash
# Copy Context template
cp .claude/templates/state-management/4-feature-scoped-context.tsx src/components/features/my-feature/my-feature-context.tsx

# Update barrel export (my-feature.ts):
export {
  FeatureProvider,
  useFeature,
} from "./my-feature-context";

# Wrap feature root with Provider
```

**See:** `.claude/templates/state-management/README.md` for all options

## Template Structure

### Barrel Export (`feature-template.ts`)

```typescript
// Named exports only (NO default exports)
export { FeatureMain } from "./feature-main";
export { FeatureSubComponent } from "./feature-sub-component";

// Optional: If using Context
// export { FeatureProvider, useFeature } from "./my-feature-context";
```

### Component Structure

All components follow standard regions:

```typescript
//### IMPORTS ###
//#region Hooks
//#region Translations
//#region Data Loading
//#region Early Returns
//#region Computed Data
//#region Event Handlers
//#region Effects
//### RETURN ###
```

### Translations (`i18n/locales/de.json`)

```json
{
  "feature": {
    "title": "Feature Title",
    "items": [{ "id": "item1", "name": "Item Name" }]
  }
}
```

## Examples

- **Live example:** `src/components/features/product-feature/`
- **With Context:** `src/components/features/product-feature/product-feature-context.tsx`

## Related Documentation

- **Component conventions:** `CLAUDE.md` → Component Structure
- **State management:** `CLAUDE.md` → State Management
- **State templates:** `.claude/templates/state-management/`

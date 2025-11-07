# State Management Templates

Minimal templates for the 6 state management patterns from CLAUDE.md.

## Decision Tree (simple → complex)

1. **Component-local** - Default for <3 components
2. **URL State** - Shareable, bookmarkable filters/tabs
3. **Persistent** - Browser-native persistence (theme, cookie banner)
4. **Feature-scoped Context** - 3+ components in feature, prop drilling avoidance
5. **Server State** - API/DB data with caching, revalidation, background sync
6. **Global Zustand** - App-wide: Auth, Theme, UI preferences

## Usage

Copy the template file that matches your use case:

```bash
# 1. Component-local (no copy needed, use directly)

# 2. URL State (add to existing component)

# 3. Persistent (add to existing component)

# 4. Feature-scoped Context
cp .claude/templates/state-management/4-feature-scoped-context.tsx src/components/features/my-feature/my-feature-context.tsx

# 5. Server State (requires TanStack Query install)
npm install @tanstack/react-query

# 6. Global Zustand (requires Zustand install)
npm install zustand
cp .claude/templates/state-management/6-global-zustand.ts src/shared/stores/auth-store.ts
```

## Organization

- **Feature Context:** `src/components/features/{feature}/{feature}-context.tsx`
- **Global Zustand:** `src/shared/stores/{store-name}.ts`
- **Persistent helpers:** `src/shared/lib/storage.ts`

## Anti-Patterns

- ❌ Zustand for feature-local state → Use Context API
- ❌ Context API for global state → Use Zustand
- ❌ localStorage for server data → Use TanStack Query
- ❌ Prop drilling >3 levels → Use Context API

## Related Documentation

- Full patterns: `CLAUDE.md` → State Management
- Context example: `src/components/features/product-feature/product-feature-context.tsx`

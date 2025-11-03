# Templates

Code templates for consistent project structure and conventions.

## Directory Structure

```
templates/
├── components/
│   ├── react-component-template.tsx         # With minimal examples
│   └── react-component-template.cleaned.tsx # Structure only (AI-optimized)
├── features/
│   └── feature-template/                    # Complete feature folder template
│       ├── feature-template.ts              # Barrel export
│       ├── feature-template-context.tsx     # Context Provider + hook
│       ├── feature-main.tsx                 # Main component
│       ├── feature-sub-component.tsx        # Sub component
│       └── i18n/
│           └── locales/
│               └── de.json                  # Translations
└── README.md
```

## Usage

### React Components

**Option 1: Manual Development (with examples)**
```bash
cp .claude/templates/components/react-component-template.tsx src/components/features/my-feature/my-component.tsx
```

**Option 2: AI-Assisted Development (cleaned)**
```bash
cp .claude/templates/components/react-component-template.cleaned.tsx src/components/features/my-feature/my-component.tsx
# AI fills structure by referencing existing components
```

**Customization steps:**
1. Rename `ComponentName` to your component name
2. Uncomment/add needed imports
3. Add interfaces
4. Fill regions with implementation

### Features (Business Logic + Context)

**Create new feature:**
```bash
# Copy entire feature template folder
cp -r .claude/templates/features/feature-template src/components/features/my-feature

# Rename all files:
# - feature-template.ts → my-feature.ts
# - feature-template-context.tsx → my-feature-context.tsx
# - feature-main.tsx → my-feature-main.tsx
# - feature-sub-component.tsx → (rename to actual component)

# Update all references:
# - Replace "FeatureTemplate" with "MyFeature" in all files
# - Replace "feature-template" with "my-feature" in imports
# - Update i18n keys in de.json
```

**Template includes:**
- ✅ Barrel export with named exports
- ✅ Context Provider + custom hook
- ✅ Main component using context
- ✅ Sub component using context
- ✅ i18n structure

## Template Philosophy

**Templates provide structure, not implementation:**
- All templates include full region structure
- Regions contain minimal examples (1 per category)
- Implementation details documented in `CLAUDE.md`
- Existing components serve as concrete examples

**Token optimization:**
- Minimal examples reduce token usage
- AI can reference real components for patterns
- Templates focus on structure over documentation

## Adding New Templates

When adding templates:
1. Create category subdirectory if needed
2. Use minimal examples (1-liner per section)
3. Keep structure consistent with conventions
4. Document usage in this README

## Related Documentation

- **Component Conventions:** See `CLAUDE.md` → Component Structure
- **Live Examples:** See `src/components/features/product-feature/`
- **Import Organization:** See `CLAUDE.md` → Import Organization

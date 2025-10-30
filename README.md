# DevKit Base Template

Ein minimales, produktionsbereites Template für React-Apps mit dem DevKit-Stack.

## Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Utility-First CSS
- **shadcn/ui** - Component System (Ready to use)
- **next-themes** - Dark Mode Support

## Projekt-Struktur

```
base-template/
├── src/
│   ├── components/
│   │   └── base/          # Platz für shadcn/ui Components
│   ├── lib/
│   │   └── utils.ts       # cn() utility für Tailwind
│   ├── App.tsx            # Main App Component
│   ├── main.tsx           # Entry Point
│   └── index.css          # Global Styles + Theme Variables
├── public/                # Static Assets
├── index.html             # HTML Entry
├── package.json
├── vite.config.ts         # Vite Configuration
├── tsconfig.json          # TypeScript Config
├── tailwind.config.js     # Tailwind Config
└── postcss.config.js      # PostCSS Config
```

## Quick Start

### 1. Installation (vom devkit root aus)

```bash
# Dependencies installieren (falls noch nicht geschehen)
npm install
```

Die Template nutzt die Dependencies vom Hauptprojekt.

### 2. Development Server starten

```bash
# Vom devkit root:
npm run dev:base-template

# Oder direkt im Template-Ordner:
cd resources/apps/base-template
npm run dev
```

Die App läuft auf: http://localhost:5174

### 3. Build für Production

```bash
npm run build
```

Build Output: `dist/`

## Als eigenständiges Projekt kopieren

Du kannst dieses Template als Basis für ein komplett eigenständiges Projekt nutzen:

```bash
# 1. Template in neuen Ordner kopieren
cp -r resources/apps/base-template /pfad/zu/deinem/neuen-projekt

# 2. Ins neue Projekt wechseln
cd /pfad/zu/deinem/neuen-projekt

# 3. Dependencies installieren
npm install

# 4. Development starten
npm run dev
```

### Anpassungen für eigenständiges Projekt

Wenn du das Template außerhalb des DevKit verwendest, musst du:

1. **vite.config.ts** anpassen:
   - Entferne die Referenz zu `../../../vite.base.config`
   - Nutze eine Standard-Vite-Config

2. **tsconfig.json** anpassen:
   - Entferne `extends: "../../../tsconfig.base.json"`
   - Kopiere die Compiler-Options direkt rein

## shadcn/ui Components hinzufügen

Das Template ist bereit für shadcn/ui Components:

```bash
# Beispiel: Button Component hinzufügen
npx shadcn@latest add button

# Card Component
npx shadcn@latest add card

# Dialog Component
npx shadcn@latest add dialog

# Alle verfügbaren Components anzeigen
npx shadcn@latest add
```

Components werden automatisch in `src/components/base/` installiert.

## Styling & Theme

### CSS Variables

Das Template nutzt CSS Variables für ein konsistentes Theme-System:

- Light/Dark Mode Support out-of-the-box
- Alle Colors sind über CSS Variables anpassbar
- Siehe `src/index.css` für alle verfügbaren Variables

### Dark Mode aktivieren

```tsx
import { ThemeProvider } from 'next-themes'

// In deiner App:
<ThemeProvider attribute="class" defaultTheme="system">
  <App />
</ThemeProvider>
```

### Tailwind Utility: cn()

Das Template enthält die `cn()` Utility für conditional class names:

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  anotherCondition ? "true-classes" : "false-classes"
)} />
```

## TypeScript

### Path Aliases

Das Template nutzt `@/` als Alias für `src/`:

```tsx
import { cn } from '@/lib/utils'
import Button from '@/components/base/button'
```

### Type Checking

```bash
npm run type-check
```

## Empfohlene zusätzliche Packages

Je nach Bedarf kannst du weitere Packages hinzufügen:

### Forms & Validation
```bash
npm install react-hook-form @hookform/resolvers zod
```

### Routing
```bash
npm install react-router-dom
```

### State Management
```bash
npm install zustand
# oder
npm install @tanstack/react-query
```

### Icons (erweitert)
```bash
npm install @phosphor-icons/react
```

### UI Components (erweitert)
```bash
npm install framer-motion          # Animations
npm install sonner                 # Toast Notifications
npm install cmdk                   # Command Menu
npm install recharts               # Charts
npm install date-fns react-day-picker  # Date Picker
```

## Scripts

- `npm run dev` - Development Server (Port 5174)
- `npm run build` - Production Build
- `npm run preview` - Preview Production Build
- `npm run type-check` - TypeScript Type Checking

## Nächste Schritte

1. **Passe das Theme an**: Bearbeite `src/index.css` und `tailwind.config.js`
2. **Füge Components hinzu**: Nutze `npx shadcn@latest add [component]`
3. **Erstelle deine Features**: Baue in `src/components/` deine eigenen Components
4. **Setup Routing**: Füge React Router hinzu wenn benötigt
5. **Configure Environment**: Erstelle `.env` für Environment Variables

## Hilfe & Ressourcen

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)

## License

MIT

# Git Worktree Workflow für Speckit

## Konzept

Parallele Feature-Entwicklung durch mehrere Arbeitsverzeichnisse (Worktrees) mit gemeinsamer Git-History.

**Struktur:**
```
base-template/           # main branch (Orchestrator)
base-template-feature-a/ # Worktree für Feature A
base-template-feature-b/ # Worktree für Feature B
base-template-feature-c/ # Worktree für Feature C
```

## Setup Commands

### Neues Feature starten
```bash
# Von base-template/ aus ausführen
git worktree add ../base-template-feature-a -b feature-a
```

### Alle Worktrees anzeigen
```bash
git worktree list
```

### Worktree entfernen (nach merge)
```bash
# Worktree löschen
git worktree remove ../base-template-feature-a

# Branch auch löschen (optional)
git branch -d feature-a

# Falls Worktree-Verzeichnis manuell gelöscht wurde
git worktree prune
```

## Speckit Workflow - Parallel

### Phase 1: Parallel Planen

**Terminal 1 (Feature A):**
```bash
cd base-template-feature-a
# Orchestrator delegiert an Planner
```

**Terminal 2 (Feature B):**
```bash
cd base-template-feature-b
# Orchestrator delegiert an Planner
```

**Vorteil:** Während Planner A läuft, startet Planner B bereits.

### Phase 2: Sequenziell Coden

**Terminal 1:**
```bash
cd base-template-feature-a
# Orchestrator → Coder → Reviewer
npm run dev  # Port 5173
```

**Terminal 2:**
```bash
cd base-template-feature-b
# Orchestrator → Coder → Reviewer
npm run dev  # Port 5174
```

**Vorteil:** Feature A läuft weiter, während Feature B entwickelt wird.

### Phase 3: Parallel Testen

**Browser:**
- Tab 1: `http://localhost:5173` (Feature A)
- Tab 2: `http://localhost:5174` (Feature B)

**Vorteil:** Beide Features gleichzeitig testen, vergleichen, debuggen.

### Phase 4: Database Integration (optional)

```bash
cd base-template-feature-a
# Orchestrator → Database-Architect
# Schema, RLS, Queries, Migrations
```

### Phase 5: Mergen

```bash
# Zurück zum main branch
cd base-template

# Feature A mergen
git merge feature-a

# Feature B mergen
git merge feature-b

# Branches löschen
git branch -d feature-a feature-b

# Worktrees aufräumen
git worktree remove ../base-template-feature-a
git worktree remove ../base-template-feature-b
```

## Agent Delegation

**Wichtig:** Agents müssen wissen, in welchem Verzeichnis sie arbeiten.

**Beispiel:**
```
User: "Planner soll Feature A analysieren"
Orchestrator: "Delegiere an Planner im Verzeichnis ../base-template-feature-a"
```

**Agent-Pfade:**
- Planner: Arbeitet in `../base-template-feature-a/`
- Coder: Arbeitet in `../base-template-feature-a/`
- Reviewer: Arbeitet in `../base-template-feature-a/` (Chrome DevTools auf Port 5173)
- Database-Architect: Arbeitet in `../base-template-feature-a/` (Chrome DevTools auf Port 5173)

## Best Practices

### DO ✅
- Ein Worktree pro Feature
- Worktree-Name = Branch-Name für Klarheit
- Dev server in jedem Worktree auf eigenem Port
- Commits in jedem Worktree normal durchführen
- Worktrees nach Merge aufräumen

### DON'T ❌
- Nicht mehrere Worktrees auf demselben Branch
- Nicht Worktree-Verzeichnis manuell löschen (erst `git worktree remove`)
- Nicht vergessen `git worktree prune` nach manueller Löschung

## Troubleshooting

### Port bereits belegt
```bash
# In package.json oder vite.config.ts:
# Port manuell setzen (5174, 5175, etc.)
npm run dev -- --port 5174
```

### Worktree lässt sich nicht löschen
```bash
# Branch ist noch ausgecheckt
cd base-template
git worktree remove ../base-template-feature-a --force
```

### Verzeichnis gelöscht, aber Git kennt Worktree noch
```bash
git worktree prune
```

## Vorteile für Speckit

1. **Planner parallel:** Mehrere Features gleichzeitig analysieren
2. **Coder/Reviewer sequenziell:** Fokus auf ein Feature, andere laufen weiter
3. **Testing parallel:** Mehrere Features im Browser vergleichen
4. **Kein Context-Switch:** Kein Stashing, kein Branch-Wechsel, kein Server-Neustart
5. **Schnellere Iteration:** Während Feature A im Review ist, Feature B schon coden

## Nachteile

- Mehr Disk Space (mehrere `node_modules/`)
- Mehr RAM (mehrere Dev Server)
- Agent muss explizit Pfad kennen

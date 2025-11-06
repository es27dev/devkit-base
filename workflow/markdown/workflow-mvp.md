# SpecKit Multi-Agent Workflow MVP

## Syntax Reference

### Agent Steps

```
**agent-name**
- Action description
- Returns: output
```

### Tool Usage Syntax

```
@command:<path-to-command.md>
@mcp:<mcp-server-name>.<tool-name>
@agent-spawn:<agent-type>[step-id]
@agent-kill:<agent-type>[step-id]
@script:<script-name> → DB Operation via CLI Script
```

**Examples:**
- `@command:speckit.specify` - Execute /speckit.specify command
- `@mcp:context7.get-library-docs` - Use Context7 MCP tool
- `@agent-spawn:planner[C1]` - Spawn planner agent (tracked via step-id)
- `@agent-kill:planner[C1]` - Kill planner agent instance
- `@script:checkcard-cli.py` - Run CLI script for DB operations

### Loop Syntax

```
+ Start Loop
- Loop Step 1 ? Agent Behavior Mode: description
- Loop Step 2
+ Loop End (approval-condition)
```

**Behavior Modes:**

- `? Socratic Dialog Mode:` - Fragend, hinweisend, user kann falsch liegen
- `? Execution Mode:` - Direktes Arbeiten ohne User-Interaktion
- `? Review Mode:` - Kritisch prüfend, detailliertes Feedback
- `? Research Mode:` - Explorativ, codebase durchsuchen

### Database Operations

**All DB operations handled by CLI Script** (`@script:checkcard-cli.py`)

Script performs operations based on checkcard step outputs:
- Reads checkcard JSON after agent fills it
- Extracts required data
- Executes DB operations via Supabase MCP
- Returns success/failure to agent

---

## A. User Request → Initial Function Creation

### A1 user

- Beschreibt welche Function/Implementation Entwicklung er machen will
- Gibt Input via CLI

### A2 orchestrator

- Liest constitution.md und CLAUDE.md
- @script:checkcard-cli.py → CLI sammelt User Input für A1 + A2
  - Frage: User Anfrage
  - Frage: User Story approved?
  - Frage: Description of Feature
  - Frage: User Story (WHO does WHAT and WHY)
  - Frage: File Context (optional)
  - Frage: MCP Servers (optional)
  - Frage: Skills (optional)
- Script speichert A1 + A2 Checkcards als JSON
- Script erstellt DB Record via @mcp:supabase.insert-row
  - Tabelle: project_functions
  - Felder: name, description, slug, status_speckit=null, status_agent='orchestrator'
- Script gibt zurück: function_id
- @agent-spawn:planner[A2] mit function_id

---

## B. Specify Phase → Initiales Spec Draft

### B1 planner[A2]

- @script:checkcard-cli.py
  - **INPUT Step**: Script lädt aus A2 Checkcard:
    - function_id
    - user_story (NICHT description!)
  - Script zeigt Daten an Agent via CLI Output
- Agent erhält user_story vom Script
- Agent liest constitution.md (Non-Negotiables, Decision Points)
- @command:speckit.specify
- Agent erstellt spec.md gemäß SpecKit Template
- @script:checkcard-cli.py
  - **OUTPUT Step**: CLI sammelt Agent-Ergebnisse:
    - Frage: Spec File Path
    - Frage: Spec File URL
  - Script speichert B1 Checkcard als JSON (mit inputs + outputs)
  - Script updated DB Record via @mcp:supabase.update-row
    - Tabelle: project_functions
    - WHERE: id = function_id (aus INPUT)
    - SET: status_speckit='specify', spec_metadata=[{file_url, index:0, phase:'specify'}], status_agent='planner'


## C. Clarify Phase → Spec Verfeinerung

### C1 orchestrator

- Liest spec.md
- @command:speckit.clarify ? Socratic Dialog Mode: Command stellt Fragen direkt an User
  - Analysiert Spec auf Lücken (max 5 Fragen)
  - Stellt Fragen interaktiv an User
  - Schreibt Antworten direkt in spec.md (nach jeder Antwort)
  - Updated spec.md inkrementell
- @script:checkcard-cli.py → CLI sammelt C1 Input
  - Frage: Function ID
  - Frage: Clarified Spec File Path
  - Frage: Questions Asked Count
- Script speichert C1 Checkcard als JSON
- Script updated DB Record via @mcp:supabase.update-row
  - Tabelle: project_functions
  - WHERE: id = function_id
  - SET: status_speckit='clarify', spec_metadata=[..., {file_url, index:1, phase:'clarify'}]

### C2 orchestrator

- @agent-spawn:planner[C2] (Plan Mode)

---

## D. Plan Phase → Technische Planung

### D1 planner[C2]

- Liest aktualisiertes spec.md
- @mcp:context7.get-library-docs (react-hook-form, zod, shadcn/ui components)
- @mcp:shadcn.search-items (findet relevante Components)
- @mcp:supabase.list-tables (falls DB Context benötigt)
- @command:speckit.plan ? Execution Mode: Erstellt plan.md mit Technical Decisions
  - Generiert research.md (Phase 0: Unknowns klären)
  - Generiert data-model.md (Phase 1: Entities)
  - Generiert contracts/ (Phase 1: API Specs)
  - Generiert quickstart.md (Phase 1: Integration Scenarios)
- Returns: plan.md, research.md, data-model.md, contracts/, quickstart.md
- @script:checkcard-cli.py → CLI sammelt D1 Input
  - Frage: Function ID
  - Frage: Plan File Path
  - Frage: Research File Path
  - Frage: Data Model File Path
  - Frage: Contracts Directory Path
  - Frage: Quickstart File Path
- Script speichert D1 Checkcard als JSON
- Script updated DB Record via @mcp:supabase.update-row
  - Tabelle: project_functions
  - WHERE: id = function_id
  - SET: status_speckit='plan', plan_metadata=[{file_url, index:0, phase:'plan'}], plan_artifacts_metadata=[...]

### D2 orchestrator

- @agent-kill:planner[C2]

---

## E. Plan Review Phase → User Review & Approval

### E orchestrator

- @command:speckit.analyze ? Review Mode: Read-only Analyse aller Design Documents
  - Analysiert spec.md, plan.md, data-model.md, contracts/, research.md
  - Prüft Cross-Artifact Consistency
  - Prüft Quality & Completeness
  - Returns: Analyse Report (analyze.md)

### E2 orchestrator

- Liest plan.md und analyze.md
- Fasst **PRIMÄR plan.md** auf Deutsch zusammen (Kernentscheidungen, Architektur, Dependencies)
- Ergänzt kurz (max 2-3 Sätze) analyze.md Status:
  - IF Status = READY: "✅ Quality Check: READY (Coverage X%, 0 Critical Issues)"
  - IF Status = NEEDS_FIXES: Detaillierte Auflistung Critical + High Issues
- Präsentiert plan-fokussierte Zusammenfassung an User

+ Start Loop (max 3 Iterationen)
- Wartet auf User Feedback ? Socratic Dialog Mode: User kann Logikfehler finden
- IF User findet Logikfehler:
  - @agent-spawn:planner[E2]
  - Planner korrigiert plan.md basierend auf User Feedback
  - @agent-kill:planner[E2]
  - Orchestrator erstellt neue Zusammenfassung
  - Zurück zu Loop Start
- IF User approved:
  - Loop End
+ Loop End (user approval OR iteration_count >= 3)

- @script:checkcard-cli.py → CLI sammelt E2 Input
  - Frage: Function ID
  - Frage: User Approved? (true/false)
  - Frage: Review Iterations Count
  - Frage: Analyze File Path
- Script speichert E2 Checkcard als JSON
- Script updated DB Record via @mcp:supabase.update-row
  - Tabelle: project_functions
  - WHERE: id = function_id
  - SET: plan_metadata=[..., {index:1, phase:'plan_review', user_approved:true, review_iterations:X}]

### E3 orchestrator

- @agent-spawn:planner[E3] (Tasks Mode)

---

## F. Tasks Phase → Task Aufschlüsselung

### F1 planner[E3]

- Liest spec.md + plan.md
- @command:speckit.tasks ? Execution Mode: Zerlegt Feature in actionable Tasks
  - Lädt design documents (plan.md, spec.md, data-model.md, contracts/, research.md)
  - Generiert tasks.md organisiert nach User Stories (P1, P2, P3...)
  - Erstellt Dependency Graph
  - Markiert parallelisierbare Tasks [P]
- Returns: tasks.md
- @script:checkcard-cli.py → CLI sammelt F1 Input
  - Frage: Function ID
  - Frage: Tasks File Path
  - Frage: Total Task Count
  - Frage: Parallel Task Count
- Script speichert F1 Checkcard als JSON
- Script updated DB Record via @mcp:supabase.update-row
  - Tabelle: project_functions
  - WHERE: id = function_id
  - SET: status_speckit='tasks', tasks_metadata=[{file_url, index:0, phase:'tasks', task_count:X, parallel_tasks:Y}]

### F2 orchestrator

- Liest tasks.md
- @script:checkcard-cli.py → CLI parsed tasks.md und schreibt Tasks in DB
  - Script extrahiert einzelne Tasks aus tasks.md
  - Script looped über alle Tasks:
    - Extrahiert Task Details (ID, Description, Phase, Dependencies, [P] marker)
    - @mcp:supabase.insert-row
      - Tabelle: project_functions_tasks
      - Felder: function_id, task_id, title, description, phase, is_parallel, status='pending', dependencies=[], blocks=[]
- Script speichert F2 Checkcard als JSON
- Script gibt zurück: Task IDs geschrieben
- @agent-kill:planner[E3]

---

## MVP Scope Summary

**Included Phases:**
- A: User Request → Function Creation (via Script)
- B: Specify Phase → spec.md
- C: Clarify Phase → spec.md refinement
- D: Plan Phase → plan.md + artifacts
- E: Plan Review → User approval
- F: Tasks Phase → tasks.md + DB task records

**Deferred (Post-MVP):**
- G: Tasks Review Phase
- H: Implementation Phase (Coder)
- I: Review Phase (Reviewer)
- J: Database Integration (Database-Architect)
- K: Completion

**Key Simplifications:**
- No time logging (started_at, completed_at, duration_minutes)
- All DB operations via CLI Script (not AI-triggered)
- Script controls DB writes with full user input
- Minimal checkcards (only essential fields)

**Script Control Pattern:**
- **INPUT Step**: Script lädt Daten aus vorherigen Checkcards
- **OUTPUT Step**: Script sammelt Agent-Ergebnisse
- Agent arbeitet nur mit Script-bereitgestellten Daten
- Keine MCP-Calls vom Agent für Datenabfragen
- Reduziert Fehler durch Script-gesteuerte Datenfluss-Kontrolle

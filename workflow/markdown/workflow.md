# SpecKit Multi-Agent Workflow

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
```

**Examples:**
- `@command:speckit.specify` - Execute /speckit.specify command
- `@mcp:context7.get-library-docs` - Use Context7 MCP tool
- `@agent-spawn:planner[C1]` - Spawn planner agent (tracked via step-id)
- `@agent-kill:planner[C1]` - Kill planner agent instance

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

```
#create@table_name
- column_name: value-fix
- column_name: <value-agent-context>
#

#update@table_name
- id: <record-id>
- column_name: value-fix
- column_name: <value-agent-context>
#

#delete@table_name
- id: <record-id>
#
```

### Status Values Reference

**status_speckit (SpecKit Workflow Steps)**

- `null` - Initial state, not yet started
- `specify` - Initial request → spec.md draft
- `clarify` - Questions raised, spec being refined
- `plan` - Technical planning in progress
- `tasks` - Breaking down into tasks
- `analyze` - Code review phase
- `implement` - Implementation & DB integration

**status_agent (Current Handler)**

- `null` - Not yet assigned
- `user` - Waiting for user input
- `orchestrator` - Orchestrator deciding next step
- `planner` - Planner working: clarify/plan/tasks
- `coder` - Coder implementing
- `reviewer` - Reviewer checking quality
- `database-architect` - DB integration in progress

---

## A. User Request → Initial Function Creation

### A1 user
→ See Checkcard: `checkcards/checkcards-A1-to-B2.json` (step_id: "A1")

- Beschreibt welche Function/Implementation Entwicklung er machen will

### A2 orchestrator
→ See Checkcard: `checkcards/checkcards-A1-to-B2.json` (step_id: "A2")
→ See Interface: `CreateProjectFunctionInput` in workflow-interfaces.ts

- Liest constitution.md und CLAUDE.md
+ Start Loop (UserApprovalLoop)
- Erörtert mit User eine gute initiale Function Beschreibung, minimale MVP User Story
+ Loop End (user approval)

- #create@project_functions
- @agent-spawn:planner[A2]


---

## B. Specify Phase → Initiales Spec Draft

### B1 planner[A2]
→ See Checkcard: `checkcards/checkcards-A1-to-B2.json` (step_id: "B1")

- Liest constitution.md (Non-Negotiables, Decision Points)
- Analysiert User Story aus project_functions.description
- @command:speckit.specify
- Erstellt spec.md gemäß SpecKit Template

### B2 orchestrator
→ See Checkcard: `checkcards/checkcards-A1-to-B2.json` (step_id: "B2")
→ See Interface: `UpdateProjectFunctionInput` in workflow-interfaces.ts

- #update@project_functions (status_speckit: "specify", spec_metadata: SpecMetadata[])
- @agent-kill:planner[A2]

## C. Clarify Phase → Spec Verfeinerung

### C1 orchestrator

- Liest spec.md

- @command:speckit.clarify ? Socratic Dialog Mode: Command stellt Fragen direkt an User, schreibt Antworten ins Spec
  - Analysiert Spec auf Lücken (max 5 Fragen)
  - Stellt Fragen interaktiv an User
  - Schreibt Antworten direkt in spec.md (nach jeder Antwort)
  - Updated spec.md inkrementell

#update@project_functions

- id: <function-id>
- status_speckit: clarify
- status_agent: orchestrator
- spec_metadata: [{"file_url": "<path-to-spec.md>", "index": 0, "phase": "specify"}, {"file_url": "<path-to-spec.md>", "index": 1, "phase": "clarify"}]

#

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

#update@project_functions

- id: <function-id>
- status_speckit: plan
- status_agent: planner
- plan_metadata: [{"file_url": "<path-to-plan.md>", "index": 0, "phase": "plan"}]
- plan_artifacts_metadata: [{"file_url": "<path-to-research.md>", "index": 0, "artifact_type": "research"}, {"file_url": "<path-to-data-model.md>", "index": 0, "artifact_type": "data-model"}, {"file_url": "<path-to-contracts/>", "index": 0, "artifact_type": "contracts"}, {"file_url": "<path-to-quickstart.md>", "index": 0, "artifact_type": "quickstart"}]

#

### D2 orchestrator

- @agent-kill:planner[C2]

---

## E. Plan Review Phase → User Review & Approval

### E orchestrator

- @command:speckit.analyze ? Review Mode: Read-only Analyse aller Design Documents
  - Analysiert spec.md, plan.md, data-model.md, contracts/, research.md
  - Prüft Cross-Artifact Consistency
  - Prüft Quality & Completeness
  - Returns: Analyse Report

### E2 orchestrator

- Liest plan.md und analyze.md
- Fasst **PRIMÄR plan.md** auf Deutsch zusammen (Kernentscheidungen, Architektur, Dependencies)
- Ergänzt kurz (max 2-3 Sätze) analyze.md Status:
  - IF Status = READY: "✅ Quality Check: READY (Coverage X%, 0 Critical Issues)"
  - IF Status = NEEDS_FIXES: Detaillierte Auflistung Critical + High Issues
- Präsentiert plan-fokussierte Zusammenfassung an User

+ Start Loop (max 3 Iterationen, PlanReviewLoop)
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

#update@project_functions

- id: <function-id>
- status_agent: orchestrator
- plan_metadata: [{"file_url": "<path-to-plan.md>", "index": 0, "phase": "plan"}, {"file_url": null, "index": 1, "phase": "plan_review", "user_approved": true, "review_iterations": "<count>"}]

#

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

#update@project_functions

- id: <function-id>
- status_speckit: tasks
- status_agent: planner
- tasks_metadata: [{"file_url": "<path-to-tasks.md>", "index": 0, "phase": "tasks", "task_count": "<total>", "parallel_tasks": "<count>"}]

#

### F2 orchestrator

- Parsed tasks.md und schreibt Tasks in Datenbank ? Execution Mode: Liest tasks.md, extrahiert einzelne Tasks

+ Start Loop (für jeden Task in tasks.md)
- Extrahiert Task Details (ID, Description, Phase, Dependencies, [P] marker)
- #create@project_functions_tasks
  - project_function_id: <function-id>
  - task_id: <task-id-from-md>
  - description: <task-description>
  - phase: <phase-name>
  - is_parallel: <true/false>
  - status: pending
  - dependencies: <dependency-task-ids>
  #
+ Loop End (alle Tasks geschrieben)

- @agent-kill:planner[E3]

---

## G. Tasks Review Phase → Implementation Complexity Overview

### G1 orchestrator

- Analysiert tasks.md und generierte Task Records ? Review Mode: Erstellt Implementierungs-Übersicht
- Berechnet Implementation Metrics:
  - Anzahl Phasen (MVP vs Post-MVP)
  - Anzahl Tasks (MVP vs Post-MVP)
  - Parallelisierbare Tasks pro Phase
  - Geschätzte Implementierungsdauer basierend auf:
    - Task Komplexität (file operations, dependencies)
    - Coder → Reviewer Zyklen (durchschnittlich 1.5 Iterationen)
    - Parallelisierungspotential
- Präsentiert Zusammenfassung auf Deutsch:
  - "📊 Implementation Overview"
  - "MVP: X Phasen, Y Tasks (Z parallelisierbar)"
  - "Post-MVP: A Phasen, B Tasks (C parallelisierbar)"
  - "⏱️ Geschätzte Dauer: ~X-Y Minuten (MVP) / ~A-B Minuten (gesamt)"
  - "🔄 Coder↔Reviewer Schleifen eingerechnet (avg 1.5 iterations)"

### G2 orchestrator

- @agent-spawn:coder[G2]

---

## H. Implementation Phase → UI mit Mock Data

### H1 coder[G2]

- Liest tasks.md ? Execution Mode: Implementiert Code gemäß Task Plan
- @command:speckit.implement
  - Checkt Checklists Status (falls vorhanden)
  - Lädt implementation context (tasks.md, plan.md, data-model.md, contracts/)
  - Verifiziert project setup (ignore files basierend auf tech stack)
  - Parsed task structure (phases, dependencies, parallel markers [P])
  - Implementiert UI Components
  - Verwendet Mock Data (noch keine DB)
- Self-Check: tsc --noEmit
- Returns: Implementation

#update@project_functions

- id: <function-id>
- status_speckit: implement
- status_agent: coder
- implementation_metadata: [{"index": 0, "phase": "implement", "completed_tasks": "<count>", "total_tasks": "<count>"}]

#

### H2 orchestrator

- @agent-kill:coder[G2]
- @agent-spawn:reviewer[H2]

---

## I. Review Phase → Qualitätsprüfung

### I1 reviewer[H2]

- @mcp:chrome-devtools.take-snapshot ? Review Mode: Prüft UI Rendering
- @mcp:chrome-devtools.take-screenshot
- @mcp:chrome-devtools.list-console-messages
- Prüft Code-Qualität
- Fixt kleine Issues (Imports, Naming, etc.)
- Returns: APPROVED / APPROVED (with fixes) / CHANGES REQUESTED

#update@project_functions

- id: <function-id>
- status_speckit: analyze
- status_agent: reviewer
- implementation_metadata: [{"index": 0, "phase": "implement", "completed_tasks": "<count>", "total_tasks": "<count>"}, {"index": 1, "phase": "analyze", "review_result": "PENDING"}]

#

### I2 orchestrator

+ Start Loop (max 3 Iterationen)
- IF reviewer[H2] returns CHANGES REQUESTED ? Execution Mode: Sendet Feedback zurück an Coder
  - @agent-kill:reviewer[H2]
  - @agent-spawn:coder[I2]
  - Coder fixt Issues
  - @agent-kill:coder[I2]
  - @agent-spawn:reviewer[I2]
  - Reviewer prüft erneut
+ Loop End (reviewer: APPROVED OR iteration_count >= 3)

#update@project_functions

- id: <function-id>
- status_agent: coder

#

### I3 orchestrator

- Falls 3 Iterationen fehlgeschlagen: Greift selbst ein, um Konflikt manuell zu lösen
- Falls APPROVED: @agent-kill:reviewer[H2] OR [I2]

+ Start Loop
- Fragt User: "Database Integration benötigt?" ? Socratic Dialog Mode: Entscheidung für DB Integration
- User antwortet
+ Loop End (user)

---

## J. Database Integration Phase (Optional)

### J1 orchestrator

- @agent-spawn:database-architect[J1]

### J2 database-architect[J1]

- Designt Schema (Tables, Columns, Relationships) ? Execution Mode: Erstellt DB Schema basierend auf data-model.md
- @mcp:supabase.list-tables
- Erstellt RLS Policies
- Ersetzt Mock Data mit Supabase Queries
- Erstellt Migration Scripts
- @mcp:chrome-devtools.take-snapshot (verifiziert DB Integration)
- Returns: DB Integration

#update@project_functions

- id: <function-id>
- status_speckit: implement
- status_agent: database-architect
- implementation_metadata: [{"index": 0, "phase": "implement", "completed_tasks": "<count>", "total_tasks": "<count>"}, {"index": 1, "phase": "analyze", "review_result": "APPROVED"}, {"index": 2, "phase": "db_integration", "db_integrated": true, "migration_files": ["<migration-paths>"], "schema": "devKit"}]

#

### J3 orchestrator

- @agent-kill:database-architect[J1]
- Verifiziert, dass Database Integration funktioniert
- Informiert User über Abschluss

---

## K. Keine Database Integration

### K1 orchestrator

- Markiert Task als abgeschlossen
- Informiert User über Completion

#update@project_functions

- id: <function-id>
- status_speckit: implement
- status_agent: user
- implementation_metadata: [{"index": 0, "phase": "implement", "completed_tasks": "<count>", "total_tasks": "<count>"}, {"index": 1, "phase": "analyze", "review_result": "APPROVED"}, {"index": 2, "phase": "completed", "completed": true, "db_integrated": false}]

#

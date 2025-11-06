---
name: speckit-workflow
description: Multi-agent workflow for spec-driven development using the Checkcard CLI system (A1 → F1)
---

# Speckit Workflow - Multi-Agent Orchestration

## Overview

This skill orchestrates a **6-step workflow (A1 → F1)** for spec-driven development, where agents collaborate to transform user requirements into validated, actionable tasks.

**Workflow Stages**: User Request → Specify → Clarify → Plan → Review → Tasks
**Agent Types**: Orchestrator, Planner

## Workflow Architecture

### Checkcard CLI System

All steps use the **Checkcard CLI** (`workflow/scripts/checkcard-cli.py`) to:
- Collect structured inputs/outputs from agents
- Validate data between steps
- Track workflow progress
- Generate 3 files per step:
  - `checkcard_X.full.json` - Complete metadata (saved by CLI)
  - `checkcard_X.ai.json` - AI-relevant data only (for agent reference)
  - `checkcard_X.ai.schema.json` - JSON Schema for validation

**Location**: `workflow/checkcards/`

### Data Flow Pattern

```
Step INPUT Phase:
  → CLI loads previous checkcard
  → Displays relevant fields to agent
  → Agent reads and processes

Step OUTPUT Phase:
  → Agent provides outputs
  → CLI validates (F1 only)
  → Saves checkcard
```

## Workflow Steps

### A1: User Request + Orchestrator Dialog

**Agent**: orchestrator
**Has Input/Output**: No (direct collection)
**Checkcard**: `checkcard_A1.full.json`

**Purpose**: Capture user requirements and refine into user story

**Data Collected**:
- `user_initial_input`: Initial user request
- `user_approved_stepA2`: User approval (true/false)
- `description_of_feature`: Summary (max 500 chars)
- `user_story`: Full user story (WHO does WHAT and WHY, max 2000 chars)
- `tools`: File context, MCP servers, Claude skills accessed

**Execution**:
```bash
cd workflow/scripts
python checkcard-cli.py
# Select: orchestrator → A1
```

**Agent Tasks**:
1. Read user's initial request
2. Engage in Socratic dialog to clarify requirements
3. Create complete user story (WHO/WHAT/WHY format)
4. Get user approval
5. Provide outputs to CLI

**Outputs to**: B1

---

### B1: Planner Specify Phase

**Agent**: planner
**Has Input/Output**: Yes
**Checkcard**: `checkcard_B1.full.json`

**Purpose**: Research codebase and create specification

**Inputs from A1**:
- `user_story`: Complete user story

**Data Collected**:
- `spec_file_path`: Path to generated spec file (e.g., `.specify/specs/001-feature/spec.md`)

**Execution**:
```bash
# INPUT Phase
python checkcard-cli.py
# Select: planner → B1 → input

# OUTPUT Phase
python checkcard-cli.py
# Select: planner → B1 → output
```

**Agent Tasks**:
1. **INPUT**: Read user story from A1
2. Research codebase using available tools
3. Execute `/speckit.specify` command
4. Generate specification document
5. **OUTPUT**: Provide spec file path to CLI

**Outputs to**: C1

---

### C1: Orchestrator Clarify Phase

**Agent**: orchestrator
**Has Input/Output**: Yes
**Checkcard**: `checkcard_C1.full.json`

**Purpose**: Review spec with user and clarify uncertainties

**Inputs from B1**:
- `spec_file_path`: Path to specification

**Data Collected**:
- `user_approved_spec`: User approval (true/false)
- `spec_file_path`: Updated spec path (may change if user requested changes)

**Execution**:
```bash
# INPUT Phase
python checkcard-cli.py
# Select: orchestrator → C1 → input

# OUTPUT Phase
python checkcard-cli.py
# Select: orchestrator → C1 → output
```

**Agent Tasks**:
1. **INPUT**: Read spec file path from B1
2. Review specification with user
3. Execute `/speckit.clarify` if needed
4. Iterate until user approves
5. **OUTPUT**: Provide approval status and final spec path

**Outputs to**: D1

---

### D1: Planner Plan Phase

**Agent**: planner
**Has Input/Output**: Yes
**Checkcard**: `checkcard_D1.full.json`

**Purpose**: Create detailed implementation plan

**Inputs from C1**:
- `spec_file_path`: Approved specification path

**Data Collected**:
- `plan_file_path`: Main plan file
- `plan_analyze_summary_path`: Plan analysis summary
- `research_path`: Research document
- `data_model_path`: Data model document
- `contracts_path`: Contracts directory
- `quickstart_path`: Quickstart guide

**Execution**:
```bash
# INPUT Phase
python checkcard-cli.py
# Select: planner → D1 → input

# OUTPUT Phase
python checkcard-cli.py
# Select: planner → D1 → output
```

**Agent Tasks**:
1. **INPUT**: Read spec file path from C1
2. Execute `/speckit.plan` command
3. Generate comprehensive plan with:
   - Implementation strategy
   - Data model design
   - API contracts
   - Research notes
   - Quickstart guide
4. **OUTPUT**: Provide all file paths to CLI

**Outputs to**: E1

---

### E1: Orchestrator Plan Review

**Agent**: orchestrator
**Has Input/Output**: Yes
**Checkcard**: `checkcard_E1.full.json`

**Purpose**: Review plan with user and get approval

**Inputs from D1**:
- `plan_file_path`: Main plan file
- `plan_analyze_summary_path`: Plan analysis

**Data Collected**:
- `user_approved_plan`: User approval (true/false)
- `plan_summary_path`: Final plan path (may be updated)

**Execution**:
```bash
# INPUT Phase
python checkcard-cli.py
# Select: orchestrator → E1 → input

# OUTPUT Phase
python checkcard-cli.py
# Select: orchestrator → E1 → output
```

**Agent Tasks**:
1. **INPUT**: Read plan paths from D1
2. Execute `/speckit.analyze` to review plan
3. Present plan to user for approval
4. Iterate if user requests changes
5. **OUTPUT**: Provide approval status and final plan path

**Outputs to**: F1

---

### F1: Planner Tasks Phase [WITH VALIDATION]

**Agent**: planner
**Has Input/Output**: Yes
**Checkcard**: `checkcard_F1.full.json`
**Special Feature**: Task JSON validation

**Purpose**: Break down plan into validated, actionable tasks

**Inputs from E1**:
- `plan_file_path`: Approved plan summary

**Data Collected**:
- `tasks_json`: Array of validated task objects
- `task_file_path`: Path where tasks are saved

**Task Schema** (validated by CLI):
```json
{
  "task_id": "string",           // Required: Unique ID
  "description": "string",        // Required: Task description
  "is_parallel": boolean,         // Required: Can run in parallel?
  "dependencies": null | string[],// Required: null or task IDs
  "mvp": boolean,                 // Required: Part of MVP?
  "phase": "pending",            // Auto-added by CLI
  "status": "pending"            // Auto-added by CLI
}
```

**Execution**:
```bash
# INPUT Phase
python checkcard-cli.py
# Select: planner → F1 → input

# OUTPUT Phase (with validation)
python checkcard-cli.py
# Select: planner → F1 → output
```

**Agent Tasks**:
1. **INPUT**: Read plan path from E1
2. Execute `/speckit.tasks` command
3. Generate task breakdown as JSON array
4. **OUTPUT**: Provide task JSON to CLI
   - CLI validates structure automatically
   - Up to 3 retry attempts if validation fails
   - CLI shows specific error messages
   - CLI auto-saves validated tasks to file

**Validation Flow**:
```
Agent provides JSON → CLI validates →
  If valid: Auto-save + success
  If invalid: Show errors + retry
```

**Common Validation Errors**:
- Missing required field (task_id, description, etc.)
- Wrong type (e.g., string instead of boolean)
- Invalid dependencies (must be null or string array)
- Empty task list

**Outputs to**: Next phase (implementation)

---

## Checkcard CLI Usage

### Agent Workflow

1. **Start CLI**:
   ```bash
   cd workflow/scripts
   python checkcard-cli.py
   ```

2. **Select Agent** (numeric shortcut):
   - 1 = orchestrator
   - 2 = planner

3. **Select Step** (numeric shortcut):
   - Orchestrator: A1, C1, E1
   - Planner: B1, D1, F1

4. **Select Phase** (for steps with INPUT/OUTPUT):
   - 1 = input (read previous data)
   - 2 = output (provide new data)

5. **Provide Data**:
   - Answer CLI prompts
   - For F1: Provide complete task JSON (multiline)

### Input Validation

CLI validates all inputs from previous steps:
- Checkcard file exists
- Referenced step key exists
- All field values are non-empty

**Error Example**:
```
ERROR: Input 'user_story' vom vorherigen Schritt 'A1' ist nicht verfügbar oder leer.
Pfad: outputs.user_story in stepA1
Bist du sicher dass du den richtigen Task gewählt hast?
```

### File References

**AI Agents should read**: `checkcard_X.ai.json` (reduced, focused data)
**CLI reads/writes**: `checkcard_X.full.json` (complete metadata)
**Schema**: `checkcard_X.ai.schema.json` (validation rules)

## Agent Coordination

### Orchestrator Responsibilities
- **A1**: Collect user requirements and refine user story
- **C1**: Review specification with user
- **E1**: Review implementation plan with user
- **General**: User-facing dialog and approval loops

### Planner Responsibilities
- **B1**: Create specification from user story
- **D1**: Create detailed implementation plan
- **F1**: Generate validated task breakdown
- **General**: Technical artifact generation

### Communication Pattern

```
Orchestrator → Planner → Orchestrator → Planner → Orchestrator → Planner
    (A1)         (B1)         (C1)         (D1)         (E1)         (F1)
```

Each handoff via checkcard files validated by CLI.

## Validation Checklist

Before moving to next step:

**A1 Complete**:
- [ ] User initial input collected
- [ ] User story created and approved
- [ ] Tools accessed tracked
- [ ] Checkcard saved: `checkcard_A1.full.json`

**B1 Complete**:
- [ ] User story loaded from A1
- [ ] Specification created
- [ ] Spec file path provided
- [ ] Checkcard saved: `checkcard_B1.full.json`

**C1 Complete**:
- [ ] Spec file loaded from B1
- [ ] User reviewed and approved spec
- [ ] Final spec path provided
- [ ] Checkcard saved: `checkcard_C1.full.json`

**D1 Complete**:
- [ ] Spec file loaded from C1
- [ ] Plan and all artifacts created
- [ ] All file paths provided (6 outputs)
- [ ] Checkcard saved: `checkcard_D1.full.json`

**E1 Complete**:
- [ ] Plan files loaded from D1
- [ ] User reviewed and approved plan
- [ ] Final plan path provided
- [ ] Checkcard saved: `checkcard_E1.full.json`

**F1 Complete**:
- [ ] Plan file loaded from E1
- [ ] Tasks JSON created
- [ ] **Tasks validated by CLI** (all fields correct)
- [ ] Tasks auto-saved by CLI
- [ ] Checkcard saved: `checkcard_F1.full.json`

## Error Handling

### Missing Previous Step
```
ERROR: Checkcard nicht gefunden: checkcard_A1.full.json
```
**Solution**: Run previous step first

### Empty Input
```
ERROR: Input 'user_story' ist nicht verfügbar oder leer
```
**Solution**: Re-run previous step with complete data

### F1 Validation Failure
```
❌ Validation failed. Errors:
   - Task 0 (T1): Missing required field: is_parallel
```
**Solution**: Fix JSON structure and retry (up to 3 attempts)

## Tool Dependencies

### Slash Commands
- `/speckit.specify` - Generate specification (B1)
- `/speckit.clarify` - Clarify spec uncertainties (C1)
- `/speckit.plan` - Create implementation plan (D1)
- `/speckit.analyze` - Analyze plan quality (E1)
- `/speckit.tasks` - Generate task breakdown (F1)

### MCP Tools
- Context7 - Library documentation
- Shadcn - UI component info
- Supabase - Database operations (future steps)

### CLI Tools
- `workflow/scripts/checkcard-cli.py` - Main workflow controller
- `workflow/scripts/step_definitions.py` - Step configurations

## File Locations

```
workflow/
├── scripts/
│   ├── checkcard-cli.py         # Main CLI
│   ├── step_definitions.py      # Step config
│   └── README.md                # CLI documentation
├── checkcards/
│   ├── checkcard_A1.full.json   # Complete checkcard
│   ├── checkcard_A1.ai.json     # AI-relevant data
│   ├── checkcard_A1.ai.schema.json # Validation schema
│   ├── ... (B1, C1, D1, E1, F1)
└── F1_VALIDATION_GUIDE.md       # F1 validation details
```

## Next Steps After F1

After F1 completes with validated tasks:
- Tasks are saved to specified file path
- Implementation phase can begin
- Each task can be assigned to appropriate agent
- Task dependencies ensure correct execution order

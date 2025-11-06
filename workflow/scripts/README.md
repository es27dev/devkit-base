# Checkcard CLI System - Complete Workflow Guide

## Overview

The Checkcard CLI is a data-driven terminal application for managing multi-agent workflow orchestration. It enables agents (Orchestrator and Planner) to create structured "checkcards" that track workflow progress through phases A1 → F1.

## Quick Start

```bash
cd workflow/scripts
python checkcard-cli.py
```

## Architecture

### Core Components

1. **step_definitions.py** - Configuration file containing all step metadata
2. **checkcard-cli.py** - Main CLI engine with validation logic
3. **checkcards/** - JSON output files for each step

### Checkcard File Structure

Each step generates 3 files:

1. **`checkcard_X.full.json`** - Complete checkcard with all metadata (saved by CLI)
2. **`checkcard_X.ai.json`** - AI-relevant inputs/outputs only (for agent reference)
3. **`checkcard_X.ai.schema.json`** - JSON Schema for validation

**Example for Step A1:**
- `checkcard_A1.full.json` - Full metadata + tools + outputs
- `checkcard_A1.ai.json` - Only tools + outputs (what AI fills)
- `checkcard_A1.ai.schema.json` - Validation schema

### Design Philosophy

- **Data-Driven**: All step logic in configuration, not code
- **Agent-Controlled**: Script guides, agent provides data
- **Validation-First**: F1 validates task JSON before saving
- **Minimal Typing**: Number shortcuts for agent/step selection
- **Separation of Concerns**: Full vs AI files prevent confusion

## Workflow Steps (A1 → F1)

```
┌─────────────────────────────────────────────────┐
│  A1: User Request + Orchestrator Dialog        │
│      Agent: orchestrator                       │
│      Output: user_story, feature_description   │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│  B1: Planner Specify Phase                     │
│      Agent: planner                            │
│      Input: user_story from A1                 │
│      Output: spec_file_path                    │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│  C1: Orchestrator Clarify Phase                │
│      Agent: orchestrator                       │
│      Input: spec_file_path from B1             │
│      Output: clarified_spec_file_path          │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│  D1: Planner Plan Phase                        │
│      Agent: planner                            │
│      Input: spec_file_path from C1             │
│      Output: plan, data-model, contracts, etc. │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│  E1: Orchestrator Plan Review                  │
│      Agent: orchestrator                       │
│      Input: plan paths from D1                 │
│      Output: approved plan_summary_path        │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│  F1: Planner Tasks Phase [WITH VALIDATION]     │
│      Agent: planner                            │
│      Input: plan_summary_path from E1          │
│      Output: validated tasks JSON + file path  │
└──────────────────────────────────────────────────┘
```

## Using the CLI

### Step 1: Agent Selection

```
[1/2] Welcher Agent bist du?
1. orchestrator
2. planner

Agent (Nummer oder Name): 1
```

### Step 2: Step Selection

```
[2/2] Welcher Step?
1. A1
2. C1
3. E1

Step (Nummer oder Name): 1
```

### Step 3: Phase Selection (for steps with INPUT/OUTPUT)

```
[3/3] Welche Phase?
1. input
2. output

Phase (Nummer oder Name): 2
```

## Step-Specific Behavior

### Step A1 (Special Case)
- No INPUT/OUTPUT phases
- Collects user request + orchestrator dialog
- Bundles tools (file_context, mcp_servers, skills)
- Saves to `checkcard_A1.full.json`

### Steps B1, C1, D1, E1, F1
- Have INPUT and OUTPUT phases
- INPUT: Loads data from previous step, displays it, no save
- OUTPUT: Collects new data, saves checkcard

### Step F1 (Special Validation)
- Accepts full task JSON array from agent
- Validates against schema (task_id, description, is_parallel, dependencies, mvp)
- Shows validation errors with retry (max 3 attempts)
- Auto-saves validated tasks to specified file path

## Input Validation

The CLI validates inputs from previous steps:

### When Loading Inputs

1. **Checkcard exists**: Verifies previous step's `.full.json` file exists
2. **Step key exists**: Checks that referenced step key exists in checkcard
3. **Field values exist**: Validates that all required fields have non-empty values

### Error Messages

```
ERROR: Checkcard nicht gefunden: checkcard_A1.full.json
Bist du sicher dass du den richtigen Task gewählt hast?
```

```
ERROR: Schritt 'stepE1' nicht gefunden im Checkcard 'D1'.
Bist du sicher dass du den richtigen Task gewählt hast?
```

```
ERROR: Input 'plan_file_path' vom vorherigen Schritt 'E1' ist nicht verfügbar oder leer.
Pfad: outputs.plan_summary_path in stepE1
Bist du sicher dass du den richtigen Task gewählt hast?
```

## F1 Task Validation

### Task Schema

```json
{
  "task_id": "string",           // Required: Unique ID
  "description": "string",        // Required: Task description
  "is_parallel": boolean,         // Required: Can run in parallel?
  "dependencies": null | ["..."], // Required: null or string array
  "mvp": boolean,                 // Required: Part of MVP?
  "phase": "pending",            // Auto-added by script
  "status": "pending"            // Auto-added by script
}
```

### Validation Flow

1. Agent provides task JSON (multiline input)
2. Script validates structure and types
3. If valid → auto-saves to file
4. If invalid → shows errors, allows retry

Example errors:
```
❌ Validation failed. Errors:

   - Task 0 (T1): Missing required field: is_parallel
   - Task 1 (T2): Field 'dependencies': must be null or string array
```

## File Structure

```
workflow/
├── scripts/
│   ├── checkcard-cli.py       # Main CLI engine
│   ├── step_definitions.py    # Step configurations
│   └── README.md              # This file
├── checkcards/                # Output directory
│   ├── checkcard_A1.full.json
│   ├── checkcard_A1.ai.json
│   ├── checkcard_A1.ai.schema.json
│   ├── checkcard_B1.full.json
│   ├── checkcard_B1.ai.json
│   ├── checkcard_B1.ai.schema.json
│   ├── ... (C1, D1, E1, F1)
└── F1_VALIDATION_GUIDE.md     # Detailed F1 validation docs
```

## Tips for Agents

### Orchestrator Agent
- Runs steps: A1, C1, E1
- Step A1: Collect user story and feature description
- Step C1: Review and clarify spec from planner
- Step E1: Review and approve plan from planner

### Planner Agent
- Runs steps: B1, D1, F1
- Step B1: Create specification from user story
- Step D1: Create detailed plan from spec
- Step F1: Break down plan into validated tasks

### Best Practices
1. Use numeric shortcuts (1, 2) instead of typing agent/step names
2. For F1: Prepare complete task JSON before starting
3. Check previous checkcard exists before running INPUT phase
4. Use Ctrl+D or type 'END' for multiline JSON input

## Naming Convention

**All steps have numbers: A1, B1, C1, D1, E1, F1**

- Step Keys: `A1`, `B1`, `C1`, `D1`, `E1`, `F1`
- Checkcard Files: `checkcard_A1.full.json`, `checkcard_B1.full.json`, etc.
- Step Keys in JSON: `stepA1`, `stepB1`, `stepC1`, `stepD1`, `stepE1`, `stepF1`
- AI Files: `checkcard_A1.ai.json`, `checkcard_B1.ai.json`, etc.
- Schema Files: `checkcard_A1.ai.schema.json`, `checkcard_B1.ai.schema.json`, etc.

**Rule**: Step-Key = First part of filename = Step key in JSON

## Error Handling

### Missing Checkcard
```
ERROR: Checkcard nicht gefunden: checkcard_A1.full.json
```
→ Previous step must be completed first

### F1 Validation Errors
```
❌ Validation failed. Errors:
   - Task 0: Missing required field: task_id
```
→ Fix JSON and retry (up to 3 attempts)

### Invalid Step Selection
```
ERROR: Step 'X' nicht verfügbar für Agent 'orchestrator'
```
→ Check agent-step mapping

## Configuration (step_definitions.py)

### Adding New Steps

```python
STEP_DEFINITIONS = {
    "G1": {
        "agent": "orchestrator",
        "has_input_output": True,
        "metadata": {
            "step_index": 8,
            "step_name": "New Step",
            "description": "Description"
        },
        "input": {
            "source_step": "F1",
            "source_sub": "stepF1",
            "fields": {...},
            "display": [...]
        },
        "output": {
            "questions": [...]
        },
        "checkcard_structure": "stepG1"
    }
}
```

## Advanced Features

### Checkcard Structure (.full.json)

Each checkcard contains:
- `step_index`: Numerical order
- `step_name`: Human-readable name
- `agent`: Who executed this step
- `description`: What this step does
- `inputs`: Data loaded from previous step (if applicable)
- `outputs`: Data generated in this step
- `tools`: (Step A1 only) Context and tools used

### AI Checkcard Structure (.ai.json)

Reduced version for agents containing only:
- `tools`: (Step A1 only) Tools used
- `inputs`: Loaded from previous step
- `outputs`: Agent-provided data

### Field Types

- `text`: Simple string input
- `bool`: true/false (converted from string)
- `list`: Comma-separated values → array

### Validation Modes

- `requires_validation`: Special flag for steps needing validation
- Currently only F1 has `"task_json"` validation
- Extensible for future validation types

## Troubleshooting

**Q: Script says "Checkcard nicht gefunden"**
A: Previous step hasn't been completed. Run that step first.

**Q: Script says "Input nicht verfügbar oder leer"**
A: Previous step's output is missing or empty. Re-run previous step.

**Q: F1 validation keeps failing**
A: Check JSON structure matches schema exactly. See F1_VALIDATION_GUIDE.md.

**Q: Can't select certain steps**
A: Steps are agent-specific. Orchestrator can't run planner steps.

**Q: How to exit multiline input?**
A: Press Ctrl+D or type 'END' on new line.

## Support

For detailed F1 validation information, see:
- `workflow/F1_VALIDATION_GUIDE.md`

For implementation details, see:
- `IMPLEMENTATION_SUMMARY.md`
- `NAMING_CONVENTION_UPDATE.md`
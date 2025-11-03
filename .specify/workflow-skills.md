# Workflow-to-Skills Generation Logic

## Core Concept

Generate workflow-aware skills automatically from `workflow.md` phases, enabling agents to orchestrate multi-step processes with:
- Clear phase positioning in overall workflow
- Database state transitions they trigger
- Multi-agent coordination across sub-steps
- Validation via checkcard checkpoints

**Key Insight**: Skills map to **MAIN PHASES**, not individual sub-steps.

## Phase → Skill Mapping

### Naming Convention

**Skills**: `workflow-{phase-action}-phase`
**Commands**: `speckit.{command-name}`

**Rationale**: Clear differentiation between agent orchestration (skills) and command execution (slash commands).

### Workflow Structure

The workflow has **8 main phases**:

1. **User Request → Initial Function Creation** (steps 1.1, 1.2)
2. **Specify Phase → Initiales Spec Draft** (steps 2.1, 2.2)
3. **Clarify Phase → Spec Verfeinerung** (steps 3.1, 3.2)
4. **Plan Phase → Technische Planung** (steps 4.1, 4.2)
5. **Plan Review Phase → User Review & Approval** (steps 4.5.1, 4.5.2)
6. **Tasks Phase → Task Aufschlüsselung** (steps 5.1, 5.2)
7. **Tasks Review Phase → Implementation Complexity Overview** (steps 5.5.1, 5.5.2)
8. **Implementation Phase → UI mit Mock Data** (steps 6.1, 6.2, 7.1-7.3, 8a/8b)

### Skill Naming Examples

| Phase | Skill Name |
|-------|-----------|
| Phase 1: User Request | `workflow-user-request-phase` |
| Phase 2: Specify Phase | `workflow-specify-phase` |
| Phase 3: Clarify Phase | `workflow-clarify-phase` |
| Phase 4: Plan Phase | `workflow-plan-phase` |
| Phase 5: Plan Review | `workflow-plan-review-phase` |
| Phase 6: Tasks Phase | `workflow-tasks-phase` |
| Phase 7: Tasks Review | `workflow-tasks-review-phase` |
| Phase 8: Implementation | `workflow-implementation-phase` |

## Workflow.md Syntax Elements

### Phase Definition

```markdown
## X. Phase Name → Description

### X.Y agent-name
- Action description
- @command:speckit.command-name
- @mcp:server.tool-name
- Returns: output
```

### Tool/Command References

```
@command:<command-name>          # Execute slash command (e.g., speckit.specify)
@mcp:<server>.<tool>             # Use MCP tool (e.g., supabase.insert_row)
@agent-spawn:<type>[step-id]     # Spawn agent instance (e.g., planner[1.2])
@agent-kill:<type>[step-id]      # Kill agent instance (e.g., planner[1.2])
```

### Database Operations

```
#create@table_name
- column: value
- column: <agent-context-value>
#

#update@table_name
- id: <record-id>
- column: value
#

#delete@table_name
- id: <record-id>
#
```

### Loops with Behavior Modes

```
+ Start Loop
- Loop Step ? Behavior Mode: description
+ Loop End (exit-condition)
```

**Behavior Modes:**
- `? Socratic Dialog Mode:` - Interactive questioning, user can be incorrect
- `? Execution Mode:` - Direct execution without user interaction
- `? Review Mode:` - Critical review with detailed feedback
- `? Research Mode:` - Exploratory codebase analysis

### Checkcard References

```
→ See Checkcard: `checkcards/checkcards-X.Y-to-X.Z.json` (step_id: "X.Y")
→ See Interface: `InterfaceName` in checkcard-interfaces.ts
```

## Multi-Agent Skill Structure

### Directory Layout

```
.claude/skills/.custom/workflow/workflow-{phase-action}-phase/
├── SKILL.md                           # Main phase orchestration instructions
├── references/
│   ├── sub-steps/
│   │   ├── step-X.1.md               # Detailed instructions for step X.1
│   │   ├── step-X.2.md               # Detailed instructions for step X.2
│   │   └── ...
│   ├── checkcards/
│   │   ├── checkcard-X.1-template.json
│   │   ├── checkcard-X.2-template.json
│   │   └── checkcard-validation.md
│   └── database-operations.md         # DB operation details for this phase
```

### SKILL.md Template Structure

```markdown
# [Phase Name] - [Phase Description]

## Overview

This skill orchestrates **Phase X: [Phase Name]**, containing sub-steps [X.1, X.2, ...].

**Phase Position**: X / 8
**Workflow Stage**: [Requirement Gathering / Design / Implementation / Review]

## Phase Context

**Phase Number**: X
**Main Workflow Phase**: [Phase Name] → [Description]
**Sub-steps**: X.1, X.2, X.3...
**Agents Involved**: [agent-name-1, agent-name-2, ...]
**Checkcard File**: `workflow/checkcards/checkcards-X.Y-to-X.Z.json`

## Multi-Agent Workflow

### Step X.1: [agent-name]

**Agent**: [agent-name] (or [agent-type][step-id] if spawned instance)
**Behavior Mode**: [mode if applicable]
**See Details**: `references/sub-steps/step-X.1.md`

**Quick Summary**:
- [Action 1]
- [Action 2]
- [Tool/Command usage]

**Inputs**:
- [input-name]: [description/source]

**Outputs**:
- [output-name]: [description/destination]

**Checkcard Validation**:
After completing this step, fill checkcard: `references/checkcards/checkcard-X.1-template.json`

**See**: Checkcard interface `[InterfaceName]` in `workflow/checkcards/checkcard-interfaces.ts`

---

### Step X.2: [agent-name]

[Similar structure for next sub-step]

---

## Checkcard Integration

### Purpose

Checkcards are **validation checkpoints** after each sub-step, providing an audit trail of workflow execution.

### Checkcard Workflow

```
Agent executes step → Fills checkcard → Validates completion → Continues to next step
```

### What Goes Where

**Checkcard Contains** (audit log):
- Step metadata (step_id, agent, timestamps, duration)
- Inputs/outputs (actual values from execution)
- Loop iteration data (full dialog, questions, answers)
- Database operations metadata (table, operation type, record ID)
- Context reads (which files were read)
- Command executions (which commands, output file paths)
- Agent lifecycle events (spawn/kill timestamps)
- Status (pending, in_progress, completed, failed)

**Database Contains** (source of truth):
- Actual project data (function records, task records)
- Current state (status_speckit, status_agent)
- Metadata arrays (spec_metadata, plan_metadata, etc.)
- Relationships (function_id → tasks)

**Why This Split**:
- Checkcard = "How we got here" (execution history)
- Database = "Where we are" (current state)
- Avoids data duplication
- Provides complete audit trail

### Filling Checkcards

After each sub-step, the responsible agent MUST:

1. **Read checkcard template**: `references/checkcards/checkcard-X.Y-template.json`
2. **Fill all required fields**:
   - inputs: Values from previous step or context
   - outputs: Values produced by this step
   - timestamps: started_at, completed_at
   - duration_minutes: Calculate from timestamps
3. **Track loop iterations** (if applicable):
   - Record each iteration in `loops.loop_data_per_iteration`
   - Capture questions, responses, refinements
4. **Record database operations**:
   - operation type (create/update/delete)
   - table name
   - record ID
   - timestamp
5. **Update status**: "completed" or "failed" (with error message)
6. **Write to checkcard file**: `workflow/checkcards/checkcards-X.Y-to-X.Z.json`

**Checkcard Location**: One JSON file per phase containing all sub-step checkcards

## Database Operations

### Supabase MCP Tool Mapping

| Workflow Syntax | Supabase MCP Tool | Checkcard Field |
|-----------------|-------------------|-----------------|
| `#create@table` | `supabase.insert_row` | `database_operations.create_*` |
| `#update@table` | `supabase.update_row` | `database_operations.update_*` |
| `#delete@table` | `supabase.delete_row` | `database_operations.delete_*` |
| Query (read) | `supabase.query_table` | Not logged (read-only) |

### Database Operation Documentation

**This phase performs the following database operations:**

#### Create Operations
[List all #create@ operations with tables and columns]

#### Update Operations
[List all #update@ operations with tables and columns]

#### Delete Operations
[List all #delete@ operations with tables]

**See**: `references/database-operations.md` for full SQL/MCP tool details and examples

### Checkcard Database Tracking

In checkcard, record:

```json
{
  "database_operations": {
    "create_project_function": {
      "operation": "create",
      "table": "project_functions",
      "schema": "devKit",
      "record_id": "<returned-uuid>",
      "timestamp": "<ISO-8601>"
    }
  }
}
```

**NOT** the full data (avoid duplication with database).

## Tool Dependencies

### Slash Commands

**Commands Used in This Phase**:
- `@command:[command-name]` - [purpose]

### MCP Tools

**MCP Tools Used in This Phase**:
- `@mcp:[server].[tool]` - [purpose]

### Agent Coordination

**Agent Lifecycle Management**:
- `@agent-spawn:[type][step-id]` - [when spawned and why]
- `@agent-kill:[type][step-id]` - [when killed and why]

## Loop Structures (if applicable)

### Loop Type: [loop-type]

**Structure**:
- Max Iterations: [number or "unlimited"]
- Exit Condition: [condition description]
- Behavior Mode: [mode]

**Loop Data Tracking**:

Each iteration must be recorded in checkcard:

```json
{
  "loops": {
    "type": "[loop-type]",
    "max_iterations": X,
    "iterations": Y,
    "loop_data_per_iteration": [
      {
        "iteration": 1,
        "[specific-fields]": "..."
      }
    ],
    "exit_condition": "[what triggered exit]"
  }
}
```

**See**: `checkcard-interfaces.ts` for specific loop interface (e.g., `UserApprovalLoop`, `CoderReviewerLoop`)

## Next Phase Transition

After this phase completes:

**Next Phase**: [X+1]. [Next Phase Name]
**Triggered By**: [orchestrator action or condition]
**Agent Spawn**: `@agent-spawn:[agent-type][step-id]` (if applicable)
**Next Agent Step**: [X+1.1] [agent-name] does [action]

## Validation Checklist

Before marking this phase complete:

- [ ] All sub-steps completed in order
- [ ] All checkcards filled and marked "completed"
- [ ] Database operations executed successfully
- [ ] Agent lifecycle managed correctly (spawn/kill)
- [ ] Next phase agent spawned (if applicable)
- [ ] All outputs from phase available to next phase
- [ ] No errors in checkcard status fields
```

## Checkcard System

### Checkcard Files

**Location**: `workflow/checkcards/`

**File Naming**: `checkcards-X.Y-to-X.Z.json`
- One file per phase containing all sub-step checkcards
- Example: `checkcards-1.1-to-2.2.json` contains Phase 1 (steps 1.1, 1.2) and Phase 2 (steps 2.1, 2.2)

**Structure**:

```json
{
  "checkcards": [
    {
      "step_id": "1.1",
      "step_name": "User Request",
      "agent": "user",
      "description": "...",
      "inputs": { ... },
      "outputs": { ... },
      "status": "pending",
      "started_at": null,
      "completed_at": null,
      "duration_minutes": null
    },
    {
      "step_id": "1.2",
      "step_name": "Orchestrator Initial Dialog",
      "agent": "orchestrator",
      "behavior_mode": "Socratic Dialog Mode",
      "inputs": { ... },
      "context_reads": [...],
      "loops": { ... },
      "database_operations": { ... },
      "outputs": { ... },
      "status": "pending",
      "started_at": null,
      "completed_at": null,
      "duration_minutes": null
    }
  ]
}
```

### Checkcard Interfaces

**Location**: `workflow/checkcards/checkcard-interfaces.ts`

**Purpose**: TypeScript interfaces defining structure for each checkcard type

**Base Interface**:

```typescript
export interface BaseCheckcard {
  step_id: string;
  step_name: string;
  agent: "user" | "orchestrator" | "planner" | "coder" | "reviewer" | "database-architect";
  description: string;
  behavior_mode?: "Socratic Dialog Mode" | "Execution Mode" | "Review Mode" | "Research Mode";

  status: "pending" | "in_progress" | "completed" | "failed";
  started_at: string | null;
  completed_at: string | null;
  duration_minutes: number | null;

  error?: string;
}
```

**Specific Interfaces**: Each step type has its own interface extending `BaseCheckcard`

Examples:
- `UserRequestCheckcard` (step 1.1)
- `OrchestratorInitialDialogCheckcard` (step 1.2)
- `PlannerSpecifyCheckcard` (step 2.1)
- `OrchestratorSpecUpdateCheckcard` (step 2.2)

### Loop Data Structures

**Loop Types**:

1. **UserApprovalLoop**: Unlimited iterations, exits on user approval
2. **PlanReviewLoop**: Max 3 iterations, exits on approval or max iterations
3. **CoderReviewerLoop**: Max 3 iterations, exits on approval, max iterations, or orchestrator intervention

Each loop type has:
- `loop_data_per_iteration`: Array capturing each iteration's data
- `exit_condition`: What caused loop to exit

## Skill Generation Strategy

### 1. Parse Workflow by Main Phases

**Algorithm**:

```
FOR each main phase in workflow.md (## X. Phase Name → Description):
  1. Extract phase number, name, description
  2. Extract all sub-steps (### X.Y agent-name)
  3. For each sub-step:
     - Extract agent assignment
     - Extract behavior mode (if present)
     - Extract actions and tool references
     - Extract database operations
     - Extract loop structures
  4. Map to checkcard file (checkcards-X.Y-to-X.Z.json)
  5. Generate skill name: workflow-{phase-action}-phase
```

### 2. Generate Skill Directory Structure

**For each phase**:

```
skill_path = .claude/skills/.custom/workflow/workflow-{phase-action}-phase

CREATE:
  skill_path/SKILL.md
  skill_path/references/sub-steps/step-X.Y.md (for each sub-step)
  skill_path/references/checkcards/checkcard-X.Y-template.json (for each sub-step)
  skill_path/references/database-operations.md
```

### 3. Generate SKILL.md Content

**Template population**:

1. Fill phase context (number, name, sub-steps, agents)
2. For each sub-step:
   - Create sub-step section
   - Extract quick summary from workflow
   - Link to detailed instructions
   - Link to checkcard template
3. Add checkcard integration section
4. Document database operations
5. List tool dependencies
6. Document next phase transition
7. Add validation checklist

### 4. Generate Sub-Step Instructions

**For each sub-step** (references/sub-steps/step-X.Y.md):

Extract from workflow:
- Agent role
- Behavior mode
- Inputs (from previous step or context)
- Context to read (files)
- Detailed instructions (actions)
- Tool/command usage
- Database operations (with Supabase MCP syntax)
- Loop handling (if applicable)
- Checkcard filling instructions
- Outputs (to next step)

### 5. Generate Checkcard Templates

**Source**: `workflow/checkcards/checkcard-interfaces.ts`

**Process**:

1. Identify interface for step (e.g., `UserRequestCheckcard` for step 1.1)
2. Convert TypeScript interface to JSON template
3. Set all values to `null` (placeholder)
4. Add comments indicating what agent should fill
5. Save to `references/checkcards/checkcard-X.Y-template.json`

**Example**:

```json
{
  "step_id": "1.2",
  "step_name": "Orchestrator Initial Dialog",
  "agent": "orchestrator",
  "behavior_mode": "Socratic Dialog Mode",

  "inputs": {
    "user_story_description": null  // FILL: From step 1.1 output
  },

  "context_reads": [],  // FILL: Add files read

  "loops": {
    "type": "user_approval_loop",
    "max_iterations": null,
    "iterations": 0,  // FILL: Actual iteration count
    "loop_data_per_iteration": [],  // FILL: Add iteration data
    "exit_condition": "user approval"
  },

  "database_operations": {
    "create_project_function": {
      "project_id": null,  // FILL: From context
      "name": null,  // FILL: From user dialog
      "description": null,  // FILL: From user dialog
      "slug": null,  // FILL: Generated
      "status_speckit": null,
      "status_agent": "orchestrator"
    }
  },

  "outputs": {
    "function_id": null,  // FILL: From database insert
    "function_name": null,
    "function_description": null,
    "function_slug": null,
    "agent_spawned": null  // FILL: Agent spawn info
  },

  "status": "pending",  // FILL: Update to "completed" or "failed"
  "started_at": null,  // FILL: ISO-8601 timestamp
  "completed_at": null,  // FILL: ISO-8601 timestamp
  "duration_minutes": null  // FILL: Calculated
}
```

### 6. Generate Database Operations Documentation

**For each phase** (references/database-operations.md):

Document all database operations from workflow:

```markdown
# Database Operations: [Phase Name]

## Create Operations

### Create: project_functions

**Workflow Syntax**:
```
#create@project_functions
- project_id: <from-context>
- name: <from-user-input>
- description: <from-loop-output>
- slug: <generated>
- status_speckit: null
- status_agent: orchestrator
#
```

**Supabase MCP Tool**:
```
@mcp:supabase.insert_row
```

**Parameters**:
```json
{
  "table": "project_functions",
  "schema": "devKit",
  "data": {
    "project_id": "<uuid>",
    "name": "Invoice Generator",
    "description": "Create PDF invoices from form data",
    "slug": "invoice-generator",
    "status_speckit": null,
    "status_agent": "orchestrator"
  }
}
```

**Returns**: `{ "id": "<uuid>", ... }`

**Checkcard Tracking**:
Record in checkcard `database_operations.create_project_function`:
- operation: "create"
- table: "project_functions"
- record_id: "<returned-uuid>"
- timestamp: "<ISO-8601>"

## Update Operations

[Similar structure for update operations]
```

## Example: Phase 1 "User Request"

### Generated Skill Structure

```
workflow-user-request-phase/
├── SKILL.md
├── references/
│   ├── sub-steps/
│   │   ├── step-1.1.md
│   │   └── step-1.2.md
│   ├── checkcards/
│   │   ├── checkcard-1.1-template.json
│   │   ├── checkcard-1.2-template.json
│   │   └── checkcard-validation.md
│   └── database-operations.md
```

### SKILL.md (Condensed)

```markdown
# User Request → Initial Function Creation

## Overview

This skill orchestrates **Phase 1: User Request**, containing sub-steps 1.1 (user), 1.2 (orchestrator).

**Phase Position**: 1 / 8
**Workflow Stage**: Requirement Gathering

## Phase Context

**Phase Number**: 1
**Main Workflow Phase**: User Request → Initial Function Creation
**Sub-steps**: 1.1, 1.2
**Agents Involved**: user, orchestrator
**Checkcard File**: `workflow/checkcards/checkcards-1.1-to-2.2.json`

## Multi-Agent Workflow

### Step 1.1: user

**Agent**: user
**See Details**: `references/sub-steps/step-1.1.md`

**Quick Summary**:
- User describes which function/implementation they want to develop

**Inputs**: None

**Outputs**:
- user_story_description: Initial function description from user

**Checkcard Validation**:
Fill: `references/checkcards/checkcard-1.1-template.json`

**See**: Interface `UserRequestCheckcard` in `workflow/checkcards/checkcard-interfaces.ts`

---

### Step 1.2: orchestrator

**Agent**: orchestrator
**Behavior Mode**: Socratic Dialog Mode
**See Details**: `references/sub-steps/step-1.2.md`

**Quick Summary**:
- Reads constitution.md and CLAUDE.md
- Engages user in dialog to refine function description (UserApprovalLoop)
- Creates project_functions database record
- Spawns planner[1.2] agent

**Inputs**:
- user_story_description: From step 1.1

**Outputs**:
- function_id: Database record UUID
- function_name: Refined function name
- function_description: Refined description
- function_slug: Generated URL slug
- agent_spawned: planner[1.2] instance info

**Loop Structure**:
- Type: UserApprovalLoop
- Max Iterations: Unlimited
- Exit Condition: User approval

**Checkcard Validation**:
Fill: `references/checkcards/checkcard-1.2-template.json`

**See**: Interface `OrchestratorInitialDialogCheckcard` in `workflow/checkcards/checkcard-interfaces.ts`

---

## Checkcard Integration

After each sub-step, the responsible agent MUST fill the corresponding checkcard.

**Checkcard Location**: `workflow/checkcards/checkcards-1.1-to-2.2.json`

Contains 4 checkcards: 1.1, 1.2 (Phase 1), 2.1, 2.2 (Phase 2)

## Database Operations

### Create: project_functions

**Table**: `project_functions`
**Schema**: `devKit`
**Operation**: `@mcp:supabase.insert_row`

**Columns**:
- project_id: Current project UUID
- name: Refined function name from user dialog
- description: Refined description from user dialog
- slug: Auto-generated from name (URL-safe)
- status_speckit: null
- status_agent: "orchestrator"

**Checkcard Tracking**:
```json
{
  "database_operations": {
    "create_project_function": {
      "project_id": "abc-123",
      "name": "Invoice Generator",
      "description": "Create PDF invoices from form data",
      "slug": "invoice-generator",
      "status_speckit": null,
      "status_agent": "orchestrator"
    }
  }
}
```

**See**: `references/database-operations.md` for full details

## Tool Dependencies

### Slash Commands
None in this phase.

### MCP Tools
- `@mcp:supabase.insert_row` - Create project_functions record

### Agent Coordination
- `@agent-spawn:planner[1.2]` - Spawned at end of step 1.2

## Next Phase Transition

After this phase completes:

**Next Phase**: 2. Specify Phase → Initiales Spec Draft
**Triggered By**: Orchestrator completes step 1.2
**Agent Spawn**: `@agent-spawn:planner[1.2]`
**Next Agent Step**: 2.1 planner[1.2] executes /speckit.specify

## Validation Checklist

- [ ] Step 1.1: User provided initial description
- [ ] Step 1.2: Orchestrator refined description with user (loop tracked)
- [ ] project_functions record created in database
- [ ] function_id captured in checkcard output
- [ ] planner[1.2] agent spawned
- [ ] Both checkcards filled and marked "completed"
- [ ] No errors in checkcard status fields
```

### references/sub-steps/step-1.2.md

```markdown
# Step 1.2: Orchestrator Initial Dialog

## Role

You are the **orchestrator** in Socratic Dialog Mode.

## Inputs

From step 1.1:
- `user_story_description`: User's initial function description

## Context to Read

1. `constitution.md` - Project principles and constraints
2. `CLAUDE.md` - Orchestrator role and workflow instructions

## Instructions

### 1. Understand User Request

Read the user's initial description and identify:
- Core functionality desired
- Scope (MVP vs full feature)
- Any technical constraints mentioned

### 2. Engage Socratic Dialog (UserApprovalLoop)

**Behavior Mode**: Socratic Dialog Mode

In this mode:
- Ask probing questions to clarify requirements
- Guide user toward clear, concise MVP definition
- User responses may be vague or incorrect - refine iteratively
- Focus on "what" and "why", not "how"

**Loop Structure**:
- Type: `user_approval_loop`
- Max Iterations: Unlimited
- Exit Condition: User approves refined description

**Track Each Iteration**:
```json
{
  "iteration": 1,
  "orchestrator_question": "What's the primary user action?",
  "user_response": "Upload invoice data and generate PDF",
  "refined_description": "Invoice Generator: Upload form data, generate PDF invoice"
}
```

**Sample Questions**:
- "What's the primary user action this function enables?"
- "What's the minimal viable output?"
- "What data inputs are required?"
- "Are there any constraints (auth, permissions, etc.)?"

### 3. Refine Function Metadata

After user approval, extract:
- **name**: Short, descriptive (e.g., "Invoice Generator")
- **description**: 1-2 sentences, clear and concise
- **slug**: URL-safe version of name (e.g., "invoice-generator")

### 4. Create Database Record

Use Supabase MCP tool:

```
@mcp:supabase.insert_row

Parameters:
{
  "table": "project_functions",
  "schema": "devKit",
  "data": {
    "project_id": "<from-context>",
    "name": "<from-dialog>",
    "description": "<from-dialog>",
    "slug": "<generated>",
    "status_speckit": null,
    "status_agent": "orchestrator"
  }
}
```

Capture returned `id` as `function_id`.

### 5. Fill Checkcard

Open: `workflow/checkcards/checkcards-1.1-to-2.2.json`

Find checkcard with `step_id: "1.2"` and fill:

```json
{
  "step_id": "1.2",
  "step_name": "Orchestrator Initial Dialog",
  "agent": "orchestrator",
  "behavior_mode": "Socratic Dialog Mode",

  "inputs": {
    "user_story_description": "<from-step-1.1>"
  },

  "context_reads": ["constitution.md", "CLAUDE.md"],

  "loops": {
    "type": "user_approval_loop",
    "max_iterations": null,
    "iterations": 3,  // Example: 3 iterations occurred
    "loop_data_per_iteration": [
      {
        "iteration": 1,
        "orchestrator_question": "...",
        "user_response": "...",
        "refined_description": "..."
      },
      // ... iterations 2 and 3
    ],
    "exit_condition": "user approval"
  },

  "database_operations": {
    "create_project_function": {
      "project_id": "abc-123",
      "name": "Invoice Generator",
      "description": "Create PDF invoices from form data",
      "slug": "invoice-generator",
      "status_speckit": null,
      "status_agent": "orchestrator"
    }
  },

  "outputs": {
    "function_id": "<returned-uuid>",
    "function_name": "Invoice Generator",
    "function_description": "Create PDF invoices from form data",
    "function_slug": "invoice-generator",
    "agent_spawned": {
      "agent_type": "planner",
      "agent_id": "planner[1.2]",
      "spawned_at": "2025-01-15T10:30:00Z"
    }
  },

  "status": "completed",
  "started_at": "2025-01-15T10:25:00Z",
  "completed_at": "2025-01-15T10:30:00Z",
  "duration_minutes": 5
}
```

### 6. Spawn Planner Agent

Execute agent spawn:

```
@agent-spawn:planner[1.2]
```

Provide planner with context:
- function_id
- function_description
- Session context

## Outputs

- **function_id**: UUID from database
- **function_name**: Refined name
- **function_description**: Refined description
- **function_slug**: Generated slug
- **agent_spawned**: planner[1.2] instance info

## Next Step

Planner[1.2] proceeds to step 2.1: Specify Phase
```

## Generator Script Interface

### Planned Script

**Location**: `.specify/scripts/powershell/generate-workflow-skills.ps1`

### Usage

```powershell
# Generate all workflow skills
.\generate-workflow-skills.ps1

# Generate specific phase
.\generate-workflow-skills.ps1 -Phase 2

# Dry run (show what would be generated)
.\generate-workflow-skills.ps1 -DryRun

# Force regenerate (overwrite existing)
.\generate-workflow-skills.ps1 -Force

# Validate workflow syntax only
.\generate-workflow-skills.ps1 -ValidateOnly

# Output as JSON instead of creating files
.\generate-workflow-skills.ps1 -OutputFormat json
```

### Parameters

```powershell
param(
    [int]$Phase,                    # Generate specific phase (1-8)
    [switch]$DryRun,                # Show what would be generated
    [switch]$Force,                 # Overwrite existing files
    [switch]$ValidateOnly,          # Validate workflow syntax only
    [string]$OutputFormat = "files" # files | json | markdown
)
```

### Expected Output

```
> .\generate-workflow-skills.ps1

Parsing workflow.md...
✓ Found 8 main phases
✓ Found 22 sub-steps
✓ Found 8 slash command references
✓ Found 15 MCP tool references
✓ Found 12 database operations
✓ Validated against checkcard-interfaces.ts

Generating skills...

Phase 1: User Request → Initial Function Creation
  ✓ Created .claude/skills/.custom/workflow/workflow-user-request-phase/
  ✓ Generated SKILL.md (1,245 lines)
  ✓ Generated references/sub-steps/step-1.1.md
  ✓ Generated references/sub-steps/step-1.2.md
  ✓ Generated references/checkcards/checkcard-1.1-template.json
  ✓ Generated references/checkcards/checkcard-1.2-template.json
  ✓ Generated references/database-operations.md

Phase 2: Specify Phase → Initiales Spec Draft
  ✓ Created .claude/skills/.custom/workflow/workflow-specify-phase/
  ...

Summary:
  8 skills generated
  22 sub-step documents created
  22 checkcard templates created
  8 database operation documents created
  0 validation errors
  0 conflicts (use -Force to overwrite)
```

## Validation Rules

### Workflow Syntax Validation

Before generation, validate:

1. **Phase Numbering**: Sequential (1, 2, 3...)
2. **Sub-step Numbering**: Logical within phase (1.1, 1.2 not 1.1, 1.5)
3. **Tool References**:
   - All `@command:` resolve to `.claude/commands/`
   - All `@mcp:` use valid `server.tool` format
4. **Agent References**:
   - All `@agent-spawn:` use valid agent types
   - All `@agent-kill:` have matching prior `@agent-spawn:`
5. **Database Operations**:
   - All `#create@`/`#update@`/`#delete@` properly closed with `#`
6. **Checkcard References**:
   - All step_ids match checkcard-interfaces.ts
   - All referenced interfaces exist

### Checkcard Interface Validation

1. Each sub-step (X.Y) must have corresponding interface in `checkcard-interfaces.ts`
2. Interface must extend `BaseCheckcard`
3. Interface must include all workflow-documented fields

### Database Schema Validation

1. All referenced tables exist in Supabase schema
2. All referenced columns exist in tables
3. Foreign key relationships valid

## Benefits of This Approach

### Single Source of Truth
- `workflow.md` defines entire process
- Changes propagate automatically via generator

### Multi-Agent Clarity
- Each skill explicitly shows agent handoffs
- Sub-step instructions isolated and detailed

### Validation Built-In
- Checkcards ensure workflow integrity
- Audit trail of complete execution history

### Maintainability
- Skills auto-generated from workflow
- Consistent structure across all phases
- Easy to update and iterate

### Traceability
- Every step tracked in checkcards
- Database operations logged
- Agent lifecycle visible

## Future Extensions

### Visual Workflow Mapping

Generate Mermaid diagram from workflow.md:

```mermaid
graph TD
    A[1.1 User Request] --> B[1.2 Orchestrator Dialog]
    B -->|Create DB record| C[project_functions]
    B -->|Spawn| D[planner-1.2]
    D --> E[2.1 Planner Specify]
    E -->|@command:speckit.specify| F[spec.md]
    F --> G[2.2 Orchestrator Update]
    G -->|Update DB| C
    G -->|Kill| D
```

### Hooks Integration (Conceptual)

If Claude Code adds skill lifecycle hooks:

```yaml
# workflow-user-request-phase/hooks.yml
on_step_start:
  - validate_checkcard_exists: step-X.Y
  - check_preconditions

on_step_end:
  - fill_checkcard: step-X.Y
  - validate_checkcard_complete
  - trigger_next_step

on_phase_complete:
  - validate_all_checkcards_complete
  - update_project_status
  - spawn_next_phase_agent
```

### Database Migration Generation

Generate Supabase migrations from workflow database operations:

```sql
-- Generated from workflow.md Phase 1
CREATE TABLE IF NOT EXISTS project_functions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  status_speckit TEXT,
  status_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Checkcard Validation System

### Validation Script

**Location**: `.claude/skills/.custom/workflow/{skill-name}/references/scripts/validate-checkcard.py`

**Purpose**: Validates checkcard JSON against TypeScript interface schemas before proceeding to next step.

### Validation Integration

Each step instruction includes validation loop after checkcard filling:

```markdown
### 6. Validate Checkcard

Run validation script to ensure checkcard is complete and correct:

```bash
python references/scripts/validate-checkcard.py \
  references/{step-id}_Checkcard_{FillingAgent}.json \
  {InterfaceName}
```

**Validation Loop** (max 3 attempts):

```
+ Start Validation Loop
- Run validation script
- IF validation passes (exit code 0): Exit loop, proceed to next step
- IF validation fails (exit code 1):
  - Review error messages
  - Fix missing/incorrect fields in checkcard
  - Retry validation
+ Loop End (validation passes OR attempt_count >= 3)

IF attempt_count >= 3 AND validation still failing:
  - Mark checkcard status as "failed"
  - Add validation errors to checkcard.error field
  - Report to orchestrator for manual intervention
  - HALT workflow (do not proceed to next step)
```
```

### Exit Codes

- `0`: Validation passed → Continue to next step
- `1`: Validation failed → Show errors, retry
- `2`: Script error (file not found, invalid JSON, etc.)

### Validation Checks

1. **Required fields** present with correct types
2. **Required values** match expected (step_id, agent, status)
3. **Status-specific rules**:
   - `completed`: Must have timestamps, duration, all outputs filled
   - `failed`: Must have error message
   - `pending`/`in_progress`: Nullable fields allowed
4. **Nested structures** (loops, database_operations) complete
5. **Timestamp format** (ISO-8601)
6. **Input/output fields** match interface requirements

### Git Commit After Validation

**Concept**: Automatically commit checkcard after successful validation as workflow checkpoint.

**Benefits**:
- Each step creates rollback point
- Audit trail in Git history
- Clear workflow progression
- Easy to resume after failure

**Implementation Options**:

**Option 1: Explicit in Step Instructions** (Recommended)
```markdown
### 7. Git Commit Checkpoint

**Only proceed if validation passed.**

Commit checkcard as workflow checkpoint:

```bash
git add references/{step-id}_Checkcard_{FillingAgent}.json
git commit -m "$(cat <<'EOF'
workflow: Phase X Step {step-id} completed

Agent: {agent-name}
Function ID: ${function_id}
Step: {step-name}
Status: completed

Checkcard validated and committed as workflow checkpoint.
EOF
)"
```
```

**Option 2: Automatic in Validation Script**
```python
# In validate-checkcard.py after validation passes
if is_valid and os.getenv("WORKFLOW_AUTO_COMMIT") == "true":
    import subprocess
    step_id = checkcard.get("step_id", "unknown")
    agent = checkcard.get("agent", "unknown")

    subprocess.run(["git", "add", checkcard_file])
    subprocess.run([
        "git", "commit", "-m",
        f"workflow: Step {step_id} completed by {agent}\n\nCheckcard validated."
    ])
```

With environment variable in `.claude/settings.local.json`:
```json
{
  "env": {
    "WORKFLOW_AUTO_COMMIT": "true"
  }
}
```

**Recommendation**: Use Option 1 (explicit) for:
- Full agent control over commit timing
- Ability to include workflow-specific data (function_id, etc.) in commit message
- Keep validation script focused on validation only (Single Responsibility Principle)
- Agent can batch multiple checkcard commits if needed

**Alternative**: Use Option 2 (automatic) for:
- Fully automated workflow execution
- Zero manual intervention required
- Environment variable provides kill-switch

## File Structure (Phase 1 Implementation)

### Current Implementation

Phase 1 skill uses **flat file structure with explicit agent role naming**:

```
.claude/skills/.custom/workflow/workflow-user-request-phase/
├── SKILL.md                                    # Phase orchestration
├── references/
│   ├── 1.1_Step_User.md                       # Step executed by User
│   ├── 1.1_Checkcard_Orchestrator.json        # Checkcard filled by Orchestrator
│   ├── 1.2_Step_Orchestrator.md               # Step executed by Orchestrator
│   ├── 1.2_Checkcard_Orchestrator.json        # Checkcard filled by Orchestrator
│   ├── database-operations.md                  # DB operations reference
│   └── scripts/
│       └── validate-checkcard.py               # Validation script
```

### Naming Convention Benefits

**Format**: `{step-id}_Step_{ExecutingAgent}.md` and `{step-id}_Checkcard_{FillingAgent}.json`

**Advantages**:
1. **Chronological order**: Automatic alphabetical sort by step ID
2. **Clear responsibility**: Immediately see who executes vs who fills checkcard
3. **Flat structure**: No unnecessary nesting, all files at same level
4. **Searchability**: Easy to find specific step or checkcard

**Agent Responsibility Model**:
- **Main Agent (Orchestrator)**: Fills ALL Main Agent checkcards, including user input tracking
- **Sub-Agents (Planner, Coder, etc.)**: Fill only their own checkcards
- **Rationale**: User doesn't interact with checkcards; Orchestrator tracks user input as workflow entry point

### Template Files

Checkcards are **template JSON files** that agents fill during execution:
- Template stored in skill references/
- Actual execution data written to `workflow/checkcards/checkcards-{range}.json`
- Template provides structure and comments for what to fill

## Summary

### Key Principles

1. **Skills = Phases** (not sub-steps)
2. **Multi-Agent Orchestration** (one skill, multiple agents)
3. **Checkcard Validation** (after each sub-step with error loop)
4. **Git Commit Checkpoints** (after successful validation)
5. **Database Separation** (checkcards = audit log, DB = source of truth)
6. **Automatic Generation** (from workflow.md)

### Naming Convention

- **Skills**: `workflow-{phase-action}-phase`
- **Commands**: `speckit.{command-name}`
- Clear differentiation for agent vs user tools

### Workflow Structure

- 8 main phases → 8 skills
- 22+ sub-steps across phases
- Multi-agent coordination (user, orchestrator, planner, coder, reviewer, database-architect)
- Checkcard validation at each sub-step
- Database operations tracked (table + ID only)

### Next Steps

1. Create generator script: `.specify/scripts/powershell/generate-workflow-skills.ps1`
2. Validate workflow.md syntax
3. Generate all 8 phase skills
4. Test with sample workflow execution
5. Iterate based on real usage

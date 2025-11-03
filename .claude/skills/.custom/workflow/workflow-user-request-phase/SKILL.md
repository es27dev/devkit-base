---
name: workflow-user-request-phase
description: This skill orchestrates Phase 1 User Request workflow, coordinating user input and orchestrator dialog to create initial project function records with validation via checkcards.
---

# User Request → Initial Function Creation

## Overview

This skill orchestrates **Phase 1: User Request**, where the user describes a function implementation and the orchestrator refines it into a structured project function entry.

**Phase Position**: 1 / 8
**Workflow Stage**: Requirement Gathering

## Phase Context

**Phase Number**: 1
**Main Workflow Phase**: User Request → Initial Function Creation
**Sub-steps**: 1.1 (user), 1.2 (orchestrator)
**Agents Involved**: user, orchestrator
**Checkcard File**: `workflow/checkcards/checkcards-1.1-to-2.2.json`

## Multi-Agent Workflow

### Step 1.1: user

**Agent**: user
**See Details**: `references/1.1_Step_User.md`
**Checkcard**: `references/1.1_Checkcard_Orchestrator.json`

**Quick Summary**:
- User describes which function/implementation they want to develop

**Inputs**: None

**Outputs**:
- user_story_description: Initial function description from user

**See Interface**: `UserRequestCheckcard` in `workflow/checkcards/checkcard-interfaces.ts`

---

### Step 1.2: orchestrator

**Agent**: orchestrator
**Behavior Mode**: Socratic Dialog Mode
**See Details**: `references/1.2_Step_Orchestrator.md`
**Checkcard**: `references/1.2_Checkcard_Orchestrator.json`

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

**See Interface**: `OrchestratorInitialDialogCheckcard` in `workflow/checkcards/checkcard-interfaces.ts`

---

## Checkcard Integration

**Agent Roles**:
- **Main Agent**: Orchestrator - Fills all Main Agent checkcards (including user input tracking)
- **Sub-Agents**: Planner, Coder, Reviewer, Database-Architect - Fill their own checkcards

**Checkcard Location**: `workflow/checkcards/checkcards-1.1-to-2.2.json`

Contains 4 checkcards: 1.1, 1.2 (Phase 1), 2.1, 2.2 (Phase 2)

### Checkcard Workflow

```
Step executes → Agent fills checkcard → Returns to Main Agent → Continues to next step
```

**Responsibility**:
- Step 1.1 (agent: "user"): **Orchestrator fills** (tracks user input as workflow input)
- Step 1.2 (agent: "orchestrator"): **Orchestrator fills** (tracks own dialog step)
- Step 2.1 (agent: "planner"): **Planner fills** (Sub-Agent tracks own work)
- Step 2.2 (agent: "orchestrator"): **Orchestrator fills** (tracks own coordination step)

**Rationale**:
- User checkcard = Orchestrator's input tracking (user doesn't interact with checkcards)
- Sub-Agents track their own work for accountability and performance measurement

### What Goes in Checkcard

- Step metadata (step_id, agent, timestamps, duration)
- Inputs/outputs (actual values from execution)
- Loop iteration data (full dialog, questions, answers)
- Database operations metadata (table, operation type, record ID)
- Context reads (which files were read)
- Agent lifecycle events (spawn timestamps)
- Status (pending, in_progress, completed, failed)

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
Record in `database_operations.create_project_function`:
- operation: "create"
- table: "project_functions"
- record_id: `<returned-uuid>`
- timestamp: `<ISO-8601>`

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

Before marking this phase complete:

- [ ] Step 1.1: User provided initial description
- [ ] Step 1.2: Orchestrator refined description with user (loop tracked)
- [ ] project_functions record created in database
- [ ] function_id captured in checkcard output
- [ ] planner[1.2] agent spawned
- [ ] Both checkcards filled and marked "completed"
- [ ] No errors in checkcard status fields

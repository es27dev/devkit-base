---
name: speckit-workflow
description: Multi-agent workflow for spec-driven development using the Checkcard MCP system (A1 → F1)
---

# Speckit Workflow - Multi-Agent Orchestration

## Overview

This skill orchestrates a **6-step workflow (A1 → F1)** for spec-driven development, where agents collaborate to transform user requirements into validated, actionable tasks.

**Workflow Stages**: User Request → Specify → Clarify → Plan → Review → Tasks
**Agent Types**: Orchestrator, Planner
**Technology**: MCP (Model Context Protocol) server for workflow state management

## Architecture

### Checkcard MCP System

All workflow steps use the **Checkcard MCP Server** to:
- Load structured inputs from previous steps
- Provide step-specific instructions to agents
- Validate outputs against schemas
- Save workflow state with metadata/agent_data separation
- Track progress through the workflow

**MCP Server**: `scripts/checkcard_mcp.py` (in this skill folder)
**Step Definitions**: `scripts/step_definitions.py`
**Template Checkcards**: `references/checkcards/`

### Data Flow Pattern

```
Agent calls load_step_input →
  MCP returns: {instructions, inputs, expected_outputs}

Agent processes task →

Agent calls save_step_output →
  MCP validates outputs →
  MCP adds metadata automatically →
  MCP saves checkcard
```

### File Structure

```
.claude/skills/.custom/speckit/
├── SKILL.md                          # This file
├── scripts/
│   ├── checkcard_mcp.py              # MCP server (FastMCP)
│   ├── step_definitions.py           # Step configurations
│   └── validate-checkcard.py         # JSON schema validator
└── references/
    └── checkcards/
        ├── A1_checkcard.json          # Template checkcard
        ├── A1_checkcard.schema.json   # JSON schema
        ├── ... (B1, C1, D1, E1, F1)
        └── F1_VALIDATION_GUIDE.md     # Task validation docs
```

## MCP Tools

### 1. Load Step Input

**Tool**: `checkcard_load_step_input`

**Parameters**:
```json
{
  "step_id": "A1" | "B1" | "C1" | "D1" | "E1" | "F1",
  "spec_path": ".specify/specs/001-feature" (optional)
}
```

**Returns**:
```json
{
  "instructions": ["Step 1: ...", "Step 2: ..."],
  "inputs": {
    "field_name": "value from previous step"
  },
  "expected_outputs": [
    {
      "key": "output_field",
      "type": "text" | "bool" | "list",
      "required": true,
      "description": "What this field contains"
    }
  ]
}
```

**Agent View**: Agent ONLY sees instructions, inputs, and expected outputs. NO metadata visible.

---

### 2. Save Step Output

**Tool**: `checkcard_save_step_output`

**Parameters**:
```json
{
  "step_id": "A1" | "B1" | "C1" | "D1" | "E1" | "F1",
  "spec_path": ".specify/specs/001-feature" (optional),
  "outputs": {
    "field_name": "value"
  },
  "tools": {  // Only for A1
    "file_context_accessed": ["file1.ts"],
    "mcp_servers_accessed": ["server1"],
    "claude_skills_accessed": []
  }
}
```

**Returns** (Success):
```json
{
  "success": true,
  "step_id": "A1",
  "saved_to": "/path/to/checkcard",
  "message": "Step A1 completed successfully"
}
```

**Returns** (Error):
```json
{
  "success": false,
  "errors": ["Missing required field: user_story"],
  "missing_fields": ["user_story"],
  "hint": "A1 requires: user_story, description_of_feature, ..."
}
```

**MCP Behavior**: Automatically adds all metadata (step_index, step_name, agent, description, created_at) without agent involvement.

---

## Workflow Steps

### A1: User Request + Orchestrator Dialog

**Agent**: orchestrator
**MCP Input**: None (first step)
**MCP Output**: user story + tools tracking

**Purpose**: Capture user requirements and refine into user story

**Instructions** (from MCP):
1. Engage in Socratic dialog with user
2. Ask clarifying questions
3. Create complete user story (WHO/WHAT/WHY format)
4. Get user approval
5. Track which tools/context you accessed

**Expected Outputs**:
- `user_initial_input`: Initial user request (text)
- `user_approved_stepA2`: User approval (bool)
- `description_of_feature`: Summary max 500 chars (text)
- `user_story`: Full user story max 2000 chars (text)
- `tools`: File context, MCP servers, Claude skills accessed (dict)

**Next Step**: B1

---

### B1: Planner Specify Phase

**Agent**: planner
**MCP Input**: `user_story` (from A1)
**MCP Output**: `spec_file_path`

**Purpose**: Research codebase and create specification

**Instructions** (from MCP):
1. Read user story from inputs
2. Research codebase using available tools
3. Execute `/speckit.specify` command
4. Generate specification document
5. Provide spec file path in outputs

**Expected Outputs**:
- `spec_file_path`: Path to spec file (e.g., `.specify/specs/001-feature/spec.md`)

**Next Step**: C1

---

### C1: Orchestrator Clarify Phase

**Agent**: orchestrator
**MCP Input**: `spec_file_path` (from B1)
**MCP Output**: approval + clarified spec path

**Purpose**: Review spec with user and clarify uncertainties

**Instructions** (from MCP):
1. Read spec file path from inputs
2. Review specification with user
3. Execute `/speckit.clarify` if needed
4. Iterate until user approves
5. Provide approval status and final spec path

**Expected Outputs**:
- `user_approved_clarification`: User approval (bool)
- `clarify_summary`: Clarification summary (text)
- `spec_file_path`: Final spec path (text)

**Next Step**: D1

---

### D1: Planner Plan Phase

**Agent**: planner
**MCP Input**: `spec_file_path` (from C1)
**MCP Output**: plan + all artifact paths

**Purpose**: Create detailed implementation plan

**Instructions** (from MCP):
1. Read approved spec file path from inputs
2. Use MCP tools to gather library docs (context7, shadcn, supabase)
3. Execute `/speckit.plan` command
4. Generate plan.md and all artifacts
5. Provide all file paths in outputs

**Expected Outputs**:
- `spec_file_path`: Spec file path (text)
- `plan_file_path`: Main plan file (text)
- `plan_analyze_summary_path`: Plan analysis (text)
- `research_path`: Research document (text)
- `data_model_path`: Data model document (text)
- `contracts_path`: Contracts directory (text)
- `quickstart_path`: Quickstart guide (text)

**Next Step**: E1

---

### E1: Orchestrator Plan Review

**Agent**: orchestrator
**MCP Input**: `plan_file_path`, `plan_analyze_summary_path` (from D1)
**MCP Output**: approval + final plan path

**Purpose**: Review plan with user and get approval

**Instructions** (from MCP):
1. Read plan file paths from inputs
2. Execute `/speckit.analyze` to review plan quality
3. Present plan summary to user
4. Get user approval (allow up to 3 review iterations)
5. Provide approval status and final plan path

**Expected Outputs**:
- `user_approved_plan`: User approval (bool)
- `plan_summary_path`: Final plan path (text)

**Next Step**: F1

---

### F1: Planner Tasks Phase [WITH VALIDATION]

**Agent**: planner
**MCP Input**: `plan_file_path` (from E1)
**MCP Output**: validated tasks JSON + task file path

**Purpose**: Break down plan into validated, actionable tasks

**Special Feature**: Task JSON validation with auto-generated fields

**Instructions** (from MCP):
1. Read approved plan path from inputs
2. Execute `/speckit.tasks` command
3. Generate task breakdown as JSON array
4. Provide tasks JSON - it will be automatically validated
5. Provide file path where tasks should be saved

**Expected Outputs**:
- `tasks_json`: Array of task objects (text or array)
- `task_file_path`: Path to save tasks (text)

**Task Schema** (validated by MCP):
```json
{
  "task_id": "string",           // Required: Unique ID (e.g., "T001")
  "description": "string",        // Required: Task description
  "is_parallel": boolean,         // Required: Can run in parallel?
  "dependencies": null | string[],// Required: null or array of task IDs
  "mvp": boolean,                 // Required: Part of MVP?
  "phase": integer,               // Auto-inferred from task_id (T001-T010=1, T011-T020=2, etc.)
  "status": "pending"             // Auto-set by MCP to "pending"
}
```

**Validation Flow**:
```
Agent provides JSON → MCP validates structure →
  If valid: Auto-add phase + status → Save → Success
  If invalid: Return errors → Agent retries
```

**Common Validation Errors**:
- Missing required field (task_id, description, etc.)
- Wrong type (e.g., string instead of boolean)
- Invalid dependencies (must be null or string array)
- Empty task list

**Next Step**: Implementation (use tasks)

---

## Checkcard File Format

### Saved Checkcard Structure

```json
{
  "stepX": {
    "metadata": {                // Added by MCP automatically
      "step_index": 1,
      "step_name": "...",
      "agent": "orchestrator",
      "description": "...",
      "created_at": "2025-11-06T..."
    },
    "agent_data": {              // Provided by agent only
      "inputs": {
        "field": "value"
      },
      "outputs": {
        "field": "value"
      },
      "tools": {                 // Only A1
        "file_context_accessed": [],
        "mcp_servers_accessed": [],
        "claude_skills_accessed": []
      }
    }
  }
}
```

### Storage Locations

**Template Checkcards** (in skill folder):
- `references/checkcards/A1_checkcard.json` (example)
- Used when `spec_path` is NOT provided
- Serve as templates for new workflows

**Spec-Specific Checkcards** (in project):
- `.specify/specs/001-feature/checkcards/A1_checkcard.json`
- Used when `spec_path` IS provided
- Track workflow state for specific features

---

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

Each handoff via MCP tools with automatic validation.

---

## Usage Example

### Starting Workflow

```python
# Step A1: Orchestrator collects user story
result = await checkcard_load_step_input({
  "step_id": "A1"
})
# Returns instructions + empty inputs + expected outputs

# Agent engages with user, creates story
result = await checkcard_save_step_output({
  "step_id": "A1",
  "spec_path": ".specify/specs/001-sales-form",
  "outputs": {
    "user_initial_input": "Sales form for leads",
    "user_approved_stepA2": true,
    "description_of_feature": "Sales contact form...",
    "user_story": "As Sales Manager I want..."
  },
  "tools": {
    "file_context_accessed": ["spec.md"],
    "mcp_servers_accessed": ["checkcard-workflow"],
    "claude_skills_accessed": []
  }
})
# MCP adds metadata and saves
```

### Continuing Workflow

```python
# Step B1: Planner creates spec
result = await checkcard_load_step_input({
  "step_id": "B1",
  "spec_path": ".specify/specs/001-sales-form"
})
# Returns: {instructions, inputs: {user_story: "..."}, expected_outputs}

# Planner generates spec
result = await checkcard_save_step_output({
  "step_id": "B1",
  "spec_path": ".specify/specs/001-sales-form",
  "outputs": {
    "spec_file_path": ".specify/specs/001-sales-form/spec.md"
  }
})
```

---

## Error Handling

### Missing Previous Step

```json
{
  "error": "Source step 'stepA1' not found in checkcard 'A1'",
  "message": "Make sure the previous step has been completed"
}
```

**Solution**: Run previous step first

### Validation Failure (F1)

```json
{
  "success": false,
  "errors": [
    "Task 0 (T001): Missing required field: is_parallel"
  ],
  "missing_fields": [],
  "invalid_fields": [],
  "hint": "Check task JSON structure"
}
```

**Solution**: Fix JSON structure and retry

### Empty Input

```json
{
  "error": "Input 'user_story' from previous step is missing or empty"
}
```

**Solution**: Re-run previous step with complete data

---

## PowerShell Scripts

**Location**: `.specify/scripts/powershell/`

- `common.ps1` - Shared functions
- `check-prerequisites.ps1` - Verify workflow requirements
- `setup-plan.ps1` - Initialize planning artifacts
- `create-new-feature.ps1` - Create new feature branch + spec structure
- `update-agent-context.ps1` - Update agent-specific context files

---

## Tool Dependencies

### Slash Commands & Skills

**Orchestrator** (can use slash commands):
- `/speckit.specify` → Agent skill: `B1_specify`
- `/speckit.clarify` → Agent skill: `C1_clarify`
- `/speckit.plan` → Agent skill: `D1_plan`
- `/speckit.analyze` → Agent skill: `E1_analyze`
- `/speckit.tasks` → Agent skill: `F1_tasks`
- `/speckit.implement` → Agent skill: `G1_implement`
- `/speckit.checklist` → Agent skill: `checklist`
- `/speckit.constitution` → Agent skill: `constitution`

**Agents** (must use skills):
- Planner: `B1_specify`, `D1_plan`, `F1_tasks`
- Coder: `G1_implement`
- Database-Architect: `G1_implement`

**Location**: `.claude/commands/speckit.*.md` (slash), `.claude/skills/.custom/speckit/*/SKILL.md` (skills)

### MCP Tools

- **context7**: Library documentation (react-hook-form, zod, etc.)
- **shadcn**: UI component information
- **supabase**: Database operations
- **chrome-devtools**: Performance testing
- **checkcard-workflow**: This workflow system

---

## MCP Server Setup

### Installation

The MCP server is included in this skill folder at `scripts/checkcard_mcp.py`.

**Register** using Claude CLI:
```bash
claude mcp add checkcard-workflow /absolute/path/to/.claude/skills/.custom/speckit/scripts/checkcard_mcp.py
```

### Dependencies

```bash
pip install fastmcp pydantic
```

### Verification

Test MCP connection:
```python
# Check available tools
mcp__checkcard-workflow__checkcard_load_step_input
mcp__checkcard-workflow__checkcard_save_step_output
```

---

## Validation Checklist

### Before Moving to Next Step

**A1 Complete**:
- [ ] User initial input collected
- [ ] User story created and approved
- [ ] Tools accessed tracked
- [ ] Checkcard saved

**B1 Complete**:
- [ ] User story loaded from A1
- [ ] Specification created
- [ ] Spec file path provided
- [ ] Checkcard saved

**C1 Complete**:
- [ ] Spec file loaded from B1
- [ ] User reviewed and approved spec
- [ ] Final spec path provided
- [ ] Checkcard saved

**D1 Complete**:
- [ ] Spec file loaded from C1
- [ ] Plan and all artifacts created
- [ ] All file paths provided (7 outputs)
- [ ] Checkcard saved

**E1 Complete**:
- [ ] Plan files loaded from D1
- [ ] User reviewed and approved plan
- [ ] Final plan path provided
- [ ] Checkcard saved

**F1 Complete**:
- [ ] Plan file loaded from E1
- [ ] Tasks JSON created
- [ ] **Tasks validated by MCP** (all fields correct)
- [ ] Tasks auto-saved by MCP
- [ ] Checkcard saved

---

## Next Steps After F1

After F1 completes with validated tasks:
- Tasks are saved to specified file path in `.specify/specs/*/`
- Implementation phase can begin
- Each task can be assigned to appropriate agent (Coder, Reviewer, Database-Architect)
- Task dependencies ensure correct execution order
- Task status tracking enables progress monitoring

---

## Implementation Agents

**After F1, implementation begins with specialized agents:**

### Coder Agent
**Role**: Implement features with mock data
**MCP**: shadcn
**Output**: Working code with placeholder data

### Reviewer Agent
**Role**: Quality check + minor fixes
**MCP**: chrome-devtools (performance testing)
**Decisions**:
- **APPROVED (with fixes)**: Reviewer fixes minor issues (imports, naming)
- **CHANGES REQUESTED**: Critical bugs → back to Coder (max 3 iterations)
- **APPROVED AS-IS**: No issues

### Database-Architect Agent
**Role**: Supabase schema + RLS policies
**MCP**: supabase, chrome-devtools
**When**: Only after Reviewer approval

### Implementation Flow

```
Planner (F1) → Coder → Reviewer
                         ↓
              (If approved) → Database-Architect
              (If changes) → Back to Coder (max 3)
```

---

## Key Files Reference

- [.specify/memory/constitution.md](.specify/memory/constitution.md) - Project governance (HIGHEST AUTHORITY)
- [.specify/templates/spec-template.md](.specify/templates/spec-template.md) - Specification template
- [.specify/templates/plan-template.md](.specify/templates/plan-template.md) - Planning template
- [.specify/templates/tasks-template.md](.specify/templates/tasks-template.md) - Tasks template
- [.claude/templates/](./../../templates/) - Component templates
- [.claude/agents/](./../../agents/) - Agent definitions (planner, coder, reviewer, database-architect)

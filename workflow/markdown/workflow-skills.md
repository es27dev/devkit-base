# Workflow-to-Skills Generation Logic

## Concept

Generate workflow-aware skills automatically from workflow.md phases, enabling agents to understand:
- Their position in the overall workflow
- Database state transitions they trigger
- Which agent takes over next
- What preconditions must be met

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
@command:<command-name>          # Execute slash command
@mcp:<server>.<tool>             # Use MCP tool
@agent-spawn:<type>[step-id]     # Spawn agent instance
@agent-kill:<type>[step-id]      # Kill agent instance
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

### Loops

```
+ Start Loop
- Loop Step ? Behavior Mode: description
+ Loop End (condition)
```

**Behavior Modes:**
- `? Socratic Dialog Mode:` - Interactive questioning
- `? Execution Mode:` - Direct execution
- `? Review Mode:` - Critical review
- `? Research Mode:` - Exploratory analysis

## Skill Generation Strategy

### 1. Parse Workflow Phases

**For each `## X. Phase` block:**

Extract:
- Phase number (X)
- Phase name
- Phase description
- Sub-steps (X.Y)
- Agent assignments
- Tool/command calls
- Database operations
- Next agent spawns

### 2. Map Commands to Skills

**Pattern**: `@command:speckit.command-name` → Skill: `speckit-command-name`

**Example:**
```markdown
### 2.1 orchestrator
- @command:speckit.specify
```

Maps to:
- Skill: `.claude/skills/.custom/speckit/speckit-specify/`
- Enhancement: Add workflow integration

### 3. Generate Workflow Integration References

**For each skill mapped from workflow:**

Create: `[skill-dir]/references/workflow-integration.md`

**Template:**

```markdown
# Workflow Integration: [skill-name]

## Phase Context

**Phase**: [X.Y] [Phase Name] → [Description]
**Executed By**: [agent-name]
**Preconditions**:
- [List preconditions from workflow]

**Postconditions**:
- [List postconditions from workflow]

## Database State Transitions

[Extract from #update@/#create@ blocks]

**Before:**
```json
{
  "status_speckit": "[previous-state]",
  "status_agent": "[previous-agent]"
}
```

**After:**
```json
{
  "status_speckit": "[new-state]",
  "status_agent": "[new-agent]"
}
```

## Database Operations

[Full SQL/operation details from workflow]

## Next Phase Trigger

**Orchestrator Action:**
- [Next @agent-spawn or phase transition]

**Next Phase**: [X+1.Y] [Next Phase Name]
**Next Agent**: [agent-name]

## Behavioral Context

**Mode**: [Behavior Mode if specified]
**User Interaction**: [Expected user interaction patterns]

## Tool Dependencies

**Commands Used:**
- @command:[command-name]

**MCP Tools Used:**
- @mcp:[server].[tool]

**Agent Coordination:**
- @agent-spawn:[type][step-id]
- @agent-kill:[type][step-id]

## Loop Integration (if applicable)

**Loop Structure:**
- Max Iterations: [number]
- Exit Condition: [condition]
- Behavior Mode: [mode]
```

### 4. Update Skill SKILL.md

**Add section to existing SKILL.md:**

```markdown
## Workflow Integration

This skill is part of the SpecKit workflow orchestration.

**See detailed workflow context**: `references/workflow-integration.md`

**Quick Context:**
- Phase: [X.Y] [Phase Name]
- Executed by: [agent-name]
- Database updates: [table-name].[status-fields]
- Next phase: [X+1.Y] [Next Phase]
```

## Generation Examples

### Example 1: Simple Command Phase

**workflow.md:**
```markdown
## 2. Specify Phase → Initiales Spec Draft

### 2.1 orchestrator
- @command:speckit.specify
- Creates spec.md

#update@project_functions
- id: <function-id>
- status_speckit: specify
- status_agent: orchestrator
- spec_file_link: <path>
#

### 2.2 orchestrator
- @agent-spawn:planner[2.2]
```

**Generated: speckit-specify/references/workflow-integration.md:**

```markdown
# Workflow Integration: speckit-specify

## Phase Context

**Phase**: 2.1 Specify Phase → Initiales Spec Draft
**Executed By**: orchestrator
**Preconditions**:
- User story exists in project_functions.description

**Postconditions**:
- spec.md created at .specify/specs/<slug>/spec.md
- project_functions updated with spec metadata

## Database State Transitions

**Before:**
```json
{
  "status_speckit": null,
  "status_agent": "orchestrator"
}
```

**After:**
```json
{
  "status_speckit": "specify",
  "status_agent": "orchestrator",
  "spec_file_link": "<path-to-spec.md>"
}
```

## Database Operations

```sql
UPDATE project_functions SET
  status_speckit = 'specify',
  status_agent = 'orchestrator',
  spec_file_link = '<path-to-spec.md>',
  spec_metadata = jsonb_build_object(
    'spec_draft_created', true,
    'created_at', NOW()
  )
WHERE id = <function-id>
```

## Next Phase Trigger

**Orchestrator Action:**
- @agent-spawn:planner[2.2] (Clarify Mode)

**Next Phase**: 3. Clarify Phase
**Next Agent**: planner
```

### Example 2: Interactive Loop Phase

**workflow.md:**
```markdown
## 3. Clarify Phase → Spec Verfeinerung

**planner**

+ Start Loop
- @command:speckit.clarify ? Socratic Dialog Mode: Stellt max 5 Fragen
- User beantwortet Fragen
- Updates spec.md inkrementell
+ Loop End (all questions answered)

#update@project_functions
- id: <function-id>
- status_speckit: clarify
- status_agent: planner
#
```

**Generated: speckit-clarify/references/workflow-integration.md:**

```markdown
# Workflow Integration: speckit-clarify

## Phase Context

**Phase**: 3. Clarify Phase → Spec Verfeinerung
**Executed By**: planner

## Loop Integration

**Loop Structure:**
- Max Questions: 5
- Exit Condition: All questions answered
- Behavior Mode: Socratic Dialog Mode (interactive questioning)

**Behavior Mode Details:**
- Agent asks probing questions
- User can provide incorrect answers
- Agent guides toward clarity
- Spec updated after each answer

## Database State Transitions

**After Loop Completion:**
```json
{
  "status_speckit": "clarify",
  "status_agent": "planner",
  "spec_metadata": {
    "questions_answered": true,
    "clarified_at": "<timestamp>"
  }
}
```
```

### Example 3: Multi-Tool Integration Phase

**workflow.md:**
```markdown
## 4. Plan Phase → Technische Planung

**planner**

- @mcp:context7.get-library-docs (react-hook-form, zod)
- @mcp:shadcn.search-items (components)
- @mcp:supabase.list-tables (DB context)
- @command:speckit.plan
- Returns: plan.md

#update@project_functions
- status_speckit: plan
- status_agent: planner
#
```

**Generated: speckit-plan/references/workflow-integration.md:**

```markdown
# Workflow Integration: speckit-plan

## Tool Dependencies

**MCP Tools Used:**
- @mcp:context7.get-library-docs - Fetch library documentation
  - Libraries: react-hook-form, zod, shadcn/ui components
- @mcp:shadcn.search-items - Find relevant UI components
- @mcp:supabase.list-tables - Retrieve database context

**Commands Used:**
- @command:speckit.plan - Generate technical plan

**Execution Order:**
1. Gather library documentation
2. Identify UI components
3. Check database schema
4. Generate plan.md with technical decisions
```

## Generator Script Interface

### Planned Script: `generate-workflow-skills.ps1`

**Location**: `.specify/scripts/powershell/generate-workflow-skills.ps1`

**Usage:**

```powershell
# Generate workflow integration for all skills
.specify/scripts/powershell/generate-workflow-skills.ps1

# Generate for specific phase
.specify/scripts/powershell/generate-workflow-skills.ps1 -Phase 2

# Dry run (show what would be generated)
.specify/scripts/powershell/generate-workflow-skills.ps1 -DryRun

# Force regenerate (overwrite existing)
.specify/scripts/powershell/generate-workflow-skills.ps1 -Force
```

**Output:**

```
Parsing workflow.md...
Found 8 phases with 12 command references

Phase 2.1: speckit-specify
  ✓ Created references/workflow-integration.md
  ✓ Updated SKILL.md with workflow section

Phase 3: speckit-clarify
  ✓ Created references/workflow-integration.md
  ✓ Updated SKILL.md with workflow section

...

Summary:
  8 skills enhanced with workflow integration
  12 workflow-integration.md files created
  0 conflicts (use -Force to overwrite)
```

## Skill Enhancement Strategy

### Current Skill Structure

```
speckit-specify/
├── SKILL.md              # Core skill instructions
```

### Enhanced Skill Structure

```
speckit-specify/
├── SKILL.md              # Core skill instructions
│                         # + Workflow Integration section
└── references/
    └── workflow-integration.md  # Detailed workflow context
```

### Progressive Enhancement

**Phase 1 (Current)**: Basic skills with execution instructions

**Phase 2 (Next)**: Add workflow integration references
- Parse workflow.md
- Generate workflow-integration.md per skill
- Add workflow section to SKILL.md

**Phase 3 (Future)**: Database operation integration
- Extract DB operations from workflow
- Generate SQL templates
- Add transaction management

**Phase 4 (Advanced)**: Agent coordination
- Extract agent spawn/kill patterns
- Generate agent handoff protocols
- Add state validation

## Workflow Validation

### Checks Before Generation

1. **Workflow Syntax Validation**:
   - All @command: references resolve to .claude/commands/
   - All @mcp: references use valid server.tool format
   - All @agent-spawn: references use valid agent types
   - Database operation blocks properly closed (#...#)

2. **Skill Existence Validation**:
   - For each @command:speckit.X, verify .claude/skills/.custom/speckit/speckit-X/ exists
   - Warn if skill directory missing

3. **Phase Continuity Validation**:
   - Phase numbers sequential (2, 3, 4...)
   - Sub-steps logical (2.1, 2.2, not 2.1, 2.5)
   - status_speckit transitions valid (specify → clarify → plan → tasks → implement)

4. **Agent Coordination Validation**:
   - Each @agent-spawn has matching step-id
   - No orphaned @agent-kill (must have prior @agent-spawn)
   - Agent types valid (orchestrator, planner, coder, reviewer, database-architect)

## Future Extensions

### Hooks Integration (Conceptual)

**If Claude Code adds skill lifecycle hooks:**

```yaml
# .claude/skills/speckit-specify/hooks.yml
on_skill_start:
  - validate_workflow_phase: 2.1
  - check_db_state: status_speckit == null

on_skill_end:
  - update_db: project_functions
  - trigger_next_phase: clarify
  - spawn_agent: planner[2.2]

on_skill_error:
  - rollback_db_changes
  - notify_orchestrator
```

**This would enable:**
- Automatic database updates on skill completion
- Automatic agent coordination
- Built-in error handling and rollback

### Visual Workflow Mapping

**Generate visual workflow diagram:**

```mermaid
graph TD
    A[User Request] --> B[orchestrator: Specify]
    B -->|@command:speckit.specify| C[spec.md created]
    C -->|DB: status=specify| D[orchestrator: spawn planner]
    D --> E[planner: Clarify]
    E -->|@command:speckit.clarify| F[spec.md updated]
    F -->|DB: status=clarify| G[planner: Plan]
```

## Summary

**Key Principles:**

1. **workflow.md is single source of truth** for process orchestration
2. **Skills are execution guides** enhanced with workflow context
3. **Generation is automatic** from workflow syntax
4. **Validation ensures consistency** between workflow and skills
5. **Progressive enhancement** allows gradual feature addition

**Benefits:**

✅ Single source of truth (workflow.md)
✅ Skills stay focused on execution
✅ Workflow changes auto-propagate to skills
✅ Database integration clear and traceable
✅ Agent coordination explicit
✅ Easy to visualize and validate complete workflow

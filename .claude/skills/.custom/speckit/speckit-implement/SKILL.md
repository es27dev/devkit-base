---
name: speckit-implement
description: This skill should be used when agents need to execute implementation plans by processing task lists, managing dependencies, and validating completion against specifications.
---

# SpecKit Implement

Execute implementation plans by systematically processing tasks from tasks.md.

## Purpose

Transform task lists into working implementations through phase-by-phase execution with dependency management, validation checkpoints, and progress tracking.

## When to Use

Use this skill when:
- Executing implementation from completed task plans
- Managing multi-phase development workflows
- Coordinating parallel vs sequential task execution
- Validating implementation against specifications

## Core Workflow

### 1. Prerequisites Check

Run prerequisite script:

```bash
.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks
```

Parse `FEATURE_DIR` and `AVAILABLE_DOCS`.

### 2. Checklist Status Validation

If `FEATURE_DIR/checklists/` exists:

**Scan all checklist files**:
- Count total items: `- [ ]` or `- [X]`
- Count completed: `- [X]` or `- [x]`
- Count incomplete: `- [ ]`

**Create status table**:

| Checklist | Total | Completed | Incomplete | Status |
|-----------|-------|-----------|------------|--------|
| ux.md     | 12    | 12        | 0          | ✓ PASS |
| test.md   | 8     | 5         | 3          | ✗ FAIL |

**If any incomplete**:
- Display table
- **STOP** and ask: "Some checklists incomplete. Proceed anyway? (yes/no)"
- Wait for user response
- Halt if "no"/"wait"/"stop"

**If all complete**: Display table, proceed automatically.

### 3. Load Implementation Context

**REQUIRED**:
- Read `tasks.md`: Complete task list and execution plan
- Read `plan.md`: Tech stack, architecture, file structure

**IF EXISTS**:
- Read `data-model.md`: Entities and relationships
- Read `contracts/`: API specs and test requirements
- Read `research.md`: Technical decisions
- Read `quickstart.md`: Integration scenarios

### 4. Project Setup Verification

**Create/verify ignore files** based on detected technologies:

**Detection logic**:
- Git repo check: `git rev-parse --git-dir 2>/dev/null` → create `.gitignore`
- Dockerfile exists → create `.dockerignore`
- `.eslintrc*` exists → create `.eslintignore`
- `.prettierrc*` exists → create `.prettierignore`

**If ignore file exists**: Verify essential patterns, append missing critical ones only

**If missing**: Create with full pattern set for detected technology

**Common patterns by technology** (from plan.md):
- **Node.js/TypeScript**: `node_modules/`, `dist/`, `build/`, `*.log`, `.env*`
- **Python**: `__pycache__/`, `*.pyc`, `.venv/`, `venv/`, `dist/`
- **Java**: `target/`, `*.class`, `*.jar`, `.gradle/`, `build/`
- **Rust**: `target/`, `debug/`, `release/`, `*.rs.bk`
- **Universal**: `.DS_Store`, `Thumbs.db`, `.vscode/`, `.idea/`

### 5. Parse tasks.md Structure

Extract:
- **Task phases**: Setup, Tests, Core, Integration, Polish
- **Task dependencies**: Sequential vs parallel rules
- **Task details**: ID, description, file paths, [P] markers
- **Execution flow**: Order and dependency requirements

### 6. Execute Implementation

**Phase-by-phase execution**:
- Complete each phase before moving to next
- Respect dependencies: sequential tasks in order
- Parallel tasks [P] can run together
- Follow TDD: test tasks before implementation
- File coordination: same-file tasks run sequentially
- Validation checkpoints after each phase

**Execution rules**:
1. **Setup first**: Project structure, dependencies, config
2. **Tests before code**: Contract, entity, integration tests (if required)
3. **Core development**: Models, services, CLI, endpoints
4. **Integration**: Database, middleware, logging, external services
5. **Polish**: Unit tests, optimization, documentation

### 7. Progress Tracking & Error Handling

- Report progress after each completed task
- **IMPORTANT**: Mark completed tasks as `[X]` in tasks.md
- Halt if any non-parallel task fails
- For [P] tasks: continue successful ones, report failures
- Provide clear error messages with context
- Suggest next steps if blocked

### 8. Completion Validation

Verify:
- All required tasks completed
- Features match original specification
- Tests pass and meet coverage requirements
- Implementation follows technical plan

Report final status with summary.

## Key Rules

**Task Marking**: Always mark completed tasks as `[X]` in tasks.md immediately after completion.

**Dependency Management**: Never execute dependent tasks before prerequisites complete.

**Error Handling**: Halt on critical failures, continue with warnings on non-blocking issues.

**Validation**: Verify implementation against spec at each phase boundary.

## Reference

Full command specification: `.claude/commands/speckit.implement.md`

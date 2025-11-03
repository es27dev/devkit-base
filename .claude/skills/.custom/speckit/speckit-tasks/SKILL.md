---
name: speckit-tasks
description: This skill should be used when agents need to generate actionable, dependency-ordered task lists organized by user story for feature implementation.
---

# SpecKit Tasks

Generate comprehensive, user-story-organized task lists from design artifacts.

## Purpose

Transform technical plans and specifications into executable task lists organized by user story, enabling independent implementation and testing of each story.

## When to Use

Use this skill when:
- Converting plans into actionable task breakdowns
- Organizing implementation by user story priorities
- Creating dependency-ordered task sequences
- Identifying parallelization opportunities

## Core Workflow

### 1. Setup & Prerequisites

Run prerequisite check:

```bash
.specify/scripts/powershell/check-prerequisites.ps1 -Json
```

Parse `FEATURE_DIR` and `AVAILABLE_DOCS`.

### 2. Load Design Documents

From `FEATURE_DIR`, read:

**Required**:
- `plan.md`: Tech stack, libraries, structure
- `spec.md`: User stories with priorities (P1, P2, P3...)

**Optional** (if exists):
- `data-model.md`: Entities
- `contracts/`: API endpoints
- `research.md`: Decisions
- `quickstart.md`: Test scenarios

### 3. Task Generation Rules

**CRITICAL FORMAT**: Every task MUST follow:

```
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**Format Components**:
1. **Checkbox**: Always `- [ ]`
2. **Task ID**: Sequential (T001, T002, T003...)
3. **[P] marker**: Include ONLY if parallelizable
4. **[Story] label**: REQUIRED for user story tasks
   - Format: [US1], [US2], [US3]
   - Setup/Foundational/Polish: NO label
5. **Description**: Clear action + exact file path

**Examples**:
- ✅ `- [ ] T001 Create project structure per implementation plan`
- ✅ `- [ ] T005 [P] Implement auth middleware in src/middleware/auth.py`
- ✅ `- [ ] T012 [P] [US1] Create User model in src/models/user.py`
- ❌ `- [ ] Create User model` (missing ID and label)

### 4. Phase Structure

Organize by user story priority:

**Phase 1: Setup**
- Project initialization tasks
- NO story labels

**Phase 2: Foundational**
- Blocking prerequisites for ALL stories
- NO story labels

**Phase 3+: User Stories** (P1, P2, P3...)
- One phase per user story
- ALL tasks have [US#] label
- Each story independently testable
- Order: Tests (if requested) → Models → Services → Endpoints → Integration

**Final Phase: Polish**
- Cross-cutting concerns
- NO story labels

### 5. Task Organization Strategy

Map components to user stories:

**From spec.md user stories**:
- Each story (P1, P2, P3) → own phase
- Map models/services/endpoints to their story
- Mark story dependencies (minimize)

**From contracts/**:
- Map endpoint → user story it serves
- Contract tests (if requested) → [P] before implementation

**From data-model.md**:
- Entity → story(ies) needing it
- Multi-story entities → earliest story or Setup

**Tests Optional**: Only generate if explicitly requested or TDD specified.

### 6. Generate tasks.md

Use `.specify/templates/tasks-template.md` structure.

Include:
- Feature name from plan.md
- All phases with story-organized tasks
- Dependency graph (story completion order)
- Parallel execution examples per story
- Implementation strategy (MVP first)

### 7. Report

Output:
- Path to tasks.md
- Total task count
- Count per user story
- Parallel opportunities
- Independent test criteria per story
- Suggested MVP scope (typically US1)
- Format validation confirmation

## Key Rules

**Organization**: Tasks MUST organize by user story, not by layer (models/services).

**Parallelization**: Mark [P] only if:
- Different files
- No dependencies on incomplete tasks

**Tests**: Generate test tasks ONLY if:
- Explicitly requested in spec
- User requests TDD approach

**Format Validation**: Minimum 80% of tasks must follow checklist format exactly.

## Reference

Full command specification: `.claude/commands/speckit.tasks.md`

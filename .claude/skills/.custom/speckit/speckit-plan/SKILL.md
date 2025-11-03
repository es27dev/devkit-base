---
name: speckit-plan
description: This skill should be used when agents need to execute implementation planning workflows, generating design artifacts including data models, API contracts, and technical architecture.
---

# SpecKit Plan

Execute implementation planning to transform feature specifications into technical design artifacts.

## Purpose

Convert validated feature specifications into actionable technical plans including architecture decisions, data models, API contracts, and implementation phases.

## When to Use

Use this skill when:
- Creating technical implementation plans from feature specs
- Generating data models and API contracts
- Making technology stack decisions
- Planning phased implementation approach

## Core Workflow

### 1. Setup & Context Loading

Run setup script and parse JSON:

```bash
.specify/scripts/powershell/setup-plan.ps1 -Json
```

Parse output for:
- `FEATURE_SPEC`: Path to spec.md
- `IMPL_PLAN`: Path to plan.md
- `SPECS_DIR`: Specs directory
- `BRANCH`: Current branch

Load context:
- Read `FEATURE_SPEC` for requirements
- Read `.specify/memory/constitution.md` for principles
- Load `IMPL_PLAN` template (already copied by script)

### 2. Execute Planning Workflow

Follow IMPL_PLAN template structure:

**Technical Context**:
- Fill architecture/stack choices
- Mark unknowns as "NEEDS CLARIFICATION"
- Document technical constraints

**Constitution Check**:
- Fill from constitution.md
- Evaluate gates (ERROR on unjustified violations)

**Phase 0: Outline & Research**:
- Extract unknowns from Technical Context
- Generate research tasks for each unknown
- Research best practices for technologies
- Consolidate findings in `research.md`:
  - Decision made
  - Rationale
  - Alternatives considered

**Phase 1: Design & Contracts**:
Prerequisites: `research.md` complete

1. Extract entities from spec → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules
   - State transitions

2. Generate API contracts from requirements:
   - One endpoint per user action
   - Use REST/GraphQL patterns
   - Output schemas to `/contracts/`

3. Update agent context:
   ```bash
   .specify/scripts/powershell/update-agent-context.ps1 -AgentType claude
   ```

Outputs: `data-model.md`, `/contracts/*`, `quickstart.md`, agent context file

### 3. Stop & Report

Command ends after Phase 2 planning.

Report:
- Branch name
- IMPL_PLAN path
- Generated artifacts (research.md, data-model.md, contracts/, quickstart.md)
- Next step: `/speckit.tasks`

## Key Rules

- Use absolute paths
- ERROR on gate failures or unresolved clarifications
- All NEEDS CLARIFICATION must be resolved in Phase 0
- Constitution violations must be justified or fixed

## Reference

Full command specification: `.claude/commands/speckit.plan.md`

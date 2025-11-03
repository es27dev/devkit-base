---
name: speckit-specify
description: This skill should be used when agents need to create or update feature specifications from natural language descriptions following the SpecKit workflow.
---

# SpecKit Specify

Generate feature specifications from user requirements using the SpecKit specification template and workflow.

## Purpose

Transform natural language feature descriptions into structured, testable specifications that follow SpecKit's quality standards. This skill guides agents through branch creation, spec generation, validation, and clarification workflows.

## When to Use

Use this skill when:
- Creating a new feature specification from user requirements
- Updating existing feature specs with new requirements
- Validating spec quality before planning phase
- Resolving specification ambiguities

## Core Workflow

### 1. Branch & Spec Initialization

Run the setup script to create feature branch and spec file:

```bash
.specify/scripts/powershell/create-new-feature.ps1 -Json "$ARGUMENTS"
```

Parse JSON output for:
- `BRANCH_NAME`: Feature branch name
- `SPEC_FILE`: Absolute path to spec.md
- `FEATURE_DIR`: Feature directory path

### 2. Load Template & Context

Read `.specify/templates/spec-template.md` for required sections.

### 3. Generate Specification

Fill template sections using this execution flow:

1. **Parse user description** from input (ERROR if empty)
2. **Extract key concepts**: actors, actions, data, constraints
3. **Handle unclear aspects**:
   - Make informed guesses based on context
   - Mark ONLY critical unknowns as `[NEEDS CLARIFICATION: question]`
   - **LIMIT: Maximum 3 clarifications total**
   - Prioritize: scope > security/privacy > UX > technical
4. **Fill User Scenarios & Testing** (ERROR if cannot determine)
5. **Generate Functional Requirements** (all testable)
6. **Define Success Criteria** (measurable, technology-agnostic)
7. **Identify Key Entities** (if data involved)

### 4. Quality Validation

Create quality checklist at `FEATURE_DIR/checklists/requirements.md`:

Validate against:
- No implementation details
- All requirements testable
- Success criteria measurable and tech-agnostic
- Maximum 3 `[NEEDS CLARIFICATION]` markers

If validation fails (excluding clarifications):
- List specific issues
- Update spec to fix
- Re-validate (max 3 iterations)

If clarifications remain:
- Present max 3 questions with suggested answers in table format
- Wait for user responses
- Update spec with resolved clarifications
- Re-validate

### 5. Report Completion

Output:
- Branch name
- Spec file path
- Validation results
- Readiness for next phase (`/speckit.clarify` or `/speckit.plan`)

## Key Guidelines

**Focus**: WHAT users need and WHY (not HOW to implement)

**Success Criteria Quality**:
- Measurable with specific metrics
- Technology-agnostic (no frameworks/tools)
- User-focused outcomes
- Verifiable without implementation knowledge

**Good**: "Users complete checkout in under 3 minutes"
**Bad**: "API response time under 200ms" (use "Users see results instantly")

**Clarification Strategy**:
- Maximum 3 [NEEDS CLARIFICATION] markers
- Use only for critical decisions impacting scope/security/UX
- Make informed guesses for everything else
- Document assumptions in spec

## Reference

Full command specification: `.claude/commands/speckit.specify.md`

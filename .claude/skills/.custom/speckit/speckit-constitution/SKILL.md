---
name: speckit-constitution
description: This skill should be used when agents need to create or update project constitution from principle inputs while ensuring all dependent templates stay synchronized.
---

# SpecKit Constitution

Create or update project constitution with governance principles, ensuring downstream template synchronization.

## Purpose

Manage the project constitution at `.specify/memory/constitution.md` as a living document defining non-negotiable principles and governance rules, propagating changes to dependent artifacts.

## When to Use

Use this skill when:
- Creating initial project constitution
- Adding or modifying governance principles
- Updating constitution version
- Synchronizing constitution changes across templates

## Critical Concept: Template-Based Constitution

Constitution file is a TEMPLATE containing placeholder tokens in square brackets (e.g., `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`).

**Job**: Collect values, fill template precisely, propagate amendments.

## Core Workflow

### 1. Load Existing Constitution

Read `.specify/memory/constitution.md`.

Identify all placeholder tokens: `[ALL_CAPS_IDENTIFIER]`.

**IMPORTANT**: User may require different number of principles than template. If number specified, respect it and update doc accordingly.

### 2. Collect/Derive Values

**Sources** (in order):
1. User input (conversation)
2. Existing repo context (README, docs, prior versions)
3. Ask user if unknown (or mark TODO)

**Governance dates**:
- `RATIFICATION_DATE`: Original adoption date (ask if unknown or mark TODO)
- `LAST_AMENDED_DATE`: Today if changes made, otherwise keep previous

**Version Increment** (`CONSTITUTION_VERSION`):
- **MAJOR**: Backward incompatible governance/principle removals or redefinitions
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements

If version bump type ambiguous, propose reasoning before finalizing.

### 3. Draft Updated Constitution

**Replace all placeholders** with concrete text:
- No bracketed tokens left (except intentionally retained, explicitly justified)
- Preserve heading hierarchy
- Remove comments once replaced (unless still clarifying)

**Each Principle section**:
- Succinct name line
- Paragraph or bullet list with non-negotiable rules
- Explicit rationale if not obvious

**Governance section**:
- Amendment procedure
- Versioning policy
- Compliance review expectations

### 4. Consistency Propagation Checklist

Validate and update dependent files:

**`.specify/templates/plan-template.md`**:
- Ensure "Constitution Check" or rules align with updated principles

**`.specify/templates/spec-template.md`**:
- Update if constitution adds/removes mandatory sections or constraints

**`.specify/templates/tasks-template.md`**:
- Ensure task categorization reflects new/removed principle-driven task types

**`.specify/templates/commands/*.md`**:
- Verify no outdated agent-specific references (use generic guidance where needed)

**Runtime docs** (README.md, docs/quickstart.md, agent guidance):
- Update references to changed principles

### 5. Produce Sync Impact Report

Prepend as HTML comment at top of constitution file after update:

```html
<!--
Sync Impact Report
==================

Version Change: vX.Y.Z → vX.Y.Z
Modified Principles:
  - Old Title → New Title

Added Sections:
  - Section Name

Removed Sections:
  - Section Name

Templates Requiring Updates:
  ✅ plan-template.md (updated)
  ✅ spec-template.md (updated)
  ⚠ tasks-template.md (pending)

Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Determine original adoption date
-->
```

### 6. Validation Before Final Output

**Check**:
- No remaining unexplained bracket tokens
- Version line matches report
- Dates in ISO format (YYYY-MM-DD)
- Principles declarative, testable, free of vague language
- "Should" replaced with MUST/SHOULD with rationale

### 7. Write Constitution

Overwrite `.specify/memory/constitution.md` with completed content.

### 8. Output Summary

Report to user:
- New version and bump rationale
- Files flagged for manual follow-up
- Suggested commit message:
  ```
  docs: amend constitution to vX.Y.Z (principle additions + governance update)
  ```

## Formatting & Style Requirements

**Markdown Structure**:
- Use template headings exactly (don't change levels)
- Wrap long rationale lines (<100 chars ideally)
- Single blank line between sections
- No trailing whitespace

**Partial Updates**: If user supplies only one principle revision, still perform validation and version decision.

**Missing Info**: Insert `TODO(<FIELD_NAME>): explanation` and include in Sync Impact Report.

## Key Rules

**Never Create New Template**: Always operate on existing `.specify/memory/constitution.md`.

**Version Bump Rationale**: Always explain why MAJOR/MINOR/PATCH chosen.

**Propagate Changes**: Update all dependent templates when principles change.

**Justification Required**: Any retained placeholder must be explicitly justified.

## Example Version Bumps

**PATCH** (v1.2.3 → v1.2.4):
- Fixed typo in Principle 3
- Clarified governance amendment wording
- No semantic changes

**MINOR** (v1.2.3 → v1.3.0):
- Added new "Observability Principle"
- Expanded guidance on existing principle

**MAJOR** (v1.2.3 → v2.0.0):
- Removed "Microservices Principle"
- Redefined "Testing Principle" (breaking change)
- Incompatible with v1.x workflows

## Reference

Full command specification: `.claude/commands/speckit.constitution.md`

---
name: speckit-analyze
description: This skill should be used when agents need to perform non-destructive cross-artifact consistency analysis across spec.md, plan.md, and tasks.md after task generation.
---

# SpecKit Analyze

Identify inconsistencies, duplications, ambiguities, and underspecified items across specification artifacts.

## Purpose

Validate consistency and quality across spec.md, plan.md, and tasks.md before implementation, identifying issues early to reduce rework risk.

## When to Use

Use this skill when:
- Validating artifact consistency after task generation
- Detecting requirement coverage gaps
- Finding duplications or conflicts
- Checking constitution alignment
- Quality-gating before implementation

**IMPORTANT**: Run ONLY after `/speckit.tasks` produces complete tasks.md.

**STRICTLY READ-ONLY**: Never modify files. Output structured analysis report.

## Core Workflow

### 1. Initialize Analysis Context

Run prerequisite check:

```bash
.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks
```

Parse `FEATURE_DIR` and `AVAILABLE_DOCS`.

Derive paths:
- `SPEC = FEATURE_DIR/spec.md`
- `PLAN = FEATURE_DIR/plan.md`
- `TASKS = FEATURE_DIR/tasks.md`

Abort if any required file missing.

### 2. Load Artifacts (Progressive Disclosure)

**From spec.md**:
- Overview/Context
- Functional Requirements
- Non-Functional Requirements
- User Stories
- Edge Cases

**From plan.md**:
- Architecture/stack choices
- Data Model references
- Phases
- Technical constraints

**From tasks.md**:
- Task IDs
- Descriptions
- Phase grouping
- Parallel markers [P]
- Referenced file paths

**From constitution**:
- Load `.specify/memory/constitution.md` for principle validation

### 3. Build Semantic Models

Create internal representations (not in output):

**Requirements inventory**: Each requirement with stable key (slug from phrase)

**User story/action inventory**: Discrete actions with acceptance criteria

**Task coverage mapping**: Map each task to requirements/stories (keyword/ID inference)

**Constitution rule set**: Principle names and MUST/SHOULD statements

### 4. Detection Passes

Limit to 50 findings total; aggregate overflow in summary.

#### A. Duplication Detection

- Near-duplicate requirements
- Mark lower-quality phrasing for consolidation

#### B. Ambiguity Detection

- Vague adjectives (fast, scalable, secure, intuitive, robust) lacking metrics
- Unresolved placeholders (TODO, TKTK, ???, `<placeholder>`)

#### C. Underspecification

- Requirements missing object or measurable outcome
- User stories missing acceptance criteria alignment
- Tasks referencing undefined files/components

#### D. Constitution Alignment

- Requirements/plan conflicting with MUST principles
- Missing mandated sections or quality gates

#### E. Coverage Gaps

- Requirements with zero tasks
- Tasks with no mapped requirement/story
- Non-functional requirements not reflected in tasks

#### F. Inconsistency

- Terminology drift (same concept, different names)
- Data entities in plan but absent in spec (or vice versa)
- Task ordering contradictions
- Conflicting requirements

### 5. Severity Assignment

**CRITICAL**: Violates constitution MUST, missing core artifact, requirement with zero coverage blocking baseline

**HIGH**: Duplicate/conflicting requirement, ambiguous security/performance, untestable acceptance criterion

**MEDIUM**: Terminology drift, missing non-functional coverage, underspecified edge case

**LOW**: Style/wording, minor redundancy not affecting execution

### 6. Produce Compact Analysis Report

Output Markdown report (no file writes):

## Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| A1 | Duplication | HIGH | spec.md:L120-134 | Two similar requirements | Merge phrasing |

**Coverage Summary Table**:

| Requirement Key | Has Task? | Task IDs | Notes |
|-----------------|-----------|----------|-------|

**Constitution Alignment Issues** (if any)

**Unmapped Tasks** (if any)

**Metrics**:
- Total Requirements
- Total Tasks
- Coverage % (requirements with ≥1 task)
- Ambiguity Count
- Duplication Count
- Critical Issues Count

### 7. Provide Next Actions

At end of report:

- **If CRITICAL**: Recommend resolving before `/speckit.implement`
- **If LOW/MEDIUM only**: User may proceed with improvement suggestions
- Provide explicit commands: `/speckit.specify refinement`, `/speckit.plan adjustment`, manual edit suggestions

### 8. Offer Remediation

Ask: "Would you like concrete remediation edits for top N issues?" (Don't apply automatically)

## Operating Principles

**Context Efficiency**:
- Minimal high-signal tokens
- Progressive disclosure (load incrementally)
- Token-efficient output (50-row limit, summarize overflow)
- Deterministic results (consistent IDs and counts)

**Analysis Guidelines**:
- **NEVER modify files** (read-only)
- **NEVER hallucinate missing sections** (report accurately)
- **Prioritize constitution violations** (always CRITICAL)
- **Use examples over exhaustive rules** (cite specific instances)
- **Report zero issues gracefully** (success report with stats)

## Key Rules

**Constitution Authority**: Constitution is non-negotiable. Conflicts are automatically CRITICAL and require spec/plan/tasks adjustment.

**Progressive Loading**: Don't dump all content into analysis. Load minimal necessary context.

**Finding Limit**: Cap at 50 findings. Summarize overflow.

**Deterministic**: Rerunning without changes produces consistent output.

## Reference

Full command specification: `.claude/commands/speckit.analyze.md`

---
name: speckit-checklist
description: This skill should be used when agents need to generate requirements quality validation checklists - unit tests for English that validate completeness, clarity, and consistency of specifications.
---

# SpecKit Checklist

Generate custom checklists that validate requirements quality - "unit tests for English."

## Purpose

Create domain-specific checklists that test whether requirements themselves are well-written, complete, unambiguous, and ready for implementation (NOT whether the implementation works).

## When to Use

Use this skill when:
- Validating requirements quality before implementation
- Creating domain-specific quality gates (UX, API, security, performance)
- Identifying specification gaps and ambiguities
- Ensuring requirements are testable and measurable

## Critical Concept: Unit Tests for English

**Checklists test REQUIREMENTS QUALITY, not implementation**:

**NOT for verification/testing**:
- ❌ "Verify the button clicks correctly"
- ❌ "Test error handling works"
- ❌ "Confirm API returns 200"

**FOR requirements quality validation**:
- ✅ "Are visual hierarchy requirements defined for all card types?" (completeness)
- ✅ "Is 'prominent display' quantified with specific sizing?" (clarity)
- ✅ "Are hover state requirements consistent across interactive elements?" (consistency)

**Metaphor**: If spec is code in English, checklist is its unit test suite.

## Core Workflow

### 1. Setup

Run prerequisite check:

```bash
.specify/scripts/powershell/check-prerequisites.ps1 -Json
```

Parse `FEATURE_DIR` and `AVAILABLE_DOCS`.

### 2. Clarify Intent (Dynamic Questions)

Generate up to 3 contextual clarifying questions from user phrasing + spec/plan/tasks signals.

**Generation algorithm**:
1. Extract signals: domain keywords, risk indicators, stakeholder hints
2. Cluster signals into candidate focus areas (max 4)
3. Identify probable audience & timing
4. Detect missing dimensions: scope, depth, risk, boundaries, criteria

**Question archetypes**:
- Scope refinement
- Risk prioritization
- Depth calibration
- Audience framing
- Boundary exclusion
- Scenario class gap

**Defaults when interaction impossible**:
- Depth: Standard
- Audience: Reviewer (PR) for code; Author otherwise
- Focus: Top 2 relevance clusters

### 3. Load Feature Context

Read from `FEATURE_DIR`:
- `spec.md`: Requirements and scope
- `plan.md` (if exists): Technical details
- `tasks.md` (if exists): Implementation tasks

**Loading strategy**: Progressive disclosure, load only necessary portions, summarize long sections.

### 4. Generate Checklist

Create `FEATURE_DIR/checklists/[domain].md`

**Naming**: Short, descriptive (e.g., `ux.md`, `api.md`, `security.md`)

Each run creates NEW file (never overwrites).

Number items sequentially: CHK001, CHK002, etc.

**Category Structure** - Group by requirement quality dimensions:

- **Requirement Completeness** (all necessary requirements present?)
- **Requirement Clarity** (specific and unambiguous?)
- **Requirement Consistency** (align without conflicts?)
- **Acceptance Criteria Quality** (measurable?)
- **Scenario Coverage** (all flows/cases addressed?)
- **Edge Case Coverage** (boundary conditions defined?)
- **Non-Functional Requirements** (performance, security, a11y specified?)
- **Dependencies & Assumptions** (documented and validated?)
- **Ambiguities & Conflicts** (what needs clarification?)

### 5. How to Write Checklist Items

**Item Structure Pattern**:
- Question format asking about requirement quality
- Focus on what's WRITTEN (or not) in spec/plan
- Include quality dimension: [Completeness/Clarity/Consistency/Coverage/etc.]
- Reference spec section: `[Spec §X.Y]` or markers: `[Gap]`, `[Ambiguity]`, `[Conflict]`

**Examples by Quality Dimension**:

**Completeness**:
- "Are error handling requirements defined for all API failure modes? [Gap]"
- "Are accessibility requirements specified for all interactive elements? [Completeness]"

**Clarity**:
- "Is 'fast loading' quantified with specific timing thresholds? [Clarity, Spec §NFR-2]"
- "Are 'related episodes' selection criteria explicitly defined? [Clarity, Spec §FR-5]"

**Consistency**:
- "Do navigation requirements align across all pages? [Consistency, Spec §FR-10]"
- "Are card component requirements consistent between pages? [Consistency]"

**Coverage**:
- "Are requirements defined for zero-state scenarios? [Coverage, Edge Case]"
- "Are concurrent user interaction scenarios addressed? [Coverage, Gap]"

**Measurability**:
- "Are visual hierarchy requirements measurable/testable? [Acceptance Criteria, Spec §FR-1]"
- "Can 'balanced visual weight' be objectively verified? [Measurability, Spec §FR-2]"

**Scenario Classification**:
- Check requirements exist for: Primary, Alternate, Exception/Error, Recovery, Non-Functional
- For each: "Are [scenario type] requirements complete, clear, consistent?"
- If missing: "Are [scenario type] requirements intentionally excluded or missing? [Gap]"

**Traceability**: ≥80% of items MUST include reference (`[Spec §X.Y]` or marker).

**Surface & Resolve Issues**:
- Ambiguities: "Is 'fast' quantified with metrics? [Ambiguity, Spec §NFR-1]"
- Conflicts: "Do navigation requirements conflict? [Conflict]"
- Assumptions: "Is 'always available API' assumption validated? [Assumption]"
- Dependencies: "Are external API requirements documented? [Dependency, Gap]"

**Content Consolidation**: If >40 raw candidates, prioritize by risk/impact. Merge near-duplicates.

### 6. Absolutely Prohibited Patterns

🚫 **These make it implementation test, NOT requirements test**:

- ❌ Starting with "Verify", "Test", "Confirm", "Check" + implementation behavior
- ❌ References to code execution, user actions, system behavior
- ❌ "Displays correctly", "works properly", "functions as expected"
- ❌ "Click", "navigate", "render", "load", "execute"
- ❌ Test cases, test plans, QA procedures
- ❌ Implementation details (frameworks, APIs, algorithms)

### 7. Required Patterns

✅ **These test requirements quality**:

- ✅ "Are [requirement type] defined/specified/documented for [scenario]?"
- ✅ "Is [vague term] quantified/clarified with specific criteria?"
- ✅ "Are requirements consistent between [section A] and [section B]?"
- ✅ "Can [requirement] be objectively measured/verified?"
- ✅ "Are [edge cases/scenarios] addressed in requirements?"
- ✅ "Does the spec define [missing aspect]?"

### 8. Structure Reference

Use `.specify/templates/checklist-template.md` for:
- Title format
- Meta section (purpose, created date)
- Category headings
- ID formatting

If unavailable, use: H1 title, meta lines, `##` categories, `- [ ] CHK### <item>` with globally incrementing IDs.

### 9. Report

Output:
- Full path to created checklist
- Item count
- Reminder that each run creates new file
- Summary: focus areas, depth level, actor/timing, user-specified items

## Example Checklist Types

**UX (`ux.md`)**:
- "Are visual hierarchy requirements defined with measurable criteria? [Clarity, Spec §FR-1]"
- "Is number/positioning of UI elements specified? [Completeness, Spec §FR-1]"
- "Are interaction state requirements consistently defined? [Consistency]"

**API (`api.md`)**:
- "Are error response formats specified for all failures? [Completeness]"
- "Are rate limiting requirements quantified? [Clarity]"
- "Are authentication requirements consistent? [Consistency]"

**Performance (`performance.md`)**:
- "Are performance requirements quantified with metrics? [Clarity]"
- "Are targets defined for critical journeys? [Coverage]"
- "Can performance requirements be objectively measured? [Measurability]"

**Security (`security.md`)**:
- "Are authentication requirements specified for protected resources? [Coverage]"
- "Are data protection requirements defined? [Completeness]"
- "Is threat model documented and aligned? [Traceability]"

## Key Rules

**File Naming**: Short, descriptive domain names (ux, api, security, performance).

**Never Overwrite**: Each run creates new file unless file already exists.

**Traceability**: Minimum 80% items must include `[Spec §X.Y]` or `[Gap]`/`[Ambiguity]`/etc.

**Quality Focus**: Test requirements quality, never implementation behavior.

## Reference

Full command specification: `.claude/commands/speckit.checklist.md`

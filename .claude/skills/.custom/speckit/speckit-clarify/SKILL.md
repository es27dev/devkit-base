---
name: speckit-clarify
description: This skill should be used when agents need to identify and resolve specification ambiguities through structured questioning before planning phase.
---

# SpecKit Clarify

Systematically identify and resolve specification ambiguities through targeted clarification questions.

## Purpose

Reduce specification ambiguity and missing decision points through structured analysis and interactive questioning, encoding answers directly into the spec before planning begins.

## When to Use

Use this skill when:
- Detecting underspecified areas in feature specs
- Resolving ambiguities before planning phase
- Improving specification completeness
- Reducing downstream rework risk

**IMPORTANT**: Run BEFORE `/speckit.plan`. If user skips clarification, warn about increased rework risk.

## Core Workflow

### 1. Setup & Load Spec

Run prerequisite check:

```bash
.specify/scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly
```

Parse minimal JSON:
- `FEATURE_DIR`
- `FEATURE_SPEC`
- `IMPL_PLAN` (optional)
- `TASKS` (optional)

Load current spec file.

### 2. Ambiguity Scan

Perform structured coverage scan using taxonomy:

**Functional Scope & Behavior**:
- Core goals & success criteria
- Out-of-scope declarations
- User roles/personas

**Domain & Data Model**:
- Entities, attributes, relationships
- Identity & uniqueness rules
- State transitions
- Data volume assumptions

**Interaction & UX Flow**:
- Critical user journeys
- Error/empty/loading states
- Accessibility/localization

**Non-Functional Quality**:
- Performance (latency, throughput)
- Scalability (limits)
- Reliability (uptime, recovery)
- Observability (logging, metrics)
- Security (authN/Z, data protection)
- Compliance

**Integration & Dependencies**:
- External services/APIs
- Data import/export formats
- Failure modes

**Edge Cases & Failure Handling**:
- Negative scenarios
- Rate limiting
- Conflict resolution

**Constraints & Tradeoffs**:
- Technical constraints
- Explicit tradeoffs

**Terminology & Consistency**:
- Canonical terms
- Avoided synonyms

Mark each category: Clear / Partial / Missing

### 3. Generate Clarification Questions

Create prioritized queue (max 5 questions):

**Constraints**:
- Maximum 10 total across session
- Each answerable with:
  - Multiple choice (2-5 options), OR
  - Short answer (≤5 words)
- Only include high-impact questions affecting:
  - Architecture, data modeling, task decomposition
  - Test design, UX behavior, operational readiness
  - Compliance validation

**Prioritization**: (Impact × Uncertainty) heuristic

Top 5 categories by unresolved high-impact areas.

### 4. Sequential Questioning

**Present ONE question at a time**.

**For multiple-choice**:
1. **Analyze all options** and determine most suitable based on:
   - Best practices
   - Common patterns
   - Risk reduction
   - Project goal alignment
2. **Present recommendation prominently**:
   ```
   **Recommended:** Option [X] - <reasoning>
   ```
3. **Render options table**:

   | Option | Description |
   |--------|-------------|
   | A | <description> |
   | B | <description> |
   | Short | Provide different answer (≤5 words) |

4. User replies with letter, "yes"/"recommended", or custom answer

**For short-answer**:
1. **Provide suggested answer** based on best practices
2. Format: `**Suggested:** <answer> - <reasoning>`
3. User accepts with "yes"/"suggested" or provides own

**After each answer**:
- Validate answer
- Record in working memory
- Move to next question

**Stop when**:
- Critical ambiguities resolved, OR
- User signals "done"/"no more", OR
- 5 questions asked

### 5. Integration After Each Answer

Maintain in-memory spec representation.

**First answer**:
- Ensure `## Clarifications` section exists
- Create `### Session YYYY-MM-DD` subheading

**For each answer**:
- Append: `- Q: <question> → A: <answer>`
- Apply to appropriate section:
  - Functional → Update Functional Requirements
  - User interaction → Update User Stories/Actors
  - Data → Update Data Model
  - Non-functional → Update Quality Attributes
  - Edge case → Add to Edge Cases/Error Handling
  - Terminology → Normalize across spec
- Replace contradictory statements
- Save spec file after each integration

### 6. Validation

After each write + final pass:
- One bullet per accepted answer
- Total questions ≤ 5
- No lingering vague placeholders
- No contradictory statements remain
- Valid Markdown structure
- Terminology consistency

### 7. Report Completion

Output:
- Questions asked & answered count
- Path to updated spec
- Sections touched
- Coverage summary table:
  - Resolved (was Partial/Missing, now addressed)
  - Deferred (exceeds quota or better for planning)
  - Clear (already sufficient)
  - Outstanding (still Partial/Missing, low impact)
- Recommendation: proceed to `/speckit.plan` or run `/speckit.clarify` again
- Suggested next command

## Key Rules

**Question Limit**: Never exceed 5 asked questions (retries don't count as new questions).

**Early Termination**: If no meaningful ambiguities found, respond: "No critical ambiguities detected" and suggest proceeding.

**Spec Missing**: Instruct user to run `/speckit.specify` first.

**User Signals**: Respect "stop"/"done"/"proceed" immediately.

**No Speculative Tech**: Avoid tech stack questions unless absence blocks functional clarity.

## Reference

Full command specification: `.claude/commands/speckit.clarify.md`

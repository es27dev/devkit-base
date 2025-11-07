# Knowledge Dependencies

**Version:** 1.0.0
**Last Updated:** 2025-11-07

## Purpose

This file tracks which agents reference which sections of `.knowledge/knowledge.md` to:
1. Prevent duplication across agent files
2. Maintain single source of truth
3. Make updates easier (change once, affects all agents)
4. Prevent hallucinations from outdated references

## Authority Hierarchy

1. **Constitution** (`.specify/memory/constitution.md`) - Final authority on principles
2. **Knowledge** (`.knowledge/knowledge.md`) - Detailed implementation patterns
3. **Agent Files** (`.claude/agents/*.md`) - Role-specific instructions only
4. **Templates** (`.knowledge/templates/`) - Structural scaffolding

**CRITICAL**: When Constitution and Knowledge conflict, Constitution wins. Update Knowledge to align.

---

## Cross-Agent Knowledge Matrix

### Component Structure (7 Regions)
**Source:** `.knowledge/knowledge.md` lines 86-295
**Used by:**
- **Planner** - Understanding structure when planning
- **Coder** - MUST follow when implementing
- **Reviewer** - MUST validate compliance

**Agent reference pattern:**
```markdown
See .knowledge/knowledge.md (lines 86-295) for 7-region structure.
```

---

### Naming Conventions
**Source:** `.knowledge/knowledge.md` lines 296-395
**Used by:**
- **Planner** - File/interface naming in plans
- **Coder** - MUST follow when implementing
- **Reviewer** - MUST validate compliance
- **Database-Architect** - TypeScript type naming (minimal)

**Agent reference pattern:**
```markdown
See .knowledge/knowledge.md (lines 296-395) for naming conventions.
Quick reference: Props, Params, Item suffixes
```

---

### State Management Decision Tree
**Source:** `.knowledge/knowledge.md` lines 396-446
**Templates:** `.knowledge/templates/state-management/`
**Used by:**
- **Planner** - MUST justify choice in plans (future-oriented: choose one level higher if growth expected)
- **Coder** - Implements chosen pattern
- **Reviewer** - Validates correct pattern usage

**Agent reference pattern:**
```markdown
See .knowledge/knowledge.md (lines 396-446) for state management patterns.
Templates: .knowledge/templates/state-management/
```

**Planner Special Guidance:**
- Think future-oriented: If component likely grows, choose one level higher
- Example: 2 components now + expected 3rd → Use Context (not useState)

---

### Performance Thresholds
**Source:** `.knowledge/knowledge.md` lines 447-503
**Constitution:** `.specify/memory/constitution.md` section 5 (Core Web Vitals)
**Used by:**
- **Reviewer** - Validates optimization usage

**Agent reference pattern:**
```markdown
See .knowledge/knowledge.md (lines 447-503) for performance thresholds.
Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
```

---

### Template Paths
**Source:** `.knowledge/templates/README.md`
**Used by:**
- **Planner** - References in plans
- **Coder** - Copies templates when needed

**Agent reference pattern:**
```markdown
Templates: .knowledge/templates/
- Components: .knowledge/templates/components/
- Features: .knowledge/templates/features/feature-template/
- State: .knowledge/templates/state-management/
```

---

### Tech Stack & Architecture
**Source:** `.knowledge/knowledge.md` lines 5-7 (Tech Stack), 84-85 (Architecture)
**Used by:**
- **Planner** - Understanding project setup

**Agent reference pattern:**
```markdown
See .knowledge/knowledge.md for:
- Tech Stack (lines 5-7)
- Architecture (lines 84-85)
```

---

## Agent-Specific Knowledge (Stays in Agent Files)

### Planner
**Keeps:**
- MCP workflow (Speckit B1/D1/F1 steps)
- Planning output format
- Context preparation for Coder
- Normal Mode output template

**References knowledge.md for:**
- State Management Decision Tree
- Template Paths
- Tech Stack
- Architecture Overview

---

### Coder
**Keeps:**
- Implementation workflow
- "What NOT to do" section
- Self-check process
- Speckit G1 step

**References knowledge.md for:**
- Component Structure (7 Regions) - FULL
- Naming Conventions - FULL
- State Management Patterns
- Context API Pattern

---

### Database-Architect
**Keeps (ALL agent-specific):**
- Supabase conventions (RLS patterns, schema design)
- Migration patterns
- UI integration patterns (Data Loading region changes)
- Security checklist
- Table naming conventions
- Query optimization

**References knowledge.md for:**
- Component Structure - Data Loading region only
- Naming Conventions - minimal (TypeScript types)

---

### Reviewer
**Keeps:**
- Three-tier review system (APPROVE/APPROVE with fixes/REQUEST CHANGES)
- Token optimization strategy (what to fix vs send back to Coder)
- Review priority order
- Speckit review step

**References knowledge.md for:**
- Component Structure - for validation
- Naming Conventions - for validation
- Performance Thresholds
- Import Organization

---

## Update Propagation Rules

### When updating `.knowledge/knowledge.md`:
1. ✅ Update line number references in this file
2. ✅ Check if any agent files have inline copies (should NOT exist after cleanup)
3. ✅ Update constitution.md if principle-level change
4. ✅ Update version number in this file

### When updating `.specify/memory/constitution.md`:
1. ✅ Check if knowledge.md needs alignment
2. ✅ Update version number (semantic versioning)
3. ✅ Document in SYNC IMPACT REPORT (if major)
4. ✅ Constitution always wins in conflicts

### When updating `.knowledge/templates/`:
1. ✅ Update template README.md
2. ✅ Check if knowledge.md references need updating
3. ✅ Verify agent references still work
4. ✅ Test template usage with Coder agent

### When renaming/moving knowledge files:
1. ✅ Update this file's references
2. ✅ Update all agent files referencing it
3. ✅ Run grep to find any missed references
4. ✅ Test all agents after changes

---

## Redundancy Prevention Checklist

Before adding content to agent files, ask:

- [ ] Does this exist in `.knowledge/knowledge.md`?
- [ ] Does this exist in `.specify/memory/constitution.md`?
- [ ] Is this agent-specific knowledge or cross-cutting?
- [ ] If cross-cutting, add to knowledge.md and reference from agents
- [ ] If agent-specific, document in "Agent-Specific Knowledge" section above

---

## Quick Reference for Agents

### Planner needs:
- State Management Decision Tree → knowledge.md lines 396-446
- Template Paths → .knowledge/templates/README.md
- Tech Stack → knowledge.md lines 5-7
- Architecture Overview → knowledge.md lines 84-85

### Coder needs:
- Component Structure (7 Regions) → knowledge.md lines 86-295
- Naming Conventions → knowledge.md lines 296-395
- State Management Patterns → knowledge.md lines 396-446
- Context API Pattern → knowledge.md lines 387-395

### Reviewer needs:
- Component Structure (validation) → knowledge.md lines 86-295
- Naming Conventions (validation) → knowledge.md lines 296-395
- Performance Thresholds → knowledge.md lines 447-503
- Import Organization → knowledge.md lines 158-194

### Database-Architect needs:
- Component Structure (Data Loading only) → knowledge.md lines 223-224
- Naming Conventions (minimal) → knowledge.md lines 296-395

---

**Version:** 1.0.0
**Last Updated:** 2025-11-07
**Maintained by:** Project Owner (update after any knowledge.md changes)

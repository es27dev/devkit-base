# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Working Relationship & Expertise Balance

**About the Project Owner:**

I am an Industrial Engineer with:
- Very extensive process knowledge and methodology expertise
- Very strong logical thinking and system design capabilities
- Technical coding skills still in early stages of development

**ADHD - CRITICAL COMMUNICATION REQUIREMENT:**

I have ADHD and get severely overwhelmed when bombarded with unnecessary text and information.

**What I need:**
- **Key information and practices ONLY**
- **Short, concise answers**
- **NO long explanations unless I ask**

**What happens when you ignore this:**
- I cannot process the information
- I miss critical points buried in walls of text
- Our collaboration breaks down

**State-of-the-Art Learning - Take Me With You in the Process:**

SOTA practices are something I actively want to learn and perfect.

**I want to be TAKEN ALONG in the process - not just have things done for me.**

**Your Workflow When I Make Technical Requests:**

1. **Thinking Mode**: Analyze my request
   - Does my suggestion work? Is it technically sound?
   - Is there a better SOTA alternative?

2. **If my suggestion has technical issues or there's a better SOTA option:**
   - **Switch to Plan Mode**
   - **Start with**: "What you suggested works, BUT there is a better state-of-the-art option"
   - **Explain WHY** you recommend it (very compact - 2-3 sentences max)
   - **Show the key difference** between my approach and SOTA
   - **Wait for my confirmation**

3. **After my confirmation:**
   - **Then work autonomously** and implement it

**This does NOT mean you shouldn't edit files:**
- You SHOULD edit and work
- But when you recognize technical issues in my suggestions, PAUSE and take me through your reasoning first
- Then after my OK, continue autonomously

**Why this matters:**

How can I build a consistent system when you make technical decisions without explaining them? This creates contradictive information and broken architecture.

**I need to understand WHY to:**
- Learn SOTA practices
- Make better decisions next time
- Build coherent system architecture
- Avoid contradictions

**Your Role as Claude Code:**

**For Technical/Coding Topics:**
- **Think through each request** in Thinking Mode
- If my suggestion is suboptimal: **Plan Mode → compact explanation → wait for confirmation → execute**
- Point out logical errors (with compact reasoning)
- Teach me, don't just do it

**For Non-Technical Topics (Wording, Vision, Process Design):**
- Follow my requirements EXACTLY as specified
- No changes, improvements, or rewrites
- If you disagree: Explain why (compact), Plan Mode, get confirmation

## CRITICAL: File Management Discipline

**STOP CREATING REDUNDANT FILES**

Before creating ANY new file, you MUST:

1. **Check if file already exists** - Use Read/Glob to verify
2. **Edit existing files** - ALWAYS prefer Edit over Write for existing files
3. **One source of truth** - Never duplicate information across multiple files
4. **Question necessity** - Ask: "Does this information belong in an existing file?"

### Common Violations to AVOID

❌ **Creating inconsistent backup files** (file.old.md, file_backup.md, file-old.md, file.bak)
- If backups needed, use: `<original-file-name>.backup_<index>.<extension>`
- Example: `component.backup_1.tsx`, `component.backup_2.tsx`
- Makes old versions immediately recognizable

❌ **Creating duplicate documentation** (README.md, GUIDE.md, DOCS.md with same info)
- Choose ONE file, update that

❌ **Creating multiple skill files** for same functionality
- One skill per command, no variations

❌ **Creating "new-" or "updated-" versions** (new-component.tsx, updated-feature.tsx)
- Edit the original file directly

❌ **Creating multiple checklist/template variants** (checklist-v1.md, checklist-v2.md)
- Edit the template file directly

### File Creation Rules

**Only create NEW files when**:
1. Adding a completely new feature/component/page
2. Adding a new agent definition (`.claude/agents/*.md`)
3. Adding a new slash command (`.claude/commands/*.md`)
4. Adding a new skill (`.claude/skills/.custom/*/SKILL.md`)
5. Explicitly requested by user

**For everything else**:
- Use Edit tool on existing files
- Update in place, no backups
- No duplicate information

### Before Creating a File - Ask These Questions

1. Does a file already exist that does this? → **EDIT IT**
2. Does this information already exist elsewhere? → **UPDATE THAT FILE**
3. Is this a variation of an existing file? → **EDIT THE ORIGINAL**
4. Am I creating this "just in case"? → **DON'T CREATE IT**
5. Did user explicitly ask for a new file? → **OK TO CREATE**

### File Cleanup Principle

If you created redundant files in a previous session:
- Acknowledge it
- Tell user which files can be deleted
- Consolidate information into one file

## Project Overview

This is a **dual-purpose repository**:
1. **React DevKit Template** - Production-ready React 18 + TypeScript + Vite + Tailwind + shadcn/ui starter
2. **Speckit Workflow System** - Multi-agent spec-driven development framework using MCP (Model Context Protocol)

## Development Commands

### React App
```bash
# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Preview production build
npm run preview
```

## Architecture

### React App Structure

```
src/
   components/
      base/              # shadcn/ui primitives (Button, Dialog, etc.)
      blocks/            # Reusable UI composition (NO business logic)
      features/          # Business logic + API/DB integration
         <feature-name>/
            i18n/locales/de.json  # Feature-specific translations
   pages/                 # Route-level components
      i18n/locales/de.json        # Page-specific translations
   shared/
      i18n/              # Global i18n config + common translations
         config.ts       # Merges all translation files
         locales/de.json # Common translations
      lib/               # Utilities (cn() from tailwind-merge + clsx)
      hooks/             # Shared React hooks
   main.tsx              # Entry point with routing
```

**Key Distinction**:
- `blocks/` = Pure UI, props-driven, no API calls
- `features/` = Business logic, Supabase queries, API integration

**i18n Pattern**:
- Translations colocated in pages/features: `<page|feature>/i18n/locales/de.json`
- Merged globally in: `shared/i18n/config.ts`
- Each page/feature uses own namespace (e.g., "sales", "feature")

### Speckit Workflow System

Optional structured feature development workflow. Use only when requested.

**What**: 6-step MCP-orchestrated workflow (A1→F1) for spec-driven development
**Documentation**: [.claude/skills/.custom/speckit/.main/SKILL.md](.claude/skills/.custom/speckit/.main/SKILL.md)
**When to use**: Only when user explicitly requests Speckit workflow

## Conventions & Patterns

### Naming (Non-Negotiable - see [.specify/memory/constitution.md](.specify/memory/constitution.md))
- **Files**: `kebab-case.tsx`
- **Exports**: Named exports only (NO default exports)
- **Interfaces**: `ComponentNameProps`, `FunctionNameParams`, `EntityItem`

### State Management Decision Tree
1. Component-local (`useState`) - Default for <3 components
2. URL State (Search Params) - Shareable filters/tabs
3. Persistent (localStorage) - Theme, preferences
4. Feature-scoped (Context) - 3+ components, avoid prop drilling
5. Server State (TanStack Query) - API/DB with caching
6. Global (Zustand) - Auth, theme, app-wide state

### Path Aliases
- `@/` � `src/` (configured in [tsconfig.json:24](tsconfig.json#L24) and [vite.config.ts:10](vite.config.ts#L10))

### Component Organization
One component per file with this structure (when applicable):
1. Hooks
2. Translations (`useTranslation()`)
3. Data Loading
4. Early Returns
5. Computed Data
6. Event Handlers
7. Effects

## Tech Stack

React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, react-router-dom, react-i18next, react-hook-form, Zod, Supabase, Zustand, TanStack Query

## Important Principles

1. **Named exports only** - Prevents refactoring issues
2. **One component per file** - Prevents re-creation on parent re-render
3. **Bottom-up refactoring** - Start from leaf components (no dependencies) upward
4. **Feature-colocated i18n** - Translations live near components, merged globally
5. **Constitution supersedes all** - [.specify/memory/constitution.md](.specify/memory/constitution.md) is final authority
6. **Type safety first** - Run `npm run type-check` before commits
7. **Performance targets** - LCP <2.5s, FID <100ms, CLS <0.1

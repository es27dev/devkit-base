-- Local SQLite Schema for SpecKit Workflow
-- Purpose: Design and test database structure locally before pushing to Supabase

-- Table 1: Projects (SpecKit Projects with Constitution)
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT CHECK(length(description) <= 300),
  slug TEXT UNIQUE NOT NULL,
  status TEXT CHECK(status IN ('devkit', 'plan', 'develop', 'test', 'production', 'archived')) DEFAULT 'plan',
  constitution_file_link TEXT,  -- Local: File path | Supabase: Will be JSONB with metadata
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Insert DevKit Project
INSERT INTO projects (id, name, description, slug, status, constitution_file_link) VALUES (
  'devkit-001',
  'DevKit Base',
  'Entwicklungsumgebung für SpecKit-basierte React-Anwendungen. Etabliert Multi-Agent Workflow (Planner, Coder, Reviewer, Database-Architect), Constitution-Framework und Feature-Sliced Design Architektur mit Supabase Integration.',
  'devkit-base',
  'devkit',
  '.specify/memory/constitution.md'
);

-- Table 2: Project Functions (spec.md content)
CREATE TABLE project_functions (
  id TEXT PRIMARY KEY
);

-- Table 3: Project Functions Tasks (tasks.md content)
CREATE TABLE project_functions_tasks (
  id TEXT PRIMARY KEY
);

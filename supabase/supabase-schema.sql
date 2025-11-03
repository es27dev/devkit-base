-- Supabase PostgreSQL Schema (converted from local-schema.sql)
-- Purpose: Production schema to be executed in Supabase SQL Editor

-- Table 1: Projects (SpecKit Projects with Constitution)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT CHECK(length(description) <= 300),
  slug TEXT UNIQUE NOT NULL,
  status TEXT CHECK(status IN ('devkit', 'plan', 'develop', 'test', 'production', 'archived')) DEFAULT 'plan',
  constitution_metadata JSONB,  -- Constitution version, ratified date, last amended, file path
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert DevKit Project
INSERT INTO projects (id, name, description, slug, status, constitution_metadata) VALUES (
  gen_random_uuid(),
  'DevKit Base',
  'Entwicklungsumgebung für SpecKit-basierte React-Anwendungen. Etabliert Multi-Agent Workflow (Planner, Coder, Reviewer, Database-Architect), Constitution-Framework und Feature-Sliced Design Architektur mit Supabase Integration.',
  'devkit-base',
  'devkit',
  '{"version": "1.0.0", "ratified": "2025-11-03", "lastAmended": "2025-11-03", "filePath": ".specify/memory/constitution.md"}'::jsonb
);

-- Table 2: Project Functions (spec.md content)
CREATE TABLE project_functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Table 3: Project Functions Tasks (tasks.md content)
CREATE TABLE project_functions_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_iterations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_functions_tasks ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (public read access for now)
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON project_iterations FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON project_functions FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON project_functions_tasks FOR SELECT TO public USING (true);

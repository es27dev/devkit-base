-- Migration 003: Create project_functions table
-- Dependencies: 002_projects.sql (projects table must exist for foreign key)

-- Create ENUM types for function status tracking
CREATE TYPE devkit.speckit_status AS ENUM ('specify', 'clarify', 'plan', 'tasks', 'analyze', 'implement');
CREATE TYPE devkit.agent_status AS ENUM ('user', 'orchestrator', 'planner', 'coder', 'reviewer', 'database-architect');

CREATE TABLE devkit.project_functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES devkit.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT CHECK(length(description) <= 500),
  slug TEXT NOT NULL,
  status_speckit devkit.speckit_status DEFAULT 'specify',
  status_agent devkit.agent_status DEFAULT 'user',

  -- Metadata columns (JSONB arrays with index versioning)
  spec_metadata JSONB DEFAULT '[]'::jsonb,
  plan_metadata JSONB DEFAULT '[]'::jsonb,
  plan_artifacts_metadata JSONB DEFAULT '[]'::jsonb,
  tasks_metadata JSONB DEFAULT '[]'::jsonb,
  implementation_metadata JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Unique constraint per project
  UNIQUE(project_id, slug)
);

-- Enable Row Level Security
ALTER TABLE devkit.project_functions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users"
ON devkit.project_functions FOR SELECT TO public USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON devkit.project_functions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON devkit.project_functions FOR UPDATE TO authenticated USING (true);

-- Indexes
CREATE INDEX idx_project_functions_project_id ON devkit.project_functions(project_id);
CREATE INDEX idx_project_functions_slug ON devkit.project_functions(slug);
CREATE INDEX idx_project_functions_status_speckit ON devkit.project_functions(status_speckit);
CREATE INDEX idx_project_functions_status_agent ON devkit.project_functions(status_agent);

-- JSONB indexes for metadata queries
CREATE INDEX idx_project_functions_spec_metadata ON devkit.project_functions USING gin(spec_metadata);
CREATE INDEX idx_project_functions_plan_metadata ON devkit.project_functions USING gin(plan_metadata);
CREATE INDEX idx_project_functions_tasks_metadata ON devkit.project_functions USING gin(tasks_metadata);
CREATE INDEX idx_project_functions_implementation_metadata ON devkit.project_functions USING gin(implementation_metadata);

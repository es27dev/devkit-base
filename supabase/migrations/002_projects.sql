-- Migration 002: Create projects table
-- Dependencies: 001_schema.sql (devkit schema must exist)

-- Create ENUM type for project status
CREATE TYPE devkit.project_status AS ENUM ('devkit', 'plan', 'develop', 'test', 'production', 'archived');

CREATE TABLE devkit.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT CHECK(length(description) <= 300),
  slug TEXT UNIQUE NOT NULL,
  status devkit.project_status DEFAULT 'plan',
  constitution_file_link TEXT,
  constitution_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE devkit.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users"
ON devkit.projects FOR SELECT TO public USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON devkit.projects FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON devkit.projects FOR UPDATE TO authenticated USING (true);

-- Indexes
CREATE INDEX idx_projects_slug ON devkit.projects(slug);
CREATE INDEX idx_projects_status ON devkit.projects(status);
CREATE INDEX idx_projects_constitution_version ON devkit.projects((constitution_metadata->'current'->>'version'));

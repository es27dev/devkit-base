-- Migration 004: Project Phases & Tasks Tables
-- Created: 2025-11-03
-- Purpose: Track implementation phases and individual tasks with review loop support

-- =====================================================
-- ENUMS
-- =====================================================

-- Task Status (includes review loop states)
CREATE TYPE devkit.task_status AS ENUM (
  'pending',
  'coding',
  'review',
  'changes_requested',
  'database_integration',
  'completed',
  'blocked',
  'skipped'
);

-- Phase Status
CREATE TYPE devkit.phase_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'blocked'
);

-- =====================================================
-- PROJECT FUNCTION PHASES TABLE
-- =====================================================

CREATE TABLE devkit.project_function_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  function_id UUID NOT NULL REFERENCES devkit.project_functions(id) ON DELETE CASCADE,

  -- Phase Identity
  phase_number INTEGER NOT NULL,              -- 1, 2, 3, 4
  phase_name TEXT NOT NULL,                   -- "Setup & Infrastructure", "User Story 1 - Lead Contact Submission"
  phase_goal TEXT,                            -- "Core MVP - User can submit contact form..."

  -- Classification
  is_mvp BOOLEAN DEFAULT false,               -- TRUE für Phase 1 + 2
  user_story TEXT,                            -- "US1", "US2", "US3", NULL (for setup/polish)
  priority TEXT,                              -- "P1", "P2", "P3", NULL

  -- Status
  status devkit.phase_status DEFAULT 'pending',

  -- Completion Criteria
  completion_criteria TEXT,                   -- "Directory structure exists, Sonner configured..."
  independent_test TEXT,                      -- "Navigate to /sales, fill all fields..."

  -- Progress Tracking
  total_tasks INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  UNIQUE(function_id, phase_number)
);

-- =====================================================
-- PROJECT FUNCTION PHASE TASKS TABLE
-- =====================================================

CREATE TABLE devkit.project_function_phase_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  function_id UUID NOT NULL REFERENCES devkit.project_functions(id) ON DELETE CASCADE,
  phase_id UUID NOT NULL REFERENCES devkit.project_function_phases(id) ON DELETE CASCADE,

  -- Task Identity
  task_id TEXT NOT NULL,                      -- "T001", "T002", etc.
  title TEXT NOT NULL,                        -- "Verify shadcn/ui components installed"
  description TEXT,                           -- Full task description with file path

  -- Classification
  phase_number INTEGER NOT NULL,              -- Denormalized for easy query + ordering
  user_story TEXT,                            -- "US1", "US2", "US3", NULL
  priority TEXT,                              -- "P1", "P2", "P3", NULL

  -- Task Attributes
  is_parallelizable BOOLEAN DEFAULT false,    -- Has [P] marker
  file_path TEXT,                             -- "src/main.tsx", "src/components/..."
  region_hint TEXT,                           -- "Region 2: Constants", "Region 7: JSX"
  operation_type TEXT,                        -- "create", "modify", "delete"

  -- Status & Assignment
  status devkit.task_status DEFAULT 'pending',
  assigned_agent devkit.agent_status,

  -- Review Loop Tracking
  review_iteration INTEGER DEFAULT 0,         -- Max 3 iterations (0 = not yet reviewed)
  review_history JSONB DEFAULT '[]'::jsonb,   -- Array of review attempts with feedback

  -- Dependencies
  depends_on TEXT[],                          -- Array of task_ids ["T001", "T002"]
  blocks TEXT[],                              -- Array of task_ids that this task blocks

  -- Execution Metadata
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_duration_minutes INTEGER,
  actual_duration_minutes INTEGER,            -- Auto-calculated from started_at/completed_at

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  UNIQUE(function_id, task_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Project Phases Indexes
CREATE INDEX idx_project_function_phases_function_id ON devkit.project_function_phases(function_id);
CREATE INDEX idx_project_function_phases_is_mvp ON devkit.project_function_phases(function_id, is_mvp) WHERE is_mvp = true;
CREATE INDEX idx_project_function_phases_status ON devkit.project_function_phases(function_id, status);

-- Project Tasks Indexes
CREATE INDEX idx_project_tasks_function_id ON devkit.project_function_phase_tasks(function_id);
CREATE INDEX idx_project_tasks_phase_id ON devkit.project_function_phase_tasks(phase_id);
CREATE INDEX idx_project_tasks_status ON devkit.project_function_phase_tasks(function_id, status);
CREATE INDEX idx_project_tasks_assigned_agent ON devkit.project_function_phase_tasks(assigned_agent) WHERE assigned_agent IS NOT NULL;
CREATE INDEX idx_project_tasks_parallelizable ON devkit.project_function_phase_tasks(phase_id, is_parallelizable) WHERE is_parallelizable = true;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE devkit.project_function_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE devkit.project_function_phase_tasks ENABLE ROW LEVEL SECURITY;

-- Project Phases: Public read, authenticated write
CREATE POLICY "project_function_phases_select_all" ON devkit.project_function_phases
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "project_function_phases_insert_authenticated" ON devkit.project_function_phases
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "project_function_phases_update_authenticated" ON devkit.project_function_phases
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "project_function_phases_delete_authenticated" ON devkit.project_function_phases
  FOR DELETE
  TO authenticated
  USING (true);

-- Project Tasks: Public read, authenticated write
CREATE POLICY "project_tasks_select_all" ON devkit.project_function_phase_tasks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "project_tasks_insert_authenticated" ON devkit.project_function_phase_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "project_tasks_update_authenticated" ON devkit.project_function_phase_tasks
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "project_tasks_delete_authenticated" ON devkit.project_function_phase_tasks
  FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp for project_function_phases
CREATE TRIGGER update_project_function_phases_updated_at
  BEFORE UPDATE ON devkit.project_function_phases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp for project_function_phase_tasks
CREATE TRIGGER update_project_tasks_updated_at
  BEFORE UPDATE ON devkit.project_function_phase_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate actual_duration_minutes when task is completed
CREATE OR REPLACE FUNCTION devkit.calculate_task_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND NEW.completed_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
    NEW.actual_duration_minutes := EXTRACT(EPOCH FROM (NEW.completed_at - NEW.started_at)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_task_duration_trigger
  BEFORE UPDATE ON devkit.project_function_phase_tasks
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION devkit.calculate_task_duration();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE devkit.project_function_phases IS 'Implementation phases for each feature (e.g., Setup, User Story 1, User Story 2)';
COMMENT ON TABLE devkit.project_function_phase_tasks IS 'Individual implementation tasks within each phase, with review loop tracking';

COMMENT ON COLUMN devkit.project_function_phases.is_mvp IS 'TRUE for MVP phases (typically Phase 1 + Phase 2 for setup + core user story)';
COMMENT ON COLUMN devkit.project_function_phase_tasks.review_iteration IS 'Tracks Coder ↔ Reviewer loop count (max 3 before orchestrator intervention)';
COMMENT ON COLUMN devkit.project_function_phase_tasks.review_history IS 'JSONB array of review attempts: [{"iteration": 1, "result": "changes_requested", "feedback": "...", "timestamp": "..."}]';
COMMENT ON COLUMN devkit.project_function_phase_tasks.depends_on IS 'Array of task_ids that must complete before this task can start';
COMMENT ON COLUMN devkit.project_function_phase_tasks.blocks IS 'Array of task_ids that cannot start until this task completes';

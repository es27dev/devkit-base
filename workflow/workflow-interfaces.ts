/**
 * TypeScript Interfaces for SpecKit Multi-Agent Workflow
 * Generated from workflow.md database operations
 *
 * These interfaces define the structure of all data stored in the devkit schema
 * and tracked throughout the SpecKit workflow phases.
 */

// =====================================================
// ENUM TYPES (matching Supabase schema)
// =====================================================

export type SpecKitStatus =
  | "specify"
  | "clarify"
  | "plan"
  | "tasks"
  | "analyze"
  | "implement";

export type AgentStatus =
  | "user"
  | "orchestrator"
  | "planner"
  | "coder"
  | "reviewer"
  | "database-architect";

export type TaskStatus =
  | "pending"
  | "coding"
  | "review"
  | "changes_requested"
  | "database_integration"
  | "completed"
  | "blocked"
  | "skipped";

export type PhaseStatus = "pending" | "in_progress" | "completed" | "blocked";

export type ReviewerResult =
  | "APPROVED"
  | "APPROVED_WITH_FIXES"
  | "CHANGES_REQUESTED";

// =====================================================
// METADATA INTERFACES
// =====================================================

/**
 * Phase 2: Specify Phase
 * Tracks spec.md file versions
 */
export interface SpecMetadata {
  file_url: string;
  index: number;
  phase: "specify" | "clarify";
  timestamp?: string;
}

/**
 * Phase 4: Plan Phase & Phase 4.5: Plan Review
 * Tracks plan.md versions and user approval
 */
export interface PlanMetadata {
  file_url: string | null;
  index: number;
  phase: "plan" | "plan_review";
  user_approved?: boolean;
  review_iterations?: number;
  timestamp?: string;
}

/**
 * Phase 4: Plan Artifacts
 * Tracks generated design documents
 */
export interface PlanArtifactMetadata {
  file_url: string;
  index: number;
  artifact_type: "research" | "data-model" | "contracts" | "quickstart";
  timestamp?: string;
}

/**
 * Phase 5: Tasks Phase
 * Tracks tasks.md file and task statistics
 */
export interface TasksMetadata {
  file_url: string;
  index: number;
  phase: "tasks";
  task_count: number;
  parallel_tasks: number;
  mvp_tasks?: number;
  post_mvp_tasks?: number;
  timestamp?: string;
}

/**
 * Phase 6-8: Implementation Phase
 * Tracks implementation progress with performance metrics
 */
export interface ImplementationIteration {
  iteration: number;
  started_at: string;
  completed_at: string;
  coder_started_at: string;
  coder_completed_at: string;
  reviewer_started_at: string;
  reviewer_completed_at: string;
  reviewer_result: ReviewerResult;
  issues_found?: string[];
  duration_minutes?: number;
}

export interface ImplementationPhase {
  phase_name: string;
  phase_number: number;
  started_at: string;
  completed_at: string;
  duration_minutes: number;
  iterations: ImplementationIteration[];
  total_iterations: number;
}

export interface PlanningPhase {
  started_at: string;
  completed_at: string;
  duration_minutes: number;
}

export interface DatabasePhase {
  started_at: string;
  completed_at: string;
  duration_minutes: number;
  migration_files?: string[];
  schema?: string;
}

export interface ImplementationMetadata {
  index: number;
  phase: "implement" | "analyze" | "db_integration" | "completed";

  // Core tracking
  feature_id?: string;
  planning_approach?: string;
  started_at?: string;
  completed_at?: string;
  total_duration_minutes?: number;

  // Phase breakdown
  planning_phase?: PlanningPhase;
  implementation_phases?: ImplementationPhase[];
  database_phase?: DatabasePhase;

  // Legacy fields (for backward compatibility)
  completed_tasks?: number;
  total_tasks?: number;
  review_result?: ReviewerResult;
  db_integrated?: boolean;
  completed?: boolean;
}

/**
 * Review Loop Tracking (stored in project_function_phase_tasks.review_history)
 */
export interface ReviewHistoryEntry {
  iteration: number;
  result: ReviewerResult;
  feedback: string;
  timestamp: string;
  reviewer_agent?: string;
}

// =====================================================
// MAIN TABLE INTERFACES
// =====================================================

/**
 * devkit.projects table
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  status: "devkit" | "plan" | "develop" | "test" | "production" | "archived";
  constitution_file_link: string | null;
  constitution_metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/**
 * devkit.project_functions table
 * Main entity tracking a feature through the SpecKit workflow
 */
export interface ProjectFunction {
  id: string;
  project_id: string;
  name: string;
  description: string;
  slug: string;
  status_speckit: SpecKitStatus;
  status_agent: AgentStatus;

  // Metadata arrays (JSONB with index versioning)
  spec_metadata: SpecMetadata[];
  plan_metadata: PlanMetadata[];
  plan_artifacts_metadata: PlanArtifactMetadata[];
  tasks_metadata: TasksMetadata[];
  implementation_metadata: ImplementationMetadata[];

  created_at: string;
  updated_at: string;
}

/**
 * devkit.project_function_phases table
 * Implementation phases for each feature
 */
export interface ProjectFunctionPhase {
  id: string;
  function_id: string;

  // Phase Identity
  phase_number: number;
  phase_name: string;
  phase_goal: string | null;

  // Classification
  is_mvp: boolean;
  user_story: string | null;
  priority: string | null;

  // Status
  status: PhaseStatus;

  // Completion Criteria
  completion_criteria: string | null;
  independent_test: string | null;

  // Progress Tracking
  total_tasks: number;
  completed_tasks: number;

  // Timestamps
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * devkit.project_function_phase_tasks table
 * Individual implementation tasks within each phase
 */
export interface ProjectFunctionPhaseTask {
  id: string;
  function_id: string;
  phase_id: string;

  // Task Identity
  task_id: string;
  title: string;
  description: string | null;

  // Classification
  phase_number: number;
  user_story: string | null;
  priority: string | null;

  // Task Attributes
  is_parallelizable: boolean;
  file_path: string | null;
  region_hint: string | null;
  operation_type: "create" | "modify" | "delete" | null;

  // Status & Assignment
  status: TaskStatus;
  assigned_agent: AgentStatus | null;

  // Review Loop Tracking
  review_iteration: number;
  review_history: ReviewHistoryEntry[];

  // Dependencies
  depends_on: string[];
  blocks: string[];

  // Execution Metadata
  started_at: string | null;
  completed_at: string | null;
  estimated_duration_minutes: number | null;
  actual_duration_minutes: number | null;

  // Audit
  created_at: string;
  updated_at: string;
}

// =====================================================
// WORKFLOW OPERATION TYPES
// =====================================================

/**
 * Type-safe operations for workflow.md #create@project_functions
 */
export interface CreateProjectFunctionInput {
  project_id: string;
  name: string;
  description: string;
  slug: string;
  status_speckit: SpecKitStatus | null;
  status_agent: AgentStatus;
  spec_metadata?: SpecMetadata[] | null;
  plan_metadata?: PlanMetadata[] | null;
  plan_artifacts_metadata?: PlanArtifactMetadata[] | null;
  tasks_metadata?: TasksMetadata[] | null;
  implementation_metadata?: ImplementationMetadata[] | null;
}

/**
 * Type-safe operations for workflow.md #update@project_functions
 */
export interface UpdateProjectFunctionInput {
  id: string;
  status_speckit?: SpecKitStatus;
  status_agent?: AgentStatus;
  spec_metadata?: SpecMetadata[];
  plan_metadata?: PlanMetadata[];
  plan_artifacts_metadata?: PlanArtifactMetadata[];
  tasks_metadata?: TasksMetadata[];
  implementation_metadata?: ImplementationMetadata[];
}

/**
 * Type-safe operations for workflow.md #create@project_functions_tasks
 */
export interface CreateProjectFunctionPhaseTaskInput {
  function_id: string;
  phase_id: string;
  task_id: string;
  title: string;
  description: string | null;
  phase_number: number;
  user_story: string | null;
  priority: string | null;
  is_parallelizable: boolean;
  file_path: string | null;
  region_hint: string | null;
  operation_type: "create" | "modify" | "delete" | null;
  status: TaskStatus;
  depends_on: string[];
  blocks: string[];
}

// =====================================================
// HELPER TYPES
// =====================================================

/**
 * Performance metrics aggregation for analysis
 */
export interface PerformanceMetrics {
  feature_id: string;
  planning_approach: string;
  total_duration_minutes: number;
  planning_duration_minutes: number;
  implementation_duration_minutes: number;
  database_duration_minutes: number;
  total_iterations: number;
  average_iterations_per_phase: number;
  mvp_duration_minutes: number;
  post_mvp_duration_minutes: number;
}

/**
 * Workflow state snapshot for debugging
 */
export interface WorkflowSnapshot {
  function: ProjectFunction;
  phases: ProjectFunctionPhase[];
  tasks: ProjectFunctionPhaseTask[];
  current_phase: string;
  current_agent: AgentStatus;
  completion_percentage: number;
}

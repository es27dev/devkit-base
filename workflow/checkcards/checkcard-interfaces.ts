/**
 * TypeScript Interfaces for Workflow Checkcards
 *
 * Checkcards sind strukturierte Logs für jeden Workflow-Schritt.
 * Jeder Agent/Orchestrator füllt die Checkcard nach Abschluss seines Schritts aus.
 */

// =====================================================
// BASE CHECKCARD INTERFACE
// =====================================================

export type CheckcardStatus = "pending" | "in_progress" | "completed" | "failed";

export interface BaseCheckcard {
  step_id: string; // e.g., "1.1", "1.2", "2.1"
  step_name: string; // e.g., "User Request", "Orchestrator Initial Dialog"
  agent: "user" | "orchestrator" | "planner" | "coder" | "reviewer" | "database-architect";
  description: string;
  behavior_mode?: "Socratic Dialog Mode" | "Execution Mode" | "Review Mode" | "Research Mode";

  status: CheckcardStatus;
  started_at: string | null; // ISO 8601 timestamp
  completed_at: string | null; // ISO 8601 timestamp
  duration_minutes: number | null;

  error?: string; // If status === "failed"
}

// =====================================================
// LOOP STRUCTURES
// =====================================================

export interface UserApprovalLoopIteration {
  iteration: number;
  orchestrator_question: string;
  user_response: string;
  refined_description: string;
}

export interface UserApprovalLoop {
  type: "user_approval_loop";
  max_iterations: number | null; // null = unbegrenzt
  iterations: number; // Actual count
  loop_data_per_iteration: UserApprovalLoopIteration[];
  exit_condition: "user approval" | "max iterations reached";
}

export interface PlanReviewLoopIteration {
  iteration: number;
  user_feedback: string;
  logic_errors_found: string[];
  planner_corrections: string;
  plan_file_updated: string; // file path
}

export interface PlanReviewLoop {
  type: "plan_review_loop";
  max_iterations: 3;
  iterations: number;
  loop_data_per_iteration: PlanReviewLoopIteration[];
  exit_condition: "user approval" | "max iterations reached";
}

export interface CoderReviewerLoopIteration {
  iteration: number;
  coder_started_at: string;
  coder_completed_at: string;
  reviewer_started_at: string;
  reviewer_completed_at: string;
  reviewer_result: "APPROVED" | "APPROVED_WITH_FIXES" | "CHANGES_REQUESTED";
  issues_found: string[];
  coder_fixes_applied: string[];
}

export interface CoderReviewerLoop {
  type: "coder_reviewer_loop";
  max_iterations: 3;
  iterations: number;
  loop_data_per_iteration: CoderReviewerLoopIteration[];
  exit_condition: "approved" | "max iterations reached" | "orchestrator intervention";
}

export type LoopData = UserApprovalLoop | PlanReviewLoop | CoderReviewerLoop;

// =====================================================
// DATABASE OPERATIONS
// =====================================================

export interface CreateProjectFunctionOperation {
  operation: "create_project_function";
  project_id: string;
  name: string;
  description: string;
  slug: string;
  status_speckit: string | null;
  status_agent: string;
  spec_metadata: unknown[] | null;
  plan_metadata: unknown[] | null;
  plan_artifacts_metadata: unknown[] | null;
  tasks_metadata: unknown[] | null;
  implementation_metadata: unknown[] | null;
}

export interface UpdateProjectFunctionOperation {
  operation: "update_project_function";
  id: string;
  status_speckit?: string;
  status_agent?: string;
  spec_metadata?: unknown[];
  plan_metadata?: unknown[];
  plan_artifacts_metadata?: unknown[];
  tasks_metadata?: unknown[];
  implementation_metadata?: unknown[];
}

export interface CreateProjectFunctionPhaseTaskOperation {
  operation: "create_project_function_phase_task";
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
  status: string;
  depends_on: string[];
  blocks: string[];
}

export type DatabaseOperation =
  | CreateProjectFunctionOperation
  | UpdateProjectFunctionOperation
  | CreateProjectFunctionPhaseTaskOperation;

// =====================================================
// COMMAND EXECUTION
// =====================================================

export interface CommandExecution {
  command: string; // e.g., "speckit.specify", "speckit.clarify"
  purpose: string;
  output_file: string | null; // file path of generated output
}

// =====================================================
// AGENT LIFECYCLE
// =====================================================

export interface AgentSpawned {
  agent_type: "planner" | "coder" | "reviewer" | "database-architect";
  agent_id: string; // e.g., "planner[1.2]", "coder[5.5.2]"
  spawned_at: string; // ISO 8601 timestamp
}

export interface AgentKilled {
  agent_type: "planner" | "coder" | "reviewer" | "database-architect";
  agent_id: string; // e.g., "planner[1.2]"
  killed_at: string; // ISO 8601 timestamp
}

// =====================================================
// SPECIFIC CHECKCARD TYPES
// =====================================================

/**
 * 1.1 User Request Checkcard
 */
export interface UserRequestCheckcard extends BaseCheckcard {
  step_id: "1.1";
  agent: "user";

  inputs: {
    user_initial_input: string;
  };

  context_reads: [];
  loops: null;

  outputs: {
    user_story_description: string;
  };
}

/**
 * 1.2 Orchestrator Initial Dialog Checkcard
 */
export interface OrchestratorInitialDialogCheckcard extends BaseCheckcard {
  step_id: "1.2";
  agent: "orchestrator";
  behavior_mode: "Socratic Dialog Mode";

  inputs: {
    user_story_description: string;
  };

  context_reads: ["constitution.md", "CLAUDE.md"];
  loops: UserApprovalLoop;

  database_operations: {
    create_project_function: CreateProjectFunctionOperation;
  };

  outputs: {
    function_id: string;
    function_name: string;
    function_description: string;
    function_slug: string;
    agent_spawned: AgentSpawned;
  };
}

/**
 * 2.1 Planner Specify Phase Checkcard
 */
export interface PlannerSpecifyCheckcard extends BaseCheckcard {
  step_id: "2.1";
  agent: "planner";
  behavior_mode: "Research Mode";

  inputs: {
    function_id: string;
    function_description: string;
    session_context: string;
  };

  context_reads: ["constitution.md"];
  loops: null;

  commands_executed: CommandExecution[];

  outputs: {
    spec_file_path: string;
    spec_file_url: string;
  };
}

/**
 * 2.2 Orchestrator Spec Update Checkcard
 */
export interface OrchestratorSpecUpdateCheckcard extends BaseCheckcard {
  step_id: "2.2";
  agent: "orchestrator";

  inputs: {
    function_id: string;
    spec_file_path: string;
  };

  context_reads: [];
  loops: null;

  database_operations: {
    update_project_function: UpdateProjectFunctionOperation;
  };

  outputs: {
    agent_killed: AgentKilled;
    next_phase: "clarify";
  };
}

// =====================================================
// UNION TYPE FOR ALL CHECKCARDS
// =====================================================

/**
 * 4.5.1 Orchestrator Analyze Phase Checkcard
 */
export interface OrchestratorAnalyzeCheckcard extends BaseCheckcard {
  step_id: "4.5.1";
  agent: "orchestrator";
  behavior_mode: "Review Mode";

  inputs: {
    function_id: string;
    spec_file_path: string;
    plan_file_path: string;
    tasks_file_path: string;
    constitution_file_path: string;
  };

  context_reads: [
    "spec.md",
    "plan.md",
    "tasks.md",
    "constitution.md",
    "data-model.md",
    "contracts/",
    "research.md"
  ];

  loops: null;

  commands_executed: [
    {
      command: "speckit.analyze";
      purpose: "Read-only cross-artifact consistency and quality analysis";
      output_file: string; // Path to analyze.md
    }
  ];

  outputs: {
    analyze_file_path: string; // e.g., ".specify/specs/001-sales-form/analyze.md"
    analyze_file_url: string;
    status: "READY" | "NEEDS_FIXES";
    critical_issues_count: number;
    high_issues_count: number;
    medium_issues_count: number;
    low_issues_count: number;
    coverage_percentage: number;
    constitution_violations: number;
    user_summary_prepared: boolean; // For 4.5.2 step
  };
}

export type WorkflowCheckcard =
  | UserRequestCheckcard
  | OrchestratorInitialDialogCheckcard
  | PlannerSpecifyCheckcard
  | OrchestratorSpecUpdateCheckcard
  | OrchestratorAnalyzeCheckcard;

"""
Step Definitions for Checkcard CLI - Data-Driven Configuration

Each step defines:
- agent: orchestrator, planner, coder, reviewer, database-architect
- has_input_output: True if step has separate INPUT/OUTPUT phases
- input: Source checkcard + field mappings (if has_input_output=True)
- output: Questions to ask agent (if has_input_output=True or no input/output)
- tools_questions: Questions for tools object
- metadata: step_index, step_name, description
"""

STEP_DEFINITIONS = {
    "A1": {
        "agent": "orchestrator",
        "has_input_output": False,
        "metadata": {
            "step_index": 1,
            "step_name": "User Request + Orchestrator Dialog",
            "description": "Orchestrator refines user story and creates project_function"
        },
        "questions": [
            {
                "section": "A1: User Request",
                "fields": [
                    {
                        "key": "user_initial_input",
                        "prompt": "Wie ist die Nutzeranfrage?",
                        "type": "text"
                    }
                ]
            },
            {
                "section": "A2: Orchestrator Dialog",
                "fields": [
                    {
                        "key": "user_approved_stepA2",
                        "prompt": "Hat der Nutzer die User Story approved? (true/false)",
                        "type": "bool"
                    },
                    {
                        "key": "description_of_feature",
                        "prompt": "Zusammenfassung der approved User Story [max. 500 char]",
                        "type": "text"
                    },
                    {
                        "key": "user_story",
                        "prompt": "Vollständige User Story (WHO does WHAT and WHY) [max. 2000 char]",
                        "type": "text"
                    }
                ]
            }
        ],
        "tools_questions": [
            {
                "key": "file_context_accessed",
                "prompt": "File Context Accessed (optional, komma-getrennt)",
                "type": "list"
            },
            {
                "key": "mcp_servers_accessed",
                "prompt": "MCP Servers Accessed (optional, komma-getrennt)",
                "type": "list"
            },
            {
                "key": "claude_skills_accessed",
                "prompt": "Claude Skills Accessed (optional, Pfade komma-getrennt)",
                "type": "list"
            }
        ],
        "checkcard_structure": "stepA1"
    },
    "B1": {
        "agent": "planner",
        "has_input_output": True,
        "metadata": {
            "step_index": 3,
            "step_name": "Planner Specify Phase",
            "description": "Planner researches codebase and executes speckit.specify"
        },
        "input": {
            "source_step": "A1",
            "source_sub": "stepA1",
            "fields": {
                "user_story": "outputs.user_story"
            },
            "display": [
                {"key": "user_story", "label": "User Story", "truncate": 100}
            ]
        },
        "output": {
            "questions": [
                {
                    "key": "spec_file_path",
                    "prompt": "Spec File Path (z.B. .specify/specs/001-feature/spec.md)",
                    "type": "text"
                }
            ]
        },
        "checkcard_structure": "stepB1"
    },
    "C1": {
        "agent": "orchestrator",
        "has_input_output": True,
        "metadata": {
            "step_index": 4,
            "step_name": "Orchestrator Clarify Phase",
            "description": "Orchestrator clarifies spec.md with user"
        },
        "input": {
            "source_step": "B1",
            "source_sub": "stepB1",
            "fields": {
                "spec_file_path": "outputs.spec_file_path"
            },
            "display": [
                {"key": "spec_file_path", "label": "Spec File", "truncate": 80}
            ]
        },
        "output": {
            "questions": [
                {
                    "key": "user_approved_clarification",
                    "prompt": "User approved clarification? (true/false)",
                    "type": "bool"
                },
                {
                    "key": "clarify_summary",
                    "prompt": "Clarification summary",
                    "type": "text"
                },
                {
                    "key": "spec_file_path",
                    "prompt": "Spec File Path (z.B. .specify/specs/001-feature/spec.md)",
                    "type": "text"
                }
            ]
        },
        "checkcard_structure": "stepC1"
    },
    "D1": {
        "agent": "planner",
        "has_input_output": True,
        "metadata": {
            "step_index": 5,
            "step_name": "Planner Plan Phase",
            "description": "Planner creates technical plan based on spec.md"
        },
        "input": {
            "source_step": "C1",
            "source_sub": "stepC1",
            "fields": {
                "spec_file_path": "outputs.spec_file_path"
            },
            "display": [
                {"key": "spec_file_path", "label": "Spec File", "truncate": 80}
            ]
        },
        "output": {
            "questions": [
                {
                    "key": "spec_file_path",
                    "prompt": "Spec File Path (z.B. .specify/specs/001-feature/spec.md)",
                    "type": "text"
                },
                {
                    "key": "plan_file_path",
                    "prompt": "Plan File Path (z.B. .specify/plans/001-feature/plan.md)",
                    "type": "text"
                },
                {
                    "key": "plan_analyze_summary_path",
                    "prompt": "Plan Analyze Summary Path",
                    "type": "text"
                },
                {
                    "key": "research_path",
                    "prompt": "Research Path",
                    "type": "text"
                },
                {
                    "key": "data_model_path",
                    "prompt": "Data Model Path",
                    "type": "text"
                },
                {
                    "key": "contracts_path",
                    "prompt": "Contracts Path",
                    "type": "text"
                },
                {
                    "key": "quickstart_path",
                    "prompt": "Quickstart Path",
                    "type": "text"
                }
            ]
        },
        "checkcard_structure": "stepD1"
    },
    "E1": {
        "agent": "orchestrator",
        "has_input_output": True,
        "metadata": {
            "step_index": 6,
            "step_name": "Orchestrator Plan Review Phase",
            "description": "Orchestrator reviews plan and gets user approval"
        },
        "input": {
            "source_step": "D1",
            "source_sub": "stepD1",
            "fields": {
                "plan_file_path": "outputs.plan_file_path",
                "plan_analyze_summary_path": "outputs.plan_analyze_summary_path"
            },
            "display": [
                {"key": "plan_file_path", "label": "Plan File", "truncate": 80},
                {"key": "plan_analyze_summary_path", "label": "Plan Analyze", "truncate": 80}
            ]
        },
        "output": {
            "questions": [
                {
                    "key": "user_approved_plan",
                    "prompt": "User approved plan? (true/false)",
                    "type": "bool"
                },
                {
                    "key": "plan_summary_path",
                    "prompt": "Plan Summary Path (may be changed by user iteration)",
                    "type": "text"
                }
            ]
        },
        "checkcard_structure": "stepE1"
    },
    "F1": {
        "agent": "planner",
        "has_input_output": True,
        "requires_validation": "task_json",
        "metadata": {
            "step_index": 7,
            "step_name": "Planner Tasks Phase",
            "description": "Planner breaks down plan into actionable tasks"
        },
        "input": {
            "source_step": "E1",
            "source_sub": "stepE1",
            "fields": {
                "plan_file_path": "outputs.plan_summary_path"
            },
            "display": [
                {"key": "plan_file_path", "label": "Plan File", "truncate": 80}
            ]
        },
        "output": {
            "questions": [
                {
                    "key": "tasks_json",
                    "prompt": "Task JSON Array (paste entire JSON or press Ctrl+D when done on multiple lines)",
                    "type": "text"
                },
                {
                    "key": "task_file_path",
                    "prompt": "Where should tasks be saved? (z.B. .specify/tasks/001-feature/tasks.md)",
                    "type": "text"
                }
            ]
        },
        "checkcard_structure": "stepF1"
    }
}


def get_available_agents():
    """Get list of available agents from definitions."""
    agents = {}
    for step_id, definition in STEP_DEFINITIONS.items():
        agent = definition["agent"]
        if agent not in agents:
            agents[agent] = []
        agents[agent].append(step_id)
    return agents


def get_step_definition(step_id):
    """Get definition for a specific step."""
    if step_id not in STEP_DEFINITIONS:
        raise ValueError(f"Unknown step: {step_id}")
    return STEP_DEFINITIONS[step_id]

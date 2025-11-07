#!/usr/bin/env python3
"""
MCP Server for Checkcard Workflow.

This server provides tools to interact with the checkcard-based workflow system,
enabling agents to load step inputs (with instructions) and save validated outputs.
"""

from typing import Optional, Dict, Any, List
from enum import Enum
from pathlib import Path
import json
import sys
from pydantic import BaseModel, Field, ConfigDict
from mcp.server.fastmcp import FastMCP

# Add current directory to path for step_definitions import
sys.path.insert(0, str(Path(__file__).parent))
from step_definitions import STEP_DEFINITIONS, get_step_definition

# Initialize the MCP server
mcp = FastMCP("checkcard_workflow")

# Constants
SKILL_ROOT = Path(__file__).parent.parent  # .claude/skills/.custom/speckit/
PROJECT_ROOT = SKILL_ROOT.parent.parent.parent.parent  # Project root (4 levels up from skill)
SKILL_CHECKCARDS_DIR = SKILL_ROOT / "references/checkcards"

# Task validation schema
TASK_SCHEMA = {
    "required_fields": ["task_id", "description", "is_parallel", "dependencies", "mvp"],
    "auto_fields": {"status": "pending"},  # Only status is auto-set
    "field_types": {
        "task_id": str,
        "description": str,
        "is_parallel": bool,
        "dependencies": (type(None), list),
        "mvp": bool,
        "phase": int,
        "status": str
    }
}


def _infer_phase_from_task_id(task_id: str) -> int:
    """
    Infer phase number from task_id.

    Heuristic: T001-T010 = 1, T011-T020 = 2, etc.
    Agent can override by providing 'phase' field explicitly.
    """
    try:
        task_num = int(task_id[1:])  # Extract number from T001
        phase_num = ((task_num - 1) // 10) + 1
        return phase_num
    except (ValueError, IndexError):
        return 1  # Fallback


def _load_checkcard(step_id: str, spec_path: Optional[str] = None) -> dict:
    """Load checkcard JSON from file."""
    if spec_path:
        # Load from spec-specific checkcards directory
        checkcard_path = PROJECT_ROOT / spec_path / "checkcards" / f"{step_id}_checkcard.json"
    else:
        # Load from global template checkcards (skill folder)
        checkcard_path = SKILL_CHECKCARDS_DIR / f"{step_id}_checkcard.json"

    if not checkcard_path.exists():
        raise FileNotFoundError(f"Checkcard not found: {checkcard_path}")

    with open(checkcard_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def _save_checkcard(step_id: str, agent_data: dict, metadata: dict, spec_path: Optional[str] = None) -> str:
    """
    Save checkcard JSON with clear separation between agent data and script metadata.

    Structure:
    {
      "stepX": {
        "metadata": {  // Added by script
          "step_index": int,
          "step_name": str,
          "agent": str,
          "description": str,
          "created_at": str
        },
        "agent_data": {  // Provided by agent
          "inputs": {...},
          "outputs": {...},
          "tools": {...}
        }
      }
    }
    """
    from datetime import datetime

    if spec_path:
        # Save to spec-specific checkcards directory
        checkcards_dir = PROJECT_ROOT / spec_path / "checkcards"
        checkcards_dir.mkdir(parents=True, exist_ok=True)
        checkcard_path = checkcards_dir / f"{step_id}_checkcard.json"
    else:
        # Save to global template checkcards (skill folder)
        SKILL_CHECKCARDS_DIR.mkdir(parents=True, exist_ok=True)
        checkcard_path = SKILL_CHECKCARDS_DIR / f"{step_id}_checkcard.json"

    # Build full checkcard with separation
    step_key = f"step{step_id}"
    full_checkcard = {
        step_key: {
            "metadata": {
                **metadata,
                "created_at": datetime.now().isoformat()
            },
            "agent_data": agent_data
        }
    }

    with open(checkcard_path, 'w', encoding='utf-8') as f:
        json.dump(full_checkcard, f, indent=2, ensure_ascii=False)

    return str(checkcard_path)


def _validate_task_json(tasks_data: Any) -> tuple[bool, List[str], Optional[List[dict]]]:
    """
    Validate task JSON structure (for F1 step).

    Returns:
        (is_valid, errors, validated_tasks)
    """
    errors = []

    # Parse JSON if string
    if isinstance(tasks_data, str):
        try:
            tasks_list = json.loads(tasks_data)
        except json.JSONDecodeError as e:
            return False, [f"JSON Parse Error: {str(e)}"], None
    else:
        tasks_list = tasks_data

    # Must be list
    if not isinstance(tasks_list, list):
        return False, ["Tasks must be a JSON array (list)"], None

    if not tasks_list:
        return False, ["Tasks list cannot be empty"], None

    validated_tasks = []

    for idx, task in enumerate(tasks_list):
        if not isinstance(task, dict):
            errors.append(f"Task {idx}: Must be an object/dict, got {type(task).__name__}")
            continue

        task_errors = []
        validated_task = {}

        # Check required fields
        for field in TASK_SCHEMA["required_fields"]:
            if field not in task:
                task_errors.append(f"Missing required field: {field}")
            else:
                value = task[field]
                expected_type = TASK_SCHEMA["field_types"][field]

                # Type validation
                if not isinstance(value, expected_type):
                    task_errors.append(f"Field '{field}': expected {expected_type}, got {type(value).__name__}")

                # Special validation for dependencies
                if field == "dependencies":
                    if value is not None and not isinstance(value, list):
                        task_errors.append(f"Field 'dependencies': must be null or string array")
                    elif isinstance(value, list):
                        for dep in value:
                            if not isinstance(dep, str):
                                task_errors.append(f"Field 'dependencies': all items must be strings")
                                break

                validated_task[field] = value

        # Add auto-generated fields (status)
        for field, default_value in TASK_SCHEMA["auto_fields"].items():
            validated_task[field] = default_value

        # Infer phase if not provided by agent
        if "phase" not in task or task["phase"] is None:
            validated_task["phase"] = _infer_phase_from_task_id(task.get("task_id", "T001"))
        else:
            validated_task["phase"] = task["phase"]

        if task_errors:
            for err in task_errors:
                errors.append(f"Task {idx} ({task.get('task_id', 'UNKNOWN')}): {err}")
        else:
            validated_tasks.append(validated_task)

    if errors:
        return False, errors, None

    return True, [], validated_tasks


def _get_step_instructions(step_id: str, definition: dict) -> List[str]:
    """Generate instructions for a step based on its definition."""
    instructions = []

    if step_id == "A1":
        instructions = [
            "1. Engage in Socratic dialog with user to understand their feature request",
            "2. Ask clarifying questions to refine requirements",
            "3. Create a complete user story following WHO/WHAT/WHY format",
            "4. Get user approval for the user story",
            "5. Track which tools/context you accessed (files, MCP servers, skills)"
        ]
    elif step_id == "B1":
        instructions = [
            "1. Read the user story from the inputs",
            "2. Research the codebase using available tools (Read, Grep, Glob)",
            "3. Execute /speckit.specify command with the user story",
            "4. Generate specification document (spec.md)",
            "5. Provide the spec file path in outputs"
        ]
    elif step_id == "C1":
        instructions = [
            "1. Read the spec file path from inputs",
            "2. Review the specification with the user",
            "3. Execute /speckit.clarify if needed to address unclear areas",
            "4. Iterate with user until spec is approved",
            "5. Provide approval status and final spec path"
        ]
    elif step_id == "D1":
        instructions = [
            "1. Read the approved spec file path from inputs",
            "2. Use MCP tools to gather library docs (context7, shadcn, supabase)",
            "3. Execute /speckit.plan command",
            "4. Generate plan.md and all artifacts (research, data-model, contracts, quickstart)",
            "5. Provide all file paths in outputs"
        ]
    elif step_id == "E1":
        instructions = [
            "1. Read plan file paths from inputs",
            "2. Execute /speckit.analyze to review plan quality",
            "3. Present plan summary to user (focus on plan.md, brief analyze.md mention)",
            "4. Get user approval (allow up to 3 review iterations)",
            "5. Provide approval status and final plan path"
        ]
    elif step_id == "F1":
        instructions = [
            "1. Read the approved plan path from inputs",
            "2. Execute /speckit.tasks command",
            "3. Generate task breakdown as JSON array",
            "4. Provide tasks JSON - it will be automatically validated",
            "5. Provide file path where tasks should be saved"
        ]

    return instructions


# Pydantic Models
class LoadStepInputModel(BaseModel):
    """Input model for loading step information."""
    model_config = ConfigDict(
        str_strip_whitespace=True,
        validate_assignment=True
    )

    step_id: str = Field(
        ...,
        description="Step ID to load (e.g., 'A1', 'B1', 'C1', 'D1', 'E1', 'F1')",
        pattern="^[A-F][1-9]$"
    )
    spec_path: Optional[str] = Field(
        default=None,
        description="Path to spec directory (e.g., '.specify/specs/002-webhero'). If not provided, uses global template checkcards."
    )


class SaveStepOutputModel(BaseModel):
    """Input model for saving step outputs."""
    model_config = ConfigDict(
        str_strip_whitespace=True,
        validate_assignment=True
    )

    step_id: str = Field(
        ...,
        description="Step ID to save (e.g., 'A1', 'B1', 'C1', 'D1', 'E1', 'F1')",
        pattern="^[A-F][1-9]$"
    )
    outputs: Dict[str, Any] = Field(
        ...,
        description="Output data to save (must match expected schema for this step)"
    )
    spec_path: Optional[str] = Field(
        default=None,
        description="Path to spec directory (e.g., '.specify/specs/002-webhero'). If not provided, uses global template checkcards."
    )
    tools: Optional[Dict[str, List[str]]] = Field(
        default=None,
        description="Tools accessed during step (only for A1: file_context_accessed, mcp_servers_accessed, claude_skills_accessed)"
    )


# MCP Tools
@mcp.tool(
    name="checkcard_load_step_input",
    annotations={
        "title": "Load Checkcard Step Input",
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": False
    }
)
async def checkcard_load_step_input(params: LoadStepInputModel) -> str:
    """
    Load complete information needed to execute a workflow step.

    This tool provides everything an agent needs to complete a step:
    - Step metadata (name, description, agent)
    - Detailed instructions on what to do
    - Input data from previous step (if applicable)
    - Expected output schema

    Use this at the start of each workflow step to understand your task.

    Args:
        params (LoadStepInputModel): Contains:
            - step_id (str): Step identifier (A1, B1, C1, D1, E1, or F1)
            - spec_path (Optional[str]): Path to spec directory (e.g., '.specify/specs/002-webhero')

    Returns:
        str: JSON-formatted response containing:
        {
            "step_id": str,              # Step identifier
            "agent": str,                # Which agent executes this (orchestrator/planner)
            "step_name": str,            # Human-readable step name
            "description": str,          # What this step does
            "instructions": [str],       # Detailed step-by-step instructions
            "inputs": {                  # Data from previous step (empty for A1)
                "field_name": value
            },
            "expected_outputs": [        # What you need to provide in save_step_output
                {
                    "key": str,          # Field name
                    "type": str,         # Field type (text/bool/list)
                    "required": bool,    # Is this field required?
                    "description": str   # What this field should contain
                }
            ]
        }

    Examples:
        - Load A1: Returns user request collection instructions with no inputs
        - Load B1: Returns planner instructions with user_story input from A1
        - Load C1: Returns clarify instructions with spec_file_path from B1

    Error Handling:
        - Returns error if step_id is invalid (must be A1-F1)
        - Returns error if required previous step checkcard doesn't exist
        - Returns error if input data from previous step is missing
    """
    try:
        step_id = params.step_id
        spec_path = params.spec_path

        # Get step definition
        definition = get_step_definition(step_id)
        metadata = definition.get("metadata", {})

        # Build response - ONLY what agent needs to see
        response = {
            "instructions": _get_step_instructions(step_id, definition),
            "inputs": {},
            "expected_outputs": []
        }

        # Load inputs from previous step if applicable
        if definition.get("has_input_output"):
            input_def = definition.get("input", {})
            source_step = input_def.get("source_step")
            source_sub = input_def.get("source_sub")
            field_mappings = input_def.get("fields", {})

            # Load source checkcard
            source_checkcard = _load_checkcard(source_step, spec_path)
            source_step_data = source_checkcard.get(source_sub, {})

            if not source_step_data:
                return json.dumps({
                    "error": f"Source step '{source_sub}' not found in checkcard '{source_step}'",
                    "message": "Make sure the previous step has been completed"
                }, indent=2)

            # Extract ONLY agent_data from previous step (not metadata!)
            source_agent_data = source_step_data.get("agent_data", source_step_data)  # Fallback for old format

            # Extract input fields from agent_data
            for key, path in field_mappings.items():
                parts = path.split(".")
                value = source_agent_data
                for part in parts:
                    value = value.get(part, {}) if isinstance(value, dict) else {}

                if not value or value == {}:
                    return json.dumps({
                        "error": f"Input '{key}' from step '{source_step}' is not available or empty",
                        "path": f"{path} in agent_data",
                        "message": "Make sure the previous step was completed correctly"
                    }, indent=2)

                response["inputs"][key] = value

        # Build expected outputs schema
        if step_id == "A1":
            # A1 has questions instead of output definition
            questions = definition.get("questions", [])
            for section in questions:
                for field in section.get("fields", []):
                    response["expected_outputs"].append({
                        "key": field.get("key"),
                        "type": field.get("type", "text"),
                        "required": True,
                        "description": field.get("prompt")
                    })
        else:
            # Other steps have output definition
            output_def = definition.get("output", {})
            questions = output_def.get("questions", [])
            for field in questions:
                response["expected_outputs"].append({
                    "key": field.get("key"),
                    "type": field.get("type", "text"),
                    "required": True,
                    "description": field.get("prompt")
                })

        return json.dumps(response, indent=2, ensure_ascii=False)

    except FileNotFoundError as e:
        return json.dumps({
            "error": "Checkcard file not found",
            "message": str(e),
            "hint": "Make sure the previous workflow step has been completed"
        }, indent=2)
    except ValueError as e:
        return json.dumps({
            "error": "Invalid step ID",
            "message": str(e),
            "valid_steps": ["A1", "B1", "C1", "D1", "E1", "F1"]
        }, indent=2)
    except Exception as e:
        return json.dumps({
            "error": "Unexpected error",
            "message": str(e),
            "type": type(e).__name__
        }, indent=2)


@mcp.tool(
    name="checkcard_save_step_output",
    annotations={
        "title": "Save Checkcard Step Output",
        "readOnlyHint": False,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": False
    }
)
async def checkcard_save_step_output(params: SaveStepOutputModel) -> str:
    """
    Validate and save outputs for a completed workflow step.

    This tool validates your outputs against the step's schema and saves
    a checkcard file. For F1 (Tasks step), it also validates task JSON structure.

    Use this after completing a step to save your work and enable the next step.

    Args:
        params (SaveStepOutputModel): Contains:
            - step_id (str): Step identifier (A1, B1, C1, D1, E1, or F1)
            - outputs (dict): Output data with required fields for this step
            - spec_path (Optional[str]): Path to spec directory (e.g., '.specify/specs/002-webhero')
            - tools (dict): Optional, only for A1 - tracks accessed tools

    Returns:
        str: JSON-formatted response containing:

        Success:
        {
            "success": true,
            "step_id": str,
            "saved_to": str,           # Path to saved checkcard file
            "message": str
        }

        Validation Error:
        {
            "success": false,
            "errors": [str],           # List of validation errors
            "missing_fields": [str],   # Required fields not provided
            "invalid_fields": [str],   # Fields with wrong type/format
            "hint": str                # Suggestion to fix errors
        }

    Examples:
        - Save A1: Provide user_story, description_of_feature, user_approved_stepA2, user_initial_input
        - Save B1: Provide spec_file_path
        - Save F1: Provide tasks_json (validated automatically), task_file_path

    Error Handling:
        - Validates all required fields are present
        - Validates field types match expected schema
        - For F1: Validates task JSON structure (task_id, description, is_parallel, dependencies, mvp)
        - Returns detailed error messages for missing/invalid fields
    """
    try:
        step_id = params.step_id
        outputs = params.outputs
        spec_path = params.spec_path
        tools = params.tools

        # Get step definition
        definition = get_step_definition(step_id)
        metadata = definition.get("metadata", {})

        # Validate outputs against expected schema
        errors = []
        missing_fields = []

        if step_id == "A1":
            # A1 has special structure with questions
            questions = definition.get("questions", [])
            required_keys = set()
            for section in questions:
                for field in section.get("fields", []):
                    required_keys.add(field.get("key"))

            # Check all required fields present
            for key in required_keys:
                if key not in outputs:
                    missing_fields.append(key)

            if missing_fields:
                return json.dumps({
                    "success": False,
                    "errors": [f"Missing required field: {field}" for field in missing_fields],
                    "missing_fields": missing_fields,
                    "hint": f"A1 requires: {', '.join(required_keys)}"
                }, indent=2)

            # Prepare agent data and metadata separately
            agent_data = {
                "outputs": outputs
            }
            if tools:
                agent_data["tools"] = tools

            script_metadata = {
                "step_index": metadata.get("step_index"),
                "step_name": metadata.get("step_name"),
                "agent": definition.get("agent"),
                "description": metadata.get("description")
            }

        else:
            # Other steps
            output_def = definition.get("output", {})
            questions = output_def.get("questions", [])
            required_keys = {field.get("key") for field in questions}

            # Check required fields
            for key in required_keys:
                if key not in outputs:
                    missing_fields.append(key)

            # Special validation for F1 (tasks)
            if step_id == "F1" and definition.get("requires_validation") == "task_json":
                if "tasks_json" in outputs:
                    is_valid, task_errors, validated_tasks = _validate_task_json(outputs["tasks_json"])

                    if not is_valid:
                        return json.dumps({
                            "success": False,
                            "errors": task_errors,
                            "hint": "Fix task JSON structure. Each task needs: task_id, description, is_parallel, dependencies, mvp"
                        }, indent=2)

                    # Replace with validated tasks
                    outputs["tasks_json"] = validated_tasks

            if missing_fields:
                return json.dumps({
                    "success": False,
                    "errors": [f"Missing required field: {field}" for field in missing_fields],
                    "missing_fields": missing_fields,
                    "hint": f"{step_id} requires: {', '.join(required_keys)}"
                }, indent=2)

            # Load inputs if step has them (for storage in checkcard, not for agent)
            inputs = {}
            if definition.get("has_input_output"):
                input_def = definition.get("input", {})
                source_checkcard = _load_checkcard(input_def.get("source_step"), spec_path)
                source_step_data = source_checkcard.get(input_def.get("source_sub"), {})
                source_agent_data = source_step_data.get("agent_data", source_step_data)  # Fallback for old format
                field_mappings = input_def.get("fields", {})

                for key, path in field_mappings.items():
                    parts = path.split(".")
                    value = source_agent_data
                    for part in parts:
                        value = value.get(part, {}) if isinstance(value, dict) else {}
                    inputs[key] = value

            # Prepare agent data
            agent_data = {
                "outputs": outputs
            }
            if inputs:
                agent_data["inputs"] = inputs

            # Prepare metadata (added by MCP, agent never sees this)
            script_metadata = {
                "step_index": metadata.get("step_index"),
                "step_name": metadata.get("step_name"),
                "agent": definition.get("agent"),
                "description": metadata.get("description")
            }

        # Save checkcard with separation
        saved_path = _save_checkcard(step_id, agent_data, script_metadata, spec_path)

        return json.dumps({
            "success": True,
            "step_id": step_id,
            "saved_to": saved_path,
            "message": f"Step {step_id} completed and saved successfully"
        }, indent=2, ensure_ascii=False)

    except ValueError as e:
        return json.dumps({
            "success": False,
            "error": "Invalid step ID",
            "message": str(e),
            "valid_steps": ["A1", "B1", "C1", "D1", "E1", "F1"]
        }, indent=2)
    except Exception as e:
        return json.dumps({
            "success": False,
            "error": "Unexpected error",
            "message": str(e),
            "type": type(e).__name__
        }, indent=2)


if __name__ == "__main__":
    mcp.run()

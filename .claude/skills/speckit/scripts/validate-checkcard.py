#!/usr/bin/env python3
"""
Checkcard Validation Script

Validates checkcard JSON files against TypeScript interface schemas (via JSON Schema).

Usage:
    python validate-checkcard.py <checkcard-file>

The script automatically determines which schema to use based on the step_id field.

Exit Codes:
    0 - Validation passed
    1 - Validation failed
    2 - Script error (file not found, invalid JSON, etc.)
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, Any, List, Tuple
from datetime import datetime

# Try to import jsonschema, provide helpful error if missing
try:
    from jsonschema import validate, ValidationError, Draft7Validator
except ImportError:
    print("ERROR: jsonschema package not installed", file=sys.stderr)
    print("Install with: pip install jsonschema", file=sys.stderr)
    sys.exit(2)


# Step ID to Interface Name mapping
STEP_INTERFACE_MAPPING = {
    "A1": "UserRequestCheckcard",
    "A2": "OrchestratorInitialDialogCheckcard",
    "B1": "PlannerSpecifyCheckcard",
    "B2": "OrchestratorSpecUpdateCheckcard",
    "E1": "OrchestratorAnalyzeCheckcard",
    # Add more mappings as interfaces are created
}


def find_project_root() -> Path:
    """Find project root by looking for workflow/checkcards directory."""
    current = Path.cwd()

    # Try current directory and parents
    for path in [current] + list(current.parents):
        workflow_dir = path / "workflow" / "checkcards"
        if workflow_dir.exists():
            return path

    # Fallback: assume we're in skill directory, go up to project root
    # .claude/skills/.custom/workflow/X/references/scripts -> project root (7 levels up)
    if ".claude" in str(current):
        return current.parents[6]

    raise FileNotFoundError(
        "Could not find project root. "
        "Expected workflow/checkcards directory in project root."
    )


def load_checkcard(file_path: str) -> Dict[str, Any]:
    """Load and parse checkcard JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"ERROR: Checkcard file not found: {file_path}", file=sys.stderr)
        sys.exit(2)
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON in checkcard file: {e}", file=sys.stderr)
        sys.exit(2)


def get_schema_path(step_id: str, project_root: Path) -> Path:
    """Get the JSON schema file path for a given step_id."""
    interface_name = STEP_INTERFACE_MAPPING.get(step_id)

    if not interface_name:
        print(
            f"ERROR: No interface mapping found for step_id '{step_id}'",
            file=sys.stderr
        )
        print(f"Available step_ids: {list(STEP_INTERFACE_MAPPING.keys())}", file=sys.stderr)
        sys.exit(2)

    schema_path = project_root / "workflow" / "checkcards" / "schemas" / f"{interface_name}.json"

    if not schema_path.exists():
        print(
            f"ERROR: Schema file not found: {schema_path}",
            file=sys.stderr
        )
        print("Generate schemas with: npm run generate-schemas", file=sys.stderr)
        sys.exit(2)

    return schema_path


def load_schema(schema_path: Path) -> Dict[str, Any]:
    """Load JSON schema file."""
    try:
        with open(schema_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON in schema file: {e}", file=sys.stderr)
        sys.exit(2)


def validate_iso8601_timestamp(value: Any, field_name: str) -> Tuple[bool, str]:
    """Validate ISO-8601 timestamp format."""
    if value is None:
        return True, ""

    if not isinstance(value, str):
        return False, f"{field_name} must be a string (ISO-8601 format)"

    try:
        datetime.fromisoformat(value.replace('Z', '+00:00'))
        return True, ""
    except ValueError:
        return False, f"{field_name} must be valid ISO-8601 timestamp (e.g., '2025-01-15T10:30:00Z')"


def validate_status_specific_rules(checkcard: Dict[str, Any]) -> List[str]:
    """Validate status-specific rules."""
    errors = []
    status = checkcard.get("status")

    if status == "completed":
        # Completed checkcards must have timestamps and duration
        if not checkcard.get("started_at"):
            errors.append("completed status requires started_at timestamp")
        if not checkcard.get("completed_at"):
            errors.append("completed status requires completed_at timestamp")
        if not checkcard.get("duration_minutes"):
            errors.append("completed status requires duration_minutes")

        # Outputs must be filled (not null)
        outputs = checkcard.get("outputs", {})
        for key, value in outputs.items():
            if value is None:
                errors.append(f"completed status requires outputs.{key} to be filled (not null)")

    elif status == "failed":
        # Failed checkcards must have error message
        if not checkcard.get("error"):
            errors.append("failed status requires error field with error message")

    return errors


def validate_checkcard(checkcard: Dict[str, Any], schema: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """
    Validate checkcard against JSON schema with additional custom checks.

    Returns:
        Tuple of (is_valid, error_messages)
    """
    errors = []

    # 1. JSON Schema validation
    validator = Draft7Validator(schema)
    schema_errors = list(validator.iter_errors(checkcard))

    for error in schema_errors:
        # Build readable error message with path
        path = ".".join(str(p) for p in error.path) if error.path else "root"
        errors.append(f"{path}: {error.message}")

    # 2. Validate timestamp formats
    timestamp_fields = ["started_at", "completed_at"]
    for field in timestamp_fields:
        if field in checkcard:
            is_valid, error_msg = validate_iso8601_timestamp(checkcard[field], field)
            if not is_valid:
                errors.append(error_msg)

    # 3. Validate status-specific rules
    status_errors = validate_status_specific_rules(checkcard)
    errors.extend(status_errors)

    # 4. Check for agent spawned timestamps (if present)
    outputs = checkcard.get("outputs", {})
    if "agent_spawned" in outputs and outputs["agent_spawned"]:
        spawned_at = outputs["agent_spawned"].get("spawned_at")
        if spawned_at:
            is_valid, error_msg = validate_iso8601_timestamp(
                spawned_at,
                "outputs.agent_spawned.spawned_at"
            )
            if not is_valid:
                errors.append(error_msg)

    # 5. Check for agent killed timestamps (if present)
    if "agent_killed" in outputs and outputs["agent_killed"]:
        killed_at = outputs["agent_killed"].get("killed_at")
        if killed_at:
            is_valid, error_msg = validate_iso8601_timestamp(
                killed_at,
                "outputs.agent_killed.killed_at"
            )
            if not is_valid:
                errors.append(error_msg)

    return len(errors) == 0, errors


def main():
    """Main execution."""
    if len(sys.argv) != 2:
        print("Usage: python validate-checkcard.py <checkcard-file>", file=sys.stderr)
        print("\nExample:", file=sys.stderr)
        print("  python validate-checkcard.py references/1.1_Checkcard_Orchestrator.json", file=sys.stderr)
        sys.exit(2)

    checkcard_file = sys.argv[1]

    # Find project root
    try:
        project_root = find_project_root()
    except FileNotFoundError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(2)

    # Load checkcard
    checkcard = load_checkcard(checkcard_file)

    # Extract step_id
    step_id = checkcard.get("step_id")
    if not step_id:
        print("ERROR: Checkcard missing 'step_id' field", file=sys.stderr)
        sys.exit(2)

    print(f"Validating checkcard for step {step_id}...")

    # Get schema path and load schema
    schema_path = get_schema_path(step_id, project_root)
    schema = load_schema(schema_path)

    print(f"Using schema: {schema_path.name}")

    # Validate
    is_valid, errors = validate_checkcard(checkcard, schema)

    if is_valid:
        print("✓ Validation passed")
        print(f"  Step: {checkcard.get('step_name', 'N/A')}")
        print(f"  Agent: {checkcard.get('agent', 'N/A')}")
        print(f"  Status: {checkcard.get('status', 'N/A')}")
        sys.exit(0)
    else:
        print("✗ Validation failed\n", file=sys.stderr)
        print("Errors found:", file=sys.stderr)
        for i, error in enumerate(errors, 1):
            print(f"  {i}. {error}", file=sys.stderr)
        print(f"\nTotal errors: {len(errors)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

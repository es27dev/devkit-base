#!/usr/bin/env python3
"""
Checkcard Validation Script

Validates checkcard JSON against TypeScript interface schema.
Used to ensure workflow step outputs are complete and correct.

Usage:
    python validate-checkcard.py <checkcard-file> <interface-name>

Example:
    python validate-checkcard.py \
        references/agents/orchestrator/1.2_checkcard.json \
        OrchestratorInitialDialogCheckcard

Exit codes:
    0 - Validation passed
    1 - Validation failed
    2 - Script error (file not found, invalid JSON, etc.)
"""

import json
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime


class CheckcardValidator:
    """Validates checkcard against expected schema"""

    # Schema definitions derived from checkcard-interfaces.ts
    SCHEMAS = {
        "UserRequestCheckcard": {
            "required_fields": {
                "step_id": str,
                "step_name": str,
                "agent": str,
                "description": str,
                "status": str,
            },
            "required_values": {
                "step_id": "1.1",
                "agent": "user",
                "status": ["pending", "in_progress", "completed", "failed"],
            },
            "required_outputs": ["user_story_description"],
            "nullable_on_pending": ["started_at", "completed_at", "duration_minutes"],
        },
        "OrchestratorInitialDialogCheckcard": {
            "required_fields": {
                "step_id": str,
                "step_name": str,
                "agent": str,
                "behavior_mode": str,
                "description": str,
                "status": str,
            },
            "required_values": {
                "step_id": "1.2",
                "agent": "orchestrator",
                "behavior_mode": "Socratic Dialog Mode",
                "status": ["pending", "in_progress", "completed", "failed"],
            },
            "required_inputs": ["user_story_description"],
            "required_outputs": [
                "function_id",
                "function_name",
                "function_description",
                "function_slug",
                "agent_spawned",
            ],
            "required_nested": {
                "loops": {
                    "type": "user_approval_loop",
                    "iterations": int,
                    "loop_data_per_iteration": list,
                    "exit_condition": str,
                },
                "database_operations": {
                    "create_project_function": dict,
                },
            },
            "nullable_on_pending": ["started_at", "completed_at", "duration_minutes"],
        },
    }

    def __init__(self, interface_name: str):
        self.interface_name = interface_name
        self.schema = self.SCHEMAS.get(interface_name)
        if not self.schema:
            raise ValueError(
                f"Unknown interface: {interface_name}. "
                f"Available: {list(self.SCHEMAS.keys())}"
            )
        self.errors: List[str] = []
        self.warnings: List[str] = []

    def validate(self, checkcard: Dict[str, Any]) -> bool:
        """
        Validate checkcard against schema.

        Returns:
            bool: True if validation passed, False otherwise
        """
        self.errors = []
        self.warnings = []

        status = checkcard.get("status")

        # Basic structure validation
        self._validate_required_fields(checkcard)
        self._validate_required_values(checkcard)

        # Status-specific validation
        if status == "completed":
            self._validate_completed_status(checkcard)
        elif status == "failed":
            self._validate_failed_status(checkcard)
        elif status in ["pending", "in_progress"]:
            self._validate_pending_status(checkcard)

        # Nested structure validation
        if "required_nested" in self.schema:
            self._validate_nested_structures(checkcard)

        # Input/output validation
        if "required_inputs" in self.schema:
            self._validate_inputs(checkcard)
        if "required_outputs" in self.schema:
            self._validate_outputs(checkcard, status)

        return len(self.errors) == 0

    def _validate_required_fields(self, checkcard: Dict[str, Any]):
        """Validate all required fields are present with correct types"""
        for field, expected_type in self.schema["required_fields"].items():
            if field not in checkcard:
                self.errors.append(f"Missing required field: {field}")
            elif not isinstance(checkcard[field], expected_type):
                self.errors.append(
                    f"Field '{field}' has wrong type. "
                    f"Expected {expected_type.__name__}, "
                    f"got {type(checkcard[field]).__name__}"
                )

    def _validate_required_values(self, checkcard: Dict[str, Any]):
        """Validate fields have expected values"""
        for field, expected in self.schema.get("required_values", {}).items():
            value = checkcard.get(field)
            if isinstance(expected, list):
                if value not in expected:
                    self.errors.append(
                        f"Field '{field}' has invalid value '{value}'. "
                        f"Expected one of: {expected}"
                    )
            elif value != expected:
                self.errors.append(
                    f"Field '{field}' has invalid value '{value}'. " f"Expected: {expected}"
                )

    def _validate_completed_status(self, checkcard: Dict[str, Any]):
        """Validate completed checkcard has all required data"""
        # Must have timestamps
        if not checkcard.get("started_at"):
            self.errors.append("Completed checkcard missing 'started_at' timestamp")
        if not checkcard.get("completed_at"):
            self.errors.append("Completed checkcard missing 'completed_at' timestamp")
        if checkcard.get("duration_minutes") is None:
            self.errors.append("Completed checkcard missing 'duration_minutes'")

        # Validate timestamp format
        for field in ["started_at", "completed_at"]:
            if checkcard.get(field):
                try:
                    datetime.fromisoformat(checkcard[field].replace("Z", "+00:00"))
                except ValueError:
                    self.errors.append(
                        f"Field '{field}' has invalid ISO-8601 format: {checkcard[field]}"
                    )

    def _validate_failed_status(self, checkcard: Dict[str, Any]):
        """Validate failed checkcard has error message"""
        if not checkcard.get("error"):
            self.errors.append("Failed checkcard missing 'error' message")

    def _validate_pending_status(self, checkcard: Dict[str, Any]):
        """Validate pending checkcard has null values for time fields"""
        nullable_fields = self.schema.get("nullable_on_pending", [])
        for field in nullable_fields:
            if checkcard.get(field) is not None:
                self.warnings.append(
                    f"Pending/in_progress checkcard has non-null '{field}' "
                    f"(expected null until completed)"
                )

    def _validate_nested_structures(self, checkcard: Dict[str, Any]):
        """Validate nested object structures"""
        for field, expected_structure in self.schema["required_nested"].items():
            if field not in checkcard:
                self.errors.append(f"Missing required nested structure: {field}")
                continue

            nested = checkcard[field]
            if not isinstance(nested, dict):
                self.errors.append(f"Field '{field}' must be an object")
                continue

            # Validate nested fields
            for nested_field, nested_type in expected_structure.items():
                if nested_field not in nested:
                    self.errors.append(
                        f"Missing required field in '{field}': {nested_field}"
                    )
                elif nested_type == dict and not isinstance(nested[nested_field], dict):
                    self.errors.append(
                        f"Field '{field}.{nested_field}' must be an object"
                    )
                elif nested_type == list and not isinstance(nested[nested_field], list):
                    self.errors.append(
                        f"Field '{field}.{nested_field}' must be an array"
                    )
                elif (
                    nested_type
                    in [int, str, bool]
                    and not isinstance(nested[nested_field], nested_type)
                ):
                    self.errors.append(
                        f"Field '{field}.{nested_field}' has wrong type. "
                        f"Expected {nested_type.__name__}"
                    )

    def _validate_inputs(self, checkcard: Dict[str, Any]):
        """Validate required inputs are present"""
        inputs = checkcard.get("inputs", {})
        for required_input in self.schema["required_inputs"]:
            if required_input not in inputs:
                self.errors.append(
                    f"Missing required input field: inputs.{required_input}"
                )

    def _validate_outputs(self, checkcard: Dict[str, Any], status: str):
        """Validate required outputs are present (if completed)"""
        if status != "completed":
            return  # Outputs can be null if not completed

        outputs = checkcard.get("outputs", {})
        for required_output in self.schema["required_outputs"]:
            if required_output not in outputs:
                self.errors.append(
                    f"Missing required output field: outputs.{required_output}"
                )
            elif outputs[required_output] is None:
                self.errors.append(
                    f"Completed checkcard has null output: outputs.{required_output}"
                )

    def print_results(self):
        """Print validation results"""
        if self.errors:
            print(f"\n❌ Checkcard validation FAILED ({len(self.errors)} errors)")
            print("\nErrors:")
            for i, error in enumerate(self.errors, 1):
                print(f"  {i}. {error}")

        if self.warnings:
            print(f"\n⚠️  Warnings ({len(self.warnings)}):")
            for i, warning in enumerate(self.warnings, 1):
                print(f"  {i}. {warning}")

        if not self.errors:
            if self.warnings:
                print(f"\n✅ Checkcard validation PASSED (with {len(self.warnings)} warnings)")
            else:
                print("\n✅ Checkcard validation PASSED")


def main():
    if len(sys.argv) != 3:
        print("Usage: python validate-checkcard.py <checkcard-file> <interface-name>")
        print("\nAvailable interfaces:")
        for interface in CheckcardValidator.SCHEMAS.keys():
            print(f"  - {interface}")
        sys.exit(2)

    checkcard_file = Path(sys.argv[1])
    interface_name = sys.argv[2]

    # Check file exists
    if not checkcard_file.exists():
        print(f"❌ File not found: {checkcard_file}")
        sys.exit(2)

    # Load checkcard
    try:
        with open(checkcard_file, "r", encoding="utf-8") as f:
            checkcard = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON: {e}")
        sys.exit(2)
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        sys.exit(2)

    # Validate
    try:
        validator = CheckcardValidator(interface_name)
        is_valid = validator.validate(checkcard)
        validator.print_results()

        sys.exit(0 if is_valid else 1)

    except ValueError as e:
        print(f"❌ {e}")
        sys.exit(2)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(2)


if __name__ == "__main__":
    main()

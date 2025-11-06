#!/usr/bin/env python3
"""
Process Checkcard - Agent AI Input → Full Checkcard

Workflow:
1. Agent fills checkcard_X.ai.json (dynamic content only)
2. Script validates AI JSON against schema
3. Script merges with static metadata from step_definitions.py
4. Script generates checkcard_X.full.json
5. Script validates full checkcard (optional)
6. Script saves full checkcard

Usage:
    python process-checkcard.py <step-id> <ai-json-file>

Example:
    python process-checkcard.py A1 ../checkcards/checkcard_A1.ai.json
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timezone

# Try to import jsonschema
try:
    from jsonschema import validate, ValidationError, Draft7Validator
except ImportError:
    print("ERROR: jsonschema package not installed", file=sys.stderr)
    print("Install with: pip install jsonschema", file=sys.stderr)
    sys.exit(2)

from step_definitions import STEP_DEFINITIONS


def load_json(file_path):
    """Load and parse JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"ERROR: File not found: {file_path}", file=sys.stderr)
        sys.exit(2)
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON in file: {e}", file=sys.stderr)
        sys.exit(2)


def validate_ai_json(ai_data, schema_path):
    """Validate AI JSON against schema."""
    schema = load_json(schema_path)

    try:
        validate(instance=ai_data, schema=schema)
        return True, []
    except ValidationError as e:
        return False, [str(e)]


def get_iso_timestamp():
    """Get current timestamp in ISO-8601 format."""
    return datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')


def build_full_checkcard(step_id, ai_data):
    """Build full checkcard from AI data + metadata."""

    definition = STEP_DEFINITIONS.get(step_id)
    if not definition:
        print(f"ERROR: No definition found for step {step_id}", file=sys.stderr)
        sys.exit(2)

    metadata = definition.get("metadata", {})
    agent = definition.get("agent")
    checkcard_structure = definition.get("checkcard_structure")

    # Build full checkcard
    full_checkcard = {
        checkcard_structure: {
            "step_index": metadata.get("step_index"),
            "step_name": metadata.get("step_name"),
            "agent": agent,
            "description": metadata.get("description"),
            "tools": ai_data.get("tools", {}),
            "outputs": ai_data.get("outputs", {})
        }
    }

    # Add inputs if step has input phase
    if definition.get("has_input_output") and "inputs" in ai_data:
        full_checkcard[checkcard_structure]["inputs"] = ai_data["inputs"]

    return full_checkcard


def main():
    """Main execution."""
    if len(sys.argv) != 3:
        print("Usage: python process-checkcard.py <step-id> <ai-json-file>", file=sys.stderr)
        print("\nExample:", file=sys.stderr)
        print("  python process-checkcard.py A1 ../checkcards/checkcard_A1.ai.json", file=sys.stderr)
        sys.exit(2)

    step_id = sys.argv[1].upper()
    ai_json_file = Path(sys.argv[2])

    print("=" * 60)
    print(f"Processing Checkcard {step_id}")
    print("=" * 60)
    print()

    # 1. Load AI JSON
    print(f"[1/5] Loading AI JSON: {ai_json_file.name}")
    ai_data = load_json(ai_json_file)
    print(f"[OK] Loaded {len(ai_data)} top-level keys")
    print()

    # 2. Validate AI JSON against schema
    schema_path = ai_json_file.parent / f"checkcard_{step_id}.ai.schema.json"
    print(f"[2/5] Validating against schema: {schema_path.name}")

    if not schema_path.exists():
        print(f"[WARNING] Schema not found, skipping validation")
    else:
        is_valid, errors = validate_ai_json(ai_data, schema_path)
        if not is_valid:
            print("[ERROR] Validation failed:", file=sys.stderr)
            for error in errors:
                print(f"  {error}", file=sys.stderr)
            sys.exit(1)
        print("[OK] AI JSON valid")
    print()

    # 3. Build full checkcard
    print(f"[3/5] Building full checkcard with metadata")
    full_checkcard = build_full_checkcard(step_id, ai_data)
    print(f"[OK] Full checkcard structure created")
    print()

    # 4. Save full checkcard
    output_file = ai_json_file.parent / f"checkcard_{step_id}.full.json"
    print(f"[4/5] Saving full checkcard: {output_file.name}")

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(full_checkcard, f, indent=2, ensure_ascii=False)

    print(f"[OK] Saved to: {output_file}")
    print()

    # 5. Summary
    print("[5/5] Summary")
    step_key = list(full_checkcard.keys())[0]
    step_data = full_checkcard[step_key]

    print(f"  Step: {step_data['step_name']}")
    print(f"  Agent: {step_data['agent']}")
    print(f"  Outputs: {len(step_data.get('outputs', {}))} fields")
    print(f"  Tools: {len(step_data.get('tools', {}))} categories")

    if "inputs" in step_data:
        print(f"  Inputs: {len(step_data['inputs'])} fields")

    print()
    print("=" * 60)
    print("[OK] Checkcard processing complete!")
    print("=" * 60)
    print()
    print("Next steps:")
    print(f"  1. Review: {output_file}")
    print(f"  2. Validate (optional): python validate-checkcard.py {output_file}")
    print(f"  3. Continue to next step: {step_id} → {chr(ord(step_id[0]) + 1)}1")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Minimal CLI for Checkcard Generation - MVP (Data-Driven)

Uses step_definitions.py for configuration instead of hardcoded logic.

Usage:
    python checkcard-cli.py
"""

import json
import sys
from pathlib import Path

from step_definitions import STEP_DEFINITIONS, get_available_agents, get_step_definition


# Task Validation Schema and Validator
TASK_SCHEMA = {
    "required_fields": ["task_id", "description", "is_parallel", "dependencies", "mvp"],
    "auto_fields": {"phase": "pending", "status": "pending"},
    "field_types": {
        "task_id": str,
        "description": str,
        "is_parallel": bool,
        "dependencies": (type(None), list),  # null or string[]
        "mvp": bool,
        "phase": str,
        "status": str
    }
}


def validate_task_json(tasks_data):
    """
    Validate task JSON structure and content.

    Args:
        tasks_data: Either JSON string or dict/list

    Returns:
        (is_valid: bool, errors: list of error messages, validated_tasks: list or None)
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

        # Add auto-generated fields
        for field, default_value in TASK_SCHEMA["auto_fields"].items():
            validated_task[field] = default_value

        if task_errors:
            for err in task_errors:
                errors.append(f"Task {idx} ({task.get('task_id', 'UNKNOWN')}): {err}")
        else:
            validated_tasks.append(validated_task)

    if errors:
        return False, errors, None

    return True, [], validated_tasks


def prompt(question):
    """Ask user for input."""
    return input(f"{question}: ").strip()


def load_checkcard(step_name):
    """Load checkcard from JSON file."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    checkcard_path = project_root / "workflow" / "checkcards" / f"checkcard_{step_name}.full.json"

    if not checkcard_path.exists():
        print(f"\nERROR: Checkcard nicht gefunden: {checkcard_path}", file=sys.stderr)
        sys.exit(2)

    with open(checkcard_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def load_inputs(input_definition):
    """Load data from previous checkcard based on input definition."""
    source_step = input_definition.get("source_step")
    source_sub = input_definition.get("source_sub")
    field_mappings = input_definition.get("fields", {})

    # Load source checkcard
    source_checkcard = load_checkcard(source_step)
    source_data = source_checkcard.get(source_sub, {})

    # Check if source_sub exists in checkcard
    if not source_data:
        print(f"\nERROR: Schritt '{source_sub}' nicht gefunden im Checkcard '{source_step}'.", file=sys.stderr)
        print(f"Bist du sicher dass du den richtigen Task gewählt hast?", file=sys.stderr)
        sys.exit(3)

    # Extract fields based on mappings
    inputs = {}
    for key, path in field_mappings.items():
        parts = path.split(".")
        value = source_data
        for part in parts:
            value = value.get(part, {}) if isinstance(value, dict) else {}

        # Check if value is empty/None
        if not value or value == {}:
            print(f"\nERROR: Input '{key}' vom vorherigen Schritt '{source_step}' ist nicht verfügbar oder leer.", file=sys.stderr)
            print(f"Pfad: {path} in {source_sub}", file=sys.stderr)
            print(f"Bist du sicher dass du den richtigen Task gewählt hast?", file=sys.stderr)
            sys.exit(3)

        inputs[key] = value

    return inputs


def display_inputs(inputs, display_config):
    """Display loaded inputs to user."""
    print("--- INPUT: Loading from previous step ---\n")
    for config in display_config:
        key = config.get("key")
        label = config.get("label", key)
        truncate = config.get("truncate")

        value = inputs.get(key, "")
        if truncate and len(value) > truncate:
            value = value[:truncate] + "..."

        print(f"[INPUT] {label}: {value}")
    print()


def collect_outputs(questions):
    """Collect output data from user based on questions definition."""
    print("--- OUTPUT: Collect Agent Results ---\n")

    outputs = {}
    for question_group in questions:
        fields = question_group.get("fields", [])
        for field in fields:
            key = field.get("key")
            prompt_text = field.get("prompt")
            field_type = field.get("type", "text")

            answer = prompt(prompt_text)

            # Type conversion
            if field_type == "bool":
                answer = answer.lower() == "true"
            elif field_type == "list":
                answer = [x.strip() for x in answer.split(",") if x.strip()] if answer else []

            outputs[key] = answer

    return outputs


def collect_tools(tools_questions):
    """Collect tools data (context accessed, MCPs, skills)."""
    tools = {}
    for question in tools_questions:
        key = question.get("key")
        prompt_text = question.get("prompt")
        answer = prompt(prompt_text)
        tools[key] = [x.strip() for x in answer.split(",") if x.strip()] if answer else []

    return tools


def collect_multiline_json(prompt_text):
    """
    Collect multiline JSON input from user.
    User enters lines until they press Ctrl+D (EOF) or empty line followed by 'END'.
    Returns the collected JSON string.
    """
    print(f"\n{prompt_text}")
    print("(Paste JSON and press Ctrl+D when done, or type 'END' on a new line)\n")

    lines = []
    try:
        while True:
            line = input()
            if line.strip() == "END":
                break
            lines.append(line)
    except EOFError:
        pass

    return "\n".join(lines)


def collect_generic(step_id, phase_type):
    """Generic collection engine - handles INPUT and OUTPUT phases."""
    definition = get_step_definition(step_id)
    metadata = definition.get("metadata", {})

    print("\n" + "=" * 60)
    print(f"Step {step_id}: {metadata.get('step_name')}")
    print("=" * 60 + "\n")

    if phase_type == "input":
        # INPUT phase - just load and display
        input_def = definition.get("input", {})
        inputs = load_inputs(input_def)
        display_config = input_def.get("display", [])
        display_inputs(inputs, display_config)
        return None  # Don't save INPUT phase

    elif phase_type == "output":
        # OUTPUT phase - collect outputs
        checkcard_data = {}

        # Build checkcard structure
        structure = definition.get("checkcard_structure")
        if "," in structure:
            # Multiple sub-steps (e.g., "stepA1, stepA2")
            sub_steps = [s.strip() for s in structure.split(",")]

            # For A1: collect A1 and A2 data into single stepA1
            if step_id == "A1":
                questions = definition.get("questions", [])
                all_outputs = {}

                for question_group in questions:
                    section = question_group.get("section", "")
                    print(f"--- {section} ---\n")

                    fields = question_group.get("fields", [])
                    for field in fields:
                        key = field.get("key")
                        prompt_text = field.get("prompt")
                        field_type = field.get("type", "text")

                        answer = prompt(prompt_text)
                        if field_type == "bool":
                            answer = answer.lower() == "true"
                        elif field_type == "list":
                            answer = [x.strip() for x in answer.split(",") if x.strip()]

                        all_outputs[key] = answer

                # Collect tools data
                print()
                tools = collect_tools(definition.get("tools_questions", []))

                # Build single checkcard for A1 (combines A1 and A2)
                checkcard_data["stepA1"] = {
                    "step_index": 1,
                    "step_name": "User Request + Orchestrator Dialog",
                    "agent": "orchestrator",
                    "description": metadata.get("description"),
                    "tools": tools,
                    "outputs": {
                        "user_initial_input": all_outputs.get("user_initial_input"),
                        "user_approved_stepA2": all_outputs.get("user_approved_stepA2"),
                        "description_of_feature": all_outputs.get("description_of_feature"),
                        "user_story": all_outputs.get("user_story")
                    }
                }

        else:
            # Single step (e.g., "stepB1")
            step_key = structure

            # Collect inputs if INPUT phase happened
            inputs = {}
            if definition.get("has_input_output"):
                input_def = definition.get("input", {})
                inputs = load_inputs(input_def)

            # Collect outputs - with special handling for F1
            questions = definition.get("output", {}).get("questions", [])
            outputs = {}

            # Special handling for F1 (task validation)
            if step_id == "F1" and definition.get("requires_validation") == "task_json":
                print("--- OUTPUT: Collect Agent Results ---\n")

                max_retries = 3
                validation_passed = False

                for attempt in range(max_retries):
                    # Collect tasks JSON
                    tasks_json_prompt = [q for q in questions if q.get("key") == "tasks_json"][0]
                    tasks_json_str = collect_multiline_json(tasks_json_prompt.get("prompt"))

                    # Validate
                    is_valid, errors, validated_tasks = validate_task_json(tasks_json_str)

                    if is_valid:
                        # Validation passed - save the validated tasks
                        outputs["tasks_json"] = validated_tasks
                        validation_passed = True
                        print("\n✅ Tasks JSON validated successfully!")
                        print(f"   Loaded {len(validated_tasks)} tasks\n")
                        break
                    else:
                        # Validation failed - show errors
                        print("\n❌ Validation failed. Errors:\n")
                        for error in errors:
                            print(f"   - {error}")

                        if attempt < max_retries - 1:
                            print(f"\n({attempt + 1}/{max_retries} attempts)")
                            retry = prompt("Try again? (yes/no)").lower()
                            if retry not in ["yes", "y"]:
                                print("\n⚠️  Skipping validation - proceeding with invalid JSON")
                                outputs["tasks_json"] = tasks_json_str  # Store as-is for manual review
                                break
                        else:
                            print("\n⚠️  Max retries reached - proceeding with last input")
                            outputs["tasks_json"] = tasks_json_str  # Store as-is for manual review

                # Collect task_file_path (where to save)
                if validation_passed:
                    task_file_path_prompt = [q for q in questions if q.get("key") == "task_file_path"][0]
                    task_file_path = prompt(task_file_path_prompt.get("prompt"))
                    outputs["task_file_path"] = task_file_path

                    # Auto-save validated tasks to file
                    script_dir = Path(__file__).parent
                    project_root = script_dir.parent.parent
                    tasks_dir = project_root / "workflow" / "checkcards"
                    tasks_dir.mkdir(parents=True, exist_ok=True)

                    # Save tasks as JSON file
                    tasks_file = project_root / task_file_path if task_file_path.startswith(".") else Path(task_file_path)
                    tasks_file.parent.mkdir(parents=True, exist_ok=True)

                    with open(tasks_file, 'w', encoding='utf-8') as f:
                        json.dump(outputs["tasks_json"], f, indent=2, ensure_ascii=False)

                    print(f"\n[OK] Tasks saved to: {tasks_file}")
            else:
                # Standard output collection for other steps
                outputs = collect_outputs([{"fields": questions}])

            # Build checkcard
            checkcard_data[step_key] = {
                "step_index": metadata.get("step_index"),
                "step_name": metadata.get("step_name"),
                "agent": definition.get("agent"),
                "description": metadata.get("description")
            }

            if inputs:
                checkcard_data[step_key]["inputs"] = inputs

            if outputs:
                checkcard_data[step_key]["outputs"] = outputs

        return checkcard_data

    else:
        print(f"ERROR: Unbekannte Phase '{phase_type}'")
        sys.exit(1)


    def print_test_result(test_name, is_valid, errors, validated_tasks):
        """Pretty print test results."""
        print(f"\n{'='*60}")
        print(f"Test: {test_name}")
        print(f"{'='*60}")

        if is_valid:
            print(f"✅ VALID - {len(validated_tasks)} tasks passed validation")
            for task in validated_tasks:
                print(f"   - {task['task_id']}: {task['description']}")
        else:
            print(f"❌ INVALID - {len(errors)} error(s):")
            for error in errors:
                print(f"   - {error}")

    # Test 1: Valid tasks
    print("\n[Test 1] Valid Tasks JSON")
    is_valid, errors, validated_tasks = validate_task_json(VALID_TASKS)
    print_test_result("Valid Tasks", is_valid, errors, validated_tasks)

    # Test 2: Valid tasks as JSON string
    print("\n[Test 2] Valid Tasks as JSON String")
    json_str = json.dumps(VALID_TASKS)
    is_valid, errors, validated_tasks = validate_task_json(json_str)
    print_test_result("Valid Tasks (JSON string)", is_valid, errors, validated_tasks)

    # Test 3: Missing required field
    print("\n[Test 3] Missing Required Field")
    is_valid, errors, validated_tasks = validate_task_json(INVALID_TASKS_MISSING_FIELD)
    print_test_result("Missing Field", is_valid, errors, validated_tasks)

    # Test 4: Wrong field type
    print("\n[Test 4] Wrong Field Type")
    is_valid, errors, validated_tasks = validate_task_json(INVALID_TASKS_WRONG_TYPE)
    print_test_result("Wrong Type", is_valid, errors, validated_tasks)

    # Test 5: Bad dependencies format
    print("\n[Test 5] Bad Dependencies Format")
    is_valid, errors, validated_tasks = validate_task_json(INVALID_TASKS_BAD_DEPENDENCIES)
    print_test_result("Bad Dependencies", is_valid, errors, validated_tasks)

    # Test 6: Empty list
    print("\n[Test 6] Empty Tasks List")
    is_valid, errors, validated_tasks = validate_task_json([])
    print_test_result("Empty List", is_valid, errors, validated_tasks)

    # Test 7: Invalid JSON string
    print("\n[Test 7] Invalid JSON String")
    is_valid, errors, validated_tasks = validate_task_json('{"invalid": json}')
    print_test_result("Invalid JSON", is_valid, errors, validated_tasks)

    # Test 8: Not an array
    print("\n[Test 8] Not an Array (dict instead of list)")
    is_valid, errors, validated_tasks = validate_task_json({"task_id": "T1"})
    print_test_result("Not Array", is_valid, errors, validated_tasks)

    print("\n" + "=" * 60)
    print("All tests completed!")
    print("=" * 60 + "\n")


def main():
    """Main execution."""
    # Check for command line arguments

    print("\n" + "=" * 60)
    print("Checkcard CLI - MVP (Data-Driven)")
    print("=" * 60)


    # Get available agents from definitions
    agent_steps = get_available_agents()

    # Step 1: Select Agent
    agent_list = list(agent_steps.keys())
    agent_mapping = {str(i+1): agent for i, agent in enumerate(agent_list)}

    print("\n[1/2] Welcher Agent bist du?")
    for num, agent in agent_mapping.items():
        print(f"{num}. {agent}")
    print()

    agent_input = prompt("Agent (Nummer oder Name)").lower()

    # Support both numeric and name input
    if agent_input in agent_mapping:
        agent = agent_mapping[agent_input]
    elif agent_input in agent_steps:
        agent = agent_input
    else:
        print(f"\nERROR: Unbekannter Agent '{agent_input}'")
        sys.exit(1)

    # Step 2: Select Step
    available_steps = agent_steps[agent]
    step_mapping = {str(i+1): step for i, step in enumerate(available_steps)}

    print(f"\n[2/2] Welcher Step?")
    print(f"Verfügbare für {agent}:")
    for num, step in step_mapping.items():
        print(f"{num}. {step}")
    print()

    step_input = prompt("Step (Nummer oder Name)").upper()

    # Support both numeric and name input
    if step_input in step_mapping:
        step = step_mapping[step_input]
    elif step_input in available_steps:
        step = step_input
    else:
        print(f"\nERROR: Step '{step_input}' nicht verfügbar für Agent '{agent}'")
        sys.exit(1)

    # Step 3: Select INPUT/OUTPUT phase (if applicable)
    definition = get_step_definition(step)
    has_input_output = definition.get("has_input_output", False)

    if has_input_output:
        print(f"\n[3/3] Was möchtest du tun?")
        print("1. INPUT - Infos für den Step laden")
        print("2. OUTPUT - Step mit deinem Output abschließen\n")

        phase = prompt("Phase (1 oder 2)").strip()

        if phase not in ["1", "2"]:
            print(f"\nERROR: Ungültige Phase '{phase}'")
            sys.exit(1)

        phase_type = "input" if phase == "1" else "output"
    else:
        phase_type = "output"

    # Execute step collection
    checkcard_data = collect_generic(step, phase_type)

    # Save JSON (nur wenn OUTPUT oder Steps ohne INPUT/OUTPUT)
    should_save = (phase_type == "output")

    if should_save and checkcard_data:
        script_dir = Path(__file__).parent
        project_root = script_dir.parent.parent
        output_dir = project_root / "workflow" / "checkcards"
        output_dir.mkdir(parents=True, exist_ok=True)

        output_file = output_dir / f"checkcard_{step}.full.json"

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(checkcard_data, f, indent=2, ensure_ascii=False)

        print("\n" + "=" * 60)
        print(f"[OK] Checkcard saved: {output_file}")
        print("=" * 60)
        print(f"\nStep: {step}")
        print(f"Agent: {agent}")
        print()
    elif not should_save:
        print("\n" + "=" * 60)
        print("[INFO] INPUT geladen, beginne deinen Task")
        print("=" * 60)
        print(f"\nNach Abschluss deines Tasks starte das Script erneut,")
        print(f"um den Schritt über {step}-OUTPUT abzuschließen.")
        print()
        input("Press enter to end")


if __name__ == "__main__":
    main()

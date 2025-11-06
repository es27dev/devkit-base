# F1 Task Validation Implementation Guide

## Overview

The F1 step (Planner Tasks Phase) now includes a **task validation system** that validates task JSON structures before saving them to disk.

## How It Works

### 1. Agent Workflow for F1

When an agent (planner) runs F1 OUTPUT phase:

1. **Agent receives plan file path** (from E1 step)
2. **Agent generates task JSON array** with the following structure:
   ```json
   [
     {
       "task_id": "T1",
       "description": "Description of the task",
       "is_parallel": false,
       "dependencies": null,
       "mvp": true
     },
     {
       "task_id": "T2",
       "description": "Another task",
       "is_parallel": true,
       "dependencies": ["T1"],
       "mvp": true
     }
   ]
   ```
3. **Script collects the JSON** using multiline input (paste entire JSON, press Ctrl+D)
4. **Script validates** each task against the schema
5. **If valid**: Script auto-saves to specified file path and continues
6. **If invalid**: Script shows errors and allows retry (max 3 attempts)

### 2. Task Schema

Required fields for each task object:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `task_id` | string | Unique task identifier | `"T1"`, `"UI_Form"` |
| `description` | string | Human-readable description | `"Create user input form"` |
| `is_parallel` | boolean | Can run in parallel with others | `true` or `false` |
| `dependencies` | null or string[] | Task IDs this depends on | `null` or `["T1", "T2"]` |
| `mvp` | boolean | Is this part of MVP phase | `true` or `false` |

Auto-generated fields (set by script):
- `phase`: Always set to `"pending"` (status of task)
- `status`: Always set to `"pending"` (execution status)

### 3. Validation Rules

**Type Validation:**
- `task_id`: Must be string
- `description`: Must be string
- `is_parallel`: Must be boolean (true/false)
- `dependencies`: Must be null OR array of strings
- `mvp`: Must be boolean

**Structure Validation:**
- Input must be a JSON array `[]`, not object `{}`
- Array cannot be empty
- Each element must be an object

**Example Errors:**

```
Task 0: Missing required field: is_parallel
Task 0: Field 'dependencies': must be null or string array
Task 1 (T2): Field 'is_parallel': expected <class 'bool'>, got str
```

### 4. Interactive Validation Loop

```
--- OUTPUT: Collect Agent Results ---

Task JSON Array (paste entire JSON or press Ctrl+D when done on multiple lines):
(Paste JSON and press Ctrl+D when done, or type 'END' on a new line)

[JSON pasted here]

❌ Validation failed. Errors:

   - Task 0: Missing required field: is_parallel
   - Task 1 (T1): Field 'description': expected <class 'str'>, got int

(1/3 attempts)
Try again? (yes/no): yes
```

### 5. On Success

When validation passes:

```
✅ Tasks JSON validated successfully!
   Loaded 3 tasks

Where should tasks be saved? (z.B. .specify/tasks/001-feature/tasks.md): .specify/tasks/001-feature/tasks.md

[OK] Tasks saved to: .specify/tasks/001-feature/tasks.md
```

## Implementation Details

### Files Modified

1. **`workflow/scripts/checkcard-cli.py`**
   - Added `TASK_SCHEMA` dict defining the validation schema
   - Added `validate_task_json()` function for validation
   - Added `collect_multiline_json()` function for multiline input
   - Added special handling in `collect_generic()` for F1 step

2. **`workflow/scripts/step_definitions.py`**
   - Added `"requires_validation": "task_json"` flag to F1 definition
   - Updated F1 OUTPUT questions to include `tasks_json` and `task_file_path`

3. **`workflow/checkcards/stepE1_checkcard.json`** (created)
   - Template E1 checkcard so F1 can load its inputs

### Validation Function

```python
def validate_task_json(tasks_data):
    """
    Validate task JSON structure and content.

    Returns:
        (is_valid: bool, errors: list of error messages, validated_tasks: list or None)
    """
```

**Input:** JSON string or Python list/dict
**Output:** Tuple of (validity, error_list, validated_tasks_or_none)

## Usage Example

### In F1 OUTPUT Phase

```
Step F1: Planner Tasks Phase
============================================================

--- INPUT: Loading from previous step ---

[INPUT] Plan File: .specify/plans/001-feature/plan.md

--- OUTPUT: Collect Agent Results ---

Task JSON Array (paste entire JSON or press Ctrl+D when done on multiple lines):
(Paste JSON and press Ctrl+D when done, or type 'END' on a new line)

[
  {
    "task_id": "T1",
    "description": "Create user registration form",
    "is_parallel": false,
    "dependencies": null,
    "mvp": true
  },
  {
    "task_id": "T2",
    "description": "Setup database schema",
    "is_parallel": true,
    "dependencies": null,
    "mvp": true
  }
]
END

✅ Tasks JSON validated successfully!
   Loaded 2 tasks

Where should tasks be saved? (z.B. .specify/tasks/001-feature/tasks.md): .specify/tasks/001-feature/tasks.md

[OK] Tasks saved to: /full/path/to/.specify/tasks/001-feature/tasks.md

============================================================
[OK] Checkcard saved: /path/to/workflow/checkcards/stepF1_checkcard.json

Step: F1
Agent: planner
```

## Testing

Run the validation test:

```bash
cd workflow/scripts
python test_f1_validation.py
```

Tests included:
1. Valid tasks (list)
2. Valid tasks (JSON string)
3. Missing required fields
4. Wrong field types
5. Bad dependencies format
6. Empty list
7. Invalid JSON syntax
8. Not an array (dict instead of list)

## Error Handling

**Max 3 attempts** to provide valid JSON:
- After each failure, user is asked "Try again? (yes/no)"
- If user says "no", skipped with warning
- If max retries reached, proceeds with invalid JSON (for manual review)

**Edge Cases Handled:**
- JSON parse errors with specific line info
- Type mismatches with expected vs actual types
- Missing fields with clear field names
- Malformed dependencies (must be array or null)

## Next Steps

After F1 completes:
- Tasks are saved to specified file path as JSON
- Checkcard records task JSON in outputs
- F2 (orchestrator) can parse tasks.md and insert into database
- Each task auto-gets `phase: "pending"` and `status: "pending"`

## Notes

- The validation is **strict**: All required fields must be present
- Dependencies are optional (can be `null`)
- The script **auto-saves** validated tasks (no separate save step)
- Agents can see validation errors immediately and correct them
- Invalid JSON doesn't block workflow (proceeds with warning)

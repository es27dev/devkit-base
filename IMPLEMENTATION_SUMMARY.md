# F1 Task Validation Implementation Summary

## What Was Implemented

### Core Validation System for F1 Step

A **task JSON validation layer** for the F1 step that:
1. Accepts task JSON from agents (multiline input)
2. Validates structure and field types
3. Returns clear error messages on failure
4. Allows retry loop (up to 3 attempts)
5. Auto-saves validated tasks to file on success

## Changes Made

### 1. Added Validation Schema (`checkcard-cli.py`)

```python
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
```

### 2. Added Validation Function

```python
def validate_task_json(tasks_data):
    """Validate task JSON structure and content."""
    # Returns: (is_valid, errors, validated_tasks)
```

**Validates:**
- JSON parsing
- Array structure
- Required fields
- Field types
- Special rules (dependencies must be null or string[])

### 3. Added Multiline Input Handler

```python
def collect_multiline_json(prompt_text):
    """Collect multiline JSON from user via Ctrl+D or 'END' keyword."""
```

### 4. Updated F1 Step Definition

```python
"F1": {
    ...
    "requires_validation": "task_json",  # NEW FLAG
    "output": {
        "questions": [
            {
                "key": "tasks_json",
                "prompt": "Task JSON Array...",
                "type": "text"
            },
            {
                "key": "task_file_path",
                "prompt": "Where should tasks be saved?",
                "type": "text"
            }
        ]
    }
}
```

### 5. Special F1 Handling in `collect_generic()`

- Detects F1 step with validation flag
- Enters validation loop (up to 3 attempts)
- Shows validation errors with specific field info
- Auto-saves validated tasks to file on success
- Stores validated task list in checkcard outputs

## Example Flow

```
Agent runs: python checkcard-cli.py → Select planner → Select F1 → Select OUTPUT

INPUT phase shows: plan_file_path (from E1)

OUTPUT phase:
1. Prompt for task JSON
2. Agent pastes JSON, presses Ctrl+D
3. Script validates JSON
   - If valid: Shows success, asks where to save, auto-saves file
   - If invalid: Shows errors, offers retry
4. On validation success: Prompts for task_file_path
5. Saves checkcard with validated tasks

Result: stepF1_checkcard.json contains validated tasks array
```

## Validation Example

**Valid Task JSON:**
```json
[
  {
    "task_id": "T1",
    "description": "Create form",
    "is_parallel": false,
    "dependencies": null,
    "mvp": true
  },
  {
    "task_id": "T2",
    "description": "Setup DB",
    "is_parallel": true,
    "dependencies": ["T1"],
    "mvp": true
  }
]
```

**Invalid (Missing field):**
```json
[
  {
    "task_id": "T1",
    "description": "Create form",
    "dependencies": null,
    "mvp": true
    // Missing: is_parallel
  }
]
```

Error: `Task 0 (T1): Missing required field: is_parallel`

**Invalid (Wrong type):**
```json
[
  {
    "task_id": "T1",
    "description": "Create form",
    "is_parallel": "yes",  // Should be boolean
    "dependencies": null,
    "mvp": true
  }
]
```

Error: `Task 0 (T1): Field 'is_parallel': expected <class 'bool'>, got str`

## Testing

Validation system tested with:
- ✅ Valid task lists
- ✅ Missing required fields
- ✅ Wrong field types
- ✅ Malformed dependencies
- ✅ Invalid JSON syntax
- ✅ Non-array input
- ✅ Empty lists

All tests passed.

## Benefits

1. **Data Quality**: Tasks are validated before being saved
2. **Clear Feedback**: Agents see exactly what's wrong and where
3. **Retry Loop**: Agents can fix errors immediately without re-running
4. **Auto-Save**: No separate save step for valid data
5. **Scalable**: Schema can be extended with new fields easily
6. **Safe Fallback**: Script proceeds with warnings if needed (for manual review)

## Files Modified

- `workflow/scripts/checkcard-cli.py` - Added validation functions and F1 handler
- `workflow/scripts/step_definitions.py` - Updated F1 definition with validation flag
- `workflow/checkcards/stepE1_checkcard.json` - Created template for F1 inputs
- `workflow/scripts/test_f1_validation.py` - Created test suite
- `workflow/F1_VALIDATION_GUIDE.md` - Created detailed documentation

## Next Steps (Post-MVP)

1. Extend validation to other steps (currently F1-specific)
2. Add dependency graph validation (ensure referenced tasks exist)
3. Add phase-based validation (check MVP vs Post-MVP structure)
4. Create web UI for task editor with real-time validation

## Architecture Notes

**Why this approach:**
- **Data-driven**: Configuration in step_definitions, not hardcoded
- **Reusable**: `validate_task_json()` can be called from multiple contexts
- **Explicit**: Schema is clear and easily modifiable
- **Graceful degradation**: Script doesn't crash on invalid input
- **Clear messaging**: Errors show exactly what's wrong and where

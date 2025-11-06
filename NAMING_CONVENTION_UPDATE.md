# Naming Convention Update - Step A & E

## Changes Made

### 1. Step A: Combined Output Structure

**Before:**
- checkcard_structure: `"stepA1, stepA2"` (two separate outputs)
- Checkcard contained:
  ```json
  {
    "stepA1": { ... },
    "stepA2": { ... }
  }
  ```

**After:**
- checkcard_structure: `"stepA1"` (single combined output)
- Checkcard contains:
  ```json
  {
    "stepA1": {
      "step_name": "User Request + Orchestrator Dialog",
      "outputs": {
        "user_initial_input": "...",
        "user_approved_stepA2": true,
        "description_of_feature": "...",
        "user_story": "..."
      },
      "tools": { ... }
    }
  }
  ```

**Rationale:**
- A1 and A2 are part of the same orchestrator dialog, not separate steps
- Combining them makes data flow clearer
- Matches A's meta-step nature (like future E)

### 2. Step E1 → E Rename

**Before:**
- Definition key: `"E1"`
- Checkcard file: `stepE1_checkcard.json`
- Checkcard structure: `"stepE1"`
- Agent mapping: `orchestrator: [A, C1, E1]`

**After:**
- Definition key: `"E"`
- Checkcard file: `stepE_checkcard.json`
- Checkcard structure: `"stepE"`
- Agent mapping: `orchestrator: [A, C1, E]`

**Rationale:**
- Aligns with A's naming convention (both are meta-steps)
- Removes numerical suffix inconsistency
- Cleaner naming pattern: A, B1, C1, D1, E, F1

### 3. Updated References

**Files Modified:**
- `workflow/scripts/step_definitions.py`
  - Changed E1 → E
  - Updated checkcard_structure: `"stepE1"` → `"stepE"`
  - Updated F1 input source: `"E1"` → `"E"` and `"stepE1"` → `"stepE"`

- `workflow/scripts/checkcard-cli.py`
  - Updated A step OUTPUT to combine A1+A2 into single stepA1
  - Removed separate stepA2 creation

- `workflow/workflow-mvp.md`
  - Changed `### E1 orchestrator` → `### E orchestrator`

- `workflow/workflow.md`
  - Changed `### E1 orchestrator` → `### E orchestrator`

- `workflow/checkcards/`
  - Created: `stepE_checkcard.json`
  - Deleted: `stepE1_checkcard.json`

## Agent Step Mapping (After Changes)

```
orchestrator:
  - A       (User Request + Orchestrator Dialog)
  - C1      (Clarify Phase)
  - E       (Plan Review Phase)

planner:
  - B1      (Specify Phase)
  - D1      (Plan Phase)
  - F1      (Tasks Phase with validation)
```

## Data Flow Update

```
A (Orchestrator)
  └─ outputs → {user_story, description_of_feature, ...}
      ↓
B1 (Planner)
  ├─ input: A.outputs.user_story
  └─ outputs → {spec_file_path}
      ↓
C1 (Orchestrator)
  ├─ input: B1.outputs.spec_file_path
  └─ outputs → {spec_file_path}
      ↓
D1 (Planner)
  ├─ input: C1.outputs.spec_file_path
  └─ outputs → {plan_file_path, plan_analyze_summary_path, ...}
      ↓
E (Orchestrator)        ← renamed from E1
  ├─ input: D1.outputs
  └─ outputs → {plan_summary_path}
      ↓
F1 (Planner)
  ├─ input: E.outputs.plan_summary_path
  └─ outputs → {tasks_json, task_file_path}
```

## Testing

Run the CLI to verify:
```bash
cd workflow/scripts
python checkcard-cli.py
# Select: orchestrator → A → OUTPUT
# Select: orchestrator → E → INPUT/OUTPUT
# Select: planner → F1 → INPUT/OUTPUT
```

All references should work correctly with new naming.

## Benefits

1. **Naming Clarity**: A and E are both meta-steps (no suffix)
2. **Data Consistency**: A1 output is unified, not split
3. **Easier Maintenance**: Cleaner naming pattern
4. **Better Semantics**: Reflects that A1/A2 are parts of the same dialog, not separate steps

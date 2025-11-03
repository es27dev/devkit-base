# Database Operations: User Request Phase

## Create Operations

### Create: project_functions

**Step**: 1.2 (Orchestrator Initial Dialog)

**Workflow Syntax**:
```
#create@project_functions
- project_id: <from-context>
- name: <from-user-input>
- description: <from-loop-output>
- slug: <generated>
- status_speckit: null
- status_agent: orchestrator
#
```

**Supabase MCP Tool**: `@mcp:supabase.insert_row`

**Parameters**:
```json
{
  "table": "project_functions",
  "schema": "devKit",
  "data": {
    "project_id": "abc-123-xyz",
    "name": "Invoice Generator",
    "description": "Create PDF invoices from form data (customer info, line items)",
    "slug": "invoice-generator",
    "status_speckit": null,
    "status_agent": "orchestrator"
  }
}
```

**Returns**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  ...
}
```

**Checkcard Tracking**:

Record in checkcard `database_operations.create_project_function`:

```json
{
  "database_operations": {
    "create_project_function": {
      "project_id": "abc-123-xyz",
      "name": "Invoice Generator",
      "description": "Create PDF invoices from form data (customer info, line items)",
      "slug": "invoice-generator",
      "status_speckit": null,
      "status_agent": "orchestrator"
    }
  }
}
```

**Note**: Record the `id` returned from insert in checkcard outputs as `function_id`.

## Update Operations

None in this phase.

## Delete Operations

None in this phase.

## Query Operations (Read-Only)

None in this phase.

---

## Database Schema Reference

### Table: project_functions

**Schema**: `devKit`

**Columns**:
- `id` (UUID, PRIMARY KEY) - Auto-generated
- `project_id` (UUID, NOT NULL) - Parent project reference
- `name` (TEXT, NOT NULL) - Function name
- `description` (TEXT) - Function description
- `slug` (TEXT, UNIQUE, NOT NULL) - URL-safe identifier
- `status_speckit` (TEXT) - Current SpecKit workflow step
- `status_agent` (TEXT) - Current responsible agent
- `spec_metadata` (JSONB) - Specification metadata array
- `plan_metadata` (JSONB) - Planning metadata array
- `plan_artifacts_metadata` (JSONB) - Plan artifacts metadata array
- `tasks_metadata` (JSONB) - Tasks metadata array
- `implementation_metadata` (JSONB) - Implementation metadata array
- `created_at` (TIMESTAMPTZ) - Auto-generated
- `updated_at` (TIMESTAMPTZ) - Auto-updated

**Initial State After Phase 1**:
```json
{
  "id": "<uuid>",
  "project_id": "<uuid>",
  "name": "Invoice Generator",
  "description": "Create PDF invoices from form data",
  "slug": "invoice-generator",
  "status_speckit": null,
  "status_agent": "orchestrator",
  "spec_metadata": null,
  "plan_metadata": null,
  "plan_artifacts_metadata": null,
  "tasks_metadata": null,
  "implementation_metadata": null,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

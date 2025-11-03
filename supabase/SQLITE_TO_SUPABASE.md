# SQLite → Supabase Migration Guide

This document tracks technical differences between local SQLite schema and production Supabase PostgreSQL schema.

## Data Type Mappings

### Primary Keys

| SQLite | Supabase (PostgreSQL) |
|--------|----------------------|
| `id TEXT PRIMARY KEY` | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |

**Reason**: PostgreSQL uses UUID for distributed systems, SQLite uses TEXT for simplicity.

---

### Timestamps

| SQLite | Supabase (PostgreSQL) |
|--------|----------------------|
| `created_at TEXT DEFAULT CURRENT_TIMESTAMP` | `created_at TIMESTAMP WITH TIME ZONE DEFAULT now()` |
| `updated_at TEXT DEFAULT CURRENT_TIMESTAMP` | `updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()` |

**Reason**: PostgreSQL has native timestamp types with timezone support, SQLite stores as TEXT (ISO 8601 format).

---

### JSON Data

| SQLite | Supabase (PostgreSQL) |
|--------|----------------------|
| `constitution_file_link TEXT` | `constitution_metadata JSONB` |

**SQLite Workaround**: Store simple file path as TEXT (e.g., `.specify/memory/constitution.md`)

**Supabase Production**: Store rich metadata as JSONB:
```json
{
  "version": "1.0.0",
  "ratified": "2025-11-03",
  "lastAmended": "2025-11-03",
  "filePath": ".specify/memory/constitution.md"
}
```

**Migration Strategy**:
1. Local: Test with simple TEXT field
2. Supabase: Expand to JSONB with full metadata
3. App Layer: Handle both formats (check if string or object)

---

### Boolean Values

| SQLite | Supabase (PostgreSQL) |
|--------|----------------------|
| `INTEGER` (0 or 1) | `BOOLEAN` |

**Example**:
```sql
-- SQLite
has_constitution INTEGER DEFAULT 0

-- Supabase
has_constitution BOOLEAN DEFAULT false
```

---

## INSERT Statement Differences

### UUID Generation

**SQLite**:
```sql
INSERT INTO projects (id, name) VALUES ('devkit-001', 'DevKit Base');
```

**Supabase**:
```sql
INSERT INTO projects (id, name) VALUES (gen_random_uuid(), 'DevKit Base');
-- Or let default handle it:
INSERT INTO projects (name) VALUES ('DevKit Base');
```

---

### JSONB Casting

**Supabase** requires explicit JSONB casting:
```sql
INSERT INTO projects (constitution_metadata) VALUES (
  '{"version": "1.0.0"}'::jsonb  -- Note the ::jsonb cast
);
```

---

## Schema Design Principles

### Local SQLite Strategy
- **Purpose**: Quick prototyping and testing
- **Approach**: Simple, flat structures
- **Trade-offs**: Less type safety, manual JSON parsing

### Supabase PostgreSQL Strategy
- **Purpose**: Production-ready with advanced features
- **Approach**: Rich types (UUID, JSONB, TIMESTAMP WITH TIME ZONE)
- **Benefits**: Type safety, indexing, advanced queries

---

## Testing Workflow

1. **Design locally** in `local-schema.sql` (SQLite)
2. **Test relationships** with simple data types
3. **Convert** to `supabase-schema.sql` (PostgreSQL)
4. **Enhance** with JSONB, proper UUIDs, timestamps
5. **Execute** in Supabase SQL Editor
6. **Document differences** in this file

---

## Current Schema Differences

### `projects` Table

| Field | SQLite | Supabase |
|-------|--------|----------|
| `id` | TEXT | UUID |
| `constitution_file_link` | TEXT (file path only) | `constitution_metadata` JSONB (version, dates, path) |
| `created_at` | TEXT | TIMESTAMP WITH TIME ZONE |
| `updated_at` | TEXT | TIMESTAMP WITH TIME ZONE |

---

## Future Considerations

- **Full-text search**: SQLite FTS5 vs PostgreSQL `tsvector`
- **Arrays**: SQLite (comma-separated TEXT) vs PostgreSQL (native ARRAY type)
- **Enums**: SQLite (CHECK constraint) vs PostgreSQL (ENUM type or CHECK)

---

**Last Updated**: 2025-11-03

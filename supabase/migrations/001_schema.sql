-- Migration 001: Create devKit schema
-- Purpose: Create separate schema for SpecKit workflow data

CREATE SCHEMA IF NOT EXISTS devkit;

-- =====================================================
-- SHARED FUNCTIONS
-- =====================================================

-- Generic trigger function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

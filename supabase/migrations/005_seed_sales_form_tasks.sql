-- Migration 005: Seed Sales Contact Form Phases & Tasks
-- Created: 2025-11-03
-- Purpose: Populate project_function_phases and project_function_phase_tasks from tasks.md

-- =====================================================
-- SEED PROJECT AND FUNCTION (IF NOT EXISTS)
-- =====================================================

-- Insert base-template project if not exists
INSERT INTO devkit.projects (id, name, slug, description, status)
VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'Base Template',
  'base-template',
  'React + Vite + Supabase base template with shadcn/ui',
  'develop'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert 001-sales-form function if not exists
INSERT INTO devkit.project_functions (id, project_id, name, slug, description, status_speckit, status_agent)
VALUES (
  'f0000000-0000-0000-0000-000000000001'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'Sales Contact Form',
  '001-sales-form',
  'Lead contact submission form with client-side validation',
  'tasks',
  'orchestrator'
)
ON CONFLICT (project_id, slug) DO NOTHING;

-- =====================================================
-- INSERT PHASES
-- =====================================================

INSERT INTO devkit.project_function_phases (
  function_id,
  phase_number,
  phase_name,
  phase_goal,
  is_mvp,
  user_story,
  priority,
  status,
  completion_criteria,
  independent_test,
  total_tasks
) VALUES
-- Phase 1: Setup & Infrastructure (MVP)
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  1,
  'Setup & Infrastructure',
  'Prepare project structure and dependencies',
  true, -- MVP Phase
  NULL, -- No user story for setup phase
  NULL,
  'pending',
  'Directory structure exists, Sonner configured, shadcn/ui components available',
  NULL,
  3 -- T001, T002, T003
),

-- Phase 2: User Story 1 - Lead Contact Submission (MVP)
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  2,
  'User Story 1 - Lead Contact Submission',
  'Core MVP - User can submit contact form with validation and success feedback',
  true, -- MVP Phase
  'US1',
  'P1',
  'pending',
  'US1 acceptance scenarios pass, form submits successfully with mock handler',
  'Navigate to /sales, fill all fields, click "Absenden". Success toast appears, form resets.',
  9 -- T004-T012
),

-- Phase 3: User Story 2 - Client-Side Validation (POST-MVP)
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  3,
  'User Story 2 - Client-Side Validation',
  'Improve UX with immediate validation feedback',
  false, -- Not MVP
  'US2',
  'P2',
  'pending',
  'All validation errors display correctly, phone formatting works, character counter visible',
  'Enter invalid email test@, blur field. Error "Bitte gültige Email-Adresse eingeben" appears.',
  4 -- T013-T016
),

-- Phase 4: User Story 3 - Loading State During Submission (POST-MVP)
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  4,
  'User Story 3 - Loading State During Submission',
  'Prevent double-submissions with visual feedback',
  false, -- Not MVP
  'US3',
  'P3',
  'pending',
  'Loading state works, double-submissions prevented',
  'Fill form, click "Absenden". Button shows "Wird gesendet..." and is disabled during submission.',
  3 -- T017-T019
);

-- =====================================================
-- INSERT TASKS
-- =====================================================

-- Phase 1 Tasks (Setup & Infrastructure)

INSERT INTO devkit.project_function_phase_tasks (
  function_id,
  phase_id,
  task_id,
  title,
  description,
  phase_number,
  user_story,
  priority,
  is_parallelizable,
  file_path,
  region_hint,
  operation_type,
  status,
  depends_on,
  blocks
) VALUES
-- T001
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 1),
  'T001',
  'Verify shadcn/ui components installed',
  'Verify shadcn/ui components installed (form, input, textarea, button, sonner)',
  1,
  NULL,
  NULL,
  false,
  NULL,
  NULL,
  NULL,
  'pending',
  NULL,
  ARRAY['T002', 'T003']
),

-- T002
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 1),
  'T002',
  'Add Sonner Toaster to src/main.tsx root layout',
  '[P] Add Sonner Toaster to src/main.tsx root layout',
  1,
  NULL,
  NULL,
  true, -- Parallelizable
  'src/main.tsx',
  NULL,
  'modify',
  'pending',
  ARRAY['T001'],
  NULL
),

-- T003
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 1),
  'T003',
  'Create feature directory structure',
  '[P] Create feature directory structure src/components/features/salesContactForm/',
  1,
  NULL,
  NULL,
  true, -- Parallelizable
  'src/components/features/salesContactForm/',
  NULL,
  'create',
  'pending',
  ARRAY['T001'],
  NULL
);

-- Phase 2 Tasks (User Story 1)

INSERT INTO devkit.project_function_phase_tasks (
  function_id,
  phase_id,
  task_id,
  title,
  description,
  phase_number,
  user_story,
  priority,
  is_parallelizable,
  file_path,
  region_hint,
  operation_type,
  status,
  depends_on,
  blocks
) VALUES
-- T004
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 2),
  'T004',
  'Create Zod validation schema',
  '[P] [US1] Create Zod validation schema in src/components/features/salesContactForm/sales-contact-form.tsx (Region 2: Constants)',
  2,
  'US1',
  'P1',
  true, -- Parallelizable
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  'Region 2: Constants',
  'create',
  'pending',
  NULL,
  NULL
),

-- T005
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 2),
  'T005',
  'Create German translations file',
  '[P] [US1] Create German translations file src/components/features/salesContactForm/i18n/locales/de.json',
  2,
  'US1',
  'P1',
  true, -- Parallelizable
  'src/components/features/salesContactForm/i18n/locales/de.json',
  NULL,
  'create',
  'pending',
  NULL,
  NULL
),

-- T006
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 2),
  'T006',
  'Implement mock submission handler function',
  '[P] [US1] Implement mock submission handler function in src/components/features/salesContactForm/sales-contact-form.tsx (Region 4: Helper Functions)',
  2,
  'US1',
  'P1',
  true, -- Parallelizable
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  'Region 4: Helper Functions',
  'create',
  'pending',
  NULL,
  NULL
),

-- T007
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 2),
  'T007',
  'Implement SalesContactForm component with 7 Regions Pattern',
  '[US1] Implement SalesContactForm component with 7 Regions Pattern in src/components/features/salesContactForm/sales-contact-form.tsx',
  2,
  'US1',
  'P1',
  false,
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  NULL,
  'create',
  'pending',
  ARRAY['T004', 'T005', 'T006'],
  NULL
),

-- T008
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 2),
  'T008',
  'Configure useForm hook with zodResolver',
  '[US1] Configure useForm hook with zodResolver and onBlur mode in src/components/features/salesContactForm/sales-contact-form.tsx (Region 3: Hooks)',
  2,
  'US1',
  'P1',
  false,
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  'Region 3: Hooks',
  'modify',
  'pending',
  ARRAY['T007'],
  NULL
),

-- T009
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 2),
  'T009',
  'Implement form JSX',
  '[US1] Implement form JSX with Form, Input, Textarea, Button components in src/components/features/salesContactForm/sales-contact-form.tsx (Region 7: JSX)',
  2,
  'US1',
  'P1',
  false,
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  'Region 7: JSX',
  'modify',
  'pending',
  ARRAY['T008'],
  NULL
),

-- T010
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 2),
  'T010',
  'Implement submission handler with toast',
  '[US1] Implement submission handler with toast.success and form reset in src/components/features/salesContactForm/sales-contact-form.tsx (Region 6: Event Handlers)',
  2,
  'US1',
  'P1',
  false,
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  'Region 6: Event Handlers',
  'modify',
  'pending',
  ARRAY['T009'],
  NULL
),

-- T011
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 2),
  'T011',
  'Create barrel export file',
  '[US1] Create barrel export file src/components/features/salesContactForm/sales-contact-form.ts',
  2,
  'US1',
  'P1',
  false,
  'src/components/features/salesContactForm/sales-contact-form.ts',
  NULL,
  'create',
  'pending',
  ARRAY['T007'],
  NULL
),

-- T012
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 2),
  'T012',
  'Integrate SalesContactForm into Sales page',
  '[US1] Integrate SalesContactForm into src/pages/Sales.tsx',
  2,
  'US1',
  'P1',
  false,
  'src/pages/Sales.tsx',
  NULL,
  'modify',
  'pending',
  ARRAY['T011'],
  NULL
);

-- Phase 3 Tasks (User Story 2)

INSERT INTO devkit.project_function_phase_tasks (
  function_id,
  phase_id,
  task_id,
  title,
  description,
  phase_number,
  user_story,
  priority,
  is_parallelizable,
  file_path,
  region_hint,
  operation_type,
  status,
  depends_on,
  blocks
) VALUES
-- T013
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 3),
  'T013',
  'Add phone auto-formatting helper function',
  '[P] [US2] Add phone auto-formatting helper function formatPhoneNumber in src/components/features/salesContactForm/sales-contact-form.tsx (Region 4: Helper Functions)',
  3,
  'US2',
  'P2',
  true, -- Parallelizable
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  'Region 4: Helper Functions',
  'modify',
  'pending',
  NULL,
  NULL
),

-- T014
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 3),
  'T014',
  'Wrap phone field with Controller component',
  '[US2] Wrap phone field with Controller component for auto-formatting in src/components/features/salesContactForm/sales-contact-form.tsx (Region 7: JSX)',
  3,
  'US2',
  'P2',
  false,
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  'Region 7: JSX',
  'modify',
  'pending',
  ARRAY['T013'],
  NULL
),

-- T015
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 3),
  'T015',
  'Add character counter for message field',
  '[P] [US2] Add character counter for message field using watch() in src/components/features/salesContactForm/sales-contact-form.tsx (Region 3: Hooks + Region 7: JSX)',
  3,
  'US2',
  'P2',
  true, -- Parallelizable
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  'Region 3: Hooks + Region 7: JSX',
  'modify',
  'pending',
  NULL,
  NULL
),

-- T016
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 3),
  'T016',
  'Add error handling with toast.error',
  '[US2] Add error handling with toast.error for network failures in src/components/features/salesContactForm/sales-contact-form.tsx (Region 6: Event Handlers)',
  3,
  'US2',
  'P2',
  false,
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  'Region 6: Event Handlers',
  'modify',
  'pending',
  NULL,
  NULL
);

-- Phase 4 Tasks (User Story 3)

INSERT INTO devkit.project_function_phase_tasks (
  function_id,
  phase_id,
  task_id,
  title,
  description,
  phase_number,
  user_story,
  priority,
  is_parallelizable,
  file_path,
  region_hint,
  operation_type,
  status,
  depends_on,
  blocks
) VALUES
-- T017
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 4),
  'T017',
  'Add isSubmitting check to Button component',
  '[P] [US3] Add isSubmitting check to Button component in src/components/features/salesContactForm/sales-contact-form.tsx (Region 7: JSX)',
  4,
  'US3',
  'P3',
  true, -- Parallelizable
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  'Region 7: JSX',
  'modify',
  'pending',
  NULL,
  NULL
),

-- T018
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 4),
  'T018',
  'Update Button text based on isSubmitting state',
  '[US3] Update Button text based on isSubmitting state in src/components/features/salesContactForm/sales-contact-form.tsx (Region 7: JSX)',
  4,
  'US3',
  'P3',
  false,
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  'Region 7: JSX',
  'modify',
  'pending',
  ARRAY['T017'],
  NULL
),

-- T019
(
  'f0000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM devkit.project_function_phases WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid AND phase_number = 4),
  'T019',
  'Verify 800ms artificial delay in mock handler',
  '[US3] Verify 800ms artificial delay in mock handler for testing in src/components/features/salesContactForm/sales-contact-form.tsx (Region 4: Helper Functions)',
  4,
  'US3',
  'P3',
  false,
  'src/components/features/salesContactForm/sales-contact-form.tsx',
  'Region 4: Helper Functions',
  'modify',
  'pending',
  NULL,
  NULL
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify phases inserted
-- SELECT phase_number, phase_name, is_mvp, total_tasks
-- FROM devkit.project_function_phases
-- WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid
-- ORDER BY phase_number;

-- Verify tasks inserted
-- SELECT task_id, title, phase_number, user_story, priority, is_parallelizable
-- FROM devkit.project_function_phase_tasks
-- WHERE function_id = 'f0000000-0000-0000-0000-000000000001'::uuid
-- ORDER BY phase_number, task_id;

-- Count tasks by phase
-- SELECT p.phase_number, p.phase_name, COUNT(t.id) as task_count
-- FROM devkit.project_function_phases p
-- LEFT JOIN devkit.project_function_phase_tasks t ON t.phase_id = p.id
-- WHERE p.function_id = 'f0000000-0000-0000-0000-000000000001'::uuid
-- GROUP BY p.phase_number, p.phase_name
-- ORDER BY p.phase_number;

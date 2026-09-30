-- =============================================================================
-- SMART AUTOMATION WEB APPLICATION - DEVELOPMENT SEED DATA
-- Default password for all seed accounts: Password123!
-- =============================================================================

-- 1. SEED USERS
INSERT INTO users (id, name, email, password_hash, role, department, is_active)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin User', 'admin@smartautomation.local', '$2b$10$OGvprA4f/MdbL.aZJqAYcuo/kO9Zn3JZhRjigO3zt1bCxvX3Tfpqi', 'admin', 'IT & Systems', true),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Sarah Manager', 'manager@smartautomation.local', '$2b$10$OGvprA4f/MdbL.aZJqAYcuo/kO9Zn3JZhRjigO3zt1bCxvX3Tfpqi', 'manager', 'Operations', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'David Approver', 'approver@smartautomation.local', '$2b$10$OGvprA4f/MdbL.aZJqAYcuo/kO9Zn3JZhRjigO3zt1bCxvX3Tfpqi', 'approver', 'Finance', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Alex Employee', 'employee@smartautomation.local', '$2b$10$OGvprA4f/MdbL.aZJqAYcuo/kO9Zn3JZhRjigO3zt1bCxvX3Tfpqi', 'employee', 'Engineering', true)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  department = EXCLUDED.department;

-- 2. SEED SAMPLE WORKFLOW: Expense Reimbursement
INSERT INTO workflows (id, name, description, created_by, status, template_config)
VALUES (
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  '💰 Expense Reimbursement',
  'Automated multi-step approval workflow for employee business travel, meals, and hardware expenses.',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'active',
  '{
    "fields": [
      { "id": "f_title", "label": "Expense Title", "type": "text", "required": true },
      { "id": "f_amount", "label": "Amount ($)", "type": "number", "required": true },
      { "id": "f_category", "label": "Expense Category", "type": "dropdown", "options": ["Travel", "Meals", "Software", "Equipment"], "required": true },
      { "id": "f_date", "label": "Expense Date", "type": "date", "required": true },
      { "id": "f_receipt", "label": "Receipt Attached", "type": "checkbox", "required": false },
      { "id": "f_notes", "label": "Business Justification", "type": "textarea", "required": false }
    ],
    "steps": [
      { "stepNumber": 1, "name": "Manager Review", "approverRole": "manager" },
      { "stepNumber": 2, "name": "Finance Approval", "approverRole": "approver" }
    ],
    "autoApprovalRules": {
      "enabled": true,
      "maxAmount": 100,
      "condition": "amount <= 100 AND receipt_attached == true"
    }
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED SAMPLE TASK
INSERT INTO tasks (id, workflow_id, title, description, assigned_to, created_by, status, priority, due_date, metadata)
VALUES (
  'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  'Tech Conference 2026 Travel Reimbursement',
  'Reimbursement request for flight ticket and accommodation during Tech Summit.',
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'pending',
  'high',
  now() + INTERVAL '3 days',
  '{
    "f_title": "Tech Conference 2026 Travel Reimbursement",
    "f_amount": 450,
    "f_category": "Travel",
    "f_date": "2026-09-25",
    "f_receipt": true,
    "f_notes": "Flight ticket and 2 nights hotel accommodation"
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED SAMPLE APPROVAL
INSERT INTO approvals (id, workflow_id, task_id, approver_id, step_number, status, comments)
VALUES (
  '11eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  1,
  'pending',
  'Awaiting finance department manager sign-off'
)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED SAMPLE NOTIFICATION
INSERT INTO notifications (id, user_id, title, message, type, is_read, link)
VALUES (
  '22eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'New Approval Request',
  'Alex Employee submitted "Tech Conference 2026 Travel Reimbursement" for your approval.',
  'approval_required',
  false,
  '/approvals'
)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED SAMPLE AUDIT LOG
INSERT INTO audit_logs (id, user_id, action, resource, resource_id, metadata)
VALUES (
  '33eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
  'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'TASK_SUBMITTED',
  'tasks',
  'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
  '{"workflow_name": "Expense Reimbursement", "amount": 450}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

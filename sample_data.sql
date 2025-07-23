
-- Projects
INSERT INTO projects (
    title, description, status, color, client_name, billing_type,
    is_billable, hourly_rate, fixed_rate, currency, deadline,
    started_at, completed_at
)
VALUES
( 'General', 'Project to add any General Tasks', 'Active', '#FF5733', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
( 'TimeTracker Pro', 'Time tracking desktop app for freelancers', 'Active', '#FF5733', 'Internal', 'Hourly', 1, 20, NULL, 'USD', '2025-07-01', '2025-05-01', NULL),
( 'Ecom Dashboard', 'Admin dashboard for ecommerce analytics', 'Active', '#33A1FF', 'ShopX', 'Fixed', 1, NULL, 3000, 'USD', '2025-08-01', '2025-05-10', NULL),
( 'Client Portal', 'Portal for client reports and communications', 'Paused', '#A833FF', 'BizCorp', 'Hourly', 1, 25, NULL, 'USD', '2025-06-30', '2025-04-15', NULL),
( 'Landing Page Redesign', 'Marketing landing page revamp', 'Completed', '#33FF99', 'WebFlowz', NULL, 0, NULL, 800, 'USD', '2025-03-31', '2025-03-01', '2025-03-30'),
( 'Inventory System', 'Full inventory + billing management system', 'Active', '#FFBD33', 'RetailMart', 'Hourly', 1, 30, NULL, 'USD', '2025-07-15', '2025-04-01', NULL),
( 'Fitness App API', 'Backend for mobile fitness tracking app', 'Active', '#FF33A6', 'Fitify', 'Fixed', 1, NULL, 5000, 'USD', '2025-08-20', '2025-05-20', NULL),
( 'HRMS UI', 'UI overhaul for HR management system', 'Paused', '#33FFF3', 'HRPro', 'Hourly', 1, 18, NULL, 'USD', '2025-05-01', '2025-02-10', NULL),
( 'Blog Engine', 'CMS-style markdown blog engine', 'Completed', '#FF8C33', 'Contento', 'Fixed', 0, NULL, 1200, 'USD', '2025-02-10', '2025-01-01', '2025-02-08'),
( 'Portfolio Website', 'Personal portfolio with blog and contact form', 'Active', '#C70039', 'Self', NULL, 0, NULL, NULL, 'USD', NULL, '2025-06-01', NULL),
( 'AI Resume Builder', 'Resume generator using GPT', 'Active', '#4CAF50', 'ResumeBoost', 'Hourly', 1, 35, NULL, 'USD', '2025-09-01', '2025-06-10', NULL);

INSERT INTO tasks (
    title, description, priority,
    status, project_id, estimated_time,
    deadline, started_at, completed_at
)
VALUES
( 'Setup DB Schema', 'Initial schema design and migrations', 'High', 'In Progress', 1, 14400, '2025-05-10', '2025-05-01', NULL),
( 'Design Dashboard UI', 'UI for ecom analytics widgets', 'Medium', 'Planning', 2, 10800, '2025-07-01', '2025-06-01', NULL),
( 'Integrate JWT Auth', 'Login and token-based auth', 'High', 'Completed', 3, 7200, '2025-05-15', '2025-05-05', '2025-05-10'),
( 'Setup Tailwind', 'Tailwind with custom theme config', 'Low', 'Completed', 4, 3600, '2025-03-10', '2025-03-02', '2025-03-03'),
( 'Add Product CRUD', 'CRUD ops for inventory', 'High', 'In Progress', 5, 14400, '2025-06-15', '2025-06-05', NULL),
( 'Create Workout API', 'Add workout logging endpoints', 'Medium', 'Planning', 6, 10800, '2025-07-15', '2025-06-20', NULL),
( 'Update Leave UI', 'Employee leave request UI update', 'Low', 'Paused', 7, 7200, '2025-05-01', '2025-03-15', NULL),
( 'Add Markdown Parser', 'Custom markdown rendering logic', 'Medium', 'Completed', 8, 5400, '2025-01-30', '2025-01-10', '2025-01-28'),
( 'Contact Form Backend', 'Send email + spam filter', 'High', 'In Progress', 9, 7200, '2025-06-20', '2025-06-05', NULL),
( 'PDF Resume Export', 'PDF export with template switching', 'High', 'Planning', 10, 10800, '2025-08-01', '2025-06-12', NULL);


-- Sessions
INSERT INTO sessions (
    title, description, project_id, task_id,
    date, start_time, end_time,
    session_duration_sec, break_duration_sec
)
VALUES
( 'Planning Session', 'Initial planning and sprint breakdown', 1, 2, '2025-06-01 00:00:00', '2025-06-01 09:00:00', '2025-06-01 10:30:00', 5400, 300),
( 'UI Design', 'Wireframing homepage UI', 2, 3, '2025-06-01 00:00:00', '2025-06-01 10:45:00', '2025-06-01 12:15:00', 5400, 600),
( 'Database Schema', 'Setup DB schema and tables', 3, 1, '2025-06-02 00:00:00', '2025-06-02 11:00:00', '2025-06-02 13:00:00', 7200, 900),
( 'Bug Fixes', 'Resolved API failures', 1, 6, '2025-06-02 00:00:00', '2025-06-02 14:00:00', '2025-06-02 15:30:00', 5400, 300),
( 'Refactoring', 'Cleaned up routes and controllers', 4, 7, '2025-06-03 00:00:00', '2025-06-03 09:30:00', '2025-06-03 11:00:00', 5400, 600),
( 'Testing', 'Unit and integration tests', 3, 5, '2025-06-03 00:00:00', '2025-06-03 11:30:00', '2025-06-03 13:00:00', 5400, 300),
( 'Code Review', 'Reviewed PRs', 2, 4, '2025-06-04 00:00:00', '2025-06-04 14:00:00', '2025-06-04 15:30:00', 5400, 300),
( 'Deployment', 'Deployed v1.0 to staging', 5, 8, '2025-06-04 00:00:00', '2025-06-04 16:00:00', '2025-06-04 17:30:00', 5400, 0),
( 'Documentation', 'Wrote README and API docs', 4, 9, '2025-06-05 00:00:00', '2025-06-05 10:00:00', '2025-06-05 12:00:00', 7200, 600),
( 'Debugging', 'Memory leak in backend service', 1, 10, '2025-06-05 00:00:00', '2025-06-05 13:00:00', '2025-06-05 14:30:00', 5400, 300),
( 'Sprint Retro', 'Sprint 12 retrospective', 3, 2, '2025-06-06 00:00:00', '2025-06-06 09:00:00', '2025-06-06 10:00:00', 3600, 0),
( 'Team Meeting', 'Discuss Q3 Roadmap', 5, 1, '2025-06-06 00:00:00', '2025-06-06 10:30:00', '2025-06-06 11:30:00', 3600, 0),
( 'Feature Dev', 'Implemented login via OTP', 2, 3, '2025-06-07 00:00:00', '2025-06-07 13:00:00', '2025-06-07 15:00:00', 7200, 600),
( 'Design Review', 'Feedback on new UI elements', 1, 4, '2025-06-07 00:00:00', '2025-06-07 15:30:00', '2025-06-07 17:00:00', 5400, 300),
( 'Analytics Setup', 'GA + Mixpanel integration', 5, 5, '2025-06-08 00:00:00', '2025-06-08 10:00:00', '2025-06-08 11:30:00', 5400, 300),
( 'Migration', 'Moved data from legacy system', 4, 6, '2025-06-08 00:00:00', '2025-06-08 12:00:00', '2025-06-08 13:30:00', 5400, 300),
( 'Security Audit', 'Checked OWASP checklist', 3, 7, '2025-06-09 00:00:00', '2025-06-09 14:00:00', '2025-06-09 15:30:00', 5400, 0),
( 'Hotfix', 'Production issue fix', 2, 8, '2025-06-09 00:00:00', '2025-06-09 16:00:00', '2025-06-09 17:00:00', 3600, 0),
( 'Sprint Planning', 'Next sprint task planning', 1, 9, '2025-06-10 00:00:00', '2025-06-10 09:00:00', '2025-06-10 10:30:00', 5400, 300),
( 'Research', 'Explored WebGPU rendering', 3, 10, '2025-06-10 00:00:00', '2025-06-10 11:00:00', '2025-06-10 12:30:00', 5400, 300),
( 'Daily Standup', 'Routine updates', 4, 1, '2025-06-11 00:00:00', '2025-06-11 09:30:00', '2025-06-11 10:00:00', 1800, 0),
( 'UI Polish', 'Added animations and responsiveness', 5, 2, '2025-06-11 00:00:00', '2025-06-11 10:30:00', '2025-06-11 12:00:00', 5400, 300),
( 'Feature Test', 'Tested new onboarding flow', 2, 3, '2025-06-12 00:00:00', '2025-06-12 13:00:00', '2025-06-12 14:30:00', 5400, 300),
( 'Backend Ops', 'Worker cronjobs optimization', 1, 4, '2025-06-12 00:00:00', '2025-06-12 15:00:00', '2025-06-12 16:30:00', 5400, 300),
( 'Cleanup', 'Deleted obsolete data, improved indexes', 3, 5, '2025-06-13 00:00:00', '2025-06-13 10:00:00', '2025-06-13 11:30:00', 5400, 300);

-- Tags
INSERT INTO tags (title, description, color)
VALUES
('Deep Work', 'Focused, distraction-free work block', '#FF5733'),
('Meeting', 'Team or client meeting', '#33A1FF'),
('Exercise', 'Workout or physical activity', '#28A745'),
('Learning', 'Time spent studying or learning something new', '#FFC107'),
('Break', 'Short rest or leisure time', '#6C757D'),
('Coding', 'Software development work', '#6610f2'),
('Reading', 'Reading books or articles', '#e83e8c'),
('Writing', 'Writing content, blogs, or documentation', '#20c997'),
('Planning', 'Sprint or daily planning sessions', '#fd7e14'),
('Review', 'Code review or project evaluation', '#17a2b8');


INSERT INTO sessions_tags (session_id, tag_id) VALUES
(1, 2), (1, 5), (1, 7),
(2, 1), (2, 3), (2, 8), (2, 9),
(3, 4), (3, 6), (3, 2),
(4, 1), (4, 3), (4, 10),
(5, 2), (5, 5),
(6, 3), (6, 7), (6, 8), (6, 10),
(7, 4), (7, 6), (7, 9),
(8, 1), (8, 2), (8, 3), (8, 4),
(9, 5), (9, 6),
(10, 3), (10, 7), (10, 9),
(11, 1), (11, 4),
(12, 2), (12, 8), (12, 10),
(13, 3), (13, 5), (13, 6), (13, 9),
(14, 1), (14, 2),
(15, 4), (15, 7), (15, 8),
(16, 5), (16, 6), (16, 10),
(17, 1), (17, 3), (17, 4),
(18, 2), (18, 8), (18, 9),
(19, 6), (19, 7),
(20, 1), (20, 5), (20, 10),
(21, 3), (21, 4),
(22, 2), (22, 6), (22, 9),
(23, 1), (23, 3), (23, 5), (23, 8),
(24, 4), (24, 7), (24, 10),
(25, 2), (25, 6);

INSERT INTO tasks_tags (task_id, tag_id) VALUES
(1, 2), (1, 5), (1, 8),
(2, 1), (2, 3), (2, 6), (2, 9),
(3, 4), (3, 7), (3, 10),
(4, 1), (4, 2), (4, 6),
(5, 3), (5, 5),
(6, 2), (6, 4), (6, 9),
(7, 1), (7, 8), (7, 10), (7, 6),
(8, 3), (8, 5), (8, 7),
(9, 4), (9, 6),
(10, 2), (10, 7), (10, 9), (10, 10);


INSERT INTO projects_tags (project_id, tag_id) VALUES
(1, 2), (1, 4), (1, 7),
(2, 1), (2, 3), (2, 6),
(3, 5), (3, 8), (3, 9), (3, 10),
(4, 2), (4, 4), (4, 6),
(5, 1), (5, 5),
(6, 3), (6, 7), (6, 8), (6, 10),
(7, 2), (7, 4), (7, 9),
(8, 1), (8, 6), (8, 7),
(9, 3), (9, 5),
(10, 2), (10, 8), (10, 10);

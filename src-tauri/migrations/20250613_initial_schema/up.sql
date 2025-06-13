-- Create Enums (optional for SQLite, handled in code)

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT,

  client_name TEXT,
  status TEXT DEFAULT 'Active', -- 'Active', 'Completed', 'On Hold', 'Cancelled'

  started_at TEXT,
  deadline TEXT,
  completed_at TEXT,

  is_billable BOOLEAN,
  billing_type TEXT, -- 'Hourly' or 'Fixed'
  hourly_rate INTEGER,
  fixed_rate INTEGER,
  currency TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CHECK (
    -- If isBillable is true, billingType must not be null
    (is_billable IS NOT 1) OR (billing_type IS NOT NULL)
  ),

  CHECK (
    -- If billingType is 'Hourly', hourlyRate must exist, fixedRate must be null
    -- If billingType is 'Fixed', fixedRate must exist, hourlyRate must be null
    (billing_type IS NULL) OR (
      (billing_type = 'Hourly' AND hourly_rate IS NOT NULL AND fixed_rate IS NULL) OR
      (billing_type = 'Fixed' AND fixed_rate IS NOT NULL AND hourly_rate IS NULL)
    )
  )
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT,
  project_id INTEGER,
  status TEXT DEFAULT 'Planning', -- Planning, In Progress, Completed, Cancelled, 'On Hold'
  priority TEXT DEFAULT 'Low', -- Low, Medium, High, Urgent
  deadline TEXT,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  estimated_time INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  project_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  start_time TEXT NOT NULL,
  end_time TEXT,
  session_duration_sec INTEGER NOT NULL DEFAULT 0,
  break_duration_sec INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Create pivot tables
CREATE TABLE IF NOT EXISTS sessions_tags (
  session_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (session_id, tag_id),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects_tags (
  project_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (project_id, tag_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks_tags (
  task_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (task_id, tag_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Pomodoro settings table
CREATE TABLE IF NOT EXISTS pomodoro_settings (
  duration INTEGER,
  session_duration INTEGER,
  session_count INTEGER,
  break_duration INTEGER,
  auto_start BOOLEAN,
  sync_with_time_tracking BOOLEAN
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  theme TEXT,
  date_format TEXT,
  time_format TEXT
);

# 🧠 Product Requirements Document: Time Tracking & Productivity App

---

## 1. Time Management

### 1.1 View Sessions
- Display all recorded sessions.
- Support multiple views: **Daily**, **Weekly**, **Monthly**, **Yearly**, and **Custom Date Range**.
- Enable filtering by **Project**, **Task**, and **Tags**.

### 1.2 Add / Update Session
- Each session **must** be linked to a **Project** and a **Task**.
- Optional fields:
  - `Title`
  - `Description`
- Mandatory fields:
  - `Start Time`
  - `End Time`
  - `Duration`
  - `Break`
- Time logic:
  - `Start Time + Duration + Break = End Time`
  - If `Start` and `End` are given, auto-calculate `Duration` and `Break`.
- Date and Time format customization:
  - Default date: `DD/MM/YYYY`
  - Default time: `HH:mm A`
- Sessions must **not overlap** with existing sessions.

### 1.3 Timer Functionality
- **Start** button creates a new session with `End Time = null`.
- While running:
  - **Pause**: pauses duration tracking, starts break timer in background.
  - **Resume**: resumes duration tracking, stops break timer.
- **Stop**: ends session and sets final `End Time`.

> Example:  
> Timer starts at 11:00 AM → Paused at 11:40 AM → Resumed at 11:45 AM  
> Result: `Duration = 40 mins`, `Break = 5 mins`

---

## 2. Project Management

### 2.1 Projects
- Displayed as **tabs**. Clicking a project shows its tasks.
- Task view is **Kanban-style**, showing tasks by state.
- Task states: `Planning`, `In Progress`, `Paused`, `Completed`
- Tasks are draggable between states.
- Project fields:
  - `Billing Type`: `Fixed` or `Hourly`
  - `Customer Name`
  - `Rate`
  - `Currency`
- Billing logic:
  - `Fixed`: `Rate = Total Project Amount`
  - `Hourly`: `Rate = Hourly Charge`
- A `+` icon allows adding new projects.

### 2.2 Tasks
- Each task has a state (`Planning`, `In Progress`, `Paused`, `Completed`).
- Each column (state) has a `+` icon to add tasks.
- Clicking a task opens a **modal** to edit.
  - Includes a free-form **brainstorming area** for notes/ideas.

---

## 3. Analytics

### 3.1 Visual Reports
- Time breakdown by **Project**, **Task**, and **Tags**
- View options:
  - `Bar Chart`
  - `Pie Chart`
- Date range filter for refined analysis

### 3.2 Data Export
- Export formats:
  - `CSV`
  - `Excel`
  - `PDF`
- Option to generate **invoices** based on time tracked and billing info.

---

## 4. Cloud Sync

- Integrate with cloud storage:
  - `Google Drive`
  - `OneDrive`
  - (Other providers in future)
- Manual `Sync` button uploads latest data to the connected drive.

---

## 5. Pomodoro Timer

- Customizable:
  - `Session Duration`
  - `Break Duration`
  - `Number of Cycles`
- Optionally sync with time tracking system for auto session creation.

---

## 6. App Settings

- Customizable user preferences:
  - `Theme` (Light / Dark)
  - `Date Format`
  - `Time Format`

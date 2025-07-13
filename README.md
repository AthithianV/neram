# Neram

### Libraries

1. Tailwindcss 4
2. Radix UI
3. zustand
4. date-fns
5. clsx
6. lucide-react (icon)
7. shadcn
8. Tanstack Query
9. React Hook Form
10. Zod

# Features

## 1. Time Management

### 1.1 Show all Sessions.

- Show all Sessions.
- Show Session in a Day, Week,Month, Year and Range.
- Able to filter based on project, task and Tags.

### 1.2 Add/Update New Session.

- Every Session will be associated with a Project and a Task. Cannot Create a session unless a project and a task is selected.
- Title and Description is Optional.
- Start Time, End Time, Duration and Break is Mandatory.
- Start Time and End Time will be used to calculate the Duration and Break. Duration and Break will be used to calculate the End Time.
- User can choose the format of Date and Time. By default date has `DD/MM/YYYY` and Time has `HH:mm A` format.
- The Start and End time should not interfere with any other session.

### 1.3 Timer

- A Start button will be given to start a timer which create new session with end time as null.
- When the timer is running there will be Pause and Stop Button.
- Pause Button will pause the duration timer but will start break timer in background.
  **For Example:** If user start timer at 11:00 AM and pause it on 11:40 AM, then at 11:45 AM user will resume the timer. The duration will be 40 minutes and break will be 5 minutes.
- Stop Button will stop the timer and end time will be.

## 2. Project Management.

### 2.1 Project

- All Project will be show in Tabs. On clicking project tab, all tasks of project will be displayed.
- Each Project will display task in Kanban style, displaying different state of each task.
- User can drag the task to change the state of the task.
- Project will have fields like Billing type, Customer name, rate, currency which will be useful for Freelancer to generate invoices.
- Billing type will be `Fixed` or `Hourly`.
- If Billing type is `Fixed`, then rate will be the total amount of the project.
- If Billing type is `Hourly`, then rate will be the rate of the project.
- A plus icon at the end of all project will allow user to add new project.

### 2.2 Task

- Each Task will have a state. The state will be `Planning`, `In Progress`, `Paused` and `Completed`.
- Task list in each state will have plus icon. On clicking plus icon, user will be able to add new task.
- On clicking a task and pop up will open to update task.
- Pop up will have a text area where user can Brain strom ideas about the task.

## Analytics

### 3.1 Graph

- User can view the time spent on each task, project and tags in a Bar or Pie Chart.
- User can filter the Date Range.

### 3.2 Exports

- User can export the data in CSV, Excel and PDF format.
- User can generate a invoice.

## 4. Sync

- User can set up google Drive, one drive etc.
- User can hit sync button and all data will be stored in the Drive.

## 5. Pomodoro

- User can set up duration and count for session and break.
- Pomodoro timer can be in sync with the session Management.

## 6. Settings

- User can update theme, Date and Time Format.

# To-Dos

[] Must Allow use to add or Update Session without project or Task.
[] Complete all CRUD methods for Project.
[] Finish the Add New Project and Update Project Form.
[] Complete all CRUD methods for Task.
[] Finish add and Update Task form.
[] Complete all CRUD methods for Tags.
[] Finish add and Update Tags form.

# Colors

```
#100d28
#ff00e2
```

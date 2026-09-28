# Daily Planner AI — Stage 2 Implementation Prompt

You are continuing development of **Daily Planner AI**, a production-ready Android planner app.

## Project Context

Stack:

- Ionic
- Capacitor
- HTML
- CSS
- JavaScript
- SQLite/local persistent storage
- Android native capabilities through Capacitor
- Groq will be the initial AI provider later

Stage 0 established the foundation and architecture.

Stage 1 established the UI shell and design system.

You are now implementing **Stage 2 only: Local Task System**.

---

# CORE RULE

Follow:

**PLAN → IMPLEMENT → TEST → FIX → VERIFY → DOCUMENT → STAGE COMPLETE**

Do not skip verification.

Do not move to Stage 3 automatically.

Do not rewrite working Stage 0/1 functionality unnecessarily.

Prefer small, isolated changes.

---

# STAGE 2 GOAL

Make the task system real and completely local.

The user must be able to:

- Create tasks
- View tasks
- Edit tasks
- Complete/uncomplete tasks
- Delete tasks
- Set task dates
- Set start/due times
- Set duration
- Set priority
- Set category
- Add descriptions/notes
- Set reminders as task data
- Mark tasks overdue based on time/date
- Search tasks
- Filter tasks
- Sort tasks
- Use the task system offline

All task data must persist after:

- App restart
- Page navigation
- Android app close/reopen

The UI must use the existing service/repository architecture.

---

# DO NOT IMPLEMENT YET

Do NOT implement:

- Groq API
- AI task creation
- AI chat
- Voice
- Speech-to-text
- Text-to-speech
- Actual Android notifications
- Background services
- Daily planning algorithm
- Calendar intelligence
- Cloud synchronization
- Authentication
- Payments/subscriptions

Reminder information may be stored in the database, but actual notification scheduling belongs to Stage 4.

---

# 1. INSPECT BEFORE IMPLEMENTING

Read:

- PROJECT_SPEC.md
- ARCHITECTURE.md
- DEVELOPMENT_STATUS.md
- DATABASE_SCHEMA.md
- CHANGELOG.md

Inspect:

- Existing SQLite implementation
- Existing migrations
- TaskService
- Repositories
- Models
- Today page
- Tasks page
- Existing UI components
- Settings architecture

Do not create duplicate services/repositories.

If Stage 1 created mock data, replace the UI's dependency on mock data with the real TaskService.

Do not necessarily delete the mock-data module immediately if other stages still reference it. Remove it when safe.

---

# 2. TASK DATA MODEL

Implement a production-ready task model.

At minimum support:

- id
- title
- description
- notes
- date
- startTime
- dueTime
- durationMinutes
- priority
- categoryId
- reminderEnabled
- reminderMinutesBefore
- repeatRule
- completed
- completedAt
- createdAt
- updatedAt

Use the project's existing database naming convention consistently.

Do not store unnecessary duplicate fields.

---

# 3. PRIORITY

Support:

- Low
- Medium
- High

Use stable internal values, for example:

- low
- medium
- high

Do not use display text as the database contract.

Make priority easy to change later if the product evolves.

---

# 4. CATEGORIES

Create the initial categories:

- Work
- Personal
- Study
- Health
- Shopping
- Finance
- Other

Use a categories table rather than hard-coding category names into every task.

Create seed/default category data through the migration or initialization process.

Avoid creating duplicate categories when the database initializes again.

---

# 5. TASK CRUD

Implement through TaskService.

Required operations:

- createTask()
- getTaskById()
- getTasks()
- updateTask()
- completeTask()
- uncompleteTask()
- deleteTask()
- searchTasks()
- getTasksByDate()
- getOverdueTasks()

Repository/database access should remain below TaskService.

The UI must never directly execute SQL.

---

# 6. VALIDATION

Validate task data before saving.

At minimum:

### Title

- Required
- Trim whitespace
- Reasonable maximum length
- Reject empty titles

### Description/notes

- Optional
- Reasonable maximum length

### Date

- Validate date format

### Times

- Validate time format

### Duration

- Must be a positive value when provided
- Apply a sensible maximum

### Priority

Only allow valid priority values.

### Category

Only allow valid category IDs.

### Reminder

If enabled:

- Validate reminder offset
- Do not allow invalid negative/unsupported values

Do not silently accept malformed data.

Return useful validation errors to the UI.

---

# 7. TASK CREATION UI

Connect the existing Add Task/Quick Add UI to the real TaskService.

Create a proper task form.

Fields:

### Required

- Task title

### Optional

- Description
- Date
- Start time
- Due time
- Duration
- Priority
- Category
- Reminder
- Repeat
- Notes

Use mobile-friendly controls.

The form must:

- Validate before submission
- Show field-level errors where useful
- Disable duplicate submission
- Show loading state
- Show success feedback
- Show human-readable errors
- Close/reset correctly after successful creation

---

# 8. EDIT TASK

Allow users to open an existing task and edit it.

The edit form should load existing values.

After saving:

- Persist changes
- Update updatedAt
- Refresh affected screens
- Preserve completion state unless intentionally changed

Do not create a duplicate task when editing.

---

# 9. COMPLETE / UNCOMPLETE

Implement the task checkbox.

When completing:

- completed = true
- completedAt = current timestamp

When uncompleting:

- completed = false
- completedAt = null

The UI should immediately reflect the change.

Persist the change to SQLite.

---

# 10. DELETE TASK

Implement deletion.

Use confirmation before destructive deletion.

Example:

"Delete this task?"

Provide:

- Cancel
- Delete

After deletion:

- Remove it from the UI
- Persist the deletion
- Show appropriate feedback

Avoid accidental deletion.

---

# 11. TASK LIST

Replace Stage 1 mock task data with real SQLite data.

Tasks screen should support:

- All
- Today
- Upcoming
- Overdue
- Completed

Implement the actual filtering now.

Do not duplicate filtering logic in every page.

Prefer TaskService/repository query methods or a dedicated task-query layer where appropriate.

---

# 12. SEARCH

Implement task search.

Search should look through relevant fields such as:

- Title
- Description
- Notes

Search should:

- Handle empty search
- Be case-insensitive
- Avoid SQL injection
- Work offline
- Update results cleanly

Use parameterized SQL queries.

Do not build SQL using raw user input concatenation.

---

# 13. SORTING

Provide sensible sorting.

For active tasks, prioritize:

1. Date
2. Start time
3. Due time
4. Priority where appropriate

Completed tasks can be ordered by completion date.

Keep sorting deterministic.

Do not bury sorting rules inside UI components.

---

# 14. TODAY SCREEN

Connect Today screen to real task data.

It should dynamically show:

- Today's tasks
- Completed count
- Total count
- Progress percentage
- Overdue tasks
- Upcoming tasks

Example:

**Today's progress**

`3 of 6 tasks completed`

Calculate these values from the database.

Do not use mock numbers.

---

# 15. OVERDUE LOGIC

A task should be considered overdue based on actual date/time.

Define the rule clearly in the architecture.

For example:

- An incomplete task with a due date/time in the past is overdue.
- An incomplete task whose date has passed is overdue even if no time exists.
- Completed tasks are never displayed as overdue.

Avoid timezone bugs.

Use the device's local timezone for user-facing planner behavior.

Document the chosen behavior.

---

# 16. DATE AND TIME HANDLING

Be consistent.

Do not randomly mix:

- Unix timestamps
- ISO strings
- Local date strings
- UTC date strings

Define the database representation and conversion strategy.

Important:

A planner task such as "tomorrow at 8 AM" must ultimately be interpreted according to the user's local device time.

Document the strategy in:

`DATABASE_SCHEMA.md`

and/or

`ARCHITECTURE.md`.

---

# 17. TASK DETAILS

Create a task-details view/modal/page as appropriate.

Show:

- Title
- Description
- Date
- Time
- Duration
- Priority
- Category
- Reminder
- Repeat
- Notes
- Created date
- Updated date
- Completion status

Actions:

- Complete/uncomplete
- Edit
- Delete

Keep the interface mobile-friendly.

---

# 18. CATEGORY MANAGEMENT

For Stage 2, users do not necessarily need full category management.

At minimum:

- Display seeded categories
- Allow selecting a category
- Persist category ID
- Display category consistently

If implementing category creation/editing is simple and does not complicate the architecture, it may be added.

Otherwise document it as future work.

---

# 19. REPEAT DATA

Store repeat information in a structured, extensible way.

Do not build the full recurring-task engine yet.

Possible supported values:

- none
- daily
- weekly
- monthly

The database should be ready for Stage 3/4 to implement actual recurring behavior.

Do not pretend recurring task generation is implemented if it is not.

---

# 20. REMINDER DATA

Store:

- reminderEnabled
- reminderMinutesBefore

Example:

Task due at 10:00

Reminder:

10 minutes before

Actual Android notification scheduling comes in Stage 4.

Do not request notification permissions yet unless the existing implementation already requires them.

---

# 21. DATABASE MIGRATIONS

Use the migration architecture established in Stage 0.

If the task schema already exists:

- Verify it.
- Add only missing fields/tables/indexes.

If changes are required:

- Create a new migration.
- Do not modify an already-applied migration in a way that breaks existing databases.

Ensure existing installations can upgrade safely.

Add useful indexes for common queries, such as:

- date
- completed
- due time
- category
- updatedAt

Do not add indexes without a reason.

---

# 22. ERROR HANDLING

Handle:

- Database unavailable
- Migration failure
- Insert failure
- Update failure
- Delete failure
- Invalid task data
- Empty results
- Unexpected repository errors

User-facing messages should be understandable.

Do not expose raw SQL errors to users.

Log useful diagnostic information in development.

Avoid logging sensitive task content unnecessarily.

---

# 23. OFFLINE-FIRST BEHAVIOR

Verify that all core task operations work without internet.

The following must not require network:

- Create task
- Edit task
- Complete task
- Delete task
- Search
- Filter
- View tasks
- View today's progress

If the app is offline:

- Do not show an AI failure message for normal task operations.
- Show the existing offline state only where relevant.

---

# 24. PERFORMANCE

Avoid loading the entire task database repeatedly.

Use appropriate queries.

Avoid:

- N+1 database queries
- Re-fetching unchanged data unnecessarily
- Heavy work on the UI thread
- Large in-memory task transformations

The task system should remain responsive with at least several hundred tasks.

---

# 25. STATE REFRESH

Make sure task changes propagate correctly.

Examples:

1. User completes a task on Today.
2. Today progress updates.
3. Tasks page reflects completion.
4. Calendar/task data can later refresh correctly.
5. Closing/reopening the app retains the change.

Avoid relying only on local component state for persistent task state.

The database remains the source of truth.

---

# 26. ANDROID TESTING

If Android tooling is available, test on an emulator or physical device.

Verify:

- App starts
- Database initializes
- Tasks persist
- Create task
- Edit task
- Complete task
- Uncomplete task
- Delete task
- Search
- Filters
- Date/time input
- App restart
- App force-close/reopen
- Dark mode
- Keyboard behavior
- Android back button

Especially verify persistence after completely closing the app.

---

# 27. TEST CASES

Create or update automated tests where the project supports them.

At minimum test:

### Task creation

- Valid task succeeds
- Empty title fails
- Invalid priority fails
- Invalid duration fails

### Task update

- Existing task updates
- Updated timestamp changes

### Completion

- Complete sets completedAt
- Uncomplete clears completedAt

### Delete

- Task is removed

### Search

- Matching title found
- Matching description found
- Matching notes found
- Search is case-insensitive

### Filtering

- Today
- Upcoming
- Overdue
- Completed

### Persistence

- Create task
- Close/reinitialize database/app
- Task still exists

### Categories

- Default categories exist
- Task category persists

### Reminder data

- Reminder configuration persists

---

# 28. DOCUMENTATION

Update:

### DATABASE_SCHEMA.md

Document:

- Tasks table
- Categories table
- Columns
- Types
- Constraints
- Indexes
- Relationships
- Migration version

### ARCHITECTURE.md

Document:

- TaskService
- TaskRepository
- Task model
- Validation
- Date/time strategy
- Overdue rules
- Filtering/query architecture

### DEVELOPMENT_STATUS.md

Record:

- Stage 2 implementation
- Completed functionality
- Remaining limitations
- Tests
- Build results

### CHANGELOG.md

Record user-visible task functionality.

---

# 29. CODE QUALITY RULES

Maintain the architecture.

Do not:

- Put SQL in pages/components.
- Put database logic in TaskCard.
- Put validation rules in multiple places.
- Duplicate overdue calculations.
- Duplicate filtering logic.
- Use mock data after real task data is connected.
- Create giant task-management files.
- Add unnecessary dependencies.
- Store API keys.
- Break Stage 1 UI unnecessarily.

Use clear names and small focused functions.

---

# 30. STAGE 2 COMPLETION GATE

Stage 2 is complete only when:

- [ ] Real SQLite task storage works
- [ ] Task migrations work
- [ ] Categories exist
- [ ] Create task works
- [ ] Edit task works
- [ ] Complete works
- [ ] Uncomplete works
- [ ] Delete works
- [ ] Confirmation exists for destructive deletion
- [ ] Search works
- [ ] Filters work
- [ ] Sorting works
- [ ] Today screen uses real task data
- [ ] Progress is calculated from real data
- [ ] Overdue detection works
- [ ] Task details work
- [ ] Reminder data is persisted
- [ ] Repeat data is persisted
- [ ] Validation works
- [ ] Errors are handled
- [ ] Offline operation works
- [ ] App restart preserves tasks
- [ ] No AI functionality was added
- [ ] No notification/background functionality was added
- [ ] Automated tests pass where configured
- [ ] Web build succeeds
- [ ] Capacitor sync succeeds
- [ ] Android build succeeds if tooling is available
- [ ] Documentation is updated
- [ ] No critical errors remain

---

# FINAL REPORT

When Stage 2 is complete, report:

1. What you inspected
2. Database changes
3. Migration changes
4. Task model
5. TaskService/repository implementation
6. UI changes
7. Validation rules
8. Search/filter/sort implementation
9. Overdue logic
10. Date/time strategy
11. Tests performed
12. Web build result
13. Capacitor result
14. Android/device result
15. Known issues
16. Recommended next stage

Then **STOP**.

Do not begin Stage 3 automatically.
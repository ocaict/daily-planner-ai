# Daily Planner AI — Stage 3 Implementation Prompt

You are continuing development of **Daily Planner AI**, a production-ready Android planner app.

## Project Context

Stack:

- Ionic
- Capacitor
- HTML
- CSS
- JavaScript
- SQLite/local persistence
- Android native capabilities through Capacitor
- Groq will be the initial AI provider later

Completed stages:

- Stage 0 — Project Foundation & Architecture
- Stage 1 — UI Shell & Design System
- Stage 2 — Local Task System

You are now implementing:

# STAGE 3 — CALENDAR & PLANNER ENGINE

---

# CORE DEVELOPMENT RULE

Follow:

**PLAN → IMPLEMENT → TEST → FIX → VERIFY → DOCUMENT → STAGE COMPLETE**

Do not skip verification.

Do not begin Stage 4 automatically.

Do not unnecessarily rewrite working Stage 0, 1, or 2 code.

The existing database remains the source of truth for persistent task data.

---

# STAGE 3 GOAL

Turn the Calendar page into a real calendar connected to the task database.

Build the first version of a deterministic **Planner Engine** that can:

- Understand available planning hours.
- Consider task duration.
- Consider priorities.
- Consider deadlines.
- Detect scheduling conflicts.
- Respect existing scheduled tasks.
- Identify unscheduled tasks.
- Produce a proposed daily schedule.
- Explain scheduling decisions through structured data.

The Planner Engine must be completely independent from AI.

AI will only be integrated in a later stage.

---

# IMPORTANT ARCHITECTURE PRINCIPLE

The Planner Engine must NOT depend on Groq, an LLM, network access, or the AI service.

Architecture:

```text
UI
 ↓
PlannerService
 ↓
PlannerEngine
 ↓
TaskRepository / CalendarRepository
 ↓
SQLite
```

Later:

```text
User
 ↓
AIService
 ↓
AIProvider
 ↓
GroqProvider
 ↓
Structured planner request
 ↓
PlannerService
 ↓
PlannerEngine
 ↓
SQLite
```

AI must never directly modify the database.

---

# DO NOT IMPLEMENT YET

Do NOT implement:

- Groq API
- AI chat
- AI-generated plans
- Voice input
- Speech-to-text
- Text-to-speech
- Android notifications
- Background services
- Cloud sync
- Authentication
- Payments
- Subscription system

The planner engine must work entirely without AI.

---

# 1. INSPECT THE CURRENT PROJECT

Before implementation:

Read:

- PROJECT_SPEC.md
- ARCHITECTURE.md
- DEVELOPMENT_STATUS.md
- DATABASE_SCHEMA.md
- CHANGELOG.md

Inspect:

- Task model
- TaskService
- TaskRepository
- SQLite migrations
- Calendar page
- Today page
- SettingsService
- Existing date/time utilities
- Existing mock calendar implementation

Reuse existing architecture.

Do not create duplicate task/date/time utilities.

---

# 2. CALENDAR DATA MODEL

The existing task model should already support scheduled tasks.

Verify support for:

- date
- startTime
- dueTime
- durationMinutes
- completed
- priority
- category
- repeatRule

If anything necessary is missing, create a proper migration rather than modifying an already-applied migration destructively.

---

# 3. CALENDAR VIEW

Make the Calendar screen functional.

Support:

- Month view
- Selected day
- Previous month
- Next month
- Today button
- Tasks shown on relevant dates
- Completed task indication
- Multiple tasks on a day
- Empty days

Calendar data must come from TaskService/repository.

Do not use mock calendar data.

---

# 4. MONTH VIEW

Implement a real calendar grid.

Each day should support:

- Date number
- Current-day indicator
- Selected-day indicator
- Task indicator
- Multiple-task indicator where necessary

The calendar must correctly handle:

- Different month lengths
- Leap years
- Week boundaries
- Year boundaries
- Local timezone

Do not assume every month has 30 days.

---

# 5. SELECTED DAY

When a user selects a date:

Show that day's tasks below or alongside the calendar.

For each task display:

- Time
- Title
- Duration
- Priority
- Completion status

Tasks should be ordered chronologically.

Tasks without a start time should appear in a clearly separated unscheduled section.

---

# 6. CALENDAR TASK CREATION

Allow the user to create a task from a selected calendar date.

For example:

User selects:

March 14

Then taps:

"Add task"

The new task form should default the task date to March 14.

Do not require the user to manually select the date again.

Connect this to the Stage 2 TaskService.

---

# 7. CALENDAR TASK EDITING

Selecting a task should open the existing task details/edit interface.

Changes must persist through TaskService.

After editing:

- Calendar updates
- Today updates if relevant
- Task list updates if relevant

Do not duplicate task-edit logic inside Calendar.

---

# 8. DATE/TIME UTILITY

Create or improve a centralized date/time utility.

It should handle:

- Today
- Tomorrow
- Yesterday
- Date comparison
- Month boundaries
- Week boundaries
- Date formatting
- Time formatting
- Combining date + time
- Local timezone conversion

Use one consistent approach throughout the app.

Avoid scattering date logic across components.

---

# 9. PLANNER SETTINGS

Connect the planner to user settings.

At minimum support:

### Day start

Example:

08:00

### Day end

Example:

22:00

### Default task duration

Example:

30 minutes

### Planning style

Prepare architecture for options such as:

- Balanced
- Priority-focused
- Deadline-focused

If planning style is not already persisted, add it through SettingsService/database architecture.

Do not create unnecessary settings.

---

# 10. AVAILABLE TIME

The Planner Engine needs to understand available time.

Create a representation such as:

```text
AvailableTimeBlock

date
startTime
endTime
source
```

Possible sources:

- planning-hours
- existing-free-time
- manual-block
- calendar-event

For this stage, planning hours are sufficient.

Future stages can add external calendar events.

---

# 11. SCHEDULED VS UNSCHEDULED TASKS

Distinguish between:

### Scheduled task

Has:

- date
- start time
- duration or due time

### Unscheduled task

Has a date or is otherwise actionable but does not have a fixed start time.

The planner should be able to schedule unscheduled tasks.

Do not automatically alter user-created scheduled tasks unless explicitly instructed by a future feature.

---

# 12. PLANNER ENGINE

Create a dedicated deterministic PlannerEngine.

Suggested architecture:

```text
PlannerService
    ↓
PlannerEngine
    ↓
Task scoring
    ↓
Time-slot generation
    ↓
Conflict detection
    ↓
Schedule generation
```

Keep this logic independent from UI.

---

# 13. PLANNER INPUT

The planner should accept structured input.

Example:

```js
{
  date: "2026-09-26",
  dayStart: "08:00",
  dayEnd: "18:00",
  tasks: [],
  existingBlocks: [],
  preferences: {}
}
```

Do not make the planner depend on page/component state.

---

# 14. TASK SCORING

Create deterministic scoring logic.

Consider:

- Priority
- Deadline proximity
- Task duration
- Existing scheduled time
- Overdue status

Do not create an arbitrary opaque score with no explanation.

Prefer explicit scoring factors.

Example conceptual model:

```text
priorityWeight
+
deadlineWeight
+
overdueWeight
+
scheduleConstraint
```

Document the rules.

The exact weights should be constants/configuration rather than magic numbers scattered throughout the code.

---

# 15. DEADLINE HANDLING

The planner should prioritize tasks approaching their deadlines.

Example:

Task A:

High priority  
Due today

Task B:

Medium priority  
Due next week

The planner should recognize the difference.

Do not claim the planner has "intelligence" beyond the deterministic rules implemented.

---

# 16. OVERDUE TASKS

Overdue incomplete tasks should be identified.

The planner should be able to:

- Detect overdue tasks
- Include them in planning candidates
- Mark them as requiring attention

Do not automatically move or delete overdue tasks.

---

# 17. DURATION

The planner must account for task duration.

Example:

Available:

09:00–12:00 = 180 minutes

Tasks:

- 60 minutes
- 30 minutes
- 90 minutes

The planner should understand the total available capacity.

Do not schedule a 90-minute task into a 30-minute slot.

---

# 18. TIME SLOT GENERATION

Create available time slots based on:

- Day start
- Day end
- Existing scheduled tasks
- Task duration

Example:

Planning hours:

08:00–17:00

Existing task:

10:00–11:00

Available blocks:

08:00–10:00
11:00–17:00

The implementation must correctly handle:

- Adjacent tasks
- Multiple existing tasks
- Tasks at beginning/end of day
- Overlapping tasks
- Zero/invalid durations

---

# 19. CONFLICT DETECTION

Implement conflict detection.

Detect:

- Two tasks occupying the same time
- Task outside planning hours
- Task exceeding available time
- Invalid start/end combinations

Do not silently move user-scheduled tasks.

Return structured conflict information.

Example:

```js
{
  type: "overlap",
  taskId: "...",
  conflictingTaskId: "...",
  message: "These tasks overlap."
}
```

---

# 20. PROPOSED DAILY PLAN

The Planner Engine should produce structured output.

Example:

```js
{
  date: "2026-09-26",
  scheduledItems: [
    {
      taskId: "...",
      startTime: "09:00",
      endTime: "09:30",
      reason: "High priority and due today"
    }
  ],
  unscheduledTasks: [],
  conflicts: [],
  unusedMinutes: 90
}
```

This is a proposal.

It should NOT automatically overwrite user task schedules.

---

# 21. PLAN CONFIRMATION

Planner output must be treated as a proposal.

For this stage:

- Build the proposal.
- Display it.
- Allow confirmation if appropriate.
- Only confirmed changes should be persisted.

If automatic persistence is not yet appropriate, keep the proposal read-only and document it.

Do not silently reschedule tasks.

---

# 22. TODAY SCREEN INTEGRATION

Improve Today screen using real planner information.

It should be able to show:

- Scheduled tasks
- Unscheduled tasks
- Available time
- Overdue tasks
- Remaining capacity

Add a clear action such as:

**Plan my day**

For Stage 3 this invokes the deterministic PlannerEngine.

It must NOT invoke AI.

---

# 23. PLAN PREVIEW UI

Create a planner preview component.

Display:

- Proposed time
- Task
- Duration
- Priority
- Reason
- Conflicts
- Unscheduled tasks

Example:

**09:00–09:45**

Finish project proposal

**High priority**

Reason:
"Due today and high priority."

Keep the explanation concise.

---

# 24. CONFIRMING A PLAN

If the user confirms a proposed plan:

Only then update affected tasks through TaskService.

Do not directly update SQLite from the UI.

The flow should be:

```text
Plan Preview
 ↓
User confirms
 ↓
PlannerService
 ↓
TaskService
 ↓
TaskRepository
 ↓
SQLite
```

---

# 25. PROTECT USER DATA

The Planner Engine must not:

- Delete tasks
- Mark tasks complete
- Change task titles
- Change priority
- Change categories
- Change descriptions

unless explicitly required by a future user action.

For normal planning, it should primarily assign time slots.

---

# 26. RECURRING TASK PREPARATION

Do not implement a full recurring-task generation engine yet.

However, ensure the planner architecture does not prevent future recurring tasks.

Document how recurring tasks are expected to interact with planning.

---

# 27. PERFORMANCE

The Planner Engine should remain fast with:

- Hundreds of tasks
- Many calendar days
- Multiple scheduled blocks

Avoid expensive recalculation when unnecessary.

Do not perform planner calculations repeatedly during every UI render.

---

# 28. TESTING — CALENDAR

Test:

- Current month
- Previous month
- Next month
- January/December boundaries
- Leap year
- Month with 28 days
- Month with 29 days
- Month with 30 days
- Month with 31 days
- Selecting a day
- Tasks on selected day
- Empty day
- Task creation from calendar
- Task editing from calendar

---

# 29. TESTING — PLANNER ENGINE

Create unit tests for deterministic behavior.

Test:

### Basic scheduling

Given:

08:00–17:00 availability

and tasks with known durations,

verify the generated schedule.

### Existing blocks

Ensure existing scheduled tasks are not overwritten.

### Duration

Ensure tasks fit available slots.

### Conflicts

Detect overlapping scheduled tasks.

### Priority

Higher-priority tasks receive appropriate consideration according to the documented rules.

### Deadlines

Tasks with closer deadlines receive appropriate consideration.

### Overdue

Overdue tasks are recognized.

### Capacity

Planner does not schedule more minutes than are available.

### Unscheduled tasks

Tasks that cannot fit remain in the unscheduled list.

### Empty input

Planner returns a valid empty plan.

### Invalid input

Planner fails gracefully with structured validation errors.

---

# 30. DATABASE TESTING

Verify:

- Existing Stage 2 tasks remain intact.
- Calendar queries return correct tasks.
- Editing a task updates calendar results.
- Completing a task updates calendar state.
- Deleting a task removes it from calendar results.

Migration upgrades must not destroy existing data.

---

# 31. ANDROID TESTING

If Android tooling is available, test on emulator/device.

Verify:

- Calendar rendering
- Date selection
- Task creation from calendar
- Task editing
- Planner preview
- Confirmation
- Database persistence
- App restart
- Android back navigation
- Keyboard behavior
- Dark mode

Do not claim device testing unless actually performed.

---

# 32. ERROR HANDLING

Handle:

- Invalid dates
- Invalid times
- Invalid durations
- Database failures
- Planner input errors
- Scheduling conflicts
- No available time
- Tasks that cannot fit

Use human-readable messages.

Do not expose stack traces or SQL errors to users.

---

# 33. DOCUMENTATION

Update:

### ARCHITECTURE.md

Document:

- Calendar architecture
- PlannerService
- PlannerEngine
- Planning input/output
- Scheduling rules
- Conflict detection
- Confirmation flow

### DATABASE_SCHEMA.md

Document any schema changes.

### PROJECT_SPEC.md

Document permanent planner/calendar decisions.

### DEVELOPMENT_STATUS.md

Record:

- Stage 3 progress
- Implemented features
- Planner limitations
- Test results
- Build results

### CHANGELOG.md

Record user-visible calendar/planner functionality.

---

# 34. CODE QUALITY

Maintain strict separation:

```text
UI
 ↓
Services
 ↓
Engine
 ↓
Repository
 ↓
Database
```

Do not:

- Put planner algorithms in UI components.
- Put SQL inside PlannerEngine.
- Put business rules inside CalendarGrid.
- Duplicate date calculations.
- Create giant planner files.
- Hard-code scoring rules throughout the code.
- Silently modify user schedules.
- Add unnecessary dependencies.

---

# 35. STAGE 3 COMPLETION GATE

Stage 3 is complete only when:

- [ ] Calendar uses real task data
- [ ] Month navigation works
- [ ] Day selection works
- [ ] Tasks appear on correct dates
- [ ] Calendar task creation works
- [ ] Calendar task editing works
- [ ] Date/time handling is centralized
- [ ] Planner settings are connected
- [ ] Available-time calculation works
- [ ] Scheduled/unscheduled tasks are distinguished
- [ ] PlannerEngine exists independently from AI
- [ ] Task scoring rules are documented
- [ ] Deadline handling works
- [ ] Overdue handling works
- [ ] Duration constraints work
- [ ] Time-slot generation works
- [ ] Conflict detection works
- [ ] Proposed daily plan works
- [ ] Plan preview works
- [ ] User confirmation exists before schedule changes
- [ ] Planner does not silently destroy/change user data
- [ ] Today screen uses planner data
- [ ] Unit tests exist for planner behavior
- [ ] Database tests pass
- [ ] Web build succeeds
- [ ] Capacitor sync succeeds
- [ ] Android build succeeds if tooling is available
- [ ] Android/device testing is performed if available
- [ ] Documentation is updated
- [ ] No critical errors remain
- [ ] No AI/Groq functionality was added
- [ ] No notification/background functionality was added

---

# FINAL REPORT

When Stage 3 is complete, report:

1. What was inspected
2. Calendar implementation
3. Date/time implementation
4. PlannerEngine architecture
5. Planning rules
6. Conflict handling
7. Plan preview/confirmation
8. Database changes
9. Tests performed
10. Web build result
11. Capacitor result
12. Android/device result
13. Known limitations
14. Recommended next stage

Then **STOP**.

Do not begin Stage 4 automatically.
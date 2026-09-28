# Daily Planner AI — Stage 4 Implementation Prompt

You are continuing development of **Daily Planner AI**, a production-ready Android planner app.

## Completed stages

- Stage 0 — Project Foundation & Architecture
- Stage 1 — UI Shell & Design System
- Stage 2 — Local Task System
- Stage 3 — Calendar & Planner Engine

You are now implementing:

# STAGE 4 — ANDROID BACKGROUND FUNCTIONALITY & NOTIFICATIONS

---

# CORE DEVELOPMENT RULE

Follow:

**PLAN → IMPLEMENT → TEST → FIX → VERIFY → DOCUMENT → STAGE COMPLETE**

Do not skip verification.

Do not begin Stage 5 automatically.

Do not rewrite working functionality unnecessarily.

---

# STAGE 4 GOAL

Implement reliable Android local notifications and background-related behavior so the planner remains useful when the application is not open.

The user should be able to:

- Receive task reminders.
- Receive due-task reminders.
- Receive morning planning notifications.
- Receive overdue-task notifications where configured.
- Schedule reminders for future tasks.
- Update notifications when tasks change.
- Cancel notifications when tasks are deleted or reminders are disabled.
- Continue receiving scheduled notifications after the app is closed.

The core implementation must be **local/offline-first**.

No cloud push notification system is required.

---

# IMPORTANT ARCHITECTURE

Notifications must be separated from task/business logic.

Use:

```text
UI
 ↓
TaskService / PlannerService
 ↓
NotificationService
 ↓
Capacitor / Android notification implementation
```

The UI must not directly schedule native notifications.

TaskService should not contain Android-specific notification code.

NotificationService owns notification scheduling and cancellation.

---

# DO NOT IMPLEMENT YET

Do NOT implement:

- Groq API
- AI chat
- AI-generated planning
- Voice
- Speech-to-text
- Text-to-speech
- Cloud push notifications
- Authentication
- Cloud sync
- Payments/subscriptions

AI will be added in Stage 5.

---

# 1. INSPECT THE PROJECT

Before changing anything, read:

- PROJECT_SPEC.md
- ARCHITECTURE.md
- DEVELOPMENT_STATUS.md
- DATABASE_SCHEMA.md
- CHANGELOG.md

Inspect:

- TaskService
- PlannerService
- NotificationService placeholder
- TaskRepository
- SettingsService
- Capacitor configuration
- Android project
- Existing permissions
- Existing reminder fields
- Existing repeatRule implementation
- Existing date/time utilities

Reuse existing architecture.

Do not create duplicate notification services.

---

# 2. NOTIFICATION ARCHITECTURE

Create a provider-independent notification interface.

For example:

```text
NotificationService
        ↓
NotificationProvider
        ↓
CapacitorNotificationProvider
        ↓
Android
```

The rest of the application should not need to know how Android notifications are implemented.

This will make future platform changes easier.

---

# 3. NOTIFICATION DATA

Review the existing reminder/task schema.

Ensure enough information exists to determine:

- Task ID
- Task title
- Task date
- Start time
- Due time
- Reminder enabled
- Reminder offset
- Repeat rule

If notification-specific persistence is required, add a migration.

Avoid storing data that can safely be derived from the task.

---

# 4. NOTIFICATION PERMISSION

Implement the appropriate Android notification permission flow for supported Android versions.

Requirements:

- Ask for permission at an appropriate user action.
- Do not immediately request permission on first app launch without context.
- Explain why notifications are useful before requesting permission where appropriate.
- Handle permission denied gracefully.
- Allow the app to continue working without notifications.

If permission is denied:

The planner must still function normally.

Do not repeatedly annoy the user with permission prompts.

---

# 5. NOTIFICATION CHANNELS

Create appropriate Android notification channels.

At minimum consider:

### Task reminders

Normal task reminder notifications.

### Planning

Morning briefing/planning notifications.

### Overdue

Overdue task notifications.

Use sensible:

- Channel names
- Descriptions
- Importance levels
- Sound/vibration behavior

Do not make every notification high priority.

Document the channel strategy.

---

# 6. TASK REMINDERS

Connect task reminder data to NotificationService.

Example:

Task:

"Call accountant"

Date:

Tomorrow

Time:

10:00

Reminder:

15 minutes before

Schedule notification:

09:45

The notification should contain useful information.

Example:

**Call accountant**

"Due at 10:00"

Do not include unnecessary task details.

---

# 7. DUE-TIME NOTIFICATIONS

If the user explicitly chooses a reminder at the task time:

Schedule the notification for the task's relevant time.

Handle:

- Tasks with start time
- Tasks with due time
- Tasks with only a date
- Tasks without reminders

Do not invent a reminder time when the user has not configured one unless a documented default setting exists.

---

# 8. NOTIFICATION LIFECYCLE

Notification scheduling must stay synchronized with task changes.

### Create task

If reminder is enabled:

Schedule notification.

### Edit task

Cancel old notification.

Schedule the updated notification.

### Delete task

Cancel associated notification.

### Disable reminder

Cancel associated notification.

### Complete task

Cancel future reminder notifications unless the product explicitly requires otherwise.

### Uncomplete task

Re-schedule reminder if appropriate.

Document these rules.

---

# 9. UNIQUE NOTIFICATION IDS

Each scheduled notification needs a stable identifier.

Do not generate random IDs every time.

Use a deterministic mapping such as:

```text
task ID → notification ID
```

If multiple notifications per task are supported later, design the ID strategy so it can expand safely.

Prevent duplicate notifications after repeated task edits.

---

# 10. PAST REMINDER HANDLING

When a task is created or edited with a reminder time that is already in the past:

Do not schedule a notification for an old time.

Handle gracefully.

Possible behavior:

- Show a validation message.
- Skip the notification.
- Offer the user an appropriate alternative.

Choose one consistent behavior and document it.

---

# 11. TIMEZONE & DATE HANDLING

Use the centralized date/time utilities from Stage 3.

Notifications must use the user's local device time.

Be especially careful with:

- Daylight-saving changes on devices that use DST
- Midnight boundaries
- Date changes
- Time changes
- Device timezone changes

Do not scatter timezone conversions throughout the application.

---

# 12. RECURRING TASKS

Implement notification scheduling for the currently supported repeat rules only if the existing task model defines them clearly.

Potential rules:

- Daily
- Weekly
- Monthly

Do not build an unnecessarily complex recurring-task engine.

If recurring task generation is not yet implemented, NotificationService should not pretend that recurring notifications are fully supported.

Document any limitation.

---

# 13. MORNING BRIEFING

Implement a local scheduled morning notification.

The user should be able to configure:

- Whether morning briefing is enabled.
- Preferred notification time.

Example:

**Good morning**

"You have 6 tasks planned today."

The notification can initially use locally calculated task counts.

Do not use AI to generate the message yet.

AI-generated morning briefings come later.

---

# 14. OVERDUE NOTIFICATIONS

Implement a configurable overdue reminder mechanism.

Possible behavior:

- Notify the user that incomplete tasks are overdue.
- Avoid repeatedly notifying for the same task unnecessarily.

Do not create notification spam.

Persist enough state to prevent repeated notifications if necessary.

Define a clear rule such as:

"Notify once per overdue transition/day."

Choose a sensible implementation and document it.

---

# 15. NOTIFICATION ACTIONS

Where supported, notifications may provide useful actions such as:

- Mark complete
- Open task

If implementing actions:

The action must route through the application's service layer.

Do NOT directly manipulate SQLite from notification callbacks.

Example:

```text
Notification action
 ↓
TaskService.completeTask()
 ↓
Repository
 ↓
SQLite
```

If notification actions are unreliable in the current Capacitor setup, prioritize opening the relevant task/app rather than creating fragile functionality.

---

# 16. DEEP LINKING

Support opening the relevant task when the user taps a notification.

Example:

Notification:

"Call accountant"

Tap notification.

App opens:

Task details for "Call accountant".

Handle the case where:

- Task no longer exists.
- Task was deleted.
- Task is already completed.
- App was not previously running.

Fail gracefully.

---

# 17. APP CLOSED BEHAVIOR

Verify that scheduled local notifications remain available when the app is:

- In foreground
- In background
- Closed normally

Do not require the app UI to remain open.

Do not create a permanent always-running background service just to support reminders.

---

# 18. DEVICE RESTART / RECOVERY

Determine what the chosen Capacitor/Android notification implementation supports after device reboot.

If scheduled notifications survive reboot automatically, verify it.

If they do not, implement an appropriate recovery mechanism where technically justified.

The recovery system must:

1. Reinitialize notification state.
2. Load relevant future reminders from SQLite.
3. Re-schedule valid notifications.
4. Avoid duplicates.

Do not create a continuously running service.

If reboot recovery cannot be reliably supported with the chosen architecture, document the limitation instead of pretending it works.

---

# 19. APP LIFECYCLE RESYNC

When the app starts/resumes:

Run a lightweight notification reconciliation process.

Conceptually:

```text
SQLite tasks
      ↓
Notification reconciliation
      ↓
Missing/obsolete notifications
      ↓
Schedule/cancel as required
```

This protects against:

- App reinstall/update
- Task edits
- Notification changes
- Missed scheduling
- Partial failures

Do not blindly delete and recreate everything on every app resume if that would be inefficient.

---

# 20. NOTIFICATION RECONCILIATION

Create a clear method such as:

```js
syncScheduledNotifications()
```

Its responsibilities:

- Find relevant future reminders.
- Determine expected notifications.
- Compare with the notification provider state if supported.
- Schedule missing notifications.
- Cancel obsolete notifications.
- Avoid duplicates.

Keep reconciliation deterministic.

---

# 21. SETTINGS UI

Connect the Settings UI from Stage 1.

Add functional controls for:

### Notifications

- Notifications enabled
- Morning briefing
- Morning briefing time
- Overdue reminders

If Android permission is denied, clearly communicate that system permission is required.

Do not make the settings page misleading.

---

# 22. NOTIFICATION PREFERENCES

Persist notification preferences locally.

The user must not lose settings after app restart.

Use SettingsService.

Do not store notification preferences inside random page state.

---

# 23. FOREGROUND BEHAVIOR

Decide what happens when a notification is triggered while the app is open.

Avoid confusing duplicate experiences.

For example:

- Show an in-app notification/toast.
- Or allow the normal local notification.

Choose a consistent behavior supported by the platform.

Document it.

---

# 24. ERROR HANDLING

Handle:

- Permission denied
- Permission unavailable
- Scheduling failure
- Cancellation failure
- Invalid notification date
- Invalid reminder offset
- Device time changes
- Database failure
- Provider unavailable

Notification failures should not break task creation/editing.

Example:

A task should still save successfully even if scheduling its reminder fails.

The user should be informed appropriately.

---

# 25. OFFLINE OPERATION

Notifications must not require internet.

Verify:

- Creating reminders offline works.
- Editing reminders offline works.
- Cancelling reminders offline works.
- Morning briefing configuration works offline.

No network calls should be involved.

---

# 26. SECURITY & PRIVACY

Notification content can expose task information on the lock screen.

Provide a sensible architecture for notification privacy.

If appropriate, support a setting such as:

- Show full task details
- Show minimal notification details

Do not expose unnecessary task descriptions or notes in notifications.

Never include:

- API keys
- Authentication tokens
- Internal database information

---

# 27. ANDROID TESTING

This stage MUST be tested on an actual Android device if one is available.

Emulator testing is useful, but real-device notification behavior should be prioritized.

Test:

### Permission

- Fresh install
- Allow notifications
- Deny notifications
- Re-enable through Android settings

### Task reminder

Create:

"Test reminder"

Set reminder for a few minutes ahead.

Close the app.

Verify notification arrives.

### Edit

Change reminder time.

Verify old notification does not remain.

### Delete

Delete task.

Verify future notification is cancelled.

### Complete

Complete task.

Verify future reminder is cancelled.

### Uncomplete

Uncomplete task.

Verify reminder is restored where appropriate.

### App closed

Close the application completely.

Verify scheduled notification still occurs.

### Device restart

If supported:

- Schedule notification.
- Restart device.
- Verify recovery behavior.

### Morning briefing

Configure a test time.

Verify it arrives.

### Overdue

Create an overdue task.

Verify the configured behavior.

---

# 28. TESTING EDGE CASES

Test:

- Reminder exactly at current time
- Reminder in the past
- Task crossing midnight
- Task without a time
- Task with date but no due time
- Task with start time
- Task with due time
- Very long duration
- Completed task with reminder
- Deleted task with reminder
- Multiple reminders/tasks at same time
- Multiple tasks on same date
- Timezone change
- App restart
- Android restart if supported

---

# 29. AUTOMATED TESTS

Where practical, add tests for notification scheduling calculations without depending on real Android notifications.

Test:

- Reminder timestamp calculation
- Notification ID generation
- Past-reminder handling
- Task-to-notification mapping
- Notification reconciliation
- Preference handling

Keep platform-specific tests separate from pure logic tests.

---

# 30. BUILD & RELEASE CHECKS

Run:

- Web build
- Tests
- Capacitor sync
- Android build

Check Android:

- Manifest
- Required permissions
- Notification channels
- Capacitor configuration
- Debug/release differences where relevant

Do not claim success unless the commands actually succeed.

---

# 31. DOCUMENTATION

Update:

### ARCHITECTURE.md

Document:

- NotificationService
- NotificationProvider
- Android implementation
- Scheduling lifecycle
- Reconciliation
- Permission handling
- Deep linking
- Reboot behavior

### DATABASE_SCHEMA.md

Document any new notification-related persistence.

### PROJECT_SPEC.md

Document permanent notification behavior and user preferences.

### DEVELOPMENT_STATUS.md

Record:

- Stage 4 implementation
- Tested Android versions/devices if known
- Notification limitations
- Build status

### CHANGELOG.md

Record user-visible notification functionality.

---

# 32. CODE QUALITY

Do not:

- Create a permanent background service unnecessarily.
- Put Android notification code inside UI components.
- Put notification logic inside TaskCard.
- Duplicate date/time calculations.
- Schedule duplicate notifications.
- Ignore notification failures.
- Block task operations because notification scheduling failed.
- Hard-code notification IDs.
- Hard-code user preferences.
- Add unnecessary dependencies.

Keep the implementation modular.

---

# 33. STAGE 4 COMPLETION GATE

Stage 4 is complete only when:

- [ ] NotificationService is implemented
- [ ] Notification provider abstraction exists
- [ ] Android local notifications work
- [ ] Permission handling works
- [ ] Notification channels are configured
- [ ] Task reminders work
- [ ] Reminder edits cancel/reschedule correctly
- [ ] Deleted tasks cancel reminders
- [ ] Completed tasks cancel future reminders
- [ ] Uncompleted tasks can restore reminders
- [ ] Past reminders are handled safely
- [ ] Stable notification IDs are used
- [ ] Morning briefing notification works
- [ ] Overdue notification behavior works
- [ ] Notification preferences persist
- [ ] App-closed notification behavior is tested
- [ ] Deep linking works if implemented
- [ ] Lifecycle reconciliation works
- [ ] Reboot recovery works if supported
- [ ] Offline operation works
- [ ] Notification failures do not break task CRUD
- [ ] Privacy of notification content is considered
- [ ] Automated scheduling tests pass where configured
- [ ] Android/device testing is completed where available
- [ ] Web build succeeds
- [ ] Capacitor sync succeeds
- [ ] Android build succeeds
- [ ] Documentation is updated
- [ ] No critical errors remain
- [ ] No AI/Groq functionality was added
- [ ] No voice functionality was added

---

# FINAL REPORT

When Stage 4 is complete, report:

1. What was inspected
2. Notification architecture
3. Android implementation
4. Permissions
5. Notification channels
6. Task reminder behavior
7. Morning briefing behavior
8. Overdue behavior
9. Lifecycle/reconciliation behavior
10. Reboot behavior
11. Deep-link behavior
12. Tests performed
13. Actual Android device/emulator tested
14. Web build result
15. Capacitor result
16. Android build result
17. Known limitations
18. Recommended next stage

Then **STOP**.

Do not begin Stage 5 automatically.
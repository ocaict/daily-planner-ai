# Daily Planner AI — Stage 1 Implementation Prompt

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

Stage 0 established the project foundation, architecture, configuration, database foundation, navigation shells, and documentation.

You are now implementing **Stage 1 only: UI Shell & Design System**.

---

# IMPORTANT DEVELOPMENT RULE

Follow this exact workflow:

**PLAN → IMPLEMENT → TEST → FIX → VERIFY → DOCUMENT → STAGE COMPLETE**

Do not skip verification.

Do not move to Stage 2 automatically.

Do not rewrite working Stage 0 architecture unless there is a real technical reason.

Prefer small, isolated changes.

---

# Stage 1 Goal

Turn the basic page shells into a polished, consistent, responsive planner interface.

The app should begin to look like a real production mobile application.

At the end of this stage:

- Today screen should have a realistic planner layout.
- Tasks screen should have a realistic task-list layout.
- Calendar screen should have a realistic calendar layout.
- AI screen should have an AI-assistant placeholder interface.
- Settings should have a realistic settings interface.
- Navigation should work.
- Light/dark/system themes should work.
- Reusable UI components should exist.
- Loading, empty, error, offline, and confirmation states should have reusable components.
- The interface must work on Android phone screen sizes.
- No real task-management logic should be implemented yet.

---

# DO NOT IMPLEMENT YET

Do NOT implement:

- Real task creation
- SQLite task CRUD
- Real calendar data
- Groq API
- AI responses
- AI chat backend
- Voice input
- Speech-to-text
- Text-to-speech
- Notifications
- Background services
- Planner algorithms
- Authentication
- Cloud synchronization
- Payments/subscriptions

Use realistic mock/sample UI data only where necessary to make the interface visually meaningful.

Clearly separate mock data from future real data.

---

# 1. FIRST INSPECT THE PROJECT

Before changing anything:

1. Inspect the existing project.
2. Read:
   - package.json
   - PROJECT_SPEC.md
   - ARCHITECTURE.md
   - DEVELOPMENT_STATUS.md
   - DATABASE_SCHEMA.md
   - CHANGELOG.md
3. Inspect the existing src structure.
4. Identify the navigation implementation.
5. Identify the current CSS/theme implementation.
6. Identify existing reusable components.
7. Identify existing dependencies.

Do not duplicate components or architecture that already exists.

If Stage 0 implementation differs from the expected structure, adapt to the existing project instead of rebuilding it.

---

# 2. UI DESIGN DIRECTION

Design the app as a modern personal productivity application.

The interface should feel:

- Clean
- Calm
- Fast
- Minimal
- Mobile-first
- Easy to scan
- Comfortable for daily use

Avoid:

- Excessive gradients
- Excessive animations
- Huge cards everywhere
- Clutter
- Tiny text
- Too many colors
- Complicated navigation
- Decorative UI that does not help productivity

The primary purpose is helping the user understand:

**What do I need to do? What am I doing now? What is next?**

---

# 3. APP NAVIGATION

Use bottom navigation on mobile.

Primary navigation:

1. Today
2. Tasks
3. Calendar
4. AI

Settings should be accessible from the appropriate top-level menu/button rather than taking space in the main bottom navigation.

Navigation must:

- Highlight the current page.
- Have clear icons.
- Have readable labels.
- Work with Android back navigation appropriately.
- Preserve page state where practical.
- Avoid unnecessary navigation stacks.

---

# 4. TODAY SCREEN

Build the primary Today dashboard.

Suggested structure:

### Header

Show:

- Current date
- Friendly greeting
- Small settings/menu button

Example visual hierarchy:

"Good morning"

"Tuesday, September 26"

Do not hard-code a specific date in the final implementation. Generate the date dynamically.

---

### Daily Progress

Create a compact progress component.

Example:

**Today's progress**

`4 of 7 tasks completed`

Include a progress indicator.

For Stage 1 this may use mock values.

---

### Today's Schedule

Create a timeline/list showing sample tasks.

Example:

08:00 — Morning workout  
09:00 — Team meeting  
11:30 — Project work  
14:00 — Study session  
17:30 — Grocery shopping

Use mock data only.

Clearly structure this so Stage 2 can replace the mock repository with real task data.

---

### Overdue Section

Create an overdue section.

Example:

**Overdue**

- Finish project proposal
- Pay electricity bill

Again, mock UI only.

---

### Upcoming Section

Show the next few tasks.

Example:

**Coming up**

- Call accountant
- Buy groceries
- Review notes

---

### Quick Add Button

Create a prominent floating/action button for adding a task.

For Stage 1:

- It may open a placeholder/modal.
- It must NOT create a real task.
- Clearly mark the functionality as coming in Stage 2 if necessary.

---

### AI Button

Provide an obvious entry point to the AI assistant.

Possible label:

"Ask AI"

or

"Plan my day"

For Stage 1 it should navigate to the AI page or open the AI interface shell.

No real AI request should happen.

---

# 5. TASKS SCREEN

Build the Tasks page UI.

Include:

### Header

"Tasks"

Search button/input.

Add-task button.

### Filters

Provide UI for:

- All
- Today
- Upcoming
- Overdue
- Completed

These filters can be visual/mock only for now.

Do not implement real filtering logic yet unless it is trivial and does not interfere with Stage 2 architecture.

### Task List

Each task should visually support:

- Completion checkbox
- Title
- Date/time
- Priority indicator
- Category
- Reminder indicator if applicable

Example mock tasks:

- Finish project proposal
- Call accountant
- Study JavaScript
- Go for a run
- Buy groceries

Use reusable TaskCard/TaskRow components.

---

# 6. CALENDAR SCREEN

Build the Calendar page shell.

Include:

- Month header
- Previous/next month controls
- Calendar grid
- Current-day indicator
- Sample task indicators
- Selected-day area

The calendar should visually resemble a real mobile planner.

Do not implement real task/calendar data yet.

Structure the calendar components so Stage 3 can connect them to the planner engine.

Do not add an unnecessary third-party calendar library unless the existing project already uses one and it is appropriate.

Prefer a lightweight custom calendar implementation if practical.

---

# 7. AI SCREEN

Build the AI assistant interface shell.

This should NOT connect to Groq yet.

Create:

### Header

"AI Assistant"

Subtitle such as:

"Plan your day, organize tasks, or ask about your schedule."

### Conversation Area

Display example/mock messages.

Example user:

"Plan my day."

Example assistant:

"Based on your schedule, you have 5 tasks planned today."

Clearly keep these as mock UI data.

### Suggested Prompts

Create buttons/chips such as:

- Plan my day
- What do I have today?
- What's overdue?
- Add a task
- Move a task
- Show my week

These will become functional in later stages.

### Input Area

Create:

- Text input
- Send button
- Microphone button placeholder

Do not implement AI or microphone functionality yet.

---

# 8. SETTINGS SCREEN

Build a clean Settings page.

Sections should include:

### Planning

- Day starts at
- Day ends at
- Default task duration
- Planning style

### Appearance

- Theme
  - System
  - Light
  - Dark

### Notifications

UI placeholders for:

- Morning briefing
- Task reminders
- Overdue reminders

Do not implement notifications yet.

### Data

UI placeholders for:

- Export data
- Import/restore data
- Delete all data

Do not implement these yet.

### About

Include:

- App name
- Version
- Privacy
- Terms

These can be placeholders for now.

---

# 9. REUSABLE UI COMPONENTS

Create reusable components instead of duplicating markup.

At minimum, consider:

- AppHeader
- BottomNavigation
- TaskCard
- TaskRow
- ProgressCard
- SectionHeader
- EmptyState
- LoadingState
- ErrorState
- OfflineState
- ConfirmationDialog
- FilterChips
- CalendarGrid
- CalendarDay
- AiMessage
- AiSuggestion
- FloatingActionButton
- SettingRow

Only create components that are genuinely reusable.

Do not create hundreds of tiny components unnecessarily.

---

# 10. DESIGN SYSTEM

Improve the global CSS design system.

Use CSS variables for:

### Colors

- Background
- Surface
- Surface elevated
- Primary
- Secondary
- Text
- Muted text
- Border
- Success
- Warning
- Danger

### Spacing

Create a consistent spacing scale.

Example:

- xs
- sm
- md
- lg
- xl
- xxl

### Radius

Create consistent values for:

- Small controls
- Cards
- Large containers

### Typography

Define:

- Display
- Heading
- Subheading
- Body
- Small
- Caption

Avoid excessive font sizes.

---

# 11. DARK MODE

Implement:

- System theme
- Light theme
- Dark theme

Use CSS variables rather than duplicating entire stylesheets.

The user's selected theme should persist locally if the Stage 0 settings architecture supports it.

If persistence is not yet available, implement the theme architecture cleanly and document the limitation.

Check:

- Text contrast
- Borders
- Cards
- Inputs
- Buttons
- Navigation
- Dialogs
- Calendar
- AI chat

in both themes.

---

# 12. RESPONSIVE DESIGN

Although Android phone is the primary target, make the interface responsive.

Test at minimum:

- Small phone width
- Normal phone width
- Large phone width
- Tablet-ish width if practical

Avoid fixed widths that break layouts.

Respect:

- Safe areas
- Android status bar
- Bottom navigation area
- Keyboard appearance

---

# 13. ACCESSIBILITY

Implement reasonable accessibility foundations.

Include:

- Semantic elements where possible
- Accessible labels for icon buttons
- Sufficient touch targets
- Visible focus states where relevant
- Readable font sizes
- Adequate contrast
- Do not rely on color alone to communicate task priority/status

Buttons should be usable by touch without requiring precision tapping.

---

# 14. UI STATES

Create reusable UI patterns for:

### Loading

Example:

"Loading your tasks..."

### Empty

Example:

"No tasks yet"

"Add your first task to get started."

### Error

Example:

"Something went wrong."

"Try again."

### Offline

Example:

"You're offline. Your local planner is still available."

### Confirmation

Example:

"Are you sure you want to delete this task?"

These should be reusable for future stages.

---

# 15. MOCK DATA

Create a small, clearly isolated mock-data layer if needed.

Example:

mockTasks.js

or an equivalent appropriate location.

Do NOT place mock data throughout page components.

Make it easy for Stage 2 to remove the mock layer and connect the UI to TaskService/Repository.

---

# 16. INTERACTION

Implement basic UI interactions where they do not require backend logic.

Examples:

- Bottom navigation
- Theme selector
- Calendar month navigation
- Opening/closing dialogs
- Opening AI page
- Selecting filters visually
- Opening settings
- Opening quick-add placeholder

Do not implement actual task persistence.

---

# 17. ANIMATION

Use animation sparingly.

Appropriate:

- Page transitions where Ionic provides them
- Dialog appearance
- Button feedback
- Small progress changes

Avoid:

- Constant movement
- Large animated backgrounds
- Slow transitions
- Animation that delays normal interaction

The app should feel fast.

---

# 18. ANDROID CONSIDERATIONS

After implementing the UI:

1. Build the web application.
2. Sync Capacitor.
3. Open/build Android if the environment supports it.
4. Test the UI on an Android emulator or connected device if available.

Check:

- Status bar
- Bottom navigation
- Back button
- Screen rotation behavior if supported
- Keyboard/input behavior
- Scrolling
- Dialogs
- Safe-area spacing
- Dark mode
- Touch targets

Do not claim Android testing succeeded unless it was actually tested.

---

# 19. CODE QUALITY

Maintain the architecture established in Stage 0.

Do not:

- Put business logic inside page components.
- Directly access SQLite from UI components.
- Create one giant JavaScript file.
- Duplicate styles unnecessarily.
- Add dependencies without justification.
- Break existing architecture just to make UI implementation faster.
- Leave debugging code in production paths.
- Hard-code environment secrets.

---

# 20. DOCUMENTATION

Update:

### DEVELOPMENT_STATUS.md

Record:

- Stage 1 started
- What was implemented
- What remains mock/placeholder
- Tests performed
- Build status
- Any known limitations

### CHANGELOG.md

Record the user-visible UI changes.

### ARCHITECTURE.md

Document any meaningful architecture/component changes.

### PROJECT_SPEC.md

Update only if Stage 1 introduces a permanent product decision.

---

# 21. TESTING

Before declaring Stage 1 complete:

### Web

Run the appropriate:

- npm install/check if needed
- build
- lint if configured
- tests if configured

### Capacitor

Run the appropriate Capacitor synchronization.

### Android

If Android tooling is available:

- build the Android project
- install/run on emulator or device if possible

### Manual UI testing

Verify:

- Today opens
- Tasks opens
- Calendar opens
- AI opens
- Settings opens
- Bottom navigation works
- Theme switching works
- Calendar navigation works
- Dialogs work
- Scrolling works
- Buttons are tappable
- No major console errors
- No broken layouts
- No horizontal overflow
- Dark mode is readable
- Empty/loading/error states render correctly

Fix discovered issues before completion.

---

# 22. STAGE 1 COMPLETION GATE

Stage 1 is complete only when:

- [ ] UI architecture is clean
- [ ] Today screen is polished
- [ ] Tasks screen is polished
- [ ] Calendar screen is polished
- [ ] AI screen is polished
- [ ] Settings screen is polished
- [ ] Bottom navigation works
- [ ] Reusable UI components exist
- [ ] Design tokens are centralized
- [ ] Light theme works
- [ ] Dark theme works
- [ ] System theme works
- [ ] Responsive mobile layout works
- [ ] Accessibility basics are implemented
- [ ] UI states exist
- [ ] Mock data is isolated
- [ ] No real AI functionality was added
- [ ] No real task CRUD was added
- [ ] No notifications/background functionality was added
- [ ] Web build succeeds
- [ ] Capacitor sync succeeds
- [ ] Android build succeeds if Android tooling is available
- [ ] Documentation is updated
- [ ] No critical errors remain

---

# FINAL REPORT

When Stage 1 is complete, provide a concise report containing:

1. What you inspected
2. What you implemented
3. Files/components created or changed
4. Dependencies added, if any, and why
5. Theme implementation
6. Navigation implementation
7. Mock data implementation
8. Tests performed
9. Web build result
10. Capacitor result
11. Android build/device result
12. Known issues
13. Recommended next stage

Then **STOP**.

Do not start Stage 2 automatically.
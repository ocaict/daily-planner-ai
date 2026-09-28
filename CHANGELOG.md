# Changelog

All notable changes to Daily Planner AI are documented here.

## [0.5.0] — 2026-09-28

### Added (Stage 4 — Android Background Functionality & Notifications)

- **NotificationService**: Schedules, cancels, and reconciles local notifications
- **NotificationProvider interface**: Provider-agnostic abstraction for platform notifications
- **CapacitorNotificationProvider**: Android implementation using @capacitor/local-notifications
- **Notification channels**: Task reminders, planning (morning briefing), overdue
- **Task lifecycle hooks**: Create/edit/delete/complete/uncomplete all sync notifications
- **Morning briefing**: Configurable daily notification with task count
- **Overdue reminders**: Configurable overdue task notifications
- **Notification reconciliation**: `syncScheduledNotifications()` on app start/resume
- **Stable notification IDs**: `taskId + 1000000` mapping prevents duplicates
- **Settings UI**: Notification toggles, briefing time, privacy controls
- **Unit tests**: 16 tests for NotificationService (all passing)

### Changed

- `src/services/TaskService.js`: Added notification hooks to all lifecycle methods
- `src/services/SettingsService.js`: Added notification preferences
- `src/pages/SettingsPage.js`: Replaced "Coming soon" placeholders with functional controls
- `src/services/ServiceContainer.js`: Wired NotificationService into DI container

## [0.4.0] — 2026-09-28

### Added (Stage 3 — Calendar & Planner Engine)

- **CalendarPage**: Connected to real task data via TaskService (replaced mock data)
- **Calendar navigation**: Month view, day selection, task indicators, add-task button
- **DateUtils**: Expanded with `addDays`, `getDaysInMonth`, `getMonthGrid`, `timeToMinutes`, `minutesToTime`, `isSameDay`, `isBefore`, `isAfter`, `diffInDays`
- **SettingsService**: Implemented with localStorage persistence for planner settings (dayStart, dayEnd, defaultTaskDuration, planningStyle)
- **PlannerEngine**: Deterministic scheduling algorithm with task scoring, time-slot generation, conflict detection
- **PlannerService**: Connects PlannerEngine to TaskRepository and SettingsService
- **ServiceContainer**: Wired PlannerService and SettingsService into DI container
- **PlanPreview component**: Displays proposed daily plan with scheduled items, unscheduled tasks, conflicts
- **TodayPage**: "Plan my day" button with plan preview integration
- **Unit tests**: 12 tests for PlannerEngine (all passing)

### Changed

- `src/main.js`: Pages now receive plannerService and settingsService
- `src/pages/CalendarPage.js`: Rewritten to use real task data
- `src/pages/TodayPage.js`: Added "Plan my day" button and plan preview container

## [0.3.2] — 2026-09-28

### Added

- **Live Android Emulator Verification**: Successfully previewed and verified the complete application on Android emulator `android17` (`emulator-5554`), confirming 60 FPS performance, offline SQLite persistence, and UI responsiveness.

### Fixed

- `src/database/MigrationRunner.js`: Resolved DDL auto-transaction nesting error where `BEGIN TRANSACTION` conflicted with SQLite's implicit table-creation transactions.
- `src/main.js`: Added `@ionic/core/css/ionic.bundle.css` import so overlay elements (`ion-modal`, `ion-toast`, `ion-alert`) and form controls render with their required styles.
- `src/components/TabBar.js`: Switched tab bar implementation to native HTML with inline SVGs, preventing shadow DOM rendering issues in mobile webviews.
- `src/styles/layout.css`: Removed conflicting `.calendar-grid` override that was squishing the header and days of the week, restoring full 7-column calendar grid layout.
- `src/pages/SettingsPage.js`: Upgraded settings controls with native, styled inputs and a responsive pill theme switcher with instant dark/light mode toggle.
- `src/pages/AIPage.js`: Styled AI chat input field, placeholder, and action buttons for high contrast in dark and light modes.
- `src/services/TaskService.js` & `src/repositories/TaskRepository.js`: Preserved `Task` instance prototypes across updates and inserts, ensuring `toRow()` is always available.
- `src/styles/layout.css`: Cleaned up task list action buttons to keep task cards sleek on mobile devices.

## [0.3.1] — 2026-09-28

### Fixed

- `src/pages/TodayPage.js`: Fixed runtime TypeError where `getCurrentDate()` string was called with `.getDay()`, now uses `new Date()`.
- `src/database/MigrationRunner.js`: Fixed query from `SELECT value` to `SELECT version` in `getCurrentVersion` so migrations are not incorrectly re-run on every restart.
- `src/database/Connection.js`: Switched parameterized queries to `CapacitorSQLite.run` (which handles `statement` + `values`), keeping `execute` for raw SQL batches.
- `src/repositories/TaskRepository.js`: Updated inserted ID retrieval to `result.changes.lastId` and made `update()` accept flexible argument styles.
- `src/services/TaskService.js`: Passed `Task` instance into `taskRepository.update()`.
- `src/pages/TasksPage.js`: Fixed `loadData()` and `refreshData()` so filter selections are not overwritten by the full task list.
- `src/models/Task.js`: Added `isToday`, `isUpcoming`, and `isOverdue` getters and category fields.
- `src/components/TaskCard.js`: Added fallback support for `dueTime`/`startTime`, `categoryName`, and `reminderEnabled`.

## [0.3.0] — 2026-09-26

### Added (Stage 2 — Local Task System)

- **Database migration v2**: `categories` and `tasks` tables with foreign keys and 4 indexes
- **Seed data**: 7 default categories (Work, Personal, Study, Health, Shopping, Finance, Other)
- **Task model**: Full field support (title, description, notes, date, start/due time, duration, priority, category, reminder, repeat, completion status, timestamps)
- **Category model**: Full model with fromRow/toRow mapping
- **TaskRepository**: Real SQL implementation with 12 methods (findById, findAll, create, update, delete, search, findByDate, findOverdue, findCompleted, findUpcoming, completeTask, uncompleteTask) — all parameterized
- **CategoryRepository**: Real SQL with findAll, findById
- **TaskService**: Full CRUD operations with validation, search, filter, sort, progress calculation (17 methods)
- **CategoryService**: getCategories, getCategoryById, getCategoryMap
- **TaskValidation**: Standalone validation utility with comprehensive rules
- **ServiceContainer**: Dependency injection container wiring repositories and services
- **TaskFormModal**: Create/edit form with all fields, validation, loading states, error handling
- **TaskDetailModal**: Task detail view with complete/edit/delete actions
- **TaskActions**: Quick action buttons (complete, edit, delete) for task lists
- **TaskList**: Reusable task list component with empty state and loading indicator
- **DateUtils extensions**: getCurrentDate, getCurrentTime, formatTime12h, isOverdue, combineDateTime, getStartOfWeek

### Changed

- `src/main.js`: Wired database initialization and ServiceContainer into app bootstrap
- `src/pages/TodayPage.js`: Connected to real task data (replaced mock data)
- `src/pages/TasksPage.js`: Connected to real task data with search, filters, sorting
- `src/services/ServiceContainer.js`: Fixed import style (default imports)
- `src/utils/DateUtils.js`: Added 6 new utility functions
- `src/services/index.js`: Added CategoryService export
- `src/utils/index.js`: Added validateTaskData/sanitizeTaskData exports
- `eslint.config.js`: Added browser globals (FormData, alert, confirm, fetch)

### Fixed

- `src/services/ServiceContainer.js`: Fixed 4 incorrect named imports to default imports

## [0.2.0] — 2026-09-26

### Added (Stage 1 — UI Shell & Design System)

- Mock data layer, 12 reusable UI components, 5 polished pages
- Theme system with localStorage persistence
- Navigation with bottom tab bar and client-side routing
- Design system improvements (expanded CSS variables, typography, accessibility)

## [0.1.0] — 2026-09-26

### Added (Stage 0 — Foundation)

- Ionic + Capacitor + Vite scaffolding
- CSS design system, database layer foundation, service/repository stubs
- AI provider architecture, error handling, utilities
- Page shells, tab navigation, Capacitor configuration

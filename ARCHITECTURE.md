# Architecture

## Layers

```
UI  →  Application Services  →  Repositories  →  Local Database (SQLite)
```

- **UI** (`src/pages/`, `src/components/`) — Ionic components, no direct DB or AI access
- **Services** (`src/services/`) — business logic and operations
- **Repositories** (`src/repositories/`) — data access only, SQLite queries
- **AI** (`src/services/ai/`) — `AIService` → `AIProvider` → `GroqProvider` (provider-agnostic)

## Folder Structure

```
src/
  pages/                — Page-level components (Today, Tasks, Calendar, AI, Settings)
  components/           — Reusable UI components (Header, TabBar, TaskCard, PlanPreview)
  services/
    TaskService.js      — Task CRUD, validation, search, filter
    PlannerService.js   — Daily planning operations (connects engine to repos)
    SettingsService.js  — User settings (localStorage persistence)
    CategoryService.js  — Category operations
    PlannerEngine.js    — Deterministic scheduling algorithm (pure logic)
    ai/
      AIProvider.js
      GroqProvider.js
      AIService.js
    index.js
  repositories/
    BaseRepository.js
    TaskRepository.js
    CategoryRepository.js
    DailyPlanRepository.js
    index.js
  database/
    Connection.js       — SQLite connection wrapper
    DatabaseManager.js  — Singleton connection manager
    MigrationRunner.js  — Versioned migration executor
    migrations/         — Numbered migration files
  utils/
    DateUtils.js        — Centralized date/time utilities
    ThemeManager.js     — Light/dark/system theme
    ErrorHandler.js     — Error wrapping and display
    TaskValidation.js   — Task validation rules
    DOMUtils.js         — DOM helpers
  config/
    AppConfig.js        — Frozen config + feature flags
  data/
    mockData.js         — Mock data for fallback/testing
  styles/
    main.css            — Global styles + CSS variables
    layout.css          — Layout components
  main.js               — App entry point, routing, bootstrap
```

## Key Design Decisions

- **Offline-first**: All core planning works with zero network connectivity
- **No hard-coded secrets**: `GroqProvider` throws in browser contexts; API keys never bundled
- **Provider-agnostic AI**: `AIProvider` interface allows swapping Groq for other providers
- **Versioned migrations**: SQLite schema changes via numbered migration files
- **CSS variables only**: Theming via custom properties, no CSS frameworks
- **Plain JavaScript**: ES modules, no TypeScript
- **Deterministic Planner**: `PlannerEngine` is pure logic — no AI, no network, no UI dependencies
- **ServiceContainer**: DI container wires all services; falls back to mock data if DB unavailable
- **Centralized date/time**: All date logic in `DateUtils.js` — no scattered date calculations
- **Notification architecture**: `NotificationService` → `NotificationProvider` → `CapacitorNotificationProvider` (provider-agnostic)
- **Notification lifecycle**: TaskService hooks into NotificationService for create/edit/delete/complete/uncomplete
- **Notification reconciliation**: `syncScheduledNotifications()` on app start/resume
- **Stable notification IDs**: `taskId + 1000000` mapping prevents duplicates

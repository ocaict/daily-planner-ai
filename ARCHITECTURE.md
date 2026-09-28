# Architecture

## Layers

```
UI  →  Application Services  →  Repositories  →  Local Database (SQLite)
```

- **UI** (`src/screens/`, `src/components/`) — Ionic components, no direct DB or AI access
- **Services** (`src/services/`) — business logic and operations
- **Repositories** (`src/repositories/`) — data access only, SQLite queries
- **AI** (`src/services/ai/`) — `AIService` → `AIProvider` → `GroqProvider` (provider-agnostic)

## Folder Structure

```
src/
  screens/              — Page-level components (Today, Tasks, Calendar, Settings)
  components/           — Reusable UI components (Header, BottomNav, TaskCard)
  services/
    TaskService.js
    PlannerService.js
    SettingsService.js
    NotificationService.js
    VoiceService.js
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
  router/
    index.js
  styles/
    variables.css
  App.js
```

## Key Design Decisions

- **Offline-first**: All core planning works with zero network connectivity
- **No hard-coded secrets**: `GroqProvider` throws in browser contexts; API keys never bundled
- **Provider-agnostic AI**: `AIProvider` interface allows swapping Groq for other providers
- **Versioned migrations**: SQLite schema changes via numbered migration files
- **CSS variables only**: Theming via custom properties, no CSS frameworks
- **Plain JavaScript**: ES modules, no TypeScript

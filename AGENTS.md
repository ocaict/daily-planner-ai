# AGENTS.md

## Project

**Daily Planner AI** — offline-first Android daily-planning assistant.
Stack: Ionic + Capacitor, plain JavaScript (not TypeScript), CSS variables, ES modules, SQLite via `@capacitor-community/sqlite`.

Full spec: [`PROMPT0.md`](./PROMPT0.md)

## Current stage

**Stage 2 — Local Task System.** Do **not** implement features from later stages (notifications, cloud sync, auth, voice, real Groq integration). Build incrementally and stop at stage boundaries.

## Commands

```bash
npm start              # Dev server (Vite, port 8100)
npm run build          # Production build
npm run lint           # ESLint — 0 errors, ~36 warnings expected (unused vars in stubs)
npm run format         # Prettier
npx cap sync           # Sync web assets to Android
npx cap run android    # Build + deploy to emulator/device
```

No test framework is configured. Verification = `npm run build` + `npx cap sync` + manual emulator check.

## Architecture

```
UI (src/pages/, src/components/)
  → Services (src/services/)
    → Repositories (src/repositories/)
      → SQLite (src/database/)
```

- **ServiceContainer** (`src/services/ServiceContainer.js`) wires everything at startup. Falls back to mock data if DB init fails.
- **UI must not** access SQLite or AI directly. No business logic in components.
- **AI** plugs in as `AIService → AIProvider → GroqProvider` — never hard-code a provider. `GroqProvider` throws in browser contexts.
- **Database**: versioned migrations in `src/database/migrations/`. Never assume empty DB on startup.
- **Theming**: CSS variables only; light/dark/system modes via `ThemeManager`.
- **Language**: plain JS with ES modules. Do not introduce TypeScript or frameworks.

## Key constraints

- **Offline-first**: core planner works with no internet, no AI, no backend.
- **Security**: never hard-code API keys in client code or anything packaged into the APK.
- **Migrations**: versioned, safe upgrades. See `DATABASE_SCHEMA.md`.

## Documentation to maintain

Keep in sync with code: `PROJECT_SPEC.md`, `ARCHITECTURE.md`, `DEVELOPMENT_STATUS.md`, `DATABASE_SCHEMA.md`, `CHANGELOG.md`.

## Verification

Before reporting success:
1. `npm run build` succeeds
2. `npx cap sync` succeeds
3. Android build succeeds if tooling available
4. No critical errors — do not claim success if the project does not build

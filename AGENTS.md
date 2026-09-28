# AGENTS.md

## Project

**Daily Planner AI** — an offline-first Android daily-planning assistant.
Stack: Ionic + Capacitor, plain JavaScript (not TypeScript), CSS variables, ES modules, SQLite (local persistent storage). Groq is the planned AI provider (Stage 1+).

The full Stage 0 specification lives in [`PROMPT0.md`](./PROMPT0.md). Read it before starting any work.

## Current stage

This repo is at **Stage 0 (foundation only)**. Do **not** implement:

- AI chat, Groq integration, voice, speech-to-text/speech
- Planning algorithms, notifications, calendar, auth, cloud sync, payments

Build incrementally and **stop at stage boundaries** — do not jump ahead to the next stage's features.

## Architecture (enforced)

```
UI  →  Application Services  →  Repositories  →  Local Database (SQLite)
```

- UI **must not** directly access SQLite or any AI provider.
- UI **must not** contain business logic that belongs in services.
- Services hold business/operations logic; repositories hold data access only.
- AI will later plug in as `AIService → AIProvider → GroqProvider` — never hard-code a provider.
- Keep modules small and focused; avoid giant files and unnecessary dependencies.

## Key constraints

- **Offline-first**: the core planner must work with no internet, no AI, no backend.
- **Security**: never hard-code a Groq API key (or any secret) in client-side code or anything packaged into the APK.
- **Database**: use versioned migrations; never assume the DB is empty on startup; support safe upgrades.
- **Theming**: CSS variables only; support light, dark, and system-preference modes.
- **Language**: plain JavaScript with ES modules — do not introduce TypeScript or extra frameworks.

## Documentation to maintain

Keep these in sync with the code (created at Stage 0):

- `PROJECT_SPEC.md` — vision, principles, stack, roadmap
- `ARCHITECTURE.md` — layers, folder structure, service/repo/DB/AI/Capacitor design
- `DEVELOPMENT_STATUS.md` — current stage, completed/remaining work, build status
- `DATABASE_SCHEMA.md` — current + planned entities
- `CHANGELOG.md` — initial setup and subsequent changes

## Verification

Before reporting success, ensure:

1. `npm run build` (or equivalent Ionic build) succeeds.
2. `npx cap sync` succeeds.
3. Android build succeeds if Android tooling is available.
4. No critical errors remain — do **not** claim success if the project does not actually build.

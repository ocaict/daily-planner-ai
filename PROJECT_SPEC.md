# Daily Planner AI — Project Specification

## Product Vision

Daily Planner AI is an offline-first Android daily-planning assistant. AI serves as an intelligent interface to the user's planner data — it is **not** the source of truth. The core planning experience must work fully offline, with no backend dependency.

## Core Principles

1. **Offline-first** — The app must be fully usable without an internet connection.
2. **Local data ownership** — All planner data lives on-device in SQLite.
3. **AI as interface, not backend** — AI features enhance but never gate the core experience.
4. **Simplicity** — Clean, maintainable architecture with small, focused modules.
5. **Security** — No secrets in client-side code or APK bundles.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | Ionic (web components) |
| Native Bridge | Capacitor |
| Language | Plain JavaScript (ES modules) |
| Build Tool | Vite |
| Database | SQLite via @capacitor-community/sqlite |
| AI Provider | Groq (planned, Stage 1+) |
| Platform | Android |

## Offline-First Approach

- Core app (tasks, planning, calendar) does not depend on internet, AI, or a backend.
- AI features (Stage 1+) may require internet but must never block core functionality.
- All data is stored locally; cloud sync is a future optional feature.

## AI Architecture (Planned)

```
UI → AIService → AIProvider (interface) → GroqProvider
```

- The AI provider is abstracted behind an interface so it can be swapped.
- No AI provider code is hard-coded into UI or services directly.
- API keys are never stored in client-side code.

## Feature Roadmap

| Stage | Features |
|-------|----------|
| **0** (current) | Foundation, architecture, design system, navigation shells |
| **1** | Task management, basic planning, Groq AI integration |
| **2** | Voice assistant, speech-to-text/text-to-speech |
| **3** | Calendar, notifications, reminders |
| **4** | Cloud sync, authentication, payments/subscriptions |

## Current Stage

**Stage 2 — Local Task System (Completed)**

See [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) for details.

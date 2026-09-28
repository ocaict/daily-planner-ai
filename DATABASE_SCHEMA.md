# Database Schema

## Current Version

**Version 2** — Tasks and Categories

## Tables

### `meta`

Key-value store for schema versioning and app metadata.

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| version | INTEGER | NOT NULL |
| name | TEXT | NOT NULL |
| applied_at | INTEGER | ISO 8601 timestamp |

### `categories`

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| name | TEXT | NOT NULL |
| color | TEXT | Hex color |
| icon | TEXT | Ionic icon name |
| sort_order | INTEGER | DEFAULT 0 |

**Seed data:** Work, Personal, Study, Health, Shopping, Finance, Other

### `tasks`

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| title | TEXT | NOT NULL |
| description | TEXT | |
| notes | TEXT | |
| date | TEXT | YYYY-MM-DD format |
| start_time | TEXT | HH:MM format (24h) |
| due_time | TEXT | HH:MM format (24h) |
| duration_minutes | INTEGER | Positive value |
| priority | TEXT | 'low', 'medium', or 'high' |
| category_id | INTEGER | FK → categories.id |
| reminder_enabled | INTEGER | 0 or 1 |
| reminder_minutes_before | INTEGER | Non-negative |
| repeat_rule | TEXT | 'none', 'daily', 'weekly', 'monthly' |
| completed | INTEGER | 0 or 1 |
| completed_at | INTEGER | Unix timestamp (ms) |
| created_at | INTEGER | Unix timestamp (ms) |
| updated_at | INTEGER | Unix timestamp (ms) |

### Indexes

| Index | Column | Purpose |
|-------|--------|---------|
| idx_tasks_date | date | Fast date-based queries |
| idx_tasks_completed | completed | Fast completion filtering |
| idx_tasks_category | category_id | Fast category filtering |
| idx_tasks_updated | updated_at | Fast sync/refresh queries |

## Date/Time Strategy

- **Dates** stored as `YYYY-MM-DD` strings in the device's local timezone
- **Times** stored as `HH:MM` strings (24-hour format) in the device's local timezone
- **Timestamps** (created_at, updated_at, completed_at) stored as Unix timestamps in milliseconds
- All date/time comparisons use the device's local timezone
- A task is **overdue** when: `completed = 0` AND (`date < today` OR (`date = today` AND `due_time < current_time`))

## Migration History

| Version | Name | Description |
|---------|------|-------------|
| 1 | initial_schema | Creates `meta` table for schema versioning |
| 2 | tasks_and_categories | Creates `categories` and `tasks` tables with indexes, seeds default categories |

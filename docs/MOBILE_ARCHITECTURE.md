# Niva mobile architecture

## Scope

This document describes the current Expo mobile application in [`../mobile/`](../mobile/). It is the architecture reference for product work on Niva 1.1.0 and later.

## Technology stack

| Layer | Technology |
| --- | --- |
| Framework | Expo SDK 54 and React Native 0.81 |
| Language | TypeScript 5.9 |
| Navigation | React Navigation native stack and bottom tabs |
| State | Zustand |
| Local database | `expo-sqlite` |
| Growth reference | `@pedi-growth/core` with WHO standard charts |
| Native capabilities | Expo Notifications, Image Picker, Document Picker, File System, Print, and Sharing |
| Builds | EAS Build |

## Runtime flow

```text
App.tsx
  ├─ keep native splash visible
  ├─ initialise/open SQLite and run migrations
  ├─ load the local baby profile
  ├─ configure medication notifications and remove expired schedules
  └─ display the Niva startup image for at least 2.5 seconds
       └─ AppNavigator
            ├─ no profile → Welcome → Setup profile
            └─ profile exists → Main bottom tabs + detail stack routes
```

The application starts only after database initialisation and profile loading complete. Startup errors are surfaced with an in-app retry action rather than silently continuing with incomplete state.

## Navigation

The main navigation contains five tabs:

| Tab | Responsibility |
| --- | --- |
| Home | Attention-first dashboard: current summary, quick actions, progress, reminder and timeline previews |
| Timeline | Unified chronological record view with filters |
| Add | Modal action launcher for feed, sleep, growth, medication, vaccination, and document actions |
| Records | Destination for the full feeding, sleep, growth, medication, vaccination, and document screens |
| Profile | Baby identity, notification settings, data/backup, privacy, help, about, and profile deletion |

Detail screens live in the root stack so they can be launched from a tab, dashboard action, or another detail screen without duplicating UI.

## Application layers

```text
screens and reusable components
        ↓
Zustand stores (profile/dashboard) and local screen state
        ↓
repositories and services
        ↓
SQLite database / Expo device APIs
```

### Screens and components

- `src/screens/` owns feature interaction, navigation, screen-level validation, and status messaging.
- `src/components/` provides cards, layouts, inputs, dashboard widgets, charts, profile controls, and timeline presentation.
- Shared presentation values are kept in `src/theme/` and `src/components/common/`.

### State

- `BabyStore` holds the single active profile, persists profile changes, creates the initial growth/vaccination data where needed, and resets data on profile deletion.
- `DashboardStore` holds the derived dashboard summary and can refresh/reset it.
- Feature stores own list/update actions for feeding, growth, medication, sleep, and vaccination records.

### Persistence

`src/database/database.ts` opens the local SQLite database. `initDatabase.ts` runs idempotent migrations before feature repositories access data. Repositories keep SQL out of screens and map database rows to typed feature models.

## Local data model

| Table | Purpose |
| --- | --- |
| `profile` | The one active baby profile: identity, birth date, sex, measurements, blood group, and local photo URI |
| `feeding` | Timestamped type, quantity, and notes |
| `sleep` | Start/end times and calculated duration |
| `growth` | Dated weight, height, optional head circumference, and notes |
| `vaccination` | Generated schedule with due date and completion status/date |
| `medication` | Medicine, dosage, duration, frequency, reminder settings, and native notification identifiers |
| `medication_dose` | Individual pending/taken/skipped dose events linked to medication |
| `document` | Local file URI, file metadata, category, tags, notes, date, and pin/favourite state |

Migrations use `CREATE TABLE IF NOT EXISTS` plus column checks so existing device databases can gain newer optional fields without a destructive reset.

## Feature implementation details

### Profile and vaccination bootstrap

Creating or updating the profile persists local identity data. A valid weight/height pair is recorded as an initial or updated growth record when it differs from the latest value. When there are no vaccination records, the app generates the supported schedule from the recorded birth date.

### Dashboard and timeline

`DashboardRepository` derives today’s totals and upcoming status from SQLite. `TimelineService` reads feature repositories and returns normalised timeline items:

```ts
type TimelineItem = {
  id: string;
  type: 'feeding' | 'sleep' | 'growth' | 'medication' | 'vaccination';
  title: string;
  subtitle?: string;
  timestamp: string;
  status?: string;
};
```

This allows the UI to filter and render a single chronological feed without adding a second universal event table.

### Growth assessment

`GrowthAssessmentService` sends age, sex, weight, height, and optional head circumference to `@pedi-growth/core` using the WHO standard chart set. It converts reference results to an app-facing assessment with z-score, percentile, range status, and parent-facing summary. It is a reference aid only and does not make a clinical diagnosis.

### Medication reminders

`MedicationNotificationService` configures an Android notification channel and schedules reminders only after device permission is granted. It supports daily, weekly, once-only, and finite-duration schedules. Long-running daily/weekly medication uses native repeat triggers; other schedules create dated notifications in a 30-day window. Existing reminder IDs are cancelled before rescheduling so duplicate notifications are avoided.

### Documents, backup, and report exports

- `DocumentStorageService` copies selected files into the app’s private document directory before a metadata row is saved to SQLite.
- `BackupService` creates a versioned JSON snapshot of profile and record tables, validates it on import, replaces local records transactionally after confirmation, then attempts to reschedule medication notifications. Backup v1 excludes profile-photo and medical-document files.
- `HealthReportService` renders local record data into HTML, uses Expo Print to generate a PDF, and opens the device share sheet.

## Privacy model

Niva has no backend service, authentication system, analytics pipeline, or automatic cloud sync in the current app. The data lifecycle is device local except where the user explicitly chooses a system share destination for a backup, document, or report.

## Extension rules

1. Add a migration before relying on a new persisted field.
2. Put SQL in a repository and device capabilities in a dedicated service.
3. Refresh the appropriate Zustand state after mutations.
4. Use the existing tab/stack pattern; avoid duplicating feature entry points across Home, Records, and Profile.
5. Preserve the local-first privacy model unless a separately approved feature changes it.
6. Update the current-status and architecture documents with any material behaviour change.

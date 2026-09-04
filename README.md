# Niva

Niva is an offline-first Expo and React Native app that helps parents keep a baby's care records—feeding, sleep, growth, vaccinations, medication, and health documents—in one private place. It includes local medication reminders, a shareable pediatric health report, and portable JSON backup and restore.

> **Current mobile release:** `1.1.0`
> **Primary app:** [`mobile/`](mobile/)
> **Current project status:** [docs/CURRENT_PRODUCT_STATUS.md](docs/CURRENT_PRODUCT_STATUS.md)

## What is implemented

- Baby-profile setup, editing, local profile photo, and birth-date formatting.
- Dashboard with daily care summary, quick actions, latest growth, timeline preview, and reminders.
- Feeding, sleep, growth, medication, and vaccination records.
- WHO-reference growth assessment through `@pedi-growth/core`.
- Local medication notifications, notification permissions, pause, and rescheduling controls.
- Medical-document camera capture/import, categorisation, search, pin/favourite, viewing, sharing, and deletion.
- Local JSON backup/restore and a printable/shareable pediatric PDF health report.
- A five-tab navigation model: Home, Timeline, Add, Records, and Profile.
- Android internal APK and production Android App Bundle EAS profiles.

## Quick start

Niva requires Node.js 20.19 or later for Expo SDK 54.

```bash
cd mobile
npm install
npm run typecheck
npx expo start
```

For device features such as reliable notifications, document sharing, and native permissions, use a development or production build rather than relying only on Expo Go.

```bash
# From mobile/
npm run build:release:android
```

See [the development and release guide](docs/DEVELOPMENT_AND_RELEASE.md) for checks, build profiles, and submission prerequisites.

## Architecture at a glance

```text
mobile/App.tsx
  └─ initialise SQLite, profile state, and notification housekeeping
      └─ React Navigation stack + five bottom tabs
          └─ screens → Zustand stores → repositories/services → SQLite + device APIs
```

- **UI:** React Native screens and reusable components in `mobile/src/screens` and `mobile/src/components`.
- **State:** focused Zustand stores in `mobile/src/store`.
- **Persistence:** `expo-sqlite` repositories and idempotent migrations in `mobile/src/database`.
- **Device integrations:** Expo Notifications, Image Picker, Document Picker, File System, Print, and Sharing.

Detailed implementation notes are in [docs/MOBILE_ARCHITECTURE.md](docs/MOBILE_ARCHITECTURE.md).

## Privacy and medical-safety notice

Niva stores its active data locally on the device and does not include an account system or automatic cloud sync. A backup is deliberately user initiated and shared using the device share sheet. Backup version 1 does **not** include the local profile photo or medical-document files.

Niva is an organisational aid, not medical advice. Growth reference results, vaccination dates, medication schedules, and any care decisions must be reviewed with an appropriately qualified healthcare professional.

## Repository layout

```text
mobile/       Current Niva Expo application
docs/         Current product, architecture, development, and historical records
src/          Earlier platform-independent planning/core toolkit
scripts/      Legacy-core validation and utility scripts
datasets/     WHO reference data used by the retained core toolkit
data/         Local sample data for the retained core toolkit; do not treat as production data
```

The root `src/`, `scripts/`, `datasets/`, and historical documentation predate the mobile app. They are retained as reference material and tooling, but the app under active product development is `mobile/`. See [docs/README.md](docs/README.md) for the documentation map.

## Validation

```bash
# Mobile app
cd mobile
npm run typecheck
npx expo-doctor

# Retained legacy core type check
cd ..
npm run check
```

The root `npm test` command currently runs legacy executable scripts through Vitest. Those scripts are not Vitest test cases, can alter local sample data, and their failure is masked by the current npm script. Do not use it as a release gate until that legacy test harness is separated or corrected.

## Contribution and release discipline

1. Keep product changes scoped to `mobile/` unless the legacy toolkit is intentionally being changed.
2. Run the checks applicable to the files changed.
3. Verify native behaviour on a development or release build.
4. Do not commit personal records, exported backups, generated PDFs, credentials, or device-specific files.
5. Follow [docs/DEVELOPMENT_AND_RELEASE.md](docs/DEVELOPMENT_AND_RELEASE.md) before creating an Android build or submitting to a store.

# Niva current product status

**Reviewed:** 2026-09-04
**Current mobile version:** 1.1.0
**Release commit:** `9f364be` (`Release Niva 1.1.0`)
**Primary codebase:** [`mobile/`](../mobile/)

## Executive summary

Niva is a functional, local-first baby-care mobile app built with Expo SDK 54, React Native 0.81, TypeScript, SQLite, and Zustand. The current release supports one local baby profile and the complete record workflow for feeding, sleep, growth, vaccinations, medications, and health documents. It also supports medication notifications, data backup/restore, and a shareable pediatric PDF report.

The app is release-candidate quality for code-level TypeScript validation, but it still needs native-device regression testing before store distribution. The present repository must not treat the legacy root test runner as a passing automated test suite.

## Feature status

| Area | Status | Current behaviour |
| --- | --- | --- |
| Onboarding and profile | Implemented | Welcome screen, required profile setup, DD-MM-YYYY entry, gender, optional measurements/blood group, and a local profile photo |
| Dashboard | Implemented | Daily feeding/sleep/medication summary, next vaccination, quick actions, timeline preview, and growth summary |
| Feeding | Implemented | Add, list, and delete feeding records with feeding type, quantity, and notes |
| Sleep | Implemented | Start/end/duration record view and deletion |
| Growth | Implemented | Add, edit, delete, chart/history views, and WHO-reference weight, length/height, and optional head-circumference assessment |
| Vaccinations | Implemented | Schedule generated from birth date; due, overdue, completed, and pending states; completion can be changed in the app |
| Medication | Implemented | Medication details, schedule, dose history/status, and reminder configuration |
| Device notifications | Implemented for medication | Permission handling, Android notification channel, daily/weekly/date-based scheduling, pause, cleanup, and rescheduling |
| Timeline | Implemented | Unified, filterable feed of feeding, sleep, growth, medication, and vaccination events |
| Medical documents | Implemented | Camera capture or file import, local copy, search, categories, metadata, pin/favourite, viewing, sharing, and deletion |
| Backup and restore | Implemented | Versioned JSON export, validation, destructive restore confirmation, and medication-reminder rescheduling after restore |
| Pediatric health report | Implemented | Generate and share a PDF containing profile, growth, vaccination, medication, recent feeding, and recent sleep records |
| Branding and distribution | Implemented | Niva name, icon/splash assets, EAS Android internal APK and production App Bundle profiles |

## Product constraints and known limitations

- **Local only:** there is no account, multi-device sync, server API, or automatic cloud backup.
- **Single profile:** the SQLite schema and UI are built around one local baby profile.
- **Medical documents:** document files are local. They are not included in the version-1 backup format.
- **Profile photo:** it is intentionally cleared during backup and restore because a device-local URI is not portable.
- **Reminders:** native scheduling code currently creates medication reminders. Vaccinations are surfaced as due/pending records, but device-level vaccination notifications are not separately scheduled by the current implementation.
- **Clinical safety:** vaccine schedules and growth assessments are reference aids, not medical advice or diagnoses; parents must confirm decisions with a clinician.
- **Expo Go:** native notification behaviour is not a complete production proxy in Expo Go. Test it in a development or release build.

## Verification performed in this review

| Check | Result | Notes |
| --- | --- | --- |
| `mobile/npm run typecheck` | Pass | TypeScript completed with exit code 0 |
| Root `npm run check` | Pass | Retained JavaScript/TypeScript core check completed with exit code 0 |
| Root `npm test` | Not a release gate | Vitest reported 81 failed files with zero test cases; the npm script then masks this with `|| echo` and exits successfully. The executable scripts also modified local sample data and generated datasets. |
| `npx expo-doctor` | Not confirmed | Did not complete in the available review window; rerun before a build or release. |
| Physical-device regression | Required | Device permissions, notifications, sharing, document handling, and safe-area UI require a dev or release build check. |

## Release readiness

The repository configuration supports these EAS workflows:

- **`release-apk`**: internal Android APK for direct installation and device validation.
- **`production`**: Android App Bundle with remote auto-increment configured for release distribution.
- **`submit.production`**: Android Internal track/draft submission configuration.

Before a release or submission, complete the checklist in [Development and release](DEVELOPMENT_AND_RELEASE.md). Store submission needs the correct Expo/EAS and Google Play credentials and an explicit human approval at the time of submission.

## Documentation boundary

The old root toolkit is still present in `src/`, `scripts/`, and `datasets/`. Its numbered documents and sprint records are historical rather than the current mobile specification. See [the documentation map](README.md) for the maintained documentation set.

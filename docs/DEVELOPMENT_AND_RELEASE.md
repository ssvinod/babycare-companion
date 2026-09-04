# Niva development and release guide

## Prerequisites

- Node.js **20.19 or later** (Expo SDK 54 requirement).
- npm.
- An Android or iOS device/simulator for native verification.
- Expo/EAS authentication only when building or submitting.
- GitHub authentication only when you intend to push a reviewed commit.

The mobile app lives in [`../mobile/`](../mobile/). Run mobile commands from that directory unless a command says otherwise.

## Local setup

```bash
git clone git@github.com:ssvinod/babycare-companion.git
cd babycare-companion/mobile
npm install
npm run typecheck
npx expo start
```

Use `npx expo start --clear` when a stale Metro cache is suspected. Do not delete device data as a first response to a UI or migration issue; preserve a backup before testing destructive flows.

## Useful commands

| Command | Use |
| --- | --- |
| `npm run typecheck` | Required TypeScript check for mobile code |
| `npx expo-doctor` | Verify Expo dependency/config compatibility before build work |
| `npm run android` | Run an Android native project locally (`expo run:android`) |
| `npm run ios` | Run an iOS native project locally (`expo run:ios`) |
| `npm run web` | Start the web target; not a substitute for native verification |
| `npm run build:release:android` | Create an internal-distribution Android APK through EAS |
| `npm run build:production:android` | Create a production Android App Bundle through EAS |
| `npm run submit:android` | Submit the configured production artifact to Google Play’s Internal track as a draft |

The root package commands validate the retained planning/core toolkit. They are separate from the mobile app:

```bash
cd ..
npm run check
```

Do **not** use root `npm test` as a release gate yet. It treats many executable `scripts/test*.js` files as Vitest suites despite containing no tests, masks the resulting failure, and can alter sample data/datasets.

## Change workflow

1. Inspect `git status` before making changes. Do not mix a feature change with generated data, backups, or another person’s work.
2. Make the smallest coherent change in `mobile/`.
3. For schema changes, add an idempotent migration and test both a new profile and an existing profile.
4. Run `npm run typecheck`.
5. Run `npx expo-doctor` for dependency, configuration, or release changes.
6. Test the changed flow in a native development/release build where it uses a device capability.
7. Update [current status](CURRENT_PRODUCT_STATUS.md), [architecture](MOBILE_ARCHITECTURE.md), and `CHANGELOG.md` when user-visible behaviour changes.
8. Inspect the staged diff before committing. Never stage `data/`, generated WHO datasets, private files, backups, PDFs, or credentials unless intentionally changed and reviewed.

## Native regression checklist

Run this on a physical device before a release:

- Start from a clean install and create a profile.
- Edit the profile, set/change a photo, and confirm the date format and profile display.
- Add and remove feeding, sleep, growth, medication, and vaccination records.
- Check the dashboard and timeline immediately after mutations.
- Verify growth assessment displays a sensible reference result and safety disclaimer.
- Grant notification permission; add an active medication; confirm the expected notification; pause and reschedule it.
- Capture/import, search, open, edit, share, and delete a medical document.
- Export a backup, make a harmless data change, restore the backup, and confirm both records and medication reminders are restored as expected.
- Generate and open/share a health report PDF.
- Check every tab and long list for safe-area and bottom-navigation occlusion.

## Build profiles

`mobile/eas.json` defines the following profiles:

| Profile | Output | Intended use |
| --- | --- | --- |
| `development` | Development client | Engineering/debug testing |
| `preview` | Internal Android APK | Shared pre-release testing |
| `release-apk` | Internal Android APK | Physical-device release validation and direct installation |
| `production` | Android App Bundle | Google Play release artifact |

The project uses EAS remote app-version management (`appVersionSource: remote`). Android’s checked-in `versionCode` is 2; EAS production builds are configured to auto-increment remotely. Confirm the effective store version in EAS before every submission.

## Release checklist

1. Confirm the branch contains only intended commits and a clean working tree.
2. Confirm `mobile/package.json` and `mobile/app.json` have the correct product version.
3. Run `npm run typecheck` and `npx expo-doctor` successfully.
4. Complete the native regression checklist on an APK or development build.
5. Create an internal APK with `npm run build:release:android` and install it on a physical Android device.
6. Review the build artifact, app name, icon, permissions, startup screen, and notification behaviour.
7. Commit documentation/version changes, push the reviewed commit, and tag the release only after validation succeeds.
8. For Google Play, build the production AAB then submit with `npm run submit:android` only after explicit approval. The configured Android track is **Internal** and the release status is **draft**.

## Credentials and external actions

- Do not commit `gh` tokens, Expo tokens, Google service-account files, keystores, or `.env` secrets.
- A successful local GitHub login does not override protected-branch rules.
- Creating an EAS build uses the configured Expo account and consumes remote build capacity.
- Google Play submission is an external publication action. Confirm the target account, track, version, release notes, and artifact immediately before submitting.

## Troubleshooting

| Symptom | First check |
| --- | --- |
| Expo package/version warnings | Run `npx expo-doctor`; use `npx expo install --fix` only after reviewing the proposed dependency changes |
| Notification does not arrive in Expo Go | Test a development or release build; Expo Go is not a complete native-notification environment |
| Reminder time/date is wrong | Check device timezone, medication start/end dates, frequency, and the saved `HH:MM` time |
| Backup restore removes current data | This is intentional after the destructive confirmation; export a fresh backup first |
| Profile photo missing after restore | Expected in backup v1; photo files are excluded by design |
| Test command changes sample data | Do not run root `npm test` until the legacy test harness is repaired; use the mobile type check and native tests instead |

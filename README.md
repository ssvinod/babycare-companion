# BabyCare Companion

Private, family-owned planning tools for Viha's health records, appointments, reminders, milestones, and memories.

## Status

`v0.1.0` establishes the project and documentation foundation. It does not yet create Calendar or Reminders items.

## Safety and privacy

- This project is an organizational aid, not medical advice or a substitute for a pediatrician.
- Vaccination dates, products, eligibility, and catch-up decisions must be confirmed with Viha's pediatrician and the vaccination record before reminders are created.
- Family data stays local by default in portable formats. Do not commit private health records, exports, backups, or secrets.

## Planned capabilities

- Scriptable adapter for Apple Calendar and Reminders
- Calendar export (ICS) for Google Calendar or Apple Calendar import
- Configurable appointment and reminder data
- Local logging, backup metadata, and duplicate protection
- Future: growth, development, feeding, sleep, health, safety, and memory modules

## Getting started

1. Read [the project charter](docs/00_Project_Charter.md) and [SRS](docs/02_Software_Requirements_Specification.md).
2. Copy `src/config/profile.example.json` to a local, ignored `profile.local.json` only when ready to configure the family profile.
3. Implement and test the core before connecting it to Calendar or Reminders.

## Repository layout

```text
docs/        Living product and engineering documentation
src/         Platform-independent core and adapters
tests/       Automated and manual test specifications
scripts/     Local development and export helpers
backups/     Local-only backup location (ignored)
release/     Release artefacts
```

## Local Git setup

The configured remote is `https://github.com/ssvinod/babycare-companion.git`.
Authenticate GitHub on this Mac (GitHub Desktop or `gh auth login`) before pushing the initial commit.

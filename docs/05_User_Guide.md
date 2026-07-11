# User Guide

## Before using reminders

Confirm every appointment, vaccine, and due date with the vaccination record and pediatrician. This project creates organizational reminders only.

## First setup (planned)

1. Copy `src/config/profile.example.json` to `src/config/profile.local.json`.
2. Fill only the family information you want to keep locally.
3. Review the generated plan in dry-run mode.
4. Confirm the plan.
5. Run the Scriptable adapter or import the generated ICS file.

## Troubleshooting

If a date, vaccine, or reminder is uncertain, do not import it. Correct the confirmed plan first and regenerate the output.

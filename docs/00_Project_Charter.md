# Project Charter

## Purpose

BabyCare Companion is a private, family-controlled project that helps organize childhood appointments, reminders, records, milestones, and memories. Its first deliverable is a reliable vaccination-reminder workflow that can be reviewed and confirmed by the family's pediatrician.

## Goals

1. Keep family data portable and under family control.
2. Produce deterministic, reviewable reminder plans.
3. Support Apple Calendar/Reminders through Scriptable and calendar export through ICS.
4. Make future features modular, testable, and maintainable.

## Non-goals

- Diagnosing, prescribing, or making medical decisions.
- Determining a vaccination schedule without clinician confirmation.
- Storing secrets or private health records in Git.

## Stakeholders

- Parents: product owners and final approvers.
- Pediatrician: authority for vaccine and health decisions.
- Maintainer: implements and verifies the software.

## Success criteria for v0.1

- Repository structure and living documentation are present.
- Local configuration is clearly separated from committed files.
- A safe, reviewable plan exists before any calendar write operation.

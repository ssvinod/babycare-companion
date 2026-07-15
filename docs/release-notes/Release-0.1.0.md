# Release Notes

## Version

v0.1.0-alpha

Release Date: 2026-07-15

---

# Overview

This release establishes the initial technical foundation of the BabyCare Companion project.

The primary goal of this milestone is to build the reusable platform-independent core architecture before integrating with Scriptable, Apple Calendar, and Apple Reminders.

---

# Features

## Core Framework

- Project structure created
- Node.js development environment configured
- Logging framework
- Version manager
- Configuration manager
- Platform-independent architecture

## Data Models

Implemented:

- Child
- Vaccine
- Reminder (initial)
- Milestone (initial)

## Vaccination Engine

Implemented:

- IAP vaccination schedule
- Calendar-aware scheduling
- Leap-year-safe calculations
- Vaccination service

## Calendar

Implemented:

- RFC5545 (.ics) calendar generation
- Calendar export script

## Reminder Engine

Implemented:

- Automatic reminders (7 days before)
- Automatic reminders (3 days before)
- Reminder on due date

## Utilities

Implemented:

- Date utilities

## Development Tools

- Development launcher
- Logger test script
- Calendar export test
- Reminder test

## Documentation

Created:

- Project Charter
- Product Vision
- SRS
- Software Architecture
- Developer Guide
- User Guide
- Technology Stack
- Data Model
- API Design
- Project Structure
- Coding Standards
- Release Process
- ADR documents
- Sprint documentation

---

# Known Limitations

The following modules are planned for future milestones:

- Scriptable Adapter
- Apple Calendar Integration
- Apple Reminders Integration
- Backup & Restore
- Growth Tracking
- Appointment Management
- Dashboard
- Multi-child support

---

# Next Release

v0.2.0-alpha

Planned Features:

- Development milestone engine
- Growth tracking
- Appointment management
- Scriptable widgets
- Apple Calendar synchronization
- Apple Reminders synchronization

---

End of Release Notes
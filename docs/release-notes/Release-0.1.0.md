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

## Core Framework / Services

- Project structure created
- Node.js development environment configured
- Logging framework
- Version manager
- Configuration manager
- Platform-independent architecture
- Health Visit Service
- Unified Timeline Service

## Data Models

Implemented:

- Child
- Vaccine
- Reminder (initial)
- Milestone (initial)
- Recommended Health Visit Schedule

## Vaccination Engine

Implemented:

- IAP vaccination schedule
- Calendar-aware scheduling
- Leap-year-safe calculations
- Vaccination service

## Calendar

Implemented:

- RFC5545 (.ics) calendar generation
- Vaccination calendar export
- Development milestone calendar export
- Stable calendar UID generation
- Apple Calendar adapter
- Shared application context
- Timeline aggregation service

## Reminder Engine

Implemented:

- Automatic reminders (7 days before)
- Automatic reminders (3 days before)
- Reminder on due date
- Stable reminder/event identifiers

## Development Milestones

Implemented:

- Development milestone schedule
- Milestone generation engine
- Milestone calendar export

## Platform Adapters

Implemented:

- Scriptable adapter
- Apple Calendar adapter
- Apple Reminders adapter
- Shared Application Context

## Utilities

Implemented:

- Date utilities

## Development Tools

- Development launcher
- Logger test script
- Vaccination test scripts
- Reminder test script
- Calendar export tests
- Milestone test scripts
- Apple Calendar adapter test
- Scriptable adapter test
- Event ID test
- Timeline test
- Application Context test

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

## Dashboard

Implemented:

- Dashboard aggregation service
- Unified chronological timeline
- Unified Dashboard Service
- Upcoming Events Service
- Shared Timeline Aggregator

# Known Limitations

- Backup & Restore
- Growth Tracking
- Appointment Management
- Dashboard
- Multi-child support

---

# Next Release

v0.2.0-alpha

Planned Features:

- Apple Reminders adapter
- Growth tracker
- Appointment manager
- Dashboard
- Scriptable widgets
- Calendar synchronization
- Multi-child support

---

End of Release Notes
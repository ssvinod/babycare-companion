# Test Strategy

## Automated tests

- Configuration schema validation
- ISO date parsing and time-zone handling
- Stable ID generation
- Duplicate detection
- Dry-run action planning
- ICS escaping and serialization

## Manual acceptance tests

- Scriptable requests Calendar and Reminders permissions once.
- First run creates only previewed items.
- Second run creates no duplicates.
- An approved plan can be exported and imported into a test calendar.
- A rollback/restore operation is previewed before it changes anything.

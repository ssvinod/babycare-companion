# Software Architecture Document

```text
Confirmed reminder plan (JSON)
            |
            v
Platform-independent core
  validation | duplicate IDs | logging | backup metadata
       |                         |
       v                         v
Scriptable adapter             ICS exporter
Apple Calendar/Reminders       Apple/Google Calendar import
```

## Boundaries

- `src/core`: validation, planning, identifiers, logging contracts; no Scriptable globals.
- `src/modules`: optional domain modules that produce validated reminder plans.
- `src/ui`: menus and user-facing text.
- `src/data`: versioned, non-private templates only.
- `src/config`: examples and schema; real profiles stay local and ignored.
- adapters: platform-specific calls and permission prompts.

## Identifier strategy

Every generated item uses a stable ID such as `vaccination:visit-6w:2026-08-03`. Adapters persist the ID in item notes/metadata where supported, allowing subsequent runs to create, update, or skip deterministically.

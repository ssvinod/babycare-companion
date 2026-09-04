# Documentation map

Niva’s current product documentation is organised around the Expo mobile app in [`../mobile/`](../mobile/).

## Current source of truth

| Document | Use it for |
| --- | --- |
| [Current product status](CURRENT_PRODUCT_STATUS.md) | Release state, implemented scope, constraints, and known validation gaps |
| [Mobile architecture](MOBILE_ARCHITECTURE.md) | App structure, navigation, persistence, data model, and device integrations |
| [Development and release](DEVELOPMENT_AND_RELEASE.md) | Local setup, validation, build profiles, and release workflow |
| [Root README](../README.md) | Concise project introduction and quick start |
| [Changelog](../CHANGELOG.md) | Versioned release history |

## Historical material

The numbered documents, ADRs, sprint logs, release notes, and `developer-guide/PROJECT_STATUS.md` describe the original platform-independent planning toolkit that lives in the repository root (`src/`, `scripts/`, and `datasets/`). They are retained to preserve decisions and implementation history.

They do not define the shipped Niva mobile feature set. For the current app, use the documents listed above.

## Documentation rules

- Update the current-status document when scope, validation, or release readiness changes.
- Update the architecture document when navigation, storage, integrations, or data flows change.
- Record user-visible releases in `CHANGELOG.md`.
- Keep historical documents factual; add an archival note rather than rewriting past decisions as if they described the current app.
- Never place real baby records, backups, report exports, credentials, or private device paths in documentation.

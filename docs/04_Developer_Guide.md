# Developer Guide

## Conventions

- ECMAScript modules, 4-space indentation, camelCase.
- Use JSDoc for public functions.
- Keep platform APIs in adapters only.
- Use Conventional Commits, for example: `docs: initialize BabyCare Companion foundation`.

## Workflow

1. Create a feature branch.
2. Add requirements and tests with implementation.
3. Run `npm test` and `npm run check`.
4. Review the dry-run output before testing a calendar write.
5. Commit and open a pull request.

## Never commit

Private family data, health records, event exports, backups, access tokens, or clinician notes.

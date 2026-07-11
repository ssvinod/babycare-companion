# Software Requirements Specification

## 1. Scope

The system manages family-approved reminder plans and exports them to supported calendar/reminder platforms. It is not a clinical decision system.

## 2. Functional requirements

- **FR-001 Configuration:** Load a local family profile without committing private data.
- **FR-002 Plan validation:** Reject reminder plans missing an identifier, date, title, or confirmation status.
- **FR-003 Preview:** Show all planned creates, updates, and skips before a platform write.
- **FR-004 Idempotency:** Use stable item identifiers to avoid duplicates on repeated runs.
- **FR-005 Logging:** Record timestamps, action type, stable item ID, outcome, and error details locally.
- **FR-006 Backup metadata:** Capture local configuration version and installed item IDs before updates.
- **FR-007 Export:** Generate standards-compliant ICS from confirmed event plans.
- **FR-008 Scriptable adapter:** Create Calendar and Reminders items only after the user grants iOS permissions.

## 3. Health-safety requirements

- **HS-001:** Vaccine dates and details are sourced from a pediatrician-confirmed schedule or record.
- **HS-002:** The UI labels all schedule data as organizational reminders.
- **HS-003:** The system never suggests dosage, treatment, or a medical response to symptoms.
- **HS-004:** Any schedule change requires explicit user confirmation before write/export.

## 4. Non-functional requirements

- Local-first data handling.
- Deterministic output for the same validated input.
- Clear audit log and dry-run support.
- Tests for date parsing, duplicate detection, validation, and ICS serialization.

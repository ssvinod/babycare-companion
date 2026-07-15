/**
 * Event ID Service
 *
 * Generates stable identifiers for calendar and reminder events.
 */

export function createEventId(child, visit) {

    return [
        child.name.trim().toLowerCase().replace(/\s+/g, "-"),
        visit.id
    ].join("-");
}

export function createCalendarUID(child, visit) {

    return `${createEventId(child, visit)}@babycarecompanion`;
}
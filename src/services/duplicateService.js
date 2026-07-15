/**
 * Duplicate Detection Service
 */

export function findDuplicateEventIds(events) {

    const seen = new Set();
    const duplicates = [];

    for (const event of events) {

        if (seen.has(event.uid)) {
            duplicates.push(event.uid);
        } else {
            seen.add(event.uid);
        }

    }

    return duplicates;
}
/**
 * iCalendar (.ics) Generator
 *
 * Converts vaccination schedules into RFC5545 compliant
 * calendar events.
 */

function formatDate(date) {
    return date
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";
}

function formatDateOnly(date) {
    return (
        date.getUTCFullYear().toString() +
        String(date.getUTCMonth() + 1).padStart(2, "0") +
        String(date.getUTCDate()).padStart(2, "0")
    );
}

export function generateICS(child, vaccinations) {

    const now = formatDate(new Date());

    let calendar = "";

    calendar += "BEGIN:VCALENDAR\r\n";
    calendar += "VERSION:2.0\r\n";
    calendar += "PRODID:-//BabyCare Companion//EN\r\n";
    calendar += "CALSCALE:GREGORIAN\r\n";

   for (const visit of vaccinations) {

    calendar += "BEGIN:VEVENT\r\n";

    calendar += `UID:${child.name}-${visit.id}@babycarecompanion\r\n`;

    calendar += `DTSTAMP:${now}\r\n`;

    calendar += `DTSTART;VALUE=DATE:${formatDateOnly(visit.dueDate)}\r\n`;

    calendar += `SUMMARY:${visit.visit} Vaccination\r\n`;

    calendar += `DESCRIPTION:Vaccines: ${visit.vaccines.join(", ")}\r\n`;

    calendar += "END:VEVENT\r\n";
   } 

    calendar += "END:VCALENDAR\r\n";

    return calendar;
}
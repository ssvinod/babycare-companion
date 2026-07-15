/**
 * iCalendar (.ics) Generator
 *
 * Converts vaccination schedules into RFC5545 compliant
 * calendar events.
 */
import { createCalendarUID } from "./eventIdService.js";

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
        calendar += `UID:${createCalendarUID(child, visit)}\r\n`;
        calendar += `DTSTAMP:${now}\r\n`;
        calendar += `DTSTART;VALUE=DATE:${formatDateOnly(visit.dueDate)}\r\n`;
        const title =
            visit.title ??
            `${visit.visit} Vaccination`;
        const descriptionLabel =
            visit.descriptionLabel ??
            "Vaccines";
        const items =
            visit.vaccines ??
            visit.milestones ??
            [];
        calendar += `SUMMARY:${title}\r\n`;
        calendar += `DESCRIPTION:${descriptionLabel}: ${items.join(", ")}\r\n`;
        calendar += "END:VEVENT\r\n";
    }
    calendar += "END:VCALENDAR\r\n";

    return calendar;
}
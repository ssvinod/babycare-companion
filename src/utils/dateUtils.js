/**
 * Date Utility Functions
 * BabyCare Companion
 */
export function addOffset(date, offset = {}) {
    const d = new Date(date);
    if (offset.years)
        d.setFullYear(d.getFullYear() + offset.years);
    if (offset.months)
        d.setMonth(d.getMonth() + offset.months);
    if (offset.weeks)
        d.setDate(d.getDate() + offset.weeks * 7);
    if (offset.days)
        d.setDate(d.getDate() + offset.days);
    return d;
}
export function formatDate(date) {
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}
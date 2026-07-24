export function shortDate(value) {
    if (!value)
        return "";
    const d =
        value instanceof Date
            ? value
            : new Date(value);
    if (Number.isNaN(d.getTime()))
        return "";
    return d.toISOString().slice(0, 10);
}
export function shortDateTime(value) {
    if (!value)
        return "";
    const d =
        value instanceof Date
            ? value
            : new Date(value);
    if (Number.isNaN(d.getTime()))
        return "";
    const yyyy = d.getFullYear();
    const mm = String(
        d.getMonth() + 1
    ).padStart(2, "0");
    const dd = String(
        d.getDate()
    ).padStart(2, "0");
    const hh = String(
        d.getHours()
    ).padStart(2, "0");
    const min = String(
        d.getMinutes()
    ).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}
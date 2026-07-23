function weeks(n) {
    return n * 7;
}
export function getMeasurementInterval(ageDays) {
    if (ageDays < 180)
        return weeks(2);
    if (ageDays < 365)
        return weeks(4);
    if (ageDays < 730)
        return weeks(8);
    return weeks(12);
}
export function getNextMeasurementDate(child, history) {
    if (!history.length)
        return child.birthDate;
    const latest =
        history.at(-1);
    const interval =
        getMeasurementInterval(
            child.getAgeOnDate(latest.date)
        );
    return new Date(
        latest.date.getTime() +
        interval * 24 * 60 * 60 * 1000
    );
}
export function getAgeInDays(birthDate, today = new Date()) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor(
        (today - birthDate) / msPerDay
    );
}
export function getAgeInWeeks(birthDate, today = new Date()) {
    return Math.floor(
        getAgeInDays(birthDate, today) / 7
    );
}
export function getAgeInMonths(birthDate, today = new Date()) {
    return (
        (today.getFullYear() - birthDate.getFullYear()) * 12 +
        (today.getMonth() - birthDate.getMonth())
    );
}
export function getAgeInYears(birthDate, today = new Date()) {
    return Math.floor(
        getAgeInMonths(birthDate, today) / 12
    );
}
export function getAgeDisplay(birthDate, today = new Date()) {
    const months = getAgeInMonths(birthDate, today);
    if (months < 1) {
        return `${getAgeInWeeks(birthDate, today)} weeks`;
    }
    if (months < 24) {
        return `${months} months`;
    }
    return `${getAgeInYears(birthDate, today)} years`;
}
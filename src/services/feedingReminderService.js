export function shouldFeedAgain(
    lastFeeding,
    hours = 3
) {
    if (!lastFeeding)
        return true;
    const elapsedHours =
        (
            Date.now() -
            new Date(lastFeeding.date)
        ) / 3600000;
    return elapsedHours >= hours;
}
export function nextFeedTime(
    lastFeeding,
    hours = 3
) {
    if (!lastFeeding)
        return null;
    return new Date(
        new Date(lastFeeding.date)
            .getTime()
        + hours * 3600000
    );
}
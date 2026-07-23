export function generateGrowthAlerts(history) {
    const alerts = [];
    if (!history?.length)
        return alerts;
    const latest =
        history.at(-1);
    if (
        latest.weightCategory === "<3rd"
    ) {
        alerts.push({
            severity: "high",
            message:
                "Weight below 3rd percentile."
        });
    }
    if (
        latest.lengthCategory === "<3rd"
    ) {
        alerts.push({
            severity: "high",
            message:
                "Length below 3rd percentile."
        });
    }
    if (
        latest.headCircumferenceCategory === "<3rd"
    ) {
        alerts.push({
            severity: "high",
            message:
                "Head circumference below 3rd percentile."
        });
    }
    if (history.length >= 2) {
        const previous =
            history.at(-2);
        if (
            latest.weightPercentile + 15 <
            previous.weightPercentile
        ) {
            alerts.push({
                severity: "medium",
                message:
                    "Weight percentile dropped significantly."
            });
        }
        if (
            latest.weight >
            previous.weight
        ) {
            alerts.push({
                severity: "info",
                message:
                    "Weight continues to increase."
            });
        }
    }
    return alerts;
}
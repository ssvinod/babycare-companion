export function analyzeGrowthTrend(history) {
    if (history.length < 2) {
        return {
            trend: "Insufficient Data",
            weightChangeKg: 0.0
        };
    }

    const previous = history[history.length - 2];
    const latest = history[history.length - 1];
    const change = Number(
        (latest.weight - previous.weight).toFixed(1)
    );

    let trend = "Stable";

    if (change > 0.3)
        trend = "Healthy Gain";
    else if (change < 0)
        trend = "Weight Loss";
    return {
        trend,
        weightChangeKg: change
    };
}
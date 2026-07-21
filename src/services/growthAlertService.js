export function generateGrowthAlerts(analysis, trend) {
    const alerts = [];
    const latest = analysis.at(-1);

    if (!latest)
        return alerts;

    if (latest.weightStatus === "Underweight") {
        alerts.push({
            severity: "High",
            message: "Weight is below the 3rd percentile."
        });
    }

    if (trend.trend === "Weight Loss") {
        alerts.push({
            severity: "High",
            message: "Weight loss detected."
        });
    }

    if (trend.trend === "Stable") {
        alerts.push({
            severity: "Medium",
            message: "Weight gain is minimal."
        });
    }
    return alerts;
}
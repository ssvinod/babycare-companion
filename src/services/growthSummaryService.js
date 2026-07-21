export function createGrowthSummary(child, analysis, trend, alerts) {
    const latest = analysis.at(-1);
    return {
        child: child.name,
        lastMeasurement: latest?.date ?? null,
        weight: latest?.weight ?? null,
        weightPercentile: latest?.weightPercentile ?? null,
        weightStatus: latest?.weightStatus ?? null,
        trend: trend.trend,
        weightChangeKg: trend.weightChangeKg,
        alertCount: alerts.length,
        alerts
    };
}
export function createGrowthSummary(
    child,
    analysis,
    trend,
    alerts
) {
    const latest = analysis.at(-1);
    return {
        child: child.name,
        ageDays:
            child.getAgeOnDate(
                latest?.date ?? new Date()
            ),
        lastMeasurement:
            latest?.date ?? null,
        weight:
            latest?.weight ?? null,
        weightPercentile:
            latest?.weightPercentile ?? null,
        weightStatus:
            latest?.weightStatus ?? null,
        length:
            latest?.length ?? null,
        lengthPercentile:
            latest?.lengthPercentile ?? null,
        lengthStatus:
            latest?.lengthStatus ?? null,
        headCircumference:
            latest?.headCircumference ?? null,
        headCircumferencePercentile:
            latest?.headCircumferencePercentile ?? null,
        headCircumferenceStatus:
            latest?.headCircumferenceStatus ?? null,
        trend:
            trend.trend,
        weightChangeKg:
            trend.weightChangeKg,
        alertCount:
            alerts.length,
        alerts
    };
}
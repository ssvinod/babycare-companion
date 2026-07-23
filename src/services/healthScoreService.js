import { calculateHealthMetrics } from "./healthMetricsService.js";

export function calculateHealthScore(context) {
    const metrics =
        calculateHealthMetrics(context);
    let score = 100;
    score -=
        metrics.overdueCount * 8;
    score +=
        metrics.vaccinationCompletion * 10;
    score +=
        metrics.growthCompletion * 5;
    if (score > 100)
        score = 100;
    if (score < 0)
        score = 0;
    let level = "Excellent";
    if (score < 90)
        level = "Good";
    if (score < 75)
        level = "Needs Attention";
    if (score < 50)
        level = "High Risk";
    return {
        score: Math.round(score),
        level,
        metrics
    };
}
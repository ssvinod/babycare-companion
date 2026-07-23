import { generateGrowthPdf }
from "./growthPdfService.js";
export function generateHealthReport(context) {
    const latest =
        context.growthSummary;
    return generateGrowthPdf({
        child:
            latest.child,
        lastMeasurement:
            latest.lastMeasurement,
        weight:
            latest.weight,
        length:
            latest.length,
        headCircumference:
            latest.headCircumference,
        weightPercentile:
            latest.weightPercentile,
        lengthPercentile:
            latest.lengthPercentile,
        headCircumferencePercentile:
            latest.headCircumferencePercentile,
        weightStatus:
            latest.weightStatus,
        lengthStatus:
            latest.lengthStatus,
        headCircumferenceStatus:
            latest.headCircumferenceStatus,
        trend:
            latest.trend,
        alertCount:
            latest.alertCount,
        alerts:
            latest.alerts,
        vaccinations:
            context.vaccinations ?? [],
        milestones:
            context.milestones ?? [],
        appointments:
            context.appointments ?? [],
        timeline:
            context.timeline ?? []
    });
}
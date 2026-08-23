import { calculateAll } from '@pedi-growth/core';
import { Baby } from '../models/Baby';
import { Growth } from '../models/Growth';
export type GrowthStatus =
    'within-range' | 'below-range' | 'above-range' | 'needs-review' | 'unavailable';
export interface GrowthMetricAssessment {
    label: string;
    value: number;
    unit: string;
    zScore: number | null;
    percentile: number | null;
    status: GrowthStatus;
    statusLabel: string;
}
export interface GrowthAssessment {
    measurementDate: string;
    ageInDays: number;
    weight: GrowthMetricAssessment | null;
    height: GrowthMetricAssessment | null;
    headCircumference: GrowthMetricAssessment | null;
    overallStatus: GrowthStatus;
    overallLabel: string;
    summary: string;
}
function round(value: number, digits = 1): number {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
}
function statusFromZScore(zScore: number | null): {
    status: GrowthStatus;
    label: string;
} {
    if (zScore === null || !Number.isFinite(zScore)) {
        return {
            status: 'unavailable',
            label: 'Assessment unavailable',
        };
    }
    if (zScore < -2) {
        return {
            status: 'below-range',
            label: 'Below reference range',
        };
    }
    if (zScore > 2) {
        return {
            status: 'above-range',
            label: 'Above reference range',
        };
    }
    return {
        status: 'within-range',
        label: 'Within expected range',
    };
}
function buildMetric(
    label: string,
    value: number,
    unit: string,
    result:
        | {
              zScore?: number;
              percentile?: number;
          }
        | null
        | undefined
): GrowthMetricAssessment {
    const zScore =
        typeof result?.zScore === 'number' && Number.isFinite(result.zScore)
            ? result.zScore
            : null;
    const percentile =
        typeof result?.percentile === 'number' && Number.isFinite(result.percentile)
            ? result.percentile
            : null;
    const status = statusFromZScore(zScore);
    return {
        label,
        value,
        unit,
        zScore: zScore === null ? null : round(zScore, 2),
        percentile: percentile === null ? null : round(percentile, 1),
        status: status.status,
        statusLabel: status.label,
    };
}
function getOverallStatus(metrics: Array<GrowthMetricAssessment | null>): GrowthStatus {
    const available = metrics.filter(
        (metric): metric is GrowthMetricAssessment =>
            metric !== null && metric.status !== 'unavailable'
    );
    if (available.length === 0) {
        return 'unavailable';
    }
    if (
        available.some(
            (metric) => metric.status === 'below-range' || metric.status === 'above-range'
        )
    ) {
        return 'needs-review';
    }
    return 'within-range';
}
function overallLabel(status: GrowthStatus): string {
    switch (status) {
        case 'within-range':
            return 'Growth within expected range';
        case 'needs-review':
            return 'Growth needs review';
        case 'below-range':
            return 'Below reference range';
        case 'above-range':
            return 'Above reference range';
        default:
            return 'Growth assessment unavailable';
    }
}
function summaryText(status: GrowthStatus): string {
    switch (status) {
        case 'within-range':
            return (
                'Latest measurements are within ' +
                'the WHO reference range for age and sex.'
            );
        case 'needs-review':
            return (
                'One or more measurements fall outside ' +
                'the usual WHO reference range. ' +
                'Review the growth trend with your pediatrician.'
            );
        default:
            return (
                'More information is needed to assess ' + 'the latest growth measurement.'
            );
    }
}
export async function assessGrowth(
    baby: Baby,
    growth: Growth
): Promise<GrowthAssessment> {
    const dateOfBirth = new Date(`${baby.birthDate}T00:00:00`);
    const dateOfMeasurement = new Date(growth.date);
    if (
        Number.isNaN(dateOfBirth.getTime()) ||
        Number.isNaN(dateOfMeasurement.getTime())
    ) {
        throw new Error('Invalid birth or measurement date');
    }
    const result = await calculateAll({
        chartSet: 'who-standard',
        sex: baby.gender === 'boy' ? 'male' : 'female',
        dateOfBirth,
        dateOfMeasurement,
        weight: growth.weight,
        lengthHeight: growth.height,
        headCircumference: growth.headCircumference ?? undefined,
    });
    /*
     * @pedi-growth/core returns results
     * keyed by WHO growth indicator.
     */
    const results = result.results;
    const weightResult =
        results.find((item) => item.indicator === 'weight-for-age') ?? null;
    const heightResult =
        results.find((item) => item.indicator === 'length-height-for-age') ?? null;
    const headResult =
        results.find((item) => item.indicator === 'head-circumference-for-age') ?? null;
    const weight = buildMetric('Weight', growth.weight, 'kg', weightResult);
    const height = buildMetric('Length / Height', growth.height, 'cm', heightResult);
    const headCircumference =
        growth.headCircumference === null
            ? null
            : buildMetric(
                  'Head Circumference',
                  growth.headCircumference,
                  'cm',
                  headResult
              );
    const status = getOverallStatus([weight, height, headCircumference]);
    const ageInDays = Math.max(
        0,
        Math.floor((dateOfMeasurement.getTime() - dateOfBirth.getTime()) / 86_400_000)
    );
    return {
        measurementDate: growth.date,
        ageInDays,
        weight,
        height,
        headCircumference,
        overallStatus: status,
        overallLabel: overallLabel(status),
        summary: summaryText(status),
    };
}

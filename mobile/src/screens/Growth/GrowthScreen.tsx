import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import PrimaryButton from '../../components/common/PrimaryButton';
import GrowthCard from '../../components/cards/GrowthCard';
import GrowthSummaryCard from '../../components/charts/GrowthSummaryCard';
import { useGrowthStore } from '../../store/GrowthStore';
import { useBabyStore } from '../../store/BabyStore';
import { Growth } from '../../models/Growth';
import {
    assessGrowth,
    GrowthAssessment,
    GrowthMetricAssessment,
} from '../../services/GrowthAssessmentService';
type ChartKey = 'weight' | 'height' | 'head';
function chartDateLabel(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
    });
}
function sortedOldestFirst(growths: Growth[]): Growth[] {
    return [...growths].sort(
        (first, second) =>
            new Date(first.date).getTime() - new Date(second.date).getTime()
    );
}
function latestRecord(growths: Growth[]): Growth | null {
    if (growths.length === 0) {
        return null;
    }
    return [...growths].sort(
        (first, second) =>
            new Date(second.date).getTime() - new Date(first.date).getTime()
    )[0];
}
function percentileText(metric: GrowthMetricAssessment | null): string | undefined {
    if (!metric || metric.percentile === null) {
        return undefined;
    }
    return (
        `${metric.percentile}th percentile` +
        (metric.zScore !== null ? ` • z ${metric.zScore}` : '')
    );
}
function metricAssessment(metric: GrowthMetricAssessment | null) {
    if (!metric) {
        return null;
    }
    return {
        label: metric.statusLabel,
        detail: percentileText(metric),
        status: metric.status === 'needs-review' ? 'unavailable' : metric.status,
    } as const;
}
export default function GrowthScreen() {
    const navigation = useNavigation<any>();
    const baby = useBabyStore((state) => state.baby);
    const { growths, loadGrowths, deleteGrowth } = useGrowthStore();
    const [assessment, setAssessment] = useState<GrowthAssessment | null>(null);
    const [assessmentError, setAssessmentError] = useState(false);
    const [expandedChart, setExpandedChart] = useState<ChartKey | null>(null);
    useFocusEffect(
        useCallback(() => {
            void loadGrowths();
        }, [loadGrowths])
    );
    const chronologicalGrowths = useMemo(() => sortedOldestFirst(growths), [growths]);
    const latest = useMemo(() => latestRecord(growths), [growths]);
    useEffect(() => {
        let active = true;
        async function runAssessment() {
            if (!baby || !latest) {
                if (active) {
                    setAssessment(null);
                    setAssessmentError(false);
                }
                return;
            }
            try {
                const result = await assessGrowth(baby, latest);
                if (active) {
                    setAssessment(result);
                    setAssessmentError(false);
                }
            } catch (error) {
                console.error('Unable to assess growth:', error);
                if (active) {
                    setAssessment(null);
                    setAssessmentError(true);
                }
            }
        }
        void runAssessment();
        return () => {
            active = false;
        };
    }, [baby, latest]);
    const weightPoints = useMemo(
        () =>
            chronologicalGrowths.map((growth) => ({
                label: chartDateLabel(growth.date),
                value: growth.weight,
            })),
        [chronologicalGrowths]
    );
    const heightPoints = useMemo(
        () =>
            chronologicalGrowths.map((growth) => ({
                label: chartDateLabel(growth.date),
                value: growth.height,
            })),
        [chronologicalGrowths]
    );
    const headPoints = useMemo(
        () =>
            chronologicalGrowths
                .filter((growth) => growth.headCircumference !== null)
                .map((growth) => ({
                    label: chartDateLabel(growth.date),
                    value: growth.headCircumference as number,
                })),
        [chronologicalGrowths]
    );
    function toggleChart(chart: ChartKey) {
        setExpandedChart((current) => (current === chart ? null : chart));
    }
    const confirmDelete = (id: number | undefined) => {
        if (id === undefined) {
            return;
        }
        Alert.alert(
            'Delete growth record?',
            'This measurement will be permanently removed.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        void deleteGrowth(id);
                    },
                },
            ]
        );
    };
    return (
        <ScreenLayout>
            <ScreenTitle title="Growth" icon="📈" />
            <View style={styles.addButtonWrapper}>
                <PrimaryButton
                    title="+ Add Growth"
                    onPress={() => navigation.navigate('AddGrowth')}
                />
            </View>
            {assessment ? (
                <View
                    style={[
                        styles.overallCard,
                        assessment.overallStatus === 'within-range'
                            ? styles.overallGood
                            : styles.overallReview,
                    ]}
                >
                    <Text style={styles.overallTitle}>
                        {assessment.overallStatus === 'within-range' ? '✓ ' : '⚠️ '}
                        {assessment.overallLabel}
                    </Text>
                    <Text style={styles.overallText}>{assessment.summary}</Text>
                    <Text style={styles.whoLabel}>WHO growth reference</Text>
                </View>
            ) : assessmentError ? (
                <View style={styles.assessmentUnavailable}>
                    <Text style={styles.assessmentUnavailableText}>
                        Growth assessment unavailable for the latest record.
                    </Text>
                </View>
            ) : null}
            <GrowthSummaryCard
                title="Weight"
                icon="⚖️"
                unit="kg"
                latestValue={latest?.weight ?? null}
                latestDate={latest?.date ?? null}
                points={weightPoints}
                assessment={metricAssessment(assessment?.weight ?? null)}
                expanded={expandedChart === 'weight'}
                onToggle={() => toggleChart('weight')}
            />
            <GrowthSummaryCard
                title="Height"
                icon="📏"
                unit="cm"
                latestValue={latest?.height ?? null}
                latestDate={latest?.date ?? null}
                points={heightPoints}
                assessment={metricAssessment(assessment?.height ?? null)}
                expanded={expandedChart === 'height'}
                onToggle={() => toggleChart('height')}
            />
            <GrowthSummaryCard
                title="Head Circumference"
                icon="👶"
                unit="cm"
                latestValue={latest?.headCircumference ?? null}
                latestDate={latest?.date ?? null}
                points={headPoints}
                assessment={metricAssessment(assessment?.headCircumference ?? null)}
                expanded={expandedChart === 'head'}
                onToggle={() => toggleChart('head')}
            />
            <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Growth History</Text>
                <Text style={styles.historySubtitle}>
                    {growths.length} {growths.length === 1 ? 'record' : 'records'}
                </Text>
            </View>
            {growths.length === 0 ? (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyIcon}>📈</Text>
                    <Text style={styles.emptyTitle}>No growth records yet</Text>
                    <Text style={styles.emptyText}>
                        Add the baby's first measurement to begin tracking growth.
                    </Text>
                </View>
            ) : (
                growths.map((growth) => (
                    <GrowthCard
                        key={growth.id ?? growth.date}
                        growth={growth}
                        onEdit={() =>
                            navigation.navigate('EditGrowth', {
                                growth,
                            })
                        }
                        onDelete={() => confirmDelete(growth.id)}
                    />
                ))
            )}
        </ScreenLayout>
    );
}
const styles = StyleSheet.create({
    addButtonWrapper: {
        marginTop: -18,
        marginBottom: -8,
    },
    overallCard: {
        marginTop: 0,
        marginBottom: 8,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    overallGood: {
        backgroundColor: '#ECFDF5',
    },
    overallReview: {
        backgroundColor: '#FFF7ED',
    },
    overallTitle: {
        fontSize: 13,
        fontWeight: '900',
        color: '#111827',
    },
    overallText: {
        marginTop: 4,
        fontSize: 11,
        lineHeight: 16,
        color: '#4B5563',
    },
    whoLabel: {
        marginTop: 5,
        fontSize: 9,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    assessmentUnavailable: {
        marginBottom: 10,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        padding: 10,
    },
    assessmentUnavailableText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginTop: 4,
        marginBottom: 8,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#111827',
    },
    historySubtitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    emptyCard: {
        minHeight: 160,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingVertical: 22,
    },
    emptyIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },
    emptyText: {
        marginTop: 6,
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 18,
        color: '#6B7280',
    },
});

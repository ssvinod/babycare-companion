import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LineChart, { LineChartPoint } from './LineChart';
interface AssessmentInfo {
    label: string;
    detail?: string;
    status: 'within-range' | 'below-range' | 'above-range' | 'unavailable';
}
interface Props {
    title: string;
    icon: string;
    unit: string;
    latestValue: number | null;
    latestDate: string | null;
    points: LineChartPoint[];
    assessment?: AssessmentInfo | null;
    expanded?: boolean;
    onToggle?: () => void;
}
function formatDate(value: string | null): string {
    if (!value) {
        return 'No records yet';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
function formatValue(value: number | null): string {
    if (value === null) {
        return '—';
    }
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
function assessmentColors(status: AssessmentInfo['status']) {
    switch (status) {
        case 'within-range':
            return {
                background: '#ECFDF5',
                text: '#047857',
            };
        case 'below-range':
        case 'above-range':
            return {
                background: '#FFF7ED',
                text: '#C2410C',
            };
        default:
            return {
                background: '#F3F4F6',
                text: '#6B7280',
            };
    }
}
export default function GrowthSummaryCard({
    title,
    icon,
    unit,
    latestValue,
    latestDate,
    points,
    assessment,
    expanded = false,
    onToggle,
}: Props) {
    const colors = assessment ? assessmentColors(assessment.status) : null;
    return (
        <View style={styles.card}>
            <Pressable
                disabled={!onToggle}
                onPress={onToggle}
                style={({ pressed }) => [
                    styles.header,
                    pressed && onToggle && styles.headerPressed,
                ]}
            >
                <View style={styles.titleRow}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>{icon}</Text>
                    </View>
                    <View style={styles.titleContent}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.date}>{formatDate(latestDate)}</Text>
                    </View>
                </View>
                <View style={styles.latest}>
                    <Text style={styles.latestLabel}>Latest</Text>
                    <Text style={styles.latestValue}>
                        {formatValue(latestValue)}{' '}
                        <Text style={styles.unit}>
                            {latestValue === null ? '' : unit}
                        </Text>
                    </Text>
                    {onToggle ? (
                        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
                    ) : null}
                </View>
            </Pressable>
            {assessment && colors ? (
                <View
                    style={[
                        styles.assessment,
                        {
                            backgroundColor: colors.background,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.assessmentLabel,
                            {
                                color: colors.text,
                            },
                        ]}
                    >
                        {assessment.label}
                    </Text>
                    {assessment.detail ? (
                        <Text
                            style={[
                                styles.assessmentDetail,
                                {
                                    color: colors.text,
                                },
                            ]}
                        >
                            {assessment.detail}
                        </Text>
                    ) : null}
                </View>
            ) : null}
            {expanded ? <LineChart points={points} unit={unit} height={105} /> : null}
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerPressed: {
        opacity: 0.75,
    },
    titleRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    titleContent: {
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 9,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
    },
    icon: {
        fontSize: 18,
    },
    title: {
        fontSize: 15,
        fontWeight: '800',
        color: '#111827',
    },
    date: {
        marginTop: 2,
        fontSize: 11,
        color: '#9CA3AF',
    },
    latest: {
        alignItems: 'flex-end',
    },
    latestLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    latestValue: {
        marginTop: 1,
        fontSize: 17,
        fontWeight: '900',
        color: '#312E81',
    },
    unit: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
    },
    chevron: {
        marginTop: 2,
        fontSize: 9,
        fontWeight: '900',
        color: '#9CA3AF',
    },
    assessment: {
        marginTop: 9,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    assessmentLabel: {
        fontSize: 11,
        fontWeight: '900',
    },
    assessmentDetail: {
        marginTop: 2,
        fontSize: 10,
        fontWeight: '600',
    },
});

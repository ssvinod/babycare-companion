import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LineChart, { LineChartPoint } from './LineChart';
interface Props {
    title: string;
    icon: string;
    unit: string;
    latestValue: number | null;
    latestDate: string | null;
    points: LineChartPoint[];
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
export default function GrowthSummaryCard({
    title,
    icon,
    unit,
    latestValue,
    latestDate,
    points,
}: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>{icon}</Text>
                    </View>
                    <View>
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
                </View>
            </View>
            <LineChart points={points} unit={unit} />
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    titleRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    iconContainer: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderRadius: 14,
        backgroundColor: '#EEF2FF',
    },
    icon: {
        fontSize: 20,
    },
    title: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111827',
    },
    date: {
        marginTop: 3,
        fontSize: 12,
        color: '#9CA3AF',
    },
    latest: {
        alignItems: 'flex-end',
    },
    latestLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    latestValue: {
        marginTop: 2,
        fontSize: 20,
        fontWeight: '900',
        color: '#312E81',
    },
    unit: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
    },
});

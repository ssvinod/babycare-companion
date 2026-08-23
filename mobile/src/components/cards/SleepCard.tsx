import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Sleep } from '../../models/Sleep';
interface Props {
    sleep: Sleep;
    onDelete(): void;
}
function formatTime(value: string | null): string {
    if (!value) {
        return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });
}
function durationText(startValue: string, endValue: string | null): string {
    if (!endValue) {
        return 'In progress';
    }
    const start = new Date(startValue);
    const end = new Date(endValue);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return '—';
    }
    const minutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    if (hours === 0) {
        return `${remainder} min`;
    }
    if (remainder === 0) {
        return `${hours} hr`;
    }
    return `${hours} hr ${remainder} min`;
}
export default function SleepCard({ sleep, onDelete }: Props) {
    const active = !sleep.endTime;
    return (
        <View style={[styles.card, active && styles.activeCard]}>
            <View style={styles.header}>
                <View style={styles.titleArea}>
                    <Text style={styles.icon}>😴</Text>
                    <View>
                        <Text style={styles.title}>Sleep</Text>
                        <Text style={[styles.status, active && styles.activeStatus]}>
                            {active
                                ? 'Sleeping now'
                                : durationText(sleep.startTime, sleep.endTime)}
                        </Text>
                    </View>
                </View>
                <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteButton}>
                    <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
            </View>
            <View style={styles.metricsRow}>
                <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Start</Text>
                    <Text style={styles.metricValue}>{formatTime(sleep.startTime)}</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metric}>
                    <Text style={styles.metricLabel}>End</Text>
                    <Text style={styles.metricValue}>
                        {sleep.endTime ? formatTime(sleep.endTime) : 'Sleeping'}
                    </Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Duration</Text>
                    <Text style={styles.metricValueSmall}>
                        {durationText(sleep.startTime, sleep.endTime)}
                    </Text>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 13,
        paddingVertical: 11,
    },
    activeCard: {
        backgroundColor: '#F5F3FF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    titleArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 7,
        fontSize: 17,
    },
    title: {
        fontSize: 15,
        fontWeight: '900',
        color: '#111827',
    },
    status: {
        marginTop: 2,
        fontSize: 10,
        fontWeight: '700',
        color: '#6B7280',
    },
    activeStatus: {
        color: '#7C3AED',
    },
    deleteButton: {
        minHeight: 36,
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    deleteText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#DC2626',
    },
    metricsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 9,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        paddingVertical: 7,
    },
    metric: {
        flex: 1,
        paddingHorizontal: 7,
    },
    metricDivider: {
        width: 1,
        height: 28,
        backgroundColor: '#E5E7EB',
    },
    metricLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    metricValue: {
        marginTop: 1,
        fontSize: 12,
        fontWeight: '900',
        color: '#111827',
    },
    metricValueSmall: {
        marginTop: 1,
        fontSize: 10,
        lineHeight: 13,
        fontWeight: '900',
        color: '#111827',
    },
});

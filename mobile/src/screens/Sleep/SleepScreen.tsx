import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import PrimaryButton from '../../components/common/PrimaryButton';
import SleepCard from '../../components/cards/SleepCard';
import { useSleepStore } from '../../store/SleepStore';
import { useDashboardStore } from '../../store/DashboardStore';
function formatMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours <= 0) {
        return `${minutes} min`;
    }
    if (minutes === 0) {
        return `${hours} hr`;
    }
    return `${hours} hr ${minutes} min`;
}
export default function SleepScreen() {
    const { sleeps, activeSleep, loadSleeps, startSleep, finishSleep, deleteSleep } =
        useSleepStore();
    const { todaySleepMinutes, refresh } = useDashboardStore();
    useEffect(() => {
        void loadSleeps();
        void refresh();
    }, [loadSleeps, refresh]);
    const completedCount = useMemo(
        () => sleeps.filter((sleep) => Boolean(sleep.endTime)).length,
        [sleeps]
    );
    return (
        <ScreenLayout>
            <ScreenTitle title="Sleep" icon="😴" />
            <View style={styles.actionWrapper}>
                <PrimaryButton
                    title={activeSleep ? 'Wake Up' : '+ Start Sleep'}
                    onPress={async () => {
                        if (activeSleep) {
                            await finishSleep(activeSleep.id!, new Date().toISOString());
                        } else {
                            await startSleep();
                        }
                        await loadSleeps();
                        await refresh();
                    }}
                />
            </View>
            <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>
                        {formatMinutes(todaySleepMinutes)}
                    </Text>
                    <Text style={styles.summaryLabel}>Today</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{completedCount}</Text>
                    <Text style={styles.summaryLabel}>Sleep records</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text
                        style={[styles.summaryValue, activeSleep && styles.activeValue]}
                    >
                        {activeSleep ? 'Sleeping' : 'Awake'}
                    </Text>
                    <Text style={styles.summaryLabel}>Current</Text>
                </View>
            </View>
            <Text style={styles.historyTitle}>Sleep History</Text>
            {sleeps.length === 0 ? (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyIcon}>😴</Text>
                    <Text style={styles.emptyTitle}>No sleep records yet</Text>
                    <Text style={styles.emptyText}>
                        Start a sleep session to begin tracking rest.
                    </Text>
                </View>
            ) : (
                sleeps.map((item) => (
                    <SleepCard
                        key={item.id}
                        sleep={item}
                        onDelete={async () => {
                            await deleteSleep(item.id!);
                            await loadSleeps();
                            await refresh();
                        }}
                    />
                ))
            )}
        </ScreenLayout>
    );
}
const styles = StyleSheet.create({
    actionWrapper: {
        marginTop: -8,
        marginBottom: 10,
    },
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        paddingVertical: 11,
        paddingHorizontal: 10,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryDivider: {
        width: 1,
        height: 32,
        backgroundColor: '#E5E7EB',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '900',
        color: '#312E81',
        textAlign: 'center',
    },
    activeValue: {
        color: '#7C3AED',
    },
    summaryLabel: {
        marginTop: 2,
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    historyTitle: {
        marginTop: 2,
        marginBottom: 7,
        fontSize: 17,
        fontWeight: '900',
        color: '#111827',
    },
    emptyCard: {
        minHeight: 150,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    emptyIcon: {
        fontSize: 30,
    },
    emptyTitle: {
        marginTop: 7,
        fontSize: 15,
        fontWeight: '800',
        color: '#111827',
    },
    emptyText: {
        marginTop: 5,
        textAlign: 'center',
        fontSize: 12,
        color: '#6B7280',
    },
});

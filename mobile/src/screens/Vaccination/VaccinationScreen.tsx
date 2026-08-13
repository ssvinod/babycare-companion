import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import SummaryCard from '../../components/cards/SummaryCard';
import VaccinationCard from '../../components/cards/VaccinationCard';
import { useVaccinationStore } from '../../store/VaccinationStore';
import vaccineInfo from '../../utils/vaccineInfo';
import { getVaccineStatus } from '../../utils/vaccineStatus';
export default function VaccinationScreen() {
    const { vaccines, completed, loadVaccinations, markCompleted, markPending } =
        useVaccinationStore();
    useFocusEffect(
        useCallback(() => {
            void loadVaccinations();
        }, [loadVaccinations])
    );
    const overdue = useMemo(
        () =>
            vaccines.filter((vaccine) => getVaccineStatus(vaccine) === 'overdue').length,
        [vaccines]
    );
    const dueToday = useMemo(
        () => vaccines.filter((vaccine) => getVaccineStatus(vaccine) === 'today').length,
        [vaccines]
    );
    const upcomingOnly = useMemo(
        () =>
            vaccines.filter((vaccine) => getVaccineStatus(vaccine) === 'upcoming').length,
        [vaccines]
    );
    return (
        <ScreenLayout>
            <ScreenTitle title="Vaccination" icon="💉" />
            <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                    <SummaryCard
                        icon="✅"
                        title="Completed"
                        value={completed.toString()}
                        color="#22C55E"
                    />
                </View>
                <View style={styles.summaryItem}>
                    <SummaryCard
                        icon="📅"
                        title="Upcoming"
                        value={upcomingOnly.toString()}
                        color="#2563EB"
                    />
                </View>
            </View>
            {overdue > 0 ? (
                <View style={styles.statusSummaryCard}>
                    <View>
                        <Text style={styles.statusSummaryLabel}>Needs attention</Text>
                        <Text style={styles.statusSummaryTitle}>
                            {overdue}{' '}
                            {overdue === 1
                                ? 'overdue vaccination'
                                : 'overdue vaccinations'}
                        </Text>
                    </View>
                    <Text style={styles.statusSummaryIcon}>⚠️</Text>
                </View>
            ) : null}
            {dueToday > 0 ? (
                <View style={styles.todayCard}>
                    <Text style={styles.todayTitle}>💉 Due Today</Text>
                    <Text style={styles.todayText}>
                        {dueToday}{' '}
                        {dueToday === 1 ? 'vaccination is' : 'vaccinations are'} due
                        today.
                    </Text>
                </View>
            ) : null}
            {vaccines.length === 0 ? (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyIcon}>💉</Text>
                    <Text style={styles.emptyTitle}>No vaccinations yet</Text>
                    <Text style={styles.emptyText}>
                        Vaccinations will appear here after the baby's schedule is
                        generated.
                    </Text>
                </View>
            ) : (
                vaccines.map((vaccine) => {
                    const info = vaccineInfo[vaccine.vaccine] ?? {
                        title: vaccine.vaccine,
                        diseases: [],
                    };
                    return (
                        <VaccinationCard
                            key={vaccine.id}
                            vaccine={vaccine}
                            description={info.diseases}
                            status={getVaccineStatus(vaccine)}
                            onComplete={async () => {
                                await markCompleted(vaccine.id!);
                            }}
                            onPending={async () => {
                                await markPending(vaccine.id!);
                            }}
                        />
                    );
                })
            )}
        </ScreenLayout>
    );
}
const styles = StyleSheet.create({
    summaryGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    summaryItem: {
        flex: 1,
    },
    todayCard: {
        marginBottom: 14,
        borderRadius: 18,
        backgroundColor: '#EFF6FF',
        padding: 16,
    },
    todayTitle: {
        fontSize: 15,
        fontWeight: '900',
        color: '#1D4ED8',
    },
    todayText: {
        marginTop: 5,
        fontSize: 13,
        lineHeight: 19,
        color: '#2563EB',
    },
    overdueTitle: {
        fontSize: 15,
        fontWeight: '900',
        color: '#9A3412',
    },
    overdueText: {
        marginTop: 5,
        fontSize: 13,
        lineHeight: 19,
        color: '#C2410C',
    },
    emptyCard: {
        minHeight: 190,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        padding: 28,
    },
    emptyIcon: {
        marginBottom: 12,
        fontSize: 38,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: '900',
        color: '#111827',
    },
    emptyText: {
        marginTop: 7,
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 20,
        color: '#6B7280',
    },
    statusSummaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        borderRadius: 18,
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    statusSummaryLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#C2410C',
    },
    statusSummaryTitle: {
        marginTop: 3,
        fontSize: 15,
        fontWeight: '900',
        color: '#9A3412',
    },
    statusSummaryIcon: {
        fontSize: 24,
    },
});

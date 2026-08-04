import React, { useCallback, useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import PrimaryButton from '../../components/common/PrimaryButton';
import GrowthCard from '../../components/cards/GrowthCard';
import GrowthSummaryCard from '../../components/charts/GrowthSummaryCard';
import { useGrowthStore } from '../../store/GrowthStore';
import { Growth } from '../../models/Growth';
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
export default function GrowthScreen() {
    const navigation = useNavigation<any>();
    const { growths, loadGrowths, deleteGrowth } = useGrowthStore();
    useFocusEffect(
        useCallback(() => {
            void loadGrowths();
        }, [loadGrowths])
    );
    const chronologicalGrowths = useMemo(() => sortedOldestFirst(growths), [growths]);
    const latest = useMemo(() => latestRecord(growths), [growths]);
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
            <PrimaryButton
                title="+ Add Growth"
                onPress={() => navigation.navigate('AddGrowth')}
            />
            <View style={styles.summarySpacer} />
            <GrowthSummaryCard
                title="Weight"
                icon="⚖️"
                unit="kg"
                latestValue={latest?.weight ?? null}
                latestDate={latest?.date ?? null}
                points={weightPoints}
            />
            <GrowthSummaryCard
                title="Height"
                icon="📏"
                unit="cm"
                latestValue={latest?.height ?? null}
                latestDate={latest?.date ?? null}
                points={heightPoints}
            />
            <GrowthSummaryCard
                title="Head Circumference"
                icon="👶"
                unit="cm"
                latestValue={latest?.headCircumference ?? null}
                latestDate={latest?.date ?? null}
                points={headPoints}
            />
            <View style={styles.historyHeader}>
                <View>
                    <Text style={styles.historyTitle}>Growth History</Text>
                    <Text style={styles.historySubtitle}>
                        {growths.length} {growths.length === 1 ? 'record' : 'records'}
                    </Text>
                </View>
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
    summarySpacer: {
        height: 16,
    },
    historyHeader: {
        marginTop: 8,
        marginBottom: 12,
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#111827',
    },
    historySubtitle: {
        marginTop: 3,
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    emptyCard: {
        minHeight: 220,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 28,
        paddingVertical: 30,
    },
    emptyIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    emptyText: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 21,
        color: '#6B7280',
    },
});

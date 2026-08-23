import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import PrimaryButton from '../../components/common/PrimaryButton';
import FeedingCard from '../../components/cards/FeedingCard';
import { useFeedingStore } from '../../store/FeedingStore';
import { useDashboardStore } from '../../store/DashboardStore';
import { getDateLabel } from '../../utils/dateUtils';
function formatLastFeeding(value: string | null): string {
    if (!value) {
        return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
    });
}
export default function FeedingScreen({ navigation }: any) {
    const { feedings, loadFeedings, deleteFeeding } = useFeedingStore();
    const { todayFeedings, todayQuantity, lastFeeding, refresh } = useDashboardStore();
    useEffect(() => {
        void loadFeedings();
        void refresh();
    }, [loadFeedings, refresh]);
    const groupedFeedings = feedings.reduce(
        (groups: Record<string, typeof feedings>, feeding) => {
            const key = getDateLabel(feeding.time);
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(feeding);
            return groups;
        },
        {}
    );
    return (
        <ScreenLayout>
            <ScreenTitle title="Feeding" icon="🍼" />
            <View style={styles.addWrapper}>
                <PrimaryButton
                    title="+ Add Feeding"
                    onPress={() => navigation.navigate('AddFeeding')}
                />
            </View>
            <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{todayFeedings}</Text>
                    <Text style={styles.summaryLabel}>Feeds today</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{todayQuantity}</Text>
                    <Text style={styles.summaryLabel}>ml today</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValueSmall}>
                        {formatLastFeeding(lastFeeding)}
                    </Text>
                    <Text style={styles.summaryLabel}>Last feed</Text>
                </View>
            </View>
            {Object.entries(groupedFeedings).map(([date, items]) => (
                <View key={date}>
                    <Text style={styles.sectionTitle}>{date}</Text>
                    {items.map((feed) => (
                        <FeedingCard
                            key={feed.id}
                            feeding={feed}
                            onDelete={async () => {
                                await deleteFeeding(feed.id!);
                                await refresh();
                            }}
                        />
                    ))}
                </View>
            ))}
        </ScreenLayout>
    );
}
const styles = StyleSheet.create({
    addWrapper: {
        marginTop: -8,
        marginBottom: 10,
    },
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 11,
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
        fontSize: 17,
        fontWeight: '900',
        color: '#1D4ED8',
    },
    summaryValueSmall: {
        fontSize: 13,
        fontWeight: '900',
        color: '#111827',
    },
    summaryLabel: {
        marginTop: 2,
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    sectionTitle: {
        marginTop: 4,
        marginBottom: 7,
        fontSize: 13,
        fontWeight: '800',
        color: '#6B7280',
    },
});

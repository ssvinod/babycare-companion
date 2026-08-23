import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feeding } from '../../models/Feeding';
import { getFeedingColor, getFeedingIcon } from '../../utils/feedingUtils';
interface Props {
    feeding: Feeding;
    onDelete: () => void;
}
function formatTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
export default function FeedingCard({ feeding, onDelete }: Props) {
    const color = getFeedingColor(feeding.type);
    const icon = getFeedingIcon(feeding.type);
    return (
        <View
            style={[
                styles.card,
                {
                    borderLeftColor: color,
                },
            ]}
        >
            <View style={styles.header}>
                <View style={styles.titleArea}>
                    <Text style={styles.icon}>{icon}</Text>
                    <View>
                        <Text style={styles.type}>{feeding.type.trim()}</Text>
                        <Text style={styles.time}>{formatTime(feeding.time)}</Text>
                    </View>
                </View>
                <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteButton}>
                    <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
            </View>
            <View style={styles.metricsRow}>
                <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Quantity</Text>
                    <Text style={styles.metricValue}>
                        {feeding.quantity} <Text style={styles.metricUnit}>ml</Text>
                    </Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Time</Text>
                    <Text style={styles.metricValueSmall}>
                        {formatTime(feeding.time)}
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
        borderLeftWidth: 5,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 13,
        paddingVertical: 11,
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
    type: {
        fontSize: 15,
        fontWeight: '900',
        color: '#111827',
    },
    time: {
        marginTop: 2,
        fontSize: 10,
        color: '#9CA3AF',
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
        paddingHorizontal: 10,
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
        fontSize: 14,
        fontWeight: '900',
        color: '#111827',
    },
    metricValueSmall: {
        marginTop: 1,
        fontSize: 12,
        fontWeight: '900',
        color: '#111827',
    },
    metricUnit: {
        fontSize: 10,
        fontWeight: '700',
        color: '#6B7280',
    },
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Growth } from '../../models/Growth';
interface Props {
    growth: Growth;
    onEdit: () => void;
    onDelete: () => void;
}
function formatCheckupDate(dateValue: string): string {
    const datePart = dateValue.slice(0, 10);
    const [year, month, day] = datePart.split('-').map(Number);
    if (!year || !month || !day) {
        return dateValue;
    }
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
export default function GrowthCard({ growth, onEdit, onDelete }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <Text style={styles.date}>{formatCheckupDate(growth.date)}</Text>
                <View style={styles.actions}>
                    <Pressable hitSlop={8} onPress={onEdit}>
                        <Text style={styles.editText}>Edit</Text>
                    </Pressable>
                    <Pressable hitSlop={8} onPress={onDelete}>
                        <Text style={styles.deleteText}>Delete</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.metricsRow}>
                <View style={styles.metric}>
                    <Text style={styles.metricIcon}>⚖️</Text>
                    <Text style={styles.metricValue}>{growth.weight}</Text>
                    <Text style={styles.metricUnit}>kg</Text>
                </View>
                <View style={styles.metric}>
                    <Text style={styles.metricIcon}>📏</Text>
                    <Text style={styles.metricValue}>{growth.height}</Text>
                    <Text style={styles.metricUnit}>cm</Text>
                </View>
                {(growth.headCircumference ?? 0) > 0 ? (
                    <View style={styles.metric}>
                        <Text style={styles.metricIcon}>🧠</Text>
                        <Text style={styles.metricValue}>{growth.headCircumference}</Text>
                        <Text style={styles.metricUnit}>cm</Text>
                    </View>
                ) : null}
            </View>
            {!!growth.notes?.trim() ? (
                <Text numberOfLines={2} style={styles.notes}>
                    {growth.notes}
                </Text>
            ) : null}
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    date: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    editText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#2563EB',
    },
    deleteText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#DC2626',
    },
    metricsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    metric: {
        flex: 1,
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 6,
    },
    metricIcon: {
        marginRight: 4,
        fontSize: 14,
    },
    metricValue: {
        fontSize: 14,
        fontWeight: '900',
        color: '#111827',
    },
    metricUnit: {
        marginLeft: 3,
        fontSize: 10,
        fontWeight: '700',
        color: '#6B7280',
    },
    notes: {
        marginTop: 8,
        fontSize: 12,
        lineHeight: 17,
        color: '#6B7280',
    },
});

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
            <Text style={styles.dateLabel}>Check-up Date</Text>
            <Text style={styles.date}>{formatCheckupDate(growth.date)}</Text>
            <Text style={styles.value}>⚖️ {growth.weight} kg</Text>
            <Text style={styles.value}>📏 {growth.height} cm</Text>
            {(growth.headCircumference ?? 0) > 0 && (
                <Text style={styles.value}>🧠 {growth.headCircumference} cm</Text>
            )}
            {!!growth.notes?.trim() && <Text style={styles.notes}>{growth.notes}</Text>}
            <View style={styles.actions}>
                <Pressable style={styles.action} onPress={onEdit}>
                    <Text style={styles.editText}>Edit</Text>
                </Pressable>
                <Pressable style={styles.action} onPress={onDelete}>
                    <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
    },
    dateLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 3,
    },
    date: {
        fontWeight: '700',
        fontSize: 17,
        marginBottom: 10,
        color: '#111827',
    },
    value: {
        fontSize: 16,
        marginTop: 4,
    },
    notes: {
        marginTop: 12,
        fontSize: 15,
        lineHeight: 21,
        color: '#6B7280',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 14,
    },
    action: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginLeft: 8,
    },
    editText: {
        color: '#2563EB',
        fontWeight: '700',
    },
    deleteText: {
        color: '#EF4444',
        fontWeight: '700',
    },
});

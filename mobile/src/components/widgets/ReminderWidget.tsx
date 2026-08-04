import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDashboardStore } from '../../store/DashboardStore';

function daysRemaining(date: string | null) {
    if (!date) return null;

    const diff = new Date(date).getTime() - new Date().getTime();

    return Math.ceil(diff / 86400000);
}

export default function ReminderWidget() {
    const { nextVaccine, nextVaccineDate } = useDashboardStore();

    const days = daysRemaining(nextVaccineDate);

    return (
        <View style={styles.card}>
            <Text style={styles.header}>Upcoming Reminder</Text>

            {nextVaccine ? (
                <Text style={styles.reminder}>
                    💉 {nextVaccine} due in {days} day{days === 1 ? '' : 's'}
                </Text>
            ) : (
                <Text style={styles.reminder}>🎉 No upcoming vaccination</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF7ED',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },

    header: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
    },

    reminder: {
        fontSize: 18,
        color: '#B45309',
    },
});

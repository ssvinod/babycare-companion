import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../common/PrimaryButton';
import { Vaccination } from '../../models/Vaccination';
interface Props {
    vaccine: Vaccination;
    description: string[];
    status: 'completed' | 'upcoming' | 'today' | 'overdue';
    onComplete: () => void;
    onPending: () => void;
}
export default function VaccinationCard({
    vaccine,
    description,
    status,
    onComplete,
    onPending,
}: Props) {
    const badge = {
        completed: '🟢 Completed',
        upcoming: '🔵 Upcoming',
        today: '🟡 Due Today',
        overdue: '🔴 Overdue',
    };
    return (
        <View style={styles.card}>
            <Text style={styles.title}>💉 {vaccine.vaccine}</Text>
            <Text style={styles.date}>Due</Text>
            <Text style={styles.value}>
                {new Date(vaccine.dueDate).toLocaleDateString('en-IN')}
            </Text>
            {vaccine.completed === 1 && vaccine.completedDate && (
                <>
                    <Text style={styles.date}>Completed</Text>
                    <Text style={styles.value}>
                        {new Date(vaccine.completedDate).toLocaleDateString('en-IN')}
                    </Text>
                </>
            )}
            <Text style={styles.status}>{badge[status]}</Text>
            <Text style={styles.protects}>Protects against</Text>
            {description.map((d) => (
                <Text key={d} style={styles.item}>
                    • {d}
                </Text>
            ))}
            {status === 'completed' ? (
                <PrimaryButton title="↩ Mark Pending" onPress={onPending} />
            ) : (
                <PrimaryButton title="✓ Mark Completed" onPress={onComplete} />
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 18,
        marginBottom: 18,
    },
    title: {
        fontSize: 19,
        fontWeight: '700',
        marginBottom: 12,
    },
    date: {
        color: '#666',
        marginTop: 6,
    },
    value: {
        fontWeight: '600',
        marginBottom: 4,
    },
    status: {
        marginTop: 10,
        fontWeight: '700',
        fontSize: 15,
    },
    protects: {
        marginTop: 16,
        fontWeight: '700',
    },
    item: {
        marginTop: 3,
        color: '#444',
    },
});

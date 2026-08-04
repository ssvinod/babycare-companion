import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { Sleep } from '../../models/Sleep';

interface Props {
    sleep: Sleep;
    onDelete(): void;
}

export default function SleepCard({ sleep, onDelete }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.time}>
                😴{' '}
                {new Date(sleep.startTime).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                })}
            </Text>

            <Text style={styles.duration}>
                End:{' '}
                {sleep.endTime
                    ? new Date(sleep.endTime).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                      })
                    : 'Still Sleeping'}
            </Text>

            <Pressable onPress={onDelete} style={styles.delete}>
                <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
    },

    time: {
        fontWeight: '700',
        fontSize: 18,
    },

    duration: {
        marginTop: 8,
        color: '#666',
    },

    delete: {
        alignSelf: 'flex-end',
        marginTop: 12,
    },

    deleteText: {
        color: '#EF4444',
        fontWeight: '700',
    },
});

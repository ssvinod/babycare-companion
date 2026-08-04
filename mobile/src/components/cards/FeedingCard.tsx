import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { Feeding } from '../../models/Feeding';
import { getFeedingColor, getFeedingIcon } from '../../utils/feedingUtils';

interface Props {
    feeding: Feeding;
    onDelete: () => void;
}

function formatTime(value: string) {
    return new Date(value).toLocaleTimeString('en-IN', {
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
            <View style={styles.topRow}>
                <View>
                    <Text style={styles.type}>
                        {icon} {feeding.type.trim()}
                    </Text>

                    <Text style={styles.time}>{formatTime(feeding.time)}</Text>
                </View>

                <Text style={styles.qty}>{feeding.quantity} ml</Text>
            </View>

            <Pressable style={styles.delete} onPress={onDelete}>
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
        borderLeftWidth: 6,

        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        elevation: 2,
    },

    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    type: {
        fontSize: 18,
        fontWeight: '700',
    },

    time: {
        marginTop: 6,
        color: '#6B7280',
    },

    qty: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },

    delete: {
        marginTop: 16,
        alignSelf: 'flex-end',
    },

    deleteText: {
        color: '#EF4444',
        fontWeight: '700',
    },
});

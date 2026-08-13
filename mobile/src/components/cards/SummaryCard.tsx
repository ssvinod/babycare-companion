import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
interface Props {
    icon: string;
    title: string;
    value: string;
    color?: string;
}
export default function SummaryCard({ icon, title, value, color = '#4F6EF7' }: Props) {
    return (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: color + '22' }]}>
                <Text style={styles.icon}>{icon}</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 7,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 2,
    },
    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    icon: {
        fontSize: 24,
    },
    content: {
        marginLeft: 11,
        flex: 1,
        minWidth: 0,
    },
    title: {
        color: '#6B7280',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 3,
    },
    value: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
});

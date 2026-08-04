import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
interface Props {
    title: string;
    subtitle: string;
    time: string;
    icon: string;
    onPress?: () => void;
}
export default function UpcomingReminderCard({
    title,
    subtitle,
    time,
    icon,
    onPress,
}: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
            <View style={styles.left}>
                <Text style={styles.icon}>{icon}</Text>
            </View>
            <View style={styles.center}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <Text style={styles.time}>{time}</Text>
        </Pressable>
    );
}
const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    pressed: {
        opacity: 0.8,
    },
    left: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
    },
    icon: {
        fontSize: 22,
    },
    center: {
        flex: 1,
        marginLeft: 14,
    },
    title: {
        fontSize: 15,
        fontWeight: '900',
        color: '#111827',
    },
    subtitle: {
        marginTop: 3,
        fontSize: 12,
        color: '#6B7280',
    },
    time: {
        fontSize: 15,
        fontWeight: '900',
        color: '#4F46E5',
    },
});

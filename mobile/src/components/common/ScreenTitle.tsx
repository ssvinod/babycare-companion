import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
    title: string;
    icon?: string;
}

export default function ScreenTitle({ title, icon }: Props) {
    return (
        <Text style={styles.title}>
            {icon ? `${icon} ` : ''}
            {title}
        </Text>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 34,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 22,
    },
});

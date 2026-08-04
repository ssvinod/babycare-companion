import React from 'react';
import { View, StyleSheet } from 'react-native';

import ProgressRingCard from '../progress/ProgressRingCard';

export default function ProgressSection() {
    return (
        <View style={styles.row}>
            <ProgressRingCard title="Feeding" progress={72} color="#2563EB" />

            <ProgressRingCard title="Sleep" progress={83} color="#7C3AED" />

            <ProgressRingCard title="Vaccines" progress={100} color="#16A34A" />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
});

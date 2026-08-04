import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QuickActionCard from './QuickActionCard';
export default function QuickActionGrid() {
    const navigation = useNavigation<any>();
    return (
        <View style={styles.grid}>
            <QuickActionCard
                icon="🍼"
                title="Feed"
                onPress={() => navigation.navigate('AddFeeding')}
            />
            <QuickActionCard
                icon="😴"
                title="Sleep"
                onPress={() => navigation.navigate('SleepDetails')}
            />
            <QuickActionCard
                icon="📈"
                title="Growth"
                onPress={() => navigation.navigate('GrowthHistory')}
            />
            <QuickActionCard
                icon="💉"
                title="Vaccines"
                onPress={() => navigation.navigate('VaccinationDetails')}
            />
            <QuickActionCard
                icon="📷"
                title="Scan"
                onPress={() => navigation.navigate('Scan')}
            />
            <QuickActionCard
                icon="💊"
                title="Medication"
                onPress={() => navigation.navigate('Medication')}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
});

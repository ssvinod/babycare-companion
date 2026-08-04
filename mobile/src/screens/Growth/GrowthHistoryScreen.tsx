import React, { useEffect } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import { useGrowthStore } from '../../store/GrowthStore';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
export default function GrowthHistoryScreen() {
    const insets = useSafeAreaInsets();
    const { growths, loadGrowths, deleteGrowth } = useGrowthStore();
    const navigation = useNavigation<any>();
    useEffect(() => {
        loadGrowths();
    }, []);
    function remove(id: number) {
        Alert.alert('Delete Growth', 'Delete this growth record?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await deleteGrowth(id);
                },
            },
        ]);
    }
    return (
        <ScreenLayout scroll={false}>
            <ScreenTitle title="Growth History" icon="📈" />
            <PrimaryButton
                title="Add Growth"
                onPress={() => navigation.navigate('AddGrowth')}
            />
            <FlatList
                data={growths}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: insets.bottom + 20,
                }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.date}>
                            {new Date(item.date).toLocaleDateString('en-IN')}
                        </Text>
                        <Text style={styles.value}>⚖️ {item.weight} kg</Text>
                        <Text style={styles.value}>📏 {item.height} cm</Text>
                        {item.headCircumference != null && (
                            <Text style={styles.value}>
                                🧠 {item.headCircumference} cm
                            </Text>
                        )}
                        <Text style={styles.delete} onPress={() => remove(item.id!)}>
                            🗑 Delete
                        </Text>
                    </View>
                )}
            />
        </ScreenLayout>
    );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
    },
    date: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
    },
    value: {
        fontSize: 17,
        marginBottom: 6,
    },
    delete: {
        color: '#DC2626',
        fontWeight: '700',
        marginTop: 12,
        fontSize: 16,
    },
});

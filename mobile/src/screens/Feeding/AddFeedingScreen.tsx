import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useFeedingStore } from '../../store/FeedingStore';
import { Pressable } from 'react-native';

export default function AddFeedingScreen({ navigation }: any) {
    const { addFeeding } = useFeedingStore();
    const [type, setType] = useState('');
    const [quantity, setQuantity] = useState('');
    async function save() {
        await addFeeding({
            time: new Date().toISOString(),
            type,
            quantity: Number(quantity),
            notes: '',
        });
        navigation.goBack();
    }
    return (
        <ScreenLayout>
            <ScreenTitle title="Add Feeding" icon="🍼" />
            <Text style={styles.label}>Feeding Type</Text>

            <View style={styles.chips}>
                {['Breastfeeding', 'Formula', 'Solids', 'Water'].map((item) => (
                    <Pressable
                        key={item}
                        onPress={() => setType(item)}
                        style={[styles.chip, type === item && styles.selectedChip]}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                type === item && styles.selectedChipText,
                            ]}
                        >
                            {item}
                        </Text>
                    </Pressable>
                ))}
            </View>
            <TextInput
                style={styles.input}
                placeholder="Quantity (ml)"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
            />
            <PrimaryButton title="Save Feeding" onPress={save} />
        </ScreenLayout>
    );
}
const styles = StyleSheet.create({
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginBottom: 18,
        fontSize: 18,
    },
    label: {
        fontWeight: '700',
        marginBottom: 10,
        fontSize: 16,
    },

    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },

    chip: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 25,
        marginRight: 10,
        marginBottom: 10,
    },

    selectedChip: {
        backgroundColor: '#3B82F6',
    },

    chipText: {
        fontWeight: '600',
    },

    selectedChipText: {
        color: '#FFFFFF',
    },
});

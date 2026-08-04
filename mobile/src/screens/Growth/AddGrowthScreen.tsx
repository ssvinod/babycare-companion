import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import PrimaryButton from '../../components/common/PrimaryButton';
import DateInput from '../../components/common/DateInput';
import { useGrowthStore } from '../../store/GrowthStore';
import { useDashboardStore } from '../../store/DashboardStore';
export default function AddGrowthScreen({ navigation }: any) {
    const addGrowth = useGrowthStore((state) => state.addGrowth);
    const refreshDashboard = useDashboardStore((state) => state.refresh);
    const [checkupDate, setCheckupDate] = useState(new Date().toISOString().slice(0, 10));
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [head, setHead] = useState('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    async function save() {
        const parsedWeight = Number(weight);
        const parsedHeight = Number(height);
        const parsedHead = head.trim() === '' ? null : Number(head);
        if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
            Alert.alert('Invalid weight', 'Enter a valid weight greater than zero.');
            return;
        }
        if (!Number.isFinite(parsedHeight) || parsedHeight <= 0) {
            Alert.alert('Invalid height', 'Enter a valid height greater than zero.');
            return;
        }
        if (parsedHead !== null && (!Number.isFinite(parsedHead) || parsedHead <= 0)) {
            Alert.alert(
                'Invalid head circumference',
                'Enter a valid measurement or leave it blank.'
            );
            return;
        }
        try {
            setSaving(true);
            await addGrowth({
                date: `${checkupDate}T12:00:00`,
                weight: parsedWeight,
                height: parsedHeight,
                headCircumference: parsedHead,
                notes: notes.trim(),
            });
            await refreshDashboard();
            Alert.alert('Growth Saved', 'Growth record added successfully.', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.error('Failed to save growth record:', error);
            Alert.alert(
                'Unable to save',
                'Something went wrong while saving the growth record.'
            );
        } finally {
            setSaving(false);
        }
    }
    return (
        <ScreenLayout>
            <ScreenTitle title="Add Growth" icon="📈" />
            <Text style={styles.label}>Check-up Date</Text>
            <DateInput value={checkupDate} onChange={setCheckupDate} />
            <Text style={styles.label}>Weight</Text>
            <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
            />
            <Text style={styles.label}>Height</Text>
            <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                keyboardType="decimal-pad"
                value={height}
                onChangeText={setHeight}
            />
            <Text style={styles.label}>Head circumference</Text>
            <TextInput
                style={styles.input}
                placeholder="Optional (cm)"
                keyboardType="decimal-pad"
                value={head}
                onChangeText={setHead}
            />
            <Text style={styles.label}>Notes</Text>
            <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Example: Monthly pediatrician visit"
                multiline
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
            />
            <PrimaryButton
                title={saving ? 'Saving...' : 'Save Growth'}
                onPress={() => {
                    if (!saving) {
                        void save();
                    }
                }}
            />
        </ScreenLayout>
    );
}
const styles = StyleSheet.create({
    label: {
        marginBottom: 8,
        marginLeft: 4,
        marginTop: 4,
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
        marginBottom: 18,
        fontSize: 18,
    },
    notesInput: {
        minHeight: 110,
    },
});

import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenTitle from '../../components/common/ScreenTitle';
import PrimaryButton from '../../components/common/PrimaryButton';
import DateInput from '../../components/common/DateInput';
import { useMedicationStore } from '../../store/MedicationStore';
const UNITS = ['ml', 'drops', 'tablet', 'capsule', 'spoon'];
const FREQUENCIES = [
    'Once',
    'Daily',
    'Twice Daily',
    'Three Times Daily',
    'Weekly',
    'As Needed',
];
type Period = 'AM' | 'PM';
interface ReminderTimeInput {
    hour: string;
    minute: string;
    period: Period;
}
const DEFAULT_REMINDER_TIMES: ReminderTimeInput[] = [
    {
        hour: '08',
        minute: '00',
        period: 'AM',
    },
    {
        hour: '08',
        minute: '00',
        period: 'PM',
    },
    {
        hour: '02',
        minute: '00',
        period: 'PM',
    },
];
function requiredTimeCount(frequency: string): number {
    if (frequency === 'Twice Daily') {
        return 2;
    }
    if (frequency === 'Three Times Daily') {
        return 3;
    }
    if (frequency === 'As Needed') {
        return 0;
    }
    return 1;
}
function sanitizeHour(value: string): string {
    return value.replace(/\D/g, '').slice(0, 2);
}
function sanitizeMinute(value: string): string {
    return value.replace(/\D/g, '').slice(0, 2);
}
function validReminderTime(time: ReminderTimeInput): boolean {
    const hour = Number(time.hour);
    const minute = Number(time.minute);
    return (
        time.hour.length > 0 &&
        time.minute.length > 0 &&
        Number.isInteger(hour) &&
        Number.isInteger(minute) &&
        hour >= 1 &&
        hour <= 12 &&
        minute >= 0 &&
        minute <= 59
    );
}
function to24HourTime(time: ReminderTimeInput): string {
    let hour = Number(time.hour);
    if (time.period === 'AM' && hour === 12) {
        hour = 0;
    }
    if (time.period === 'PM' && hour !== 12) {
        hour += 12;
    }
    return `${String(hour).padStart(2, '0')}:${String(Number(time.minute)).padStart(
        2,
        '0'
    )}`;
}
export default function AddMedicationScreen({ navigation }: any) {
    const addMedication = useMedicationStore((state) => state.addMedication);
    const today = new Date().toISOString().slice(0, 10);
    const [medicine, setMedicine] = useState('');
    const [dosage, setDosage] = useState('');
    const [unit, setUnit] = useState('ml');
    const [frequency, setFrequency] = useState('Daily');
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState('');
    const [reminderTimes, setReminderTimes] =
        useState<ReminderTimeInput[]>(DEFAULT_REMINDER_TIMES);
    const [remindersEnabled, setRemindersEnabled] = useState(true);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    function updateReminderHour(index: number, value: string) {
        setReminderTimes((current) =>
            current.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          hour: sanitizeHour(value),
                      }
                    : item
            )
        );
    }
    function updateReminderMinute(index: number, value: string) {
        setReminderTimes((current) =>
            current.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          minute: sanitizeMinute(value),
                      }
                    : item
            )
        );
    }
    function updateReminderPeriod(index: number, period: Period) {
        setReminderTimes((current) =>
            current.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          period,
                      }
                    : item
            )
        );
    }
    async function save() {
        const trimmedMedicine = medicine.trim();
        if (!trimmedMedicine) {
            Alert.alert('Medicine name required', 'Enter the medicine name.');
            return;
        }
        if (endDate && endDate < startDate) {
            Alert.alert(
                'Invalid end date',
                'The end date cannot be before the start date.'
            );
            return;
        }
        const timeCount = requiredTimeCount(frequency);
        const selectedInputs = reminderTimes.slice(0, timeCount);
        if (remindersEnabled && selectedInputs.some((time) => !validReminderTime(time))) {
            Alert.alert(
                'Invalid reminder time',
                'Enter an hour from 1 to 12 and minutes from 00 to 59.'
            );
            return;
        }
        const selectedTimes = selectedInputs.map(to24HourTime);
        try {
            setSaving(true);
            await addMedication({
                medicine: trimmedMedicine,
                dosage: dosage.trim(),
                unit,
                frequency,
                reminderTime: selectedTimes[0] ?? '',
                reminderTimes: JSON.stringify(selectedTimes),
                startDate,
                endDate,
                remindersEnabled: remindersEnabled && frequency !== 'As Needed' ? 1 : 0,
                notificationIds: '[]',
                notes: notes.trim(),
                completed: 0,
                completedAt: null,
                createdAt: new Date().toISOString(),
            });
            Alert.alert(
                'Medication saved',
                remindersEnabled && frequency !== 'As Needed'
                    ? 'The medication and reminders were created.'
                    : 'The medication was saved.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.error('Unable to save medication:', error);
            Alert.alert(
                'Unable to save',
                'Something went wrong while saving the medication.'
            );
        } finally {
            setSaving(false);
        }
    }
    const timeCount = requiredTimeCount(frequency);
    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <ScreenTitle title="Add Medication" icon="💊" />
                    <Text style={styles.label}>Medicine Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={medicine}
                        onChangeText={setMedicine}
                        placeholder="Example: Vitamin D"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="words"
                    />
                    <Text style={styles.label}>Dose</Text>
                    <TextInput
                        style={styles.input}
                        value={dosage}
                        onChangeText={setDosage}
                        placeholder="Example: 0.5"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="decimal-pad"
                    />
                    <Text style={styles.label}>Unit</Text>
                    <View style={styles.chipGrid}>
                        {UNITS.map((item) => (
                            <Pressable
                                key={item}
                                onPress={() => setUnit(item)}
                                style={[
                                    styles.chip,
                                    unit === item && styles.selectedChip,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        unit === item && styles.selectedChipText,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                    <Text style={styles.label}>Start Date</Text>
                    <DateInput value={startDate} onChange={setStartDate} />
                    <Text style={styles.label}>End Date</Text>
                    <DateInput value={endDate} onChange={setEndDate} />
                    <Text style={styles.helper}>
                        Leave the end date blank for an ongoing medication.
                    </Text>
                    <Text style={styles.label}>Frequency</Text>
                    <View style={styles.chipGrid}>
                        {FREQUENCIES.map((item) => (
                            <Pressable
                                key={item}
                                onPress={() => setFrequency(item)}
                                style={[
                                    styles.chip,
                                    frequency === item && styles.selectedChip,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        frequency === item && styles.selectedChipText,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                    {timeCount > 0 ? (
                        <>
                            <View style={styles.switchRow}>
                                <View style={styles.flex}>
                                    <Text style={styles.switchTitle}>
                                        Medication reminders
                                    </Text>
                                    <Text style={styles.helper}>
                                        Notify me when each dose is due.
                                    </Text>
                                </View>
                                <Switch
                                    value={remindersEnabled}
                                    onValueChange={setRemindersEnabled}
                                />
                            </View>
                            {remindersEnabled
                                ? reminderTimes.slice(0, timeCount).map((time, index) => (
                                      <View key={index}>
                                          <Text style={styles.label}>
                                              {timeCount === 1
                                                  ? 'Reminder Time'
                                                  : `Reminder Time ${index + 1}`}
                                          </Text>
                                          <View style={styles.timeRow}>
                                              <TextInput
                                                  style={[styles.input, styles.timeInput]}
                                                  value={time.hour}
                                                  onChangeText={(value) =>
                                                      updateReminderHour(index, value)
                                                  }
                                                  placeholder="08"
                                                  placeholderTextColor="#9CA3AF"
                                                  keyboardType="number-pad"
                                                  maxLength={2}
                                                  textAlign="center"
                                              />
                                              <Text style={styles.timeSeparator}>:</Text>
                                              <TextInput
                                                  style={[styles.input, styles.timeInput]}
                                                  value={time.minute}
                                                  onChangeText={(value) =>
                                                      updateReminderMinute(index, value)
                                                  }
                                                  placeholder="00"
                                                  placeholderTextColor="#9CA3AF"
                                                  keyboardType="number-pad"
                                                  maxLength={2}
                                                  textAlign="center"
                                              />
                                              <View style={styles.periodContainer}>
                                                  {(['AM', 'PM'] as Period[]).map(
                                                      (period) => (
                                                          <Pressable
                                                              key={period}
                                                              onPress={() =>
                                                                  updateReminderPeriod(
                                                                      index,
                                                                      period
                                                                  )
                                                              }
                                                              style={[
                                                                  styles.periodButton,
                                                                  time.period ===
                                                                      period &&
                                                                      styles.selectedPeriodButton,
                                                              ]}
                                                          >
                                                              <Text
                                                                  style={[
                                                                      styles.periodText,
                                                                      time.period ===
                                                                          period &&
                                                                          styles.selectedPeriodText,
                                                                  ]}
                                                              >
                                                                  {period}
                                                              </Text>
                                                          </Pressable>
                                                      )
                                                  )}
                                              </View>
                                          </View>
                                          <Text style={styles.timeHelper}>
                                              Use 1–12 for hour and 00–59 for minutes.
                                          </Text>
                                      </View>
                                  ))
                                : null}
                        </>
                    ) : null}
                    <Text style={styles.label}>Notes</Text>
                    <TextInput
                        style={[styles.input, styles.notesInput]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Example: Give after feeding"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                    />
                    <PrimaryButton
                        title={saving ? 'Saving...' : 'Save Medication'}
                        onPress={() => {
                            if (!saving) {
                                void save();
                            }
                        }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#EEF2F8',
    },
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#EEF2F8',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 80,
    },
    label: {
        marginTop: 18,
        marginBottom: 8,
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    input: {
        minHeight: 54,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        fontSize: 17,
        color: '#111827',
    },
    notesInput: {
        minHeight: 110,
        paddingTop: 16,
    },
    helper: {
        marginTop: 6,
        color: '#6B7280',
        fontSize: 13,
        lineHeight: 18,
    },
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    selectedChip: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    chipText: {
        color: '#374151',
        fontWeight: '600',
    },
    selectedChipText: {
        color: '#FFFFFF',
    },
    switchRow: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
    },
    switchTitle: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '700',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeInput: {
        width: 68,
        paddingHorizontal: 10,
    },
    timeSeparator: {
        marginHorizontal: 8,
        fontSize: 22,
        fontWeight: '800',
        color: '#374151',
    },
    periodContainer: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 12,
        overflow: 'hidden',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
    },
    periodButton: {
        flex: 1,
        minHeight: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedPeriodButton: {
        backgroundColor: '#2563EB',
    },
    periodText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#4B5563',
    },
    selectedPeriodText: {
        color: '#FFFFFF',
    },
    timeHelper: {
        marginTop: 6,
        fontSize: 12,
        color: '#6B7280',
    },
});

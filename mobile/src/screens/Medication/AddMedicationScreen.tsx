import React, {
  useState,
} from "react";
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
} from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import DateInput from "../../components/common/DateInput";
import { useMedicationStore } from "../../store/MedicationStore";
const UNITS = [
  "ml",
  "drops",
  "tablet",
  "capsule",
  "spoon",
];
const FREQUENCIES = [
  "Once",
  "Daily",
  "Twice Daily",
  "Three Times Daily",
  "Weekly",
  "As Needed",
];
function formatTime(
  value: string
): string {
  const digits = value
    .replace(/\D/g, "")
    .slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(
    0,
    2
  )}:${digits.slice(2)}`;
}
function validTime(
  value: string
): boolean {
  const match =
    /^(\d{2}):(\d{2})$/.exec(
      value
    );
  if (!match) {
    return false;
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return (
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59
  );
}
function requiredTimeCount(
  frequency: string
): number {
  if (
    frequency === "Twice Daily"
  ) {
    return 2;
  }
  if (
    frequency ===
    "Three Times Daily"
  ) {
    return 3;
  }
  if (
    frequency === "As Needed"
  ) {
    return 0;
  }
  return 1;
}
export default function AddMedicationScreen({
  navigation,
}: any) {
  const addMedication =
    useMedicationStore(
      (state) =>
        state.addMedication
    );
  const today = new Date()
    .toISOString()
    .slice(0, 10);
  const [medicine, setMedicine] =
    useState("");
  const [dosage, setDosage] =
    useState("");
  const [unit, setUnit] =
    useState("ml");
  const [frequency, setFrequency] =
    useState("Daily");
  const [startDate, setStartDate] =
    useState(today);
  const [endDate, setEndDate] =
    useState("");
  const [reminderTimes, setReminderTimes] =
    useState([
      "08:00",
      "20:00",
      "14:00",
    ]);
  const [
    remindersEnabled,
    setRemindersEnabled,
  ] = useState(true);
  const [notes, setNotes] =
    useState("");
  const [saving, setSaving] =
    useState(false);
  function updateReminderTime(
    index: number,
    value: string
  ) {
    setReminderTimes(
      (current) =>
        current.map(
          (item, itemIndex) =>
            itemIndex === index
              ? formatTime(value)
              : item
        )
    );
  }
  async function save() {
    const trimmedMedicine =
      medicine.trim();
    if (!trimmedMedicine) {
      Alert.alert(
        "Medicine name required",
        "Enter the medicine name."
      );
      return;
    }
    if (
      endDate &&
      endDate < startDate
    ) {
      Alert.alert(
        "Invalid end date",
        "The end date cannot be before the start date."
      );
      return;
    }
    const timeCount =
      requiredTimeCount(
        frequency
      );
    const selectedTimes =
      reminderTimes.slice(
        0,
        timeCount
      );
    if (
      remindersEnabled &&
      selectedTimes.some(
        (time) => !validTime(time)
      )
    ) {
      Alert.alert(
        "Invalid reminder time",
        "Enter each reminder using 24-hour HH:MM format."
      );
      return;
    }
    try {
      setSaving(true);
      await addMedication({
        medicine:
          trimmedMedicine,
        dosage: dosage.trim(),
        unit,
        frequency,
        reminderTime:
          selectedTimes[0] ?? "",
        reminderTimes:
          JSON.stringify(
            selectedTimes
          ),
        startDate,
        endDate,
        remindersEnabled:
          remindersEnabled &&
          frequency !== "As Needed"
            ? 1
            : 0,
        notificationIds: "[]",
        notes: notes.trim(),
        completed: 0,
        completedAt: null,
        createdAt:
          new Date().toISOString(),
      });
      Alert.alert(
        "Medication saved",
        remindersEnabled &&
          frequency !==
            "As Needed"
          ? "The medication and reminders were created."
          : "The medication was saved.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error(
        "Unable to save medication:",
        error
      );
      Alert.alert(
        "Unable to save",
        "Something went wrong while saving the medication."
      );
    } finally {
      setSaving(false);
    }
  }
  const timeCount =
    requiredTimeCount(frequency);
  return (
    <SafeAreaView
      style={styles.safe}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <ScreenTitle
            title="Add Medication"
            icon="💊"
          />
          <Text style={styles.label}>
            Medicine Name *
          </Text>
          <TextInput
            style={styles.input}
            value={medicine}
            onChangeText={setMedicine}
            placeholder="Example: Vitamin D"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
          />
          <Text style={styles.label}>
            Dose
          </Text>
          <TextInput
            style={styles.input}
            value={dosage}
            onChangeText={setDosage}
            placeholder="Example: 0.5"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
          />
          <Text style={styles.label}>
            Unit
          </Text>
          <View style={styles.chipGrid}>
            {UNITS.map((item) => (
              <Pressable
                key={item}
                onPress={() =>
                  setUnit(item)
                }
                style={[
                  styles.chip,
                  unit === item &&
                    styles.selectedChip,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    unit === item &&
                      styles.selectedChipText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.label}>
            Start Date
          </Text>
          <DateInput
            value={startDate}
            onChange={setStartDate}
          />
          <Text style={styles.label}>
            End Date
          </Text>
          <DateInput
            value={endDate}
            onChange={setEndDate}
          />
          <Text style={styles.helper}>
            Leave the end date blank for an ongoing medication.
          </Text>
          <Text style={styles.label}>
            Frequency
          </Text>
          <View style={styles.chipGrid}>
            {FREQUENCIES.map(
              (item) => (
                <Pressable
                  key={item}
                  onPress={() =>
                    setFrequency(item)
                  }
                  style={[
                    styles.chip,
                    frequency === item &&
                      styles.selectedChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      frequency === item &&
                        styles.selectedChipText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              )
            )}
          </View>
          {timeCount > 0 ? (
            <>
              <View
                style={
                  styles.switchRow
                }
              >
                <View style={styles.flex}>
                  <Text
                    style={
                      styles.switchTitle
                    }
                  >
                    Medication reminders
                  </Text>
                  <Text
                    style={styles.helper}
                  >
                    Notify me when each dose is due.
                  </Text>
                </View>
                <Switch
                  value={
                    remindersEnabled
                  }
                  onValueChange={
                    setRemindersEnabled
                  }
                />
              </View>
              {remindersEnabled
                ? reminderTimes
                    .slice(
                      0,
                      timeCount
                    )
                    .map(
                      (
                        time,
                        index
                      ) => (
                        <View
                          key={index}
                        >
                          <Text
                            style={
                              styles.label
                            }
                          >
                            {timeCount ===
                            1
                              ? "Reminder Time"
                              : `Reminder Time ${
                                  index + 1
                                }`}
                          </Text>
                          <TextInput
                            style={
                              styles.input
                            }
                            value={time}
                            onChangeText={(
                              value
                            ) =>
                              updateReminderTime(
                                index,
                                value
                              )
                            }
                            placeholder="HH:MM"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="number-pad"
                            maxLength={5}
                          />
                        </View>
                      )
                    )
                : null}
            </>
          ) : null}
          <Text style={styles.label}>
            Notes
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.notesInput,
            ]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Example: Give after feeding"
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
          />
          <PrimaryButton
            title={
              saving
                ? "Saving..."
                : "Save Medication"
            }
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
    backgroundColor: "#EEF2F8",
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#EEF2F8",
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
    fontWeight: "700",
    color: "#1F2937",
  },
  input: {
    minHeight: 54,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 17,
    color: "#111827",
  },
  notesInput: {
    minHeight: 110,
    paddingTop: 16,
  },
  helper: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  selectedChip: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  chipText: {
    color: "#374151",
    fontWeight: "600",
  },
  selectedChipText: {
    color: "#FFFFFF",
  },
  switchRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  switchTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
});
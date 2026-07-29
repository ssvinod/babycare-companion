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
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
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
  "Weekly",
  "As Needed",
];
export default function AddMedicationScreen({
  navigation,
}: any) {
  const {
    addMedication,
  } = useMedicationStore();
  const [
    medicine,
    setMedicine,
  ] = useState("");
  const [
    dosage,
    setDosage,
  ] = useState("");
  const [
    unit,
    setUnit,
  ] = useState("ml");
  const [
    frequency,
    setFrequency,
  ] = useState("Daily");
  const [
    reminderTime,
    setReminderTime,
  ] = useState("");
  const [
    notes,
    setNotes,
  ] = useState("");
  const [
    saving,
    setSaving,
  ] = useState(false);
  function formatTime(
    value: string
  ) {
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
  ) {
    if (!value) {
      return true;
    }
    const match =
      /^(\d{2}):(\d{2})$/.exec(
        value
      );
    if (!match) {
      return false;
    }
    const hour =
      Number(match[1]);
    const minute =
      Number(match[2]);
    return (
      hour >= 0 &&
      hour <= 23 &&
      minute >= 0 &&
      minute <= 59
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
    if (!validTime(reminderTime)) {
      Alert.alert(
        "Invalid reminder time",
        "Use 24-hour HH:MM format. Example: 08:30 or 20:00."
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
        reminderTime,
        notes: notes.trim(),
        completed: 0,
        completedAt: null,
        createdAt:
          new Date().toISOString(),
      });
      navigation.goBack();
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
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
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
            {UNITS.map(
              (item) => (
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
              )
            )}
          </View>
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
          <Text style={styles.label}>
            Reminder Time
          </Text>
          <TextInput
            style={styles.input}
            value={reminderTime}
            onChangeText={(value) =>
              setReminderTime(
                formatTime(value)
              )
            }
            placeholder="HH:MM — example 08:30"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            maxLength={5}
          />
          <Text style={styles.helper}>
            Use 24-hour format. Leave blank when no reminder is needed.
          </Text>
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
            placeholder="Instructions or additional information"
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
            onPress={save}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles =
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor:
        "#EEF2F8",
    },
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor:
        "#EEF2F8",
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
      color: "#111827",
      fontSize: 16,
    },
    notesInput: {
      minHeight: 110,
      paddingTop: 16,
    },
    helper: {
      marginTop: 7,
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
      paddingHorizontal: 16,
      paddingVertical: 11,
      borderRadius: 24,
      backgroundColor: "#E5E7EB",
    },
    selectedChip: {
      backgroundColor: "#4F6EF7",
    },
    chipText: {
      color: "#374151",
      fontWeight: "600",
    },
    selectedChipText: {
      color: "#FFFFFF",
    },
  });
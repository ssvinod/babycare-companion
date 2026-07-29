import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import type {
  ParamListBase,
} from "@react-navigation/native";
import type {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import DateInput from "../../components/common/DateInput";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import { useGrowthStore } from "../../store/GrowthStore";
import { useDashboardStore } from "../../store/DashboardStore";
import { Growth } from "../../models/Growth";
type EditGrowthScreenProps =
  NativeStackScreenProps<
    ParamListBase,
    "EditGrowth"
  >;
export default function EditGrowthScreen({
  navigation,
  route,
}: EditGrowthScreenProps) {
  const { growth } =
    route.params as {
      growth: Growth;
    };
  const updateGrowth = useGrowthStore(
    (state) => state.updateGrowth
  );
  const refreshDashboard =
    useDashboardStore(
      (state) => state.refresh
    );
  const [checkupDate, setCheckupDate] =
    useState(
      growth.date.slice(0, 10)
    );
  const [weight, setWeight] = useState(
    String(growth.weight)
  );
  const [height, setHeight] = useState(
    String(growth.height)
  );
  const [head, setHead] = useState(
    growth.headCircumference
      ? String(
          growth.headCircumference
        )
      : ""
  );
  const [notes, setNotes] = useState(
    growth.notes ?? ""
  );
  const [saving, setSaving] =
    useState(false);
  async function save() {
    const parsedWeight = Number(weight);
    const parsedHeight = Number(height);
    const parsedHead =
      head.trim() === ""
        ? null
        : Number(head);
    if (
      !Number.isFinite(parsedWeight) ||
      parsedWeight <= 0
    ) {
      Alert.alert(
        "Invalid weight",
        "Enter a valid weight greater than zero."
      );
      return;
    }
    if (
      !Number.isFinite(parsedHeight) ||
      parsedHeight <= 0
    ) {
      Alert.alert(
        "Invalid height",
        "Enter a valid height greater than zero."
      );
      return;
    }
    if (
      parsedHead !== null &&
      (!Number.isFinite(parsedHead) ||
        parsedHead <= 0)
    ) {
      Alert.alert(
        "Invalid head circumference",
        "Enter a valid measurement or leave it blank."
      );
      return;
    }
    try {
      setSaving(true);
      await updateGrowth({
        ...growth,
        date: `${checkupDate}T12:00:00`,
        weight: parsedWeight,
        height: parsedHeight,
        headCircumference: parsedHead,
        notes: notes.trim(),
      });
      await refreshDashboard();
      Alert.alert(
        "Growth Updated",
        "The growth record was updated successfully.",
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
        "Failed to update growth record:",
        error
      );
      Alert.alert(
        "Unable to update",
        "Something went wrong while updating the growth record."
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <ScreenLayout>
      <ScreenTitle
        title="Edit Growth"
        icon="📈"
      />
      <Text style={styles.label}>
        Check-up Date
      </Text>
      <DateInput
        value={checkupDate}
        onChange={setCheckupDate}
      />
      <Text style={styles.label}>
        Weight
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="decimal-pad"
        value={weight}
        onChangeText={setWeight}
      />
      <Text style={styles.label}>
        Height
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="decimal-pad"
        value={height}
        onChangeText={setHeight}
      />
      <Text style={styles.label}>
        Head circumference
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Optional (cm)"
        keyboardType="decimal-pad"
        value={head}
        onChangeText={setHead}
      />
      <Text style={styles.label}>
        Notes
      </Text>
      <TextInput
        style={[
          styles.input,
          styles.notesInput,
        ]}
        placeholder="Example: Monthly pediatrician visit"
        multiline
        textAlignVertical="top"
        value={notes}
        onChangeText={setNotes}
      />
      <PrimaryButton
        title={
          saving
            ? "Updating..."
            : "Update Growth"
        }
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
    fontWeight: "700",
    color: "#374151",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    fontSize: 18,
  },
  notesInput: {
    minHeight: 110,
  },
});
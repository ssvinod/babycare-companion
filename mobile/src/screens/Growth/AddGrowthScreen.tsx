import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
} from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import { useGrowthStore } from "../../store/GrowthStore";
import { useDashboardStore } from "../../store/DashboardStore";
export default function AddGrowthScreen({
  navigation,
}: any) {
  const { addGrowth } = useGrowthStore();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [head, setHead] = useState("");
  const { refresh } = useDashboardStore();
  async function save() {
    console.log("SAVE GROWTH START");
    try {
      console.log("Calling addGrowth...");
      await addGrowth({
        date: new Date().toISOString(),
        weight: Number(weight),
        height: Number(height),
        headCircumference: Number(head),
        notes: "",
      });
      console.log("Growth saved");
      refresh();
      console.log("Dashboard refreshed");
      navigation.goBack();
    } catch (e) {
      console.log("GROWTH ERROR");
      console.log(e);
    }
  }
  return (
    <ScreenLayout>
      <ScreenTitle
        title="Add Growth"
        icon="📈"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Head Circumference (cm)"
        keyboardType="numeric"
        value={head}
        onChangeText={setHead}
      />
      <PrimaryButton
        title="Save Growth"
        onPress={save}
      />
    </ScreenLayout>
  );
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    fontSize: 18,
  },
});